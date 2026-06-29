import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const ease = [0.22, 1, 0.36, 1];

const fadeUp = (i) => ({
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.09, ease } },
});

function MockChatPreview() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-20px" });
  const messages = [
    { role: "AI", text: "Tell me your biggest weakness.", style: "ai" },
    {
      role: "You",
      text: "I'd say I over-index on details — which I've learned to channel into better documentation habits.",
      style: "you",
    },
    { role: "AI", text: "Strong self-awareness. Score: 88/100", style: "score" },
  ];
  const styles = {
    ai: { row: "bg-[#f7f5ff] text-[#3d3560]", badge: "bg-[#ede9ff] text-brand" },
    you: { row: "bg-[#fffaf7] text-[#3a2e28]", badge: "bg-[#fff0e8] text-orange-600" },
    score: { row: "bg-green-50 text-green-700", badge: "bg-green-100 text-green-700" },
  };

  return (
    <div ref={ref} className="mt-4 rounded-[14px] overflow-hidden border border-[#ede9ff] bg-[#faf9ff]">
      {messages.map((msg, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -8 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.35, delay: 0.15 + i * 0.12, ease }}
          className={`flex items-start gap-1.5 px-3 py-2.5 text-[11.5px] leading-snug ${styles[msg.style].row} ${
            i < 2 ? "border-b border-[#ede9ff]" : ""
          }`}
        >
          <span className={`shrink-0 text-[10px] font-bold px-1.5 py-0.5 rounded-md mt-px ${styles[msg.style].badge}`}>
            {msg.role}
          </span>
          {msg.text}
        </motion.div>
      ))}
    </div>
  );
}

function MCQPreview() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-20px" });
  const opts = ["O(n log n)", "O(n²)", "O(log n)", "O(n)"];

  return (
    <div ref={ref} className="mt-4">
      <p className="text-xs text-[#3d3560] mb-2.5 font-medium leading-snug">
        What&apos;s the average time complexity of QuickSort?
      </p>
      {opts.map((o, i) => (
        <motion.div
          key={o}
          initial={{ opacity: 0, y: 6 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.3, delay: 0.1 + i * 0.07, ease }}
          className={`flex items-center gap-2 px-2.5 py-[7px] rounded-[10px] mb-1.5 text-xs ${
            i === 0
              ? "bg-green-50 border border-green-300 text-green-700 font-semibold"
              : "bg-[#f9f9fb] border border-[#ece8f5] text-[#8a8aa8]"
          }`}
        >
          <span
            className={`w-[18px] h-[18px] rounded-full shrink-0 flex items-center justify-center text-[10px] font-bold ${
              i === 0 ? "bg-green-500 text-white" : "bg-[#ece8f5] text-[#b0aac8]"
            }`}
          >
            {i === 0 ? "✓" : String.fromCharCode(65 + i)}
          </span>
          {o}
        </motion.div>
      ))}
    </div>
  );
}

