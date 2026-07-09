import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "../utils/api";

const suggestions = [
  "Java Collections", "React Hooks", "System Design", "DSA Arrays",
  "SQL Joins", "OOP Concepts", "JavaScript Closures", "DBMS Normalization",
  "Marketing Strategy", "Financial Analysis", "Business Communication",
  "Product Management", "HR Management", "Supply Chain",
];

const LANGUAGES = [
  { value: "Python",     icon: "🐍" },
  { value: "JavaScript", icon: "🟨" },
  { value: "Java",       icon: "☕" },
  { value: "C++",        icon: "⚙️" },
  { value: "C#",         icon: "💜" },
  { value: "Go",         icon: "🐹" },
  { value: "TypeScript", icon: "🔷" },
  { value: "None (Non-technical)", icon: "📋" },
];

function getSavedLanguage() {
  try {
    // Try localStorage first (fast)
    const cached = localStorage.getItem("preferredLanguage");
    if (cached) return cached;
  } catch { /* ignore */ }
  return null;
}

function saveLanguage(lang) {
  try { localStorage.setItem("preferredLanguage", lang); } catch { /* ignore */ }
}

function cleanError(err) {
  const msg = err?.message || "";
  const status = err?.status;
  if (status === 429 || msg.includes("429")) return "Too many requests. Please wait a moment and try again.";
  if (msg.includes("503") || msg.includes("high demand") || msg.includes("temporarily unavailable")) return "AI is experiencing high demand. Please try again in a moment.";
  if (msg.includes("401") || msg.includes("API key")) return "AI service is not configured. Please contact support.";
  if (msg.includes("No token") || msg.includes("sign in")) return "Please sign in to generate questions.";
  if (msg.includes("Failed to fetch") || msg.includes("NetworkError")) return "Network error. Please check your connection.";
  if (msg.includes("googleapis.com")) return "AI service is temporarily unavailable. Please try again.";
  return msg || "Failed to generate content. Please try again.";
}

