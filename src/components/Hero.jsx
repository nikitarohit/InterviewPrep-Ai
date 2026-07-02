import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";

// ── Typewriter ────────────────────────────────────────────────────────────────
function useTypewriter(text, speed = 26, delay = 0) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  const reduced = useReducedMotion();
  useEffect(() => {
    if (reduced) { setDisplayed(text); setDone(true); return; }
    setDisplayed(""); setDone(false);
    let i = 0;
    const t = setTimeout(() => {
      const iv = setInterval(() => {
        i++; setDisplayed(text.slice(0, i));
        if (i >= text.length) { clearInterval(iv); setDone(true); }
      }, speed);
      return () => clearInterval(iv);
    }, delay);
    return () => clearTimeout(t);
  }, [text, speed, delay, reduced]);
  return { displayed, done };
}

const Q = "Walk me through how you'd design a rate limiter.";
const A = `Start with token bucket — each user gets N tokens/sec, requests consume one. For distributed state, use Redis with atomic INCR + TTL so all nodes share the same counter. Add a sliding window for smoother enforcement and fail-open on Redis timeout.`;

// ── Notebook Card ─────────────────────────────────────────────────────────────
function NotebookCard() {
  const [phase, setPhase] = useState("q");
  const { displayed: qText, done: qDone } = useTypewriter(Q, 22, 600);
  const { displayed: aText } = useTypewriter(A, 16, phase === "a" ? 0 : 1e7);

  useEffect(() => {
    if (!qDone) return;
    const t1 = setTimeout(() => setPhase("thinking"), 400);
    const t2 = setTimeout(() => setPhase("a"), 1500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [qDone]);

  const scoreVisible = aText.length > A.length * 0.85;

  return (
    <div style={{
      position: "relative",
      width: "100%",
      maxWidth: 420,
    }}>
      {/* Notebook */}
      <div style={{
        background: "#f8f1e2",
        borderRadius: "4px 14px 14px 4px",
        boxShadow: "0 16px 48px -16px rgba(23,22,29,0.18), 0 2px 8px rgba(23,22,29,0.06)",
        transform: "rotate(-0.8deg)",
        padding: "28px 28px 24px 52px",
        position: "relative",
        backgroundImage: "repeating-linear-gradient(#e6dcc8 0 1px, transparent 1px 30px)",
        backgroundPosition: "0 80px",
        minHeight: 380,
      }}>
        {/* Spiral binding */}
        <div style={{
          position: "absolute", left: -12, top: 20, bottom: 20,
          width: 24, display: "flex", flexDirection: "column",
          justifyContent: "space-between",
        }}>
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} style={{
              width: 24, height: 13,
              border: "2.2px solid #2b2b2b",
              borderRadius: "50%",
              background: "transparent",
            }} />
          ))}
        </div>

        {/* Notebook title */}
        <p style={{
          fontFamily: "'Caveat', cursive",
          fontSize: 20,
          color: "#17161d",
          margin: "0 0 20px",
          fontWeight: 700,
        }}>
          <span style={{ background: "#e4defa", padding: "2px 8px", borderRadius: 3 }}>
            Today's session
          </span>
        </p>

        {/* Checklist */}
        {[
          { text: "Mock Interview", tag: "System Design", done: true },
          { text: "Review AI Feedback", done: true },
          { text: "Save to Notes", done: true },
          { text: "Track Progress", done: false },
        ].map((item, i) => (
          <div key={i} style={{
            display: "flex", alignItems: "center", gap: 10,
            marginBottom: 12, fontFamily: "'Caveat', cursive",
            fontSize: 17, color: "#17161d",
          }}>
            <div style={{
              width: 16, height: 16, border: "2px solid #2b2b2b",
              borderRadius: 3, flexShrink: 0,
              background: item.done ? "#2b2b2b" : "transparent",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 10, color: "#f8f1e2", fontWeight: 700,
            }}>
              {item.done ? "✓" : ""}
            </div>
            {item.text}
            {item.tag && (
              <span style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 11, fontWeight: 600,
                background: "#eeecfd", color: "#5b52e8",
                padding: "2px 8px", borderRadius: 6,
              }}>{item.tag}</span>
            )}
          </div>
        ))}

        {/* AI Q&A Card inside notebook */}
        <div style={{
          background: "#fff",
          borderRadius: 12,
          padding: "16px 18px",
          boxShadow: "0 8px 24px -12px rgba(23,22,29,0.22)",
          marginTop: 16,
        }}>
          {/* Q */}
          <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
            <div style={{
              flexShrink: 0, width: 26, height: 26, borderRadius: "50%",
              background: "#5b52e8", color: "#fff",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 10, fontWeight: 700,
            }}>AI</div>
            <p style={{
              fontSize: 13, color: "#17161d", lineHeight: 1.55, margin: 0,
              fontFamily: "'Inter', sans-serif",
            }}>
              {qText}
              {phase === "q" && (
                <span style={{
                  display: "inline-block", width: 2, height: "0.8em",
                  background: "#5b52e8", marginLeft: 2, verticalAlign: "middle",
                  animation: "nbcursor 1s step-end infinite",
                }} />
              )}
            </p>
          </div>

          {/* Thinking dots */}
          {phase === "thinking" && (
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <div style={{ width: 26, height: 26, borderRadius: "50%", background: "#fdf1c7", flexShrink: 0 }} />
              <div style={{ display: "flex", gap: 5, padding: "6px 0" }}>
                {[0,1,2].map(i => (
                  <span key={i} style={{
                    width: 6, height: 6, borderRadius: "50%", background: "#a9822b",
                    animation: `nbdot 1s ease-in-out ${i * 0.18}s infinite`,
                  }} />
                ))}
              </div>
            </div>
          )}

          {/* Answer */}
          {phase === "a" && (
            <div style={{ display: "flex", gap: 10 }}>
              <div style={{
                flexShrink: 0, width: 26, height: 26, borderRadius: "50%",
                background: "#fdf1c7", color: "#a9822b",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 10, fontWeight: 700,
              }}>Y</div>
              <p style={{
                fontSize: 13, color: "#3a3620", lineHeight: 1.6, margin: 0,
                fontFamily: "'Inter', sans-serif",
              }}>
                {aText}
                {aText.length < A.length && (
                  <span style={{
                    display: "inline-block", width: 2, height: "0.8em",
                    background: "#a9822b", marginLeft: 2, verticalAlign: "middle",
                    animation: "nbcursor 1s step-end infinite",
                  }} />
                )}
              </p>
            </div>
          )}

          {/* Score bar */}
          {scoreVisible && (
            <motion.div
              initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
              style={{
                marginTop: 12, padding: "10px 12px",
                background: "#eafaf0", borderRadius: 8,
                border: "1px solid #b6e8c8",
                display: "flex", alignItems: "center", gap: 10,
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: "#1f9d55", marginBottom: 5 }}>
                  Technical depth · Structured
                </div>
                <div style={{ height: 4, borderRadius: 99, background: "#d1f5e0", overflow: "hidden" }}>
                  <motion.div
                    initial={{ width: 0 }} animate={{ width: "91%" }}
                    transition={{ duration: 1.1, delay: 0.3, ease: "easeOut" }}
                    style={{ height: "100%", borderRadius: 99, background: "#1f9d55" }}
                  />
                </div>
              </div>
              <span style={{ fontSize: 18, fontWeight: 800, color: "#1f9d55" }}>91</span>
            </motion.div>
          )}
        </div>
      </div>

      {/* Sticky note */}
      <div style={{
        position: "absolute", top: 24, right: -16,
        width: 148, background: "#c9c2f2",
        padding: "18px 16px 20px", borderRadius: 3,
        boxShadow: "0 10px 28px -10px rgba(23,22,29,0.22)",
        transform: "rotate(4deg)",
        fontFamily: "'Caveat', cursive",
        fontSize: 17, color: "#2c2660", lineHeight: 1.35,
      }}>
        Be clear.<br/>Be concise.<br/>Be you.
        <div style={{ width: 52, borderTop: "1.5px solid #2c2660", marginTop: 10 }} />
        <span style={{ position: "absolute", bottom: 14, right: 14, fontSize: 13 }}>♥</span>
      </div>

      {/* Yellow sticky */}
      <div style={{
        position: "absolute", bottom: -12, right: -8,
        width: 140, background: "#fdf1c7",
        padding: "14px 16px 16px", borderRadius: 3,
        boxShadow: "0 8px 24px -10px rgba(23,22,29,0.2)",
        transform: "rotate(-2.5deg)",
      }}>
        <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontWeight: 700, fontSize: 14, color: "#3a3620", marginBottom: 8, display: "flex", alignItems: "center", gap: 5 }}>
          Notes 💡
        </div>
        <ul style={{ margin: 0, paddingLeft: 16, fontFamily: "'Caveat', cursive", fontSize: 15, color: "#3a3620", lineHeight: 2 }}>
          <li>Key points</li>
          <li>Approach</li>
          <li>Trade-offs</li>
        </ul>
      </div>

      <style>{`
        @keyframes nbcursor { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes nbdot { 0%,100%{transform:translateY(0);opacity:.5} 50%{transform:translateY(-4px);opacity:1} }
      `}</style>
    </div>
  );
}

