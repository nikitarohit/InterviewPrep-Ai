import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";

const ease = [0.22, 1, 0.36, 1];

const QUERY = "Explain Java Collections";

const OUTPUTS = [
  {
    id: "theory",
    label: "Theory Explanation",
    accent: "#6b5cf6",
    accentBg: "#f0edff",
    preview: "ArrayList vs LinkedList — O(1) random access vs O(1) insert at head. HashMap uses buckets with chaining for collisions.",
  },
  {
    id: "questions",
    label: "Top Interview Questions",
    accent: "#16a34a",
    accentBg: "#f0fdf4",
    preview: "Difference between HashMap and Hashtable? When would you use ConcurrentHashMap?",
  },
  {
    id: "mcq",
    label: "MCQs with Answers",
    accent: "#0ea5e9",
    accentBg: "#f0f9ff",
    preview: "Which collection allows duplicate elements? → List ✓",
  },
  {
    id: "coding",
    label: "Coding Problem",
    accent: "#2563eb",
    accentBg: "#eff6ff",
    preview: "Implement LRU Cache using HashMap + Doubly Linked List",
  },
  {
    id: "hr",
    label: "HR Questions",
    accent: "#ea580c",
    accentBg: "#fff7ed",
    preview: "Tell me about a time you optimized a data structure choice in production.",
  },
];

const BULLETS = [
  "One topic → theory, questions, MCQs, code & HR",
  "Gemini-powered explanations in plain English",
  "Save outputs directly to your Notes",
];

function useTypewriter(text, speed = 28, active = true) {
  const [displayed, setDisplayed] = useState("");
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!active) {
      setDisplayed("");
      return;
    }
    if (reduced) {
      setDisplayed(text);
      return;
    }
    setDisplayed("");
    let i = 0;
    const iv = setInterval(() => {
      i++;
      setDisplayed(text.slice(0, i));
      if (i >= text.length) clearInterval(iv);
    }, speed);
    return () => clearInterval(iv);
  }, [text, speed, active, reduced]);

  return displayed;
}

function OutputRow({ item, index, visible }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 16, height: 0 }}
      animate={
        visible
          ? { opacity: 1, x: 0, height: "auto" }
          : { opacity: 0, x: 16, height: 0 }
      }
      transition={{ duration: 0.45, delay: index * 0.12, ease }}
      className="overflow-hidden"
    >
      <div
        className="rounded-2xl border p-4 mb-3 transition-shadow duration-200"
        style={{ background: item.accentBg, borderColor: `${item.accent}33` }}
      >
        <div className="flex items-center gap-2.5 mb-2">
          <span
            className="w-2 h-2 rounded-full shrink-0"
            style={{ background: item.accent, boxShadow: `0 0 8px ${item.accent}88` }}
          />
          <span className="text-[13px] font-bold" style={{ color: item.accent }}>
            {item.label}
          </span>
          {visible && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.12 + 0.25 }}
              className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/80"
              style={{ color: item.accent }}
            >
              Generated
            </motion.span>
          )}
        </div>
        <p className="text-[12.5px] leading-relaxed text-[#4a4a6a] m-0">{item.preview}</p>
      </div>
    </motion.div>
  );
}

