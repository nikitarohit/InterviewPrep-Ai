import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../hooks/useAuth";

export default function Settings() {
  const { user, logout } = useAuth();
  const [saved, setSaved] = useState(false);
  const [useMock, setUseMock] = useState(false);

  useEffect(() => {
    const v = String(localStorage.getItem("forceMockAI") || "");
    setUseMock(v === "1" || v === "true");
  }, []);

  useEffect(() => {
    localStorage.setItem("forceMockAI", useMock ? "1" : "0");
  }, [useMock]);

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 1800);
  }

  return (
    <div style={{ minHeight: "100vh", background: "#fafaf8", padding: "32px 24px 80px" }}>
      <div style={{ maxWidth: 860, margin: "0 auto", display: "grid", gap: 16 }}>
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} style={{ background: "#fff", borderRadius: 24, padding: 24, border: "1px solid #ece8f5", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#1a1a2e", margin: "0 0 8px" }}>Settings</h1>
          <p style={{ margin: 0, color: "#7a7a9a" }}>Manage your account preferences and session.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} style={{ background: "#fff", borderRadius: 24, padding: 24, border: "1px solid #ece8f5", boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
          <h2 style={{ fontSize: 18, fontWeight: 700, color: "#1a1a2e", marginTop: 0 }}>Account</h2>
          <div style={{ display: "grid", gap: 10, color: "#4a4a6a" }}>
            <div><strong>Name:</strong> {user?.name || "Guest"}</div>
            <div><strong>Email:</strong> {user?.email || "Not available"}</div>
            <div><strong>Plan:</strong> {user?.plan || "free"}</div>
          </div>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 20 }}>
            <button onClick={handleSave} style={{ border: "none", padding: "10px 16px", borderRadius: 12, background: "linear-gradient(135deg, #6b5cf6, #a78bfa)", color: "#fff", fontWeight: 700, cursor: "pointer" }}>
              {saved ? "Saved ✓" : "Save changes"}
            </button>
            <label style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 14px", borderRadius: 12, background: useMock ? "#fef3c7" : "#f3f4f6", cursor: "pointer" }}>
              <input type="checkbox" checked={useMock} onChange={(e) => setUseMock(e.target.checked)} />
              Force mock AI responses (frontend)
            </label>
            <button onClick={logout} style={{ border: "1px solid #fecdd3", padding: "10px 16px", borderRadius: 12, background: "#fff1f2", color: "#dc2626", fontWeight: 700, cursor: "pointer" }}>
              Log out
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
