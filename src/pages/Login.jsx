import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../hooks/useAuth";

const ease = [0.22, 1, 0.36, 1];

const inputStyle = { width: "100%", padding: "11px 14px", borderRadius: 12, border: "1px solid #ece8f5", background: "#fafaf8", fontSize: 14, color: "#1a1a2e", outline: "none", boxSizing: "border-box", transition: "border-color 0.2s, box-shadow 0.2s" };

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError(""); setLoading(true);
    try { await login(form.email, form.password); navigate("/dashboard"); }
    catch (err) { setError(err.message); }
    finally { setLoading(false); }
  }

  return (
    <div style={{ minHeight: "100vh", background: "#fafaf8", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, ease }} style={{ width: "100%", maxWidth: 420 }}>
        <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: 10, justifyContent: "center", marginBottom: 32 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg,#6b5cf6,#a78bfa)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(107,92,246,0.28)" }}>
            <span style={{ color: "#fff", fontWeight: 800, fontSize: 13 }}>IP</span>
          </div>
          <span style={{ fontSize: 17, fontWeight: 700, color: "#1a1a2e" }}>InterviewPrep <span style={{ background: "linear-gradient(130deg,#6b5cf6,#a78bfa)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>AI</span></span>
        </Link>

        <div style={{ background: "#fff", borderRadius: 24, padding: 32, border: "1px solid #ece8f5", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "#1a1a2e", margin: "0 0 6px", letterSpacing: "-0.02em" }}>Welcome back</h1>
          <p style={{ fontSize: 14, color: "#9b8fb5", margin: "0 0 24px" }}>Sign in to continue your prep</p>

          {error && <div style={{ padding: "10px 14px", borderRadius: 12, background: "#fff1f2", border: "1px solid #fecdd3", color: "#dc2626", fontSize: 13, marginBottom: 16 }}>{error}</div>}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[{ label: "Email", key: "email", type: "email", placeholder: "you@example.com" }, { label: "Password", key: "password", type: "password", placeholder: "••••••••" }].map((f) => (
              <div key={f.key}>
                <label style={{ fontSize: 13, fontWeight: 600, color: "#4a4a6a", display: "block", marginBottom: 6 }}>{f.label}</label>
                <input type={f.type} placeholder={f.placeholder} value={form[f.key]} onChange={(e) => setForm((p) => ({ ...p, [f.key]: e.target.value }))} required style={inputStyle}
                  onFocus={(e) => { e.target.style.borderColor = "#a78bfa"; e.target.style.boxShadow = "0 0 0 3px rgba(167,139,250,0.15)"; }}
                  onBlur={(e) => { e.target.style.borderColor = "#ece8f5"; e.target.style.boxShadow = "none"; }} />
              </div>
            ))}
            <motion.button type="submit" disabled={loading} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              style={{ marginTop: 6, padding: 13, borderRadius: 14, border: "none", background: "linear-gradient(135deg,#6b5cf6,#a78bfa)", color: "#fff", fontWeight: 700, fontSize: 15, cursor: loading ? "not-allowed" : "pointer", opacity: loading ? 0.7 : 1, boxShadow: "0 4px 16px rgba(107,92,246,0.25)" }}>
              {loading ? "Signing in..." : "Sign in →"}
            </motion.button>
          </form>

          <p style={{ textAlign: "center", fontSize: 13.5, color: "#9b8fb5", marginTop: 20, marginBottom: 0 }}>
            Don't have an account? <Link to="/register" style={{ color: "#6b5cf6", fontWeight: 600, textDecoration: "none" }}>Sign up free</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}