// ── Hero ──────────────────────────────────────────────────────────────────────
export default function Hero() {
  return (
    <section style={{ background: "#fdfcfb", minHeight: "100vh", overflow: "hidden" }}>

      {/* Nav-like top padding offset */}
      <div style={{ maxWidth: 1160, margin: "0 auto", padding: "clamp(64px,10vw,120px) 56px clamp(48px,6vw,80px)" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "clamp(32px,6vw,80px)",
          alignItems: "center",
        }} className="hero-grid">

          {/* LEFT */}
          <div>
            {/* Handwritten eyebrow */}
            <motion.p
              initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              style={{
                fontFamily: "'Caveat', cursive",
                fontSize: 19, color: "#1f9d55",
                margin: "0 0 14px", fontWeight: 600,
              }}
            >
              — for the night before your interview
            </motion.p>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.07 }}
              style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 800, fontSize: "clamp(2.2rem, 5vw, 3.6rem)",
                lineHeight: 1.1, letterSpacing: "-0.015em",
                color: "#17161d", margin: "0 0 20px",
              }}
            >
              Practice the answer<br />
              you'll{" "}
              <span style={{
                color: "#5b52e8",
                textDecoration: "underline",
                textDecorationThickness: 3,
                textUnderlineOffset: 6,
                textDecorationColor: "#b9b4f6",
              }}>
                actually
              </span>{" "}give.
            </motion.h1>

            {/* Subtext */}
            <motion.p
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.16 }}
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "clamp(0.95rem, 1.6vw, 1.05rem)",
                lineHeight: 1.65, color: "#6f6d7a",
                maxWidth: 440, margin: "0 0 30px",
              }}
            >
              AI-powered mock interviews, smart feedback, and simple progress
              tracking — everything you need to ace your next interview.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.24 }}
              style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 28 }}
            >
              <Link to="/dashboard" style={{ textDecoration: "none" }}>
                <motion.span
                  whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 8,
                    background: "#5b52e8", color: "#fff",
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontWeight: 700, fontSize: 15,
                    padding: "13px 22px", borderRadius: 10, border: "none",
                    cursor: "pointer", letterSpacing: "0.01em",
                  }}
                >
                  Start practicing →
                </motion.span>
              </Link>
              <motion.a
                href="#features"
                whileHover={{ scale: 1.02, background: "#f0edfc" }}
                whileTap={{ scale: 0.97 }}
                style={{
                  display: "inline-flex", alignItems: "center", gap: 8,
                  background: "#fff", color: "#17161d",
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  fontWeight: 700, fontSize: 15,
                  padding: "13px 22px", borderRadius: 10,
                  border: "1.5px solid #ecebf0", cursor: "pointer",
                  textDecoration: "none",
                }}
              >
                See how it works →
              </motion.a>
            </motion.div>

            {/* Social proof */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ delay: 0.45 }}
              style={{ display: "flex", alignItems: "center", gap: 12 }}
            >
              <div style={{ display: "flex" }}>
                {[
                  { l: "R", bg: "#5b52e8" },
                  { l: "A", bg: "#1f9d55" },
                  { l: "K", bg: "#e08a3c" },
                ].map((a, i) => (
                  <div key={i} style={{
                    width: 34, height: 34, borderRadius: "50%",
                    background: a.bg, border: "2px solid #fdfcfb",
                    marginLeft: i === 0 ? 0 : -10,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 12, fontWeight: 700, color: "#fff",
                  }}>{a.l}</div>
                ))}
              </div>
              <div>
                <div style={{ color: "#f5b942", fontSize: 14, letterSpacing: 1 }}>★★★★★</div>
                <div style={{ fontSize: 13, color: "#6f6d7a", marginTop: 2, fontFamily: "'Inter', sans-serif" }}>
                  Loved by 10,000+ learners
                </div>
              </div>
            </motion.div>
          </div>

          {/* RIGHT — Notebook */}
          <motion.div
            initial={{ opacity: 0, x: 32 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.75, delay: 0.3 }}
            style={{ display: "flex", justifyContent: "center", paddingBottom: 32 }}
          >
            <NotebookCard />
          </motion.div>
        </div>

        {/* Feature strip */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          style={{
            marginTop: "clamp(40px, 6vw, 72px)",
            border: "1px solid #ecebf0",
            borderRadius: 16,
            display: "grid",
            gridTemplateColumns: "repeat(4,1fr)",
          }}
          className="feature-strip"
        >
          {[
            { icon: "🎤", label: "AI Mock Interviews", desc: "Realistic, role-based with instant feedback.", bg: "#eeecfd" },
            { icon: "💬", label: "Smart Feedback",     desc: "Detailed suggestions to improve every answer.", bg: "#eafaf0" },
            { icon: "📝", label: "Notes & Reflections",desc: "Save key learnings and revisit your best answers.", bg: "#fdf1c7" },
            { icon: "📈", label: "Track Progress",     desc: "Visualize improvements and stay consistent.", bg: "#e6f1fd" },
          ].map((f, i, arr) => (
            <div key={f.label} style={{
              padding: "28px 24px",
              borderRight: i < arr.length - 1 ? "1px solid #ecebf0" : "none",
            }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12, background: f.bg,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 20, marginBottom: 14,
              }}>
                {f.icon}
              </div>
              <h4 style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontWeight: 700, fontSize: 15, margin: "0 0 6px", color: "#17161d",
              }}>{f.label}</h4>
              <p style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: 13.5, color: "#6f6d7a", lineHeight: 1.5, margin: 0,
              }}>{f.desc}</p>
            </div>
          ))}
        </motion.div>

        {/* Trusted by */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.85 }}
          style={{ textAlign: "center", padding: "52px 0 20px" }}
        >
          <p style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 13.5, color: "#6f6d7a", marginBottom: 24,
          }}>
            Trusted by learners from
          </p>
          <div style={{
            display: "flex", justifyContent: "center",
            gap: "clamp(24px,4vw,52px)", flexWrap: "wrap",
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontWeight: 700, fontSize: 18, color: "#8b899a",
          }}>
            {["Google","Microsoft","Amazon","TCS","Infosys","Adobe"].map(c => (
              <span key={c}>{c}</span>
            ))}
          </div>
        </motion.div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&family=Inter:wght@400;500;600&family=Caveat:wght@600;700&display=swap');
        @media (max-width: 860px) {
          .hero-grid { grid-template-columns: 1fr !important; }
          .feature-strip { grid-template-columns: 1fr 1fr !important; }
          .feature-strip > div { border-right: none !important; border-bottom: 1px solid #ecebf0; }
          .feature-strip > div:last-child { border-bottom: none; }
        }
        @media (max-width: 520px) {
          .feature-strip { grid-template-columns: 1fr !important; }
          div[style*="padding: \"clamp(64px"] { padding-left: 22px !important; padding-right: 22px !important; }
        }
      `}</style>
    </section>
  );
}