// ── Language Picker Modal ─────────────────────────────────────────────────────
function LanguagePicker({ topic, onSelect, onSkip }) {
  const [selected, setSelected] = useState(null);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: "fixed", inset: 0, zIndex: 100,
        background: "rgba(0,0,0,0.35)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 20,
      }}
      onClick={onSkip}
    >
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 8 }}
        transition={{ duration: 0.22 }}
        onClick={e => e.stopPropagation()}
        style={{
          background: "#fff", borderRadius: 20,
          padding: "28px 28px 24px",
          maxWidth: 480, width: "100%",
          boxShadow: "0 24px 64px rgba(0,0,0,0.16)",
          border: "1px solid #ecebf0",
        }}
      >
        <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#9b8fb5", margin: "0 0 6px" }}>
          Quick preference
        </p>
        <h3 style={{ fontSize: 18, fontWeight: 700, color: "#17161d", margin: "0 0 4px", letterSpacing: "-0.01em" }}>
          Preferred coding language?
        </h3>
        <p style={{ fontSize: 13.5, color: "#6f6d7a", margin: "0 0 20px", lineHeight: 1.5 }}>
          For "{topic}" — we'll use this for code examples. You can change it anytime in Profile.
        </p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 20 }}>
          {LANGUAGES.map(lang => {
            const active = selected === lang.value;
            return (
              <button
                key={lang.value}
                onClick={() => setSelected(lang.value)}
                style={{
                  display: "flex", alignItems: "center", gap: 7,
                  padding: "8px 14px", borderRadius: 10,
                  border: `1.5px solid ${active ? "#5b52e8" : "#ecebf0"}`,
                  background: active ? "#eeecfd" : "#fafaf8",
                  color: active ? "#5b52e8" : "#3a3a4a",
                  fontWeight: active ? 700 : 500, fontSize: 13.5,
                  cursor: "pointer", transition: "all 0.15s",
                }}
              >
                <span style={{ fontSize: 15 }}>{lang.icon}</span>
                {lang.value}
              </button>
            );
          })}
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={() => { if (selected) { saveLanguage(selected); onSelect(selected); } }}
            disabled={!selected}
            style={{
              flex: 1, padding: "11px", borderRadius: 12, border: "none",
              background: selected ? "#5b52e8" : "#e5e4f0",
              color: selected ? "#fff" : "#9b8fb5",
              fontWeight: 700, fontSize: 14,
              cursor: selected ? "pointer" : "not-allowed",
              transition: "all 0.15s",
            }}
          >
            Generate →
          </button>
          <button
            onClick={onSkip}
            style={{
              padding: "11px 18px", borderRadius: 12,
              border: "1px solid #ecebf0", background: "#fff",
              color: "#6f6d7a", fontWeight: 600, fontSize: 14,
              cursor: "pointer",
            }}
          >
            Skip
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showLangPicker, setShowLangPicker] = useState(false);
  const navigate = useNavigate();

  const filtered = suggestions.filter(
    s => s.toLowerCase().includes(query.toLowerCase()) && query.length > 0
  );

  async function doGenerate(topic, language) {
    setLoading(true);
    setError("");
    setShowLangPicker(false);
    try {
      let data;
      let attempt = 0;
      while (attempt <= 2) {
        try {
          data = await api.generate(topic, language);
          break;
        } catch (e) {
          attempt++;
          if (e?.status === 429 && attempt <= 2) {
            await new Promise(r => setTimeout(r, (2 ** attempt) * 1000));
            continue;
          }
          throw e;
        }
      }
      const pack = data.pack || data.content || data;
      sessionStorage.setItem("resultData", JSON.stringify({
        topic: data.topic || topic,
        content: pack,
        source: data.source || "gemini",
      }));
      navigate("/result");
    } catch (err) {
      console.error("[SearchBar]", err);
      const isOverload = err?.status === 429 || (err?.message || "").includes("503") || (err?.message || "").includes("high demand");
      if (isOverload) {
        try {
          const mockResp = await api.generateMock(topic);
          const pack = mockResp.pack || mockResp.content || mockResp;
          sessionStorage.setItem("resultData", JSON.stringify({ topic: mockResp.topic || topic, content: pack, source: "mock" }));
          navigate("/result");
          return;
        } catch { /* fall through to error */ }
      }
      setError(cleanError(err));
    } finally {
      setLoading(false);
    }
  }

  function handleGenerate(topicOverride) {
  const topic = (topicOverride || query).trim();
  if (!topic) return;
  
  // ← ADD THIS
  if (topic.length < 3) {
    setError("Please enter a more specific topic (e.g. 'Java Collections', 'System Design')");
    return;
  }

  const savedLang = getSavedLanguage();
  if (savedLang) {
    doGenerate(topic, savedLang);
  } else {
    setShowLangPicker(true);
  }
}

  return (
    <>
      <div style={{ position: "relative", width: "100%", maxWidth: 640, margin: "0 auto" }}>

        {/* Search row */}
        <div style={{
          display: "flex", alignItems: "center", gap: 10,
          background: "#fff", borderRadius: 14,
          border: "1px solid #ecebf0",
          boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
          padding: "10px 10px 10px 18px",
        }}>
          {loading
            ? <div style={{ width: 15, height: 15, borderRadius: "50%", border: "2px solid #ecebf0", borderTopColor: "#5b52e8", animation: "sbspin 0.8s linear infinite", flexShrink: 0 }} />
            : <svg width="15" height="15" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, color: "#9b8fb5" }}>
                <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
          }
          <input
            type="text"
            placeholder="Search any topic — Java, Marketing, System Design, HR..."
            value={query}
            disabled={loading}
            onChange={e => { setQuery(e.target.value); setShowSuggestions(true); setError(""); }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
            onKeyDown={e => e.key === "Enter" && handleGenerate()}
            style={{ flex: 1, border: "none", outline: "none", background: "none", fontSize: 14, color: "#17161d", fontFamily: "'Inter', sans-serif" }}
          />
          <button
            onClick={() => handleGenerate()}
            disabled={loading || !query.trim()}
            style={{
              padding: "9px 20px", borderRadius: 10, border: "none", flexShrink: 0,
              background: "#5b52e8", color: "#fff",
              fontWeight: 700, fontSize: 13.5,
              cursor: loading || !query.trim() ? "not-allowed" : "pointer",
              opacity: !query.trim() ? 0.55 : 1,
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}
          >
            {loading ? "Generating…" : "Generate →"}
          </button>
        </div>

        {/* Error */}
        {error && (
          <div style={{ marginTop: 8, padding: "10px 14px", borderRadius: 10, background: "#fff1f2", border: "1px solid #fecdd3", fontSize: 13, color: "#dc2626" }}>
            ⚠️ {error}
          </div>
        )}

        {/* Suggestions */}
        <AnimatePresence>
          {showSuggestions && filtered.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15 }}
              style={{
                position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, zIndex: 50,
                background: "#fff", borderRadius: 12, border: "1px solid #ecebf0",
                boxShadow: "0 8px 28px rgba(0,0,0,0.09)", overflow: "hidden",
              }}
            >
              {filtered.map(s => (
                <button key={s}
                  onMouseDown={() => { setQuery(s); handleGenerate(s); }}
                  style={{ width: "100%", textAlign: "left", padding: "10px 16px", border: "none", background: "none", cursor: "pointer", fontSize: 13.5, color: "#3a3a4a", borderBottom: "1px solid #f5f5f8", display: "flex", alignItems: "center", gap: 8, fontFamily: "'Inter', sans-serif" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "#f5f3ff"; e.currentTarget.style.color = "#5b52e8"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "#3a3a4a"; }}
                >
                  <svg width="11" height="11" viewBox="0 0 12 12" fill="none"><circle cx="5" cy="5" r="4" stroke="currentColor" strokeWidth="1.2"/><path d="M8 8l2.5 2.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
                  {s}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <style>{`@keyframes sbspin { to { transform: rotate(360deg); } }`}</style>
      </div>

      {/* Language picker modal */}
      <AnimatePresence>
        {showLangPicker && (
          <LanguagePicker
            topic={query.trim()}
            onSelect={lang => doGenerate(query.trim(), lang)}
            onSkip={() => { setShowLangPicker(false); doGenerate(query.trim(), "Python"); }}
          />
        )}
      </AnimatePresence>
    </>
  );
}