function CodePreview() {
  const lines = [
    { n: 1, t: "def ", k: "rate_limit", r: "(user_id: str):" },
    { n: 2, t: "    key = ", k: `f"rl:{user_id}"`, r: "" },
    { n: 3, t: "    tokens = redis.", k: "incr", r: "(key)" },
    { n: 4, t: "    if tokens == ", k: "1", r: ": redis.expire(key, 60)" },
    { n: 5, t: "    return tokens <= ", k: "MAX_TOKENS", r: "" },
  ];

  return (
    <div className="mt-4 rounded-xl overflow-hidden bg-[#1e1b2e] border border-[#312d4b]">
      <div className="flex gap-1.5 px-3 py-2 border-b border-[#312d4b]">
        {["bg-[#ff6b6b]", "bg-[#ffd93d]", "bg-[#6bcb77]"].map((c) => (
          <div key={c} className={`w-2 h-2 rounded-full opacity-80 ${c}`} />
        ))}
        <span className="text-[10px] text-[#6b6b9b] ml-1.5">rate_limiter.py</span>
        <span className="ml-auto text-[10px] text-[#6bcb77] font-semibold">Easy</span>
      </div>
      <div className="px-3.5 py-2.5">
        {lines.map((l) => (
          <div key={l.n} className="flex gap-2.5 text-[11px] leading-[1.8] font-mono">
            <span className="text-[#4b4b7a] min-w-3.5 select-none">{l.n}</span>
            <span>
              <span className="text-violet-300">{l.t}</span>
              <span className="text-amber-400">{l.k}</span>
              <span className="text-slate-400">{l.r}</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function RoadmapPreview() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-20px" });
  const weeks = [
    { w: "Wk 1", label: "DSA Foundations", done: true },
    { w: "Wk 2", label: "System Design", done: true },
    { w: "Wk 3", label: "Behavioural", done: false, active: true },
    { w: "Wk 4", label: "Mock Interviews", done: false },
  ];

  return (
    <div ref={ref} className="mt-4 flex flex-col gap-2">
      {weeks.map((w, i) => (
        <motion.div
          key={w.w}
          initial={{ opacity: 0, x: -10 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.35, delay: i * 0.08, ease }}
          className="flex items-center gap-2.5"
        >
          <div
            className={`w-7 h-7 rounded-full shrink-0 flex items-center justify-center text-[10px] font-bold ${
              w.done
                ? "bg-brand text-white"
                : w.active
                  ? "bg-brand-bg text-brand border-2 border-brand"
                  : "bg-[#f1f0f5] text-[#c0bcd0] border-2 border-transparent"
            }`}
          >
            {w.done ? "✓" : w.w.replace("Wk ", "")}
          </div>
          <div className="flex-1">
            <div
              className={`text-xs ${
                w.active ? "font-semibold text-ink" : w.done ? "text-[#4a4a6a]" : "text-[#a0a0b8]"
              }`}
            >
              {w.label}
            </div>
            {w.active && (
              <div className="h-[3px] rounded-full bg-brand-bg mt-1 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={inView ? { width: "45%" } : {}}
                  transition={{ duration: 0.9, delay: 0.4, ease: "easeOut" }}
                  className="h-full rounded-full bg-gradient-brand-soft"
                />
              </div>
            )}
          </div>
          <div
            className={`text-[10px] font-semibold ${
              w.done ? "text-green-500" : w.active ? "text-brand" : "text-[#c0bcd0]"
            }`}
          >
            {w.done ? "Done" : w.active ? "45%" : "—"}
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function ProgressPreview() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-20px" });
  const topics = [
    { label: "Arrays & Trees", pct: 82, color: "#6b5cf6" },
    { label: "System Design", pct: 61, color: "#f97316" },
    { label: "Behavioural", pct: 90, color: "#22c55e" },
  ];

  return (
    <div ref={ref} className="mt-4">
      <div className="flex gap-2.5 mb-3.5">
        {[
          { n: "14", l: "Day streak 🔥" },
          { n: "47", l: "Topics done" },
        ].map((s, i) => (
          <motion.div
            key={s.l}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.35, delay: i * 0.1 }}
            className="flex-1 px-3 py-2.5 rounded-xl bg-[#f7f5ff] border border-[#ede9ff]"
          >
            <div className="text-lg font-extrabold text-ink">{s.n}</div>
            <div className="text-[11px] text-brand-muted mt-0.5">{s.l}</div>
          </motion.div>
        ))}
      </div>
      {topics.map((t, i) => (
        <div key={t.label} className="mb-2.5">
          <div className="flex justify-between text-xs text-[#4a4a6a] mb-1">
            <span>{t.label}</span>
            <span className="font-semibold">{t.pct}%</span>
          </div>
          <div className="h-[5px] rounded-full bg-[#f1f0f7] overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={inView ? { width: `${t.pct}%` } : {}}
              transition={{ duration: 0.9, delay: 0.2 + i * 0.12, ease: "easeOut" }}
              className="h-full rounded-full opacity-[0.85]"
              style={{ background: t.color }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function QuestionPreview() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-20px" });
  const qs = ["Tell me about yourself", "Why this company?", "Where do you see yourself in 5 years?"];

  return (
    <div ref={ref} className="mt-4 flex flex-col gap-[7px]">
      {qs.map((q, i) => (
        <motion.div
          key={q}
          initial={{ opacity: 0, y: 6 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.3, delay: 0.1 + i * 0.08, ease }}
          className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-[#faf9ff] border border-[#ede9ff]"
        >
          <span className="text-[10px] font-bold text-brand bg-brand-bg rounded-md px-[7px] py-0.5 shrink-0">
            Q{i + 1}
          </span>
          <span className="text-xs text-[#3d3560] flex-1">{q}</span>
          <span className="text-[10px] text-brand font-semibold opacity-70">View →</span>
        </motion.div>
      ))}
      <div className="text-center text-[11px] text-brand-muted py-1.5 border-t border-[#ede9ff] mt-0.5">
        +124 more questions generated
      </div>
    </div>
  );
}

const icons = {
  mock: (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden>
      <path d="M4 8a6 6 0 1112 0v3a2 2 0 01-2 2h-1l-1.5 2.5a1 1 0 01-1.7 0L9 13H7a2 2 0 01-2-2V8z" stroke="#6b5cf6" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M8 8h6M8 11h4" stroke="#6b5cf6" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  ),
  coding: (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden>
      <path d="M6 7L3 11l3 4M16 7l3 4-3 4M12 5l-2 12" stroke="#2563eb" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  mcq: (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden>
      <rect x="3" y="3" width="16" height="16" rx="4" stroke="#16a34a" strokeWidth="1.4" />
      <path d="M7 11l3 3 5-6" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  roadmap: (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden>
      <circle cx="4" cy="11" r="2.5" stroke="#7c3aed" strokeWidth="1.4" />
      <circle cx="18" cy="5" r="2.5" stroke="#7c3aed" strokeWidth="1.4" />
      <circle cx="18" cy="17" r="2.5" stroke="#7c3aed" strokeWidth="1.4" />
      <path d="M6.5 10.5L15.5 6.5M6.5 11.5L15.5 15.5" stroke="#7c3aed" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  ),
  progress: (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden>
      <path d="M3 17V7M8 17V4M13 17v-6M18 17v-9" stroke="#e11d48" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  ),
  questions: (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden>
      <path d="M11 2l2 4 4.5.7-3.25 3.2.75 4.5L11 12.5 7 14.4l.75-4.5L4.5 6.7 9 6l2-4z" stroke="#ea580c" strokeWidth="1.3" strokeLinejoin="round" />
    </svg>
  ),
};

export const featureCards = [
  {
    key: "mock",
    size: "featured",
    accent: "#6b5cf6",
    accentBg: "#f0edff",
    accentBorder: "#ddd6fe",
    tag: "Most popular",
    tagBg: "#ede9fe",
    tagColor: "#6d28d9",
    label: "Mock Interview",
    desc: "Have a real back-and-forth conversation with AI that adapts to your answers, challenges you, and scores you like an actual interviewer would.",
    to: "/dashboard",
    cta: "Try a mock interview",
    preview: <MockChatPreview />,
  },
  {
    key: "coding",
    size: "normal",
    accent: "#2563eb",
    accentBg: "#eff6ff",
    accentBorder: "#bfdbfe",
    label: "Coding Problems",
    desc: "Curated challenges with step-by-step solutions and complexity breakdowns.",
    to: "/result",
    cta: "Solve problems",
    preview: <CodePreview />,
  },
  {
    key: "mcq",
    size: "normal",
    accent: "#16a34a",
    accentBg: "#f0fdf4",
    accentBorder: "#bbf7d0",
    label: "MCQ Practice",
    desc: "Topic-wise sets with explanations — not just answer keys.",
    to: "/result",
    cta: "Start MCQs",
    preview: <MCQPreview />,
  },
  {
    key: "roadmap",
    size: "normal",
    accent: "#7c3aed",
    accentBg: "#fdf4ff",
    accentBorder: "#e9d5ff",
    label: "Roadmaps",
    desc: "Week-by-week plans built around your role, timeline, and current level.",
    to: "/dashboard",
    cta: "View roadmap",
    preview: <RoadmapPreview />,
  },
  {
    key: "progress",
    size: "normal",
    accent: "#e11d48",
    accentBg: "#fff1f2",
    accentBorder: "#fecdd3",
    label: "Progress Tracking",
    desc: "Daily streaks, topic rings, and a clear view of what's done — and what's left.",
    to: "/profile",
    cta: "See progress",
    preview: <ProgressPreview />,
  },
  {
    key: "questions",
    size: "normal",
    accent: "#ea580c",
    accentBg: "#fff7ed",
    accentBorder: "#fed7aa",
    label: "AI Questions",
    desc: "Generate role-specific questions with model answers you can study and adapt.",
    to: "/result",
    cta: "Generate questions",
    preview: <QuestionPreview />,
  },
];

export default function FeatureCard({ card, index }) {
  const featured = card.size === "featured";
  const icon = icons[card.key];

  return (
    <motion.div
      custom={index}
      variants={fadeUp(index)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      className={featured ? "lg:col-span-2" : "col-span-1"}
    >
      <motion.div
        whileHover={{ y: -6, transition: { duration: 0.22, ease: "easeOut" } }}
        className={`group h-full rounded-3xl bg-white border border-border shadow-card flex transition-shadow duration-250 hover:shadow-[0_16px_48px_rgba(0,0,0,0.10)] hover:ring-2 hover:ring-[var(--accent-border)] ${
          featured ? "flex-col lg:flex-row gap-0 lg:gap-8 px-7 pt-7 pb-5" : "flex-col px-[22px] pt-6 pb-5"
        }`}
        style={{ "--accent-border": card.accentBorder }}
      >
        <div className={`flex flex-col ${featured ? "lg:basis-[260px] lg:shrink-0" : "flex-1"}`}>
          <div className="flex items-start justify-between gap-3 mb-3.5">
            <div
              className="w-[42px] h-[42px] rounded-[14px] shrink-0 flex items-center justify-center transition-transform duration-200 group-hover:scale-105"
              style={{ background: card.accentBg }}
            >
              {icon}
            </div>
            {card.tag && (
              <span
                className="text-[11px] font-bold px-2.5 py-1 rounded-full shrink-0"
                style={{ background: card.tagBg, color: card.tagColor }}
              >
                {card.tag}
              </span>
            )}
          </div>

          <h3 className={`font-bold text-ink mb-2.5 leading-tight ${featured ? "text-[22px]" : "text-[17px]"}`}>
            {card.label}
          </h3>
          <p className="text-[13.5px] text-[#6b6b8a] leading-relaxed flex-1 m-0">{card.desc}</p>

          <Link to={card.to} className={`${featured ? "mt-5" : "mt-4"} self-start`}>
            <motion.span
              whileHover={{ scale: 1.04, backgroundColor: card.accentBg }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-1.5 px-[16px] py-2 rounded-xl bg-[#f7f5ff] font-semibold text-[12.5px] cursor-pointer border transition-colors"
              style={{ color: card.accent, borderColor: `${card.accent}33` }}
            >
              {card.cta}
              <span className="text-[14px] leading-none group-hover:translate-x-0.5 transition-transform">→</span>
            </motion.span>
          </Link>
        </div>

        <div className={`flex-1 min-w-0 ${featured ? "lg:pt-1" : ""}`}>{card.preview}</div>
      </motion.div>
    </motion.div>
  );
}
