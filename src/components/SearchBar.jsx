import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "../utils/api";

const suggestions = ["Java Collections", "React Hooks", "System Design", "DSA Arrays", "SQL Joins", "OOP Concepts", "JavaScript Closures", "DBMS Normalization"];

function cleanError(err) {
  const msg = err?.message || "";
  const status = err?.status;

  if (status === 429 || msg.includes("429") || msg.includes("Too Many Requests"))
    return "Too many requests. Please wait a moment and try again.";
  if (msg.includes("503") || msg.includes("high demand") || msg.includes("Service Unavailable") || msg.includes("temporarily unavailable"))
    return "AI is experiencing high demand right now. Please try again in a moment.";
  if (msg.includes("401") || msg.includes("API key") || msg.includes("not configured"))
    return "AI service is not configured. Please contact support.";
  if (msg.includes("No token") || msg.includes("not authorized") || msg.includes("sign in"))
    return "Please sign in to generate questions.";
  if (msg.includes("parse") || msg.includes("JSON"))
    return "AI returned an unexpected response. Please try again.";
  if (msg.includes("Failed to fetch") || msg.includes("NetworkError"))
    return "Network error. Please check your connection and try again.";

  // Catch-all: never show raw Google SDK URLs or stack traces
  if (msg.includes("googleapis.com") || msg.includes("generativelanguage"))
    return "AI service is temporarily unavailable. Please try again in a moment.";

  return msg || "Failed to generate content. Please try again.";
}

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [usedMock, setUsedMock] = useState(false);
  const navigate = useNavigate();

  const filtered = suggestions.filter(
    (s) => s.toLowerCase().includes(query.toLowerCase()) && query.length > 0
  );

  async function handleGenerate(topic) {
    const t = (topic || query).trim();
    if (!t) return;
    setLoading(true);
    setError("");
    setUsedMock(false);
    setShowSuggestions(false);

    try {
      // Retry on 429 with exponential backoff (your existing logic — kept as-is)
      let data;
      let attempt = 0;
      const maxAttempts = 2;
      while (attempt <= maxAttempts) {
        try {
          data = await api.generate(t);
          break;
        } catch (e) {
          attempt += 1;
          if (e?.status === 429 && attempt <= maxAttempts) {
            const wait = e.details?.retryAfterSeconds
              ? Math.ceil(e.details.retryAfterSeconds)
              : 2 ** attempt;
            await new Promise((r) => setTimeout(r, wait * 1000));
            continue;
          }
          throw e;
        }
      }

      const pack = data.pack || data.content || data;
      const source = data.source || "gemini";
      sessionStorage.setItem(
        "resultData",
        JSON.stringify({ topic: data.topic || t, content: pack, source })
      );
      navigate("/result");
    } catch (err) {
      console.error("[SearchBar] generate error:", err);

      // Try mock fallback for overload / quota errors
      const isOverload =
        err?.status === 429 ||
        (err?.message || "").includes("503") ||
        (err?.message || "").includes("high demand") ||
        (err?.message || "").includes("temporarily unavailable");

      if (isOverload) {
        try {
          const mockResp = await api.generateMock(t);
          const pack = mockResp.pack || mockResp.content || mockResp;
          sessionStorage.setItem(
            "resultData",
            JSON.stringify({ topic: mockResp.topic || t, content: pack, source: "mock" })
          );
          api.updateProgress({ type: "questions", amount: 1 }).catch(() => {});
          setUsedMock(true);
          navigate("/result");
          return;
        } catch {
          // mock also failed — show friendly error below
        }
      }

      setError(cleanError(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ position: "relative", width: "100%", maxWidth: 640, margin: "0 auto" }}>
      {/* Search input row */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, background: "#fff", borderRadius: 18, border: "1px solid #ece8f5", boxShadow: "0 4px 24px rgba(107,92,246,0.10)", padding: "10px 10px 10px 20px" }}>
        {loading
          ? <div style={{ width: 16, height: 16, borderRadius: "50%", border: "2px solid #f0edff", borderTopColor: "#6b5cf6", animation: "sbspin 0.8s linear infinite", flexShrink: 0 }} />
          : <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, color: "#9b8fb5" }}><circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5"/><path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
        }
        <input
          type="text"
          placeholder="Search a topic — e.g. Java, System Design, DSA..."
          value={query}
          disabled={loading}
          onChange={(e) => { setQuery(e.target.value); setShowSuggestions(true); setError(""); setUsedMock(false); }}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
          onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
          style={{ flex: 1, border: "none", outline: "none", background: "none", fontSize: 14.5, color: "#1a1a2e" }}
        />
        <motion.button
          whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
          onClick={() => handleGenerate()}
          disabled={loading || !query.trim()}
          style={{ padding: "10px 22px", borderRadius: 13, border: "none", flexShrink: 0, background: "linear-gradient(135deg,#6b5cf6,#a78bfa)", color: "#fff", fontWeight: 700, fontSize: 14, cursor: loading || !query.trim() ? "not-allowed" : "pointer", opacity: !query.trim() ? 0.6 : 1, boxShadow: "0 3px 12px rgba(107,92,246,0.25)" }}>
          {loading ? "Generating..." : "Generate →"}
        </motion.button>
      </div>

      {/* Error box — clean message + "Try sample data" button */}
      {error && (
        <div style={{ marginTop: 8, padding: "12px 16px", borderRadius: 12, background: "#fff1f2", border: "1px solid #fecdd3", display: "flex", flexDirection: "column", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
            <span style={{ fontSize: 15, flexShrink: 0 }}>⚠️</span>
            <p style={{ fontSize: 13, color: "#dc2626", margin: 0, lineHeight: 1.6 }}>{error}</p>
          </div>
          {/* Offer mock data when it's an overload / availability error */}
          {(error.includes("high demand") || error.includes("try again") || error.includes("unavailable")) && (
            <button
              onClick={async () => {
                setError("");
                setLoading(true);
                try {
                  const mockResp = await api.generateMock(query.trim());
                  const pack = mockResp.pack || mockResp.content || mockResp;
                  sessionStorage.setItem(
                    "resultData",
                    JSON.stringify({ topic: query.trim(), content: pack, source: "mock" })
                  );
                  navigate("/result");
                } catch {
                  setError("Failed to load sample data. Please refresh and try again.");
                } finally {
                  setLoading(false);
                }
              }}
              style={{ alignSelf: "flex-start", padding: "6px 14px", borderRadius: 9, border: "none", background: "#fee2e2", color: "#dc2626", fontWeight: 600, fontSize: 12.5, cursor: "pointer" }}
            >
              Use sample data instead →
            </button>
          )}
        </div>
      )}

      {/* Suggestions dropdown */}
      <AnimatePresence>
        {showSuggestions && filtered.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.18 }}
            style={{ position: "absolute", top: "calc(100% + 8px)", left: 0, right: 0, zIndex: 50, background: "#fff", borderRadius: 16, border: "1px solid #ece8f5", boxShadow: "0 8px 32px rgba(0,0,0,0.10)", overflow: "hidden" }}>
            {filtered.map((s) => (
              <button key={s} onMouseDown={() => { setQuery(s); handleGenerate(s); }}
                style={{ width: "100%", textAlign: "left", padding: "11px 18px", border: "none", background: "none", cursor: "pointer", fontSize: 14, color: "#4a4a6a", borderBottom: "1px solid #f7f5ff", display: "flex", alignItems: "center", gap: 10 }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#f7f5ff"; e.currentTarget.style.color = "#6b5cf6"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "none"; e.currentTarget.style.color = "#4a4a6a"; }}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><circle cx="5" cy="5" r="4" stroke="currentColor" strokeWidth="1.2"/><path d="M8 8l2.5 2.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
                {s}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`@keyframes sbspin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}