function PreviewPanel() {
  const [phase, setPhase] = useState("typing");
  const [visibleCount, setVisibleCount] = useState(0);
  const reduced = useReducedMotion();
  const queryText = useTypewriter(QUERY, 32, phase === "typing" || phase === "generating" || phase === "done");

  useEffect(() => {
    if (reduced) {
      setPhase("done");
      setVisibleCount(OUTPUTS.length);
      return;
    }
    const t1 = setTimeout(() => setPhase("generating"), QUERY.length * 32 + 400);
    const t2 = setTimeout(() => setPhase("done"), QUERY.length * 32 + 900);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [reduced]);

  useEffect(() => {
    if (phase !== "done") return;
    if (visibleCount >= OUTPUTS.length) return;
    const t = setTimeout(() => setVisibleCount((c) => c + 1), 280);
    return () => clearTimeout(t);
  }, [phase, visibleCount]);

  useEffect(() => {
    if (phase !== "done" || visibleCount < OUTPUTS.length) return;
    const t = setTimeout(() => {
      setPhase("typing");
      setVisibleCount(0);
    }, 5000);
    return () => clearTimeout(t);
  }, [phase, visibleCount]);

  const progress =
    phase === "typing"
      ? 15
      : phase === "generating"
        ? 55
        : Math.min(55 + ((visibleCount / OUTPUTS.length) * 45), 100);

  return (
    <motion.div
      initial={{ opacity: 0, x: 48 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.75, ease }}
      className="relative w-full max-w-[480px] mx-auto lg:mx-0 lg:ml-auto"
    >
      <div
        aria-hidden
        className="absolute -inset-5 rounded-[36px] opacity-50 blur-[18px] -z-0"
        style={{
          background:
            "conic-gradient(from 200deg at 50% 50%, #ede9ff 0deg, #fff7ed 130deg, #e0f2fe 260deg, #ede9ff 360deg)",
        }}
      />

      <div className="relative z-10 overflow-hidden rounded-[28px] bg-white border border-violet-500/15 shadow-[0_0_0_1px_rgba(255,255,255,0.9)_inset,0_20px_60px_rgba(107,92,246,0.12),0_4px_16px_rgba(0,0,0,0.06)]">
        <div className="flex items-center gap-2 px-[18px] py-3 bg-[#faf9ff] border-b border-[#f0edff]">
          {["bg-[#ff6b6b]", "bg-[#ffd93d]", "bg-[#6bcb77]"].map((c) => (
            <div key={c} className={`w-2.5 h-2.5 rounded-full opacity-85 ${c}`} />
          ))}
          <span className="ml-1.5 text-[11px] font-semibold tracking-[0.08em] uppercase text-brand-muted">
            InterviewPrep AI — Topic Generator
          </span>
          <span className="ml-auto flex items-center gap-1.5">
            <span
              className={`w-[7px] h-[7px] rounded-full ${
                phase === "generating" ? "bg-amber-400 animate-pulse" : "bg-green-500 shadow-[0_0_6px_#22c55e]"
              }`}
            />
            <span className="text-[11px] text-brand-muted">
              {phase === "generating" ? "Generating…" : "Ready"}
            </span>
          </span>
        </div>

        <div className="px-5 pt-5 pb-2">
          <div className="flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-[#f7f5ff] border border-[#ede9ff] mb-4">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden className="shrink-0 opacity-50">
              <circle cx="7" cy="7" r="4.5" stroke="#6b5cf6" strokeWidth="1.3" />
              <path d="M10.5 10.5L13 13" stroke="#6b5cf6" strokeWidth="1.3" strokeLinecap="round" />
            </svg>
            <span className="text-[13.5px] font-medium text-[#3d3560]">
              {queryText}
              {phase === "typing" && (
                <span className="inline-block w-0.5 h-[0.85em] ml-0.5 align-middle animate-blink bg-brand" />
              )}
            </span>
          </div>

          {(phase === "generating" || phase === "done") && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 px-1"
            >
              <div className="flex justify-between text-[11px] text-brand-muted mb-1.5 font-medium">
                <span>Building your study pack</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <div className="h-[5px] rounded-full bg-brand-bg overflow-hidden">
                <motion.div
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="h-full rounded-full bg-gradient-brand-soft"
                />
              </div>
            </motion.div>
          )}

          <div className="max-h-[320px] overflow-y-auto pr-0.5 pb-3">
            {OUTPUTS.map((item, i) => (
              <OutputRow key={item.id} item={item} index={i} visible={i < visibleCount} />
            ))}
          </div>
        </div>

        {visibleCount >= OUTPUTS.length && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-4 mb-4 px-3.5 py-3 rounded-[14px] border border-green-200 bg-gradient-to-br from-green-50 to-green-100 flex items-center gap-2.5"
          >
            <span className="text-base">✓</span>
            <div className="flex-1">
              <div className="text-[12px] font-semibold text-green-700">5 resources generated in 2.4s</div>
              <div className="text-[11px] text-green-600/80 mt-0.5">Saved to Notes · Ready to practice</div>
            </div>
          </motion.div>
        )}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5 }}
        className="absolute -bottom-4 -left-3 z-20 flex items-center gap-2 rounded-full bg-white px-3.5 py-[7px] border border-border-soft shadow-[0_4px_20px_rgba(0,0,0,0.10)]"
      >
        <span className="text-[13px]">⚡</span>
        <span className="text-xs font-semibold text-[#4a4a6a]">Powered by Gemini</span>
      </motion.div>
    </motion.div>
  );
}

export default function AIPreview() {
  return (
    <section id="ai-preview" className="relative bg-surface py-[100px] pb-[110px] overflow-hidden">
      <div
        aria-hidden
        className="absolute top-1/2 -translate-y-1/2 -left-[120px] w-[480px] h-[480px] pointer-events-none opacity-70 bg-[radial-gradient(circle,#f0edff_0%,transparent_65%)]"
      />
      <div
        aria-hidden
        className="absolute top-0 right-0 w-[420px] h-[420px] pointer-events-none opacity-60 bg-[radial-gradient(circle,#fff7ed_0%,transparent_65%)]"
      />

      <div className="relative max-w-[1160px] mx-auto px-7">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[clamp(48px,6vw,80px)] items-center">
          <div>
            <motion.p
              initial={{ opacity: 0, y: -8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="text-[11px] font-bold tracking-[0.14em] uppercase text-brand-muted mb-4"
            >
              AI Preview
            </motion.p>

            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.05, ease }}
              className="text-[clamp(2rem,4vw,3.2rem)] font-extrabold tracking-tight text-ink leading-tight mb-5"
            >
              Your personal{" "}
              <span className="text-gradient-brand">interview assistant</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.12 }}
              className="text-[clamp(1rem,1.8vw,1.1rem)] leading-relaxed text-body max-w-[440px] mb-8"
            >
              Type any topic and get theory explanations, curated questions, MCQs, coding
              problems, and HR prompts — all generated in one click.
            </motion.p>

            <motion.ul
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.18 }}
              className="flex flex-col gap-3 mb-9 list-none p-0 m-0"
            >
              {BULLETS.map((b, i) => (
                <motion.li
                  key={b}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.22 + i * 0.07 }}
                  className="flex items-start gap-3 text-[14px] text-[#4a4a6a]"
                >
                  <span className="mt-0.5 w-[18px] h-[18px] rounded-full bg-brand-bg border border-violet-200 flex items-center justify-center shrink-0">
                    <span className="text-[10px] font-bold text-brand">✓</span>
                  </span>
                  {b}
                </motion.li>
              ))}
            </motion.ul>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Link to="/dashboard">
                <motion.span
                  whileHover={{ scale: 1.04, boxShadow: "0 10px 32px rgba(107,92,246,0.35)" }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-block px-7 py-3.5 rounded-2xl bg-gradient-brand text-white font-bold text-sm cursor-pointer shadow-brand tracking-wide"
                >
                  Try it free →
                </motion.span>
              </Link>
            </motion.div>
          </div>

          <PreviewPanel />
        </div>
      </div>
    </section>
  );
}
