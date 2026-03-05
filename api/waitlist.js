// /api/waitlist.js
import { Resend } from "resend";

const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ ok: false, error: "Method not allowed" });
    }

    try {
        const body =
            typeof req.body === "string" ? JSON.parse(req.body || "{}") : (req.body || {});
        const { email } = body;

        if (!email || !emailRe.test(email)) {
            return res.status(400).json({ ok: false, error: "Invalid email" });
        }

        const url = process.env.SUPABASE_URL;
        const key = process.env.SUPABASE_SERVICE_ROLE;
        if (!url || !key) {
            console.error("Missing Supabase envs", { hasUrl: !!url, hasKey: !!key });
            return res.status(500).json({ ok: false, error: "Server misconfigured" });
        }

        const { createClient } = await import("@supabase/supabase-js");
        const supabase = createClient(url, key, { auth: { persistSession: false } });

        const { error } = await supabase
            .from("waitlist")
            .upsert({ email }, { onConflict: "email" });
        if (error) {
            console.error("Supabase error:", error);
            return res.status(500).json({ ok: false, error: "Database error" });
        }

        try {
            const resend = new Resend(process.env.RESEND_API_KEY);
            await resend.emails.send({
                from: "Kyndo <hello@kyndodesign.com>",
                to: email,
                subject: "You're on the Kyndo waitlist ✨",
                html: `
          <div style="font-family: Fenix, Georgia, serif; color:#111">
            <h2 style="margin:0 0 12px">Thanks for joining the waitlist</h2>
            <p style="margin:0 0 16px">We’ll email you as soon as Nemuri Lamp is in stock.</p>
            <p style="margin:0; color:#666; font-size:14px">— Kyndo Studio</p>
          </div>
        `,
            });
        } catch (mailErr) {
            console.error("Email send error:", mailErr);
        }

        return res.status(200).json({ ok: true, message: "Thanks! We’ll let you know." });
    } catch (e) {
        console.error("waitlist unexpected error:", e);
        return res.status(500).json({ ok: false, error: "Server error" });
    }
}
