import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";

const LANGUAGES = [
  { id: "Python",     emoji: "🐍" },
  { id: "JavaScript", emoji: "🟨" },
  { id: "Java",       emoji: "☕" },
  { id: "C++",        emoji: "⚙️" },
  { id: "C#",         emoji: "💜" },
  { id: "Go",         emoji: "🐹" },
  { id: "TypeScript", emoji: "🔷" },
];

// ── helpers ───────────────────────────────────────────────────────────────────
function getSavedLanguage() {
  return localStorage.getItem("preferredLanguage") || "Python";
}
function saveLanguage(lang) {
  localStorage.setItem("preferredLanguage", lang);
}

export default function Settings() {
  const { user, logout } = useAuth();

  // language preference
  const [selectedLang, setSelectedLang] = useState(getSavedLanguage);

  // mock AI toggle
  const [useMock, setUseMock] = useState(() => {
    const v = String(localStorage.getItem("forceMockAI") || "");
    return v === "1" || v === "true";
  });

  // save feedback
  const [saved, setSaved] = useState(false);

  // keep mock flag in sync
  useEffect(() => {
    localStorage.setItem("forceMockAI", useMock ? "1" : "0");
  }, [useMock]);

  function handleSave() {
    // persist language preference
    saveLanguage(selectedLang);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div style={{ minHeight: "100vh", background: "#fafaf8", padding: "32px 24px 80px" }}>
      <div style={{ maxWidth: 720, margin: "0 auto", display: "grid", gap: 16 }}>

        {/* Header */}
        <div style={{ background: "#fff", borderRadius: 16, padding: "20px 24px", border: "1px solid #e5e7eb" }}>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: "#111827", margin: "0 0 4px" }}>Settings</h1>
          <p style={{ margin: 0, color: "#6b7280", fontSize: 13 }}>Manage your account preferences and session.</p>
        </div>

        {/* Account info */}
        <div style={{ background: "#fff", borderRadius: 16, padding: "20px 24px", border: "1px solid #e5e7eb" }}>
          <h2 style={{ fontSize: 15, fontWeight: 600, color: "#111827", margin: "0 0 14px" }}>Account</h2>
          <div style={{ display: "grid", gap: 8, fontSize: 13, color: "#374151" }}>
            <div style={{ display: "flex", gap: 8 }}>
              <span style={{ color: "#9ca3af", width: 60 }}>Name</span>
              <span style={{ fontWeight: 500 }}>{user?.name || "Guest"}</span>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <span style={{ color: "#9ca3af", width: 60 }}>Email</span>
              <span style={{ fontWeight: 500 }}>{user?.email || "Not available"}</span>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <span style={{ color: "#9ca3af", width: 60 }}>Plan</span>
              <span style={{ fontWeight: 500, textTransform: "capitalize" }}>{user?.plan || "free"}</span>
            </div>
          </div>
        </div>

        {/* Language preference — THE FIX */}
        <div style={{ background: "#fff", borderRadius: 16, padding: "20px 24px", border: "1px solid #e5e7eb" }}>
          <h2 style={{ fontSize: 15, fontWeight: 600, color: "#111827", margin: "0 0 4px" }}>
            Preferred Coding Language
          </h2>
          <p style={{ fontSize: 13, color: "#6b7280", margin: "0 0 16px" }}>
            AI-generated coding solutions will use this language.
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
            {LANGUAGES.map(lang => {
              const active = selectedLang === lang.id;
              return (
                <button
                  key={lang.id}
                  onClick={() => setSelectedLang(lang.id)}
                  style={{
                    display: "flex", alignItems: "center", gap: 8,
                    padding: "8px 16px", borderRadius: 8, cursor: "pointer",
                    fontSize: 13, fontWeight: active ? 600 : 400,
                    border: active ? "2px solid #5B21B6" : "1px solid #e5e7eb",
                    background: active ? "#f0edff" : "#fff",
                    color: active ? "#5B21B6" : "#374151",
                    transition: "all 0.15s",
                  }}
                >
                  <span>{lang.emoji}</span>
                  <span>{lang.id}</span>
                  {active && <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#5B21B6" }} />}
                </button>
              );
            })}
          </div>

          {/* Current selection confirmation */}
          <p style={{ fontSize: 12, color: "#9ca3af", margin: "0 0 16px" }}>
            Currently selected: <strong style={{ color: "#5B21B6" }}>{selectedLang}</strong>
          </p>
        </div>

        {/* Dev tools */}
        <div style={{ background: "#fff", borderRadius: 16, padding: "20px 24px", border: "1px solid #e5e7eb" }}>
          <h2 style={{ fontSize: 15, fontWeight: 600, color: "#111827", margin: "0 0 14px" }}>Developer</h2>
          <label style={{
            display: "flex", alignItems: "center", gap: 10, cursor: "pointer",
            padding: "10px 14px", borderRadius: 8,
            background: useMock ? "#fefce8" : "#f9fafb",
            border: "1px solid " + (useMock ? "#fde68a" : "#e5e7eb"),
          }}>
            <input
              type="checkbox" checked={useMock}
              onChange={e => setUseMock(e.target.checked)}
              style={{ accentColor: "#5B21B6", width: 15, height: 15 }}
            />
            <div>
              <div style={{ fontSize: 13, fontWeight: 500, color: "#111827" }}>Force mock AI responses</div>
              <div style={{ fontSize: 11, color: "#9ca3af" }}>Use sample data instead of calling Gemini API</div>
            </div>
          </label>
        </div>

        {/* Action buttons */}
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button
            onClick={handleSave}
            style={{
              padding: "10px 24px", borderRadius: 8, border: "none",
              background: saved ? "#16a34a" : "#5B21B6",
              color: "#fff", fontWeight: 600, fontSize: 13,
              cursor: "pointer", transition: "background 0.2s",
            }}
          >
            {saved ? "✓ Saved" : "Save preference"}
          </button>
          <button
            onClick={logout}
            style={{
              padding: "10px 20px", borderRadius: 8,
              border: "1px solid #fecaca", background: "#fff",
              color: "#dc2626", fontWeight: 600, fontSize: 13, cursor: "pointer",
            }}
          >
            Log out
          </button>
        </div>

      </div>
    </div>
  );
}