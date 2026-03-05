// /api/stripe-webhook.js
export const config = { api: { bodyParser: false } };

function readRawBody(req) {
  return new Promise((resolve) => {
    const chunks = [];
    req.on("data", (c) => chunks.push(c));
    req.on("end", () => resolve(Buffer.concat(chunks)));
  });
}

const makeDisplayId = (stripeId) => `KY-${stripeId.slice(-6).toUpperCase()}`;

const renderAddress = (addr) => {
  if (!addr) return "—";
  return [
    addr.line1,
    addr.line2,
    [addr.postal_code, addr.city].filter(Boolean).join(" "),
    addr.state,
    addr.country,
  ]
    .filter(Boolean)
    .join("<br/>");
};

const renderItemsHtml = (items, currency) => {
  if (!items?.length) return "<p>—</p>";
  const rows = items
    .map(
      (i) => `
      <tr>
        <td style="padding:6px 8px;border-bottom:1px solid #eee;">${i.name}</td>
        <td style="padding:6px 8px;border-bottom:1px solid #eee;" align="right">x${i.qty}</td>
        <td style="padding:6px 8px;border-bottom:1px solid #eee;" align="right">${i.unit_amount.toFixed(2)} ${currency}</td>
      </tr>`
    )
    .join("");
  return `
    <table width="100%" cellspacing="0" cellpadding="0" style="border-collapse:collapse;">
      <thead>
        <tr>
          <th align="left" style="text-align:left;padding:6px 8px;border-bottom:1px solid #eee;">Item</th>
          <th align="right" style="text-align:right;padding:6px 8px;border-bottom:1px solid #eee;">Qty</th>
          <th align="right" style="text-align:right;padding:6px 8px;border-bottom:1px solid #eee;">Unit</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>`;
};

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    const { default: Stripe } = await import("stripe");
    const { createClient } = await import("@supabase/supabase-js");
    const { Resend } = await import("resend");

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE
    );
    const resend = new Resend(process.env.RESEND_API_KEY);

    const buf = await readRawBody(req);
    const sig = req.headers["stripe-signature"];

    let event;
    try {
      event = stripe.webhooks.constructEvent(
        buf,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error("❌ Signature verification failed:", err?.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    if (event.type === "checkout.session.completed") {
      const s = event.data.object;

      // Get line items
      const li = await stripe.checkout.sessions.listLineItems(s.id, { limit: 100 });
      const items = li.data.map((x) => ({
        name: x.description, // "Nemuri Lamp — Standard" / "Nemuri Lamp — Premium"
        qty: x.quantity,
        unit_amount: (x.amount_subtotal / x.quantity) / 100,
        subtotal: x.amount_subtotal / 100,
      }));

      // Prepare payload
      const payload = {
        stripe_id: s.id,
        display_id: makeDisplayId(s.id),
        status: "paid",
        email: s.customer_details?.email || null,
        name: s.customer_details?.name || null,
        phone: s.customer_details?.phone || null,
        address: s.customer_details?.address || null,
        currency: (s.currency || "ron").toUpperCase(),
        amount_total: (s.amount_total ?? 0) / 100,
        items,
      };

      // Upsert order and get current flags
      const { data: orderRow, error } = await supabase
        .from("orders")
        .upsert(payload, { onConflict: "stripe_id" })
        .select("id, display_id, email, name, phone, address, currency, amount_total, items, owner_notified, customer_emailed, stripe_id")
        .single();

      if (error) {
        console.error("❌ Supabase upsert error:", error);
        return res.status(200).json({ received: true, db: "error" });
      }

      const currency = orderRow.currency;
      const fmtMoney = (n) => `${n.toFixed(2)} ${currency}`;
      const shippingAddressHtml = renderAddress(orderRow.address);

      /* ======================
         1) Customer thank-you email (send once)
         ====================== */
      if (orderRow.email && orderRow.customer_emailed !== true) {
        try {
          await resend.emails.send({
            from: process.env.EMAIL_FROM || "Kyndo <hello@kyndodesign.com>",
            to: orderRow.email,
            subject: `Mulțumim! Comanda ta ${orderRow.display_id} a fost primită`,
            html: `
              <div style="font-family: Fenix, Georgia, serif; color:#111; max-width:640px; margin:0 auto;">
                <h2 style="margin:0 0 8px;">Mulțumim pentru comandă!</h2>
                <p style="margin:0 0 12px;">Comanda <strong>${orderRow.display_id}</strong> a fost înregistrată.</p>

                <h3 style="margin:18px 0 8px;">Sumar comandă</h3>
                ${renderItemsHtml(orderRow.items, currency)}
                <p style="margin:12px 0;"><strong>Total:</strong> ${fmtMoney(orderRow.amount_total)}</p>

                <h3 style="margin:18px 0 8px;">Livrare</h3>
                <p style="margin:0 0 6px;">${shippingAddressHtml}</p>
                ${orderRow.phone ? `<p style="margin:0 0 6px;"><strong>Telefon:</strong> ${orderRow.phone}</p>` : ""}

                <p style="margin:18px 0 0;">Te anunțăm când expediem coletul. Dacă ai întrebări, răspunde la acest email.</p>
                <p style="margin:6px 0 0; color:#666; font-size:14px;">— Kyndo Studio</p>
              </div>
            `,
          });

          // Mark emailed
          await supabase
            .from("orders")
            .update({ customer_emailed: true })
            .eq("id", orderRow.id);
        } catch (e) {
          console.error("❌ Resend customer email error:", e?.message);
        }
      }

      /* ======================
         2) Owner Discord notification (all details)
         ====================== */
      try {
        if (process.env.DISCORD_WEBHOOK_URL) {
          const lines = (orderRow.items || [])
            .map((i) => `• ${i.name} ×${i.qty} — ${i.unit_amount.toFixed(2)} ${currency}`)
            .join("\n") || "—";

          const addressText = orderRow.address
            ? [
                orderRow.address.line1,
                orderRow.address.line2,
                [orderRow.address.postal_code, orderRow.address.city].filter(Boolean).join(" "),
                orderRow.address.state,
                orderRow.address.country,
              ]
              .filter(Boolean)
              .join(", ")
            : "—";

          const content = process.env.DISCORD_OWNER_TAG || ""; // e.g. "<@12345>"

          const discordRes = await fetch(process.env.DISCORD_WEBHOOK_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              username: "Kyndo Bot",
              content,
              embeds: [
                {
                  title: `🧾 New order ${orderRow.display_id}`,
                  color: 5814783,
                  fields: [
                    { name: "Customer", value: `${orderRow.name || "—"}\n${orderRow.email || "—"}\n${orderRow.phone || "—"}`, inline: false },
                    { name: "Address", value: addressText, inline: false },
                    { name: "Items", value: lines, inline: false },
                    { name: "Total", value: fmtMoney(orderRow.amount_total), inline: true },
                    { name: "Currency", value: currency, inline: true },
                    { name: "Stripe", value: `Session: ${orderRow.stripe_id}`, inline: false },
                  ],
                  timestamp: new Date().toISOString(),
                },
              ],
            }),
          });

          if (discordRes.ok) {
            await supabase
              .from("orders")
              .update({ owner_notified: true })
              .eq("id", orderRow.id);
          } else {
            console.error("❌ Discord webhook failed:", await discordRes.text());
          }
        }
      } catch (e) {
        console.error("❌ Discord webhook error:", e?.message);
      }
    }

    return res.status(200).json({ received: true });
  } catch (err) {
    console.error("❌ Webhook crash:", err);
    return res.status(500).send("Server error");
  }
}
