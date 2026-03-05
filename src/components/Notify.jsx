import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Notify() {
    const [email, setEmail] = useState("");
    const [state, setState] = useState({ loading: false, ok: null, msg: "" });
    const navigate = useNavigate();
    const location = useLocation();

    /**
     * Handle form submission
     * Sends email to waitlist API and redirects on success
     * @param {React.FormEvent} event - Form submission event
     */
    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!email.trim()) {
            return; // Guard: Email is required
        }

        setState({ loading: true, ok: null, msg: "" });

        try {
            const referralPage = location?.state?.from || "/";
            const response = await fetch("/api/waitlist", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, page: referralPage }),
            });

            const data = await response.json();

            if (!response.ok || !data.ok) {
                throw new Error(data.error || "Failed to submit email");
            }

            setState({ loading: false, ok: true, msg: "You're on the list. Thank you!" });

            // Redirect after success
            setTimeout(() => navigate("/#store"), 1200);
        } catch (error) {
            setState({ loading: false, ok: false, msg: error.message || "An error occurred. Please try again." });
        }
    };

    return (
        <section className="section">
            <div className="container" style={{ maxWidth: 520 }}>
                <h2 className="cart__title" style={{ marginBottom: 8 }}>Notify me when available</h2>
                <p className="about__text" style={{ textAlign: "center", marginBottom: 22 }}>
                    Leave your email and we’ll let you know as soon as the lamp is in stock.
                </p>

                <form onSubmit={handleSubmit} style={{ display: "grid", gridTemplateColumns: "1fr auto", gap: 10 }}>
                    <input
                        type="email"
                        required
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{ width: "100%", padding: "12px 14px", border: "1px solid var(--line)", borderRadius: 12, background: "#fff" }}
                        className="notify__input"
                    />
                    <button type="submit" className="btn btn--solid" disabled={state.loading}>
                        {state.loading ? "Sending…" : "Notify me"}
                    </button>
                </form>

                {state.ok && <div style={{ marginTop: 10, color: "green", textAlign: "center" }}>You’re on the list ✅</div>}
                {state.ok === false && <div style={{ marginTop: 10, color: "crimson", textAlign: "center" }}>{state.msg}</div>}
            </div>
        </section>
    );
}
