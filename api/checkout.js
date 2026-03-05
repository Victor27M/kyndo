// /api/checkout.js
export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    const { default: Stripe } = await import("stripe");
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
    const { items = [], shippingRate = process.env.STRIPE_SHIPPING_RATE_EASYBOX } = body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: "Missing cart items" });
    }
    if (!shippingRate) {
      return res.status(500).json({ error: "Missing shipping rate." });
    }

    // Prices in RON
    const PRICE_STANDARD = 149.99;
    const PRICE_PREMIUM  = 199.99;
    const currency = "ron";

    // Map variants to named line items
    const line_items = items.map((it) => {
      const isPremium = (it.cable || "standard") === "premium";
      const quantity = Math.max(1, Number(it.qty) || 1);

      const unit_amount = Math.round((isPremium ? PRICE_PREMIUM : PRICE_STANDARD) * 100);
      const name = isPremium ? "Nemuri Lamp — Premium" : "Nemuri Lamp — Standard";

      return {
        quantity,
        price_data: {
          currency,
          unit_amount,
          product_data: {
            name,
            metadata: {
              base: "Nemuri Lamp",
              cable: isPremium ? "premium" : "standard",
            },
          },
        },
      };
    });

    // A broad set of shipping countries (trim as needed)
    const ALL = [
      "US","CA","MX","AR","BR","CL","CO","PE","UY",
      "GB","IE","FR","DE","IT","ES","PT","NL","BE","LU","AT","CH","DK","SE","NO","FI","IS",
      "PL","CZ","SK","HU","SI","HR","RO","BG","GR","EE","LV","LT","MT","CY",
      "TR","IL","AE","SA","QA","KW","BH","OM","JO","EG","MA","TN","ZA",
      "AU","NZ","JP","KR","SG","HK","TW","TH","VN","MY","ID","PH","IN"
    ];

    const origin = req.headers.origin || "https://kyndodesign.com";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      locale: "ro",

      phone_number_collection: { enabled: true },
      billing_address_collection: "auto",
      shipping_address_collection: { allowed_countries: ALL },

      shipping_options: [{ shipping_rate: shippingRate }],

      line_items,
      allow_promotion_codes: false,
      custom_text: { submit: { message: "Plată securizată 🔒" } },

      success_url: `${origin}/?success=1&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cart?canceled=1`,
    });

    return res.status(200).json({ url: session.url });
  } catch (e) {
    console.error("checkout error:", e?.message, e);
    return res.status(500).json({ error: e?.message || "Server error" });
  }
}
