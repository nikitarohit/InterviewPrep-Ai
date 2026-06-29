import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const ease = [0.22, 1, 0.36, 1];

const FILTERS = ["All", "Core", "Popular", "Advanced"];

const topics = [
  {
    name: "DSA",
    questions: 340,
    time: "~6 hrs",
    level: "Core",
    accent: "#6b5cf6",
    accentBg: "#f0edff",
    accentBorder: "#ddd6fe",
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden>
        <rect x="2" y="13" width="4" height="7" rx="1.5" fill="#6b5cf6" opacity="0.9" />
        <rect x="9" y="8" width="4" height="12" rx="1.5" fill="#6b5cf6" opacity="0.7" />
        <rect x="16" y="3" width="4" height="17" rx="1.5" fill="#6b5cf6" opacity="0.5" />
      </svg>
    ),
  },
  {
    name: "System Design",
    questions: 120,
    time: "~4 hrs",
    level: "Advanced",
    accent: "#0ea5e9",
    accentBg: "#f0f9ff",
    accentBorder: "#bae6fd",
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden>
        <circle cx="4" cy="11" r="2.5" stroke="#0ea5e9" strokeWidth="1.5" />
        <circle cx="18" cy="5" r="2.5" stroke="#0ea5e9" strokeWidth="1.5" />
        <circle cx="18" cy="17" r="2.5" stroke="#0ea5e9" strokeWidth="1.5" />
        <path d="M6.5 10L15.5 6M6.5 12L15.5 16" stroke="#0ea5e9" strokeWidth="1.3" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    name: "React",
    questions: 210,
    time: "~3 hrs",
    level: "Popular",
    accent: "#06b6d4",
    accentBg: "#ecfeff",
    accentBorder: "#a5f3fc",
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden>
        <ellipse cx="11" cy="11" rx="9" ry="3.5" stroke="#06b6d4" strokeWidth="1.4" />
        <ellipse cx="11" cy="11" rx="9" ry="3.5" stroke="#06b6d4" strokeWidth="1.4" transform="rotate(60 11 11)" />
        <ellipse cx="11" cy="11" rx="9" ry="3.5" stroke="#06b6d4" strokeWidth="1.4" transform="rotate(120 11 11)" />
        <circle cx="11" cy="11" r="1.8" fill="#06b6d4" />
      </svg>
    ),
  },
  {
    name: "JavaScript",
    questions: 285,
    time: "~4 hrs",
    level: "Popular",
    accent: "#ca8a04",
    accentBg: "#fefce8",
    accentBorder: "#fde68a",
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden>
        <rect x="2" y="2" width="18" height="18" rx="4" fill="#fde68a" opacity="0.5" />
        <path d="M8 15.5c0 1.5-2.5 1.5-2.5 0" stroke="#ca8a04" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M13 13v3c0 1 1.5 1.5 2.5.5" stroke="#ca8a04" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="8" cy="8" r="1.2" fill="#ca8a04" />
        <circle cx="14" cy="8" r="1.2" fill="#ca8a04" />
      </svg>
    ),
  },
  {
    name: "Java",
    questions: 195,
    time: "~3 hrs",
    level: "Core",
    accent: "#dc2626",
    accentBg: "#fff1f2",
    accentBorder: "#fecdd3",
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden>
        <path d="M8 16c1-2 5-2.5 4-6C11 8 9 7.5 9 6c0-1.5 2-2 2-2" stroke="#dc2626" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M6 18s6 1 10-2" stroke="#dc2626" strokeWidth="1.4" strokeLinecap="round" />
        <path d="M5.5 16s5.5 1 11-1.5" stroke="#dc2626" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    name: "SQL",
    questions: 175,
    time: "~2 hrs",
    level: "Core",
    accent: "#16a34a",
    accentBg: "#f0fdf4",
    accentBorder: "#bbf7d0",
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden>
        <ellipse cx="11" cy="6" rx="7" ry="2.5" stroke="#16a34a" strokeWidth="1.4" />
        <path d="M4 6v5c0 1.38 3.13 2.5 7 2.5s7-1.12 7-2.5V6" stroke="#16a34a" strokeWidth="1.4" />
        <path d="M4 11v5c0 1.38 3.13 2.5 7 2.5s7-1.12 7-2.5v-5" stroke="#16a34a" strokeWidth="1.4" />
      </svg>
    ),
  },
  {
    name: "OOP",
    questions: 140,
    time: "~2 hrs",
    level: "Core",
    accent: "#7c3aed",
    accentBg: "#fdf4ff",
    accentBorder: "#e9d5ff",
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden>
        <rect x="2" y="3" width="8" height="6" rx="2" stroke="#7c3aed" strokeWidth="1.4" />
        <rect x="12" y="3" width="8" height="6" rx="2" stroke="#7c3aed" strokeWidth="1.4" />
        <rect x="7" y="14" width="8" height="6" rx="2" stroke="#7c3aed" strokeWidth="1.4" />
        <path d="M6 9v2.5h10V9M11 11.5V14" stroke="#7c3aed" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    name: "DBMS",
    questions: 160,
    time: "~2 hrs",
    level: "Core",
    accent: "#ea580c",
    accentBg: "#fff7ed",
    accentBorder: "#fed7aa",
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden>
        <rect x="4" y="4" width="14" height="4" rx="2" stroke="#ea580c" strokeWidth="1.4" />
        <rect x="4" y="10" width="14" height="4" rx="2" stroke="#ea580c" strokeWidth="1.4" />
        <rect x="4" y="16" width="14" height="2.5" rx="1.25" stroke="#ea580c" strokeWidth="1.4" />
        <circle cx="16" cy="6" r="1" fill="#ea580c" />
        <circle cx="16" cy="12" r="1" fill="#ea580c" />
      </svg>
    ),
  },
];

const levelBadge = {
  Core: "bg-[#f1f0f9] text-brand",
  Advanced: "bg-[#fff0e6] text-orange-600",
  Popular: "bg-green-50 text-green-600",
};

const SUMMARY = [
  { value: "1,625+", label: "Total questions" },
  { value: "8", label: "Topics covered" },
  { value: "Weekly", label: "New additions" },
];

function TopicCard({ topic, index }) {
  const pct = Math.round((topic.questions / 340) * 100);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 28, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.45, delay: index * 0.05, ease }}
      whileHover={{ y: -7, transition: { duration: 0.22, ease: "easeOut" } }}
    >
      <Link
        to="/result"
        className="group block h-full rounded-[22px] bg-white border border-border p-[22px] pb-[18px] shadow-card transition-all duration-250 hover:shadow-[0_12px_36px_rgba(0,0,0,0.10)] hover:ring-2 hover:ring-[var(--accent-border)]"
        style={{ "--accent-border": topic.accentBorder }}
      >
        <div className="flex items-start justify-between mb-4">
          <div
            className="w-[46px] h-[46px] rounded-[14px] flex items-center justify-center transition-transform duration-200 group-hover:scale-105"
            style={{ background: topic.accentBg }}
          >
            {topic.icon}
          </div>
          <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${levelBadge[topic.level]}`}>
            {topic.level}
          </span>
        </div>

        <h3 className="text-lg font-bold text-ink tracking-tight mb-1">{topic.name}</h3>

        <div className="flex items-center gap-2 mb-4 text-[12px] text-brand-muted">
          <span>{topic.questions} questions</span>
          <span className="w-1 h-1 rounded-full bg-[#d0c8e8]" />
          <span>{topic.time}</span>
        </div>

        <div className="flex items-center justify-between text-[11px] text-brand-muted mb-1.5">
          <span>Popularity</span>
          <span className="font-semibold" style={{ color: topic.accent }}>
            {pct}%
          </span>
        </div>

        <div className="h-1 rounded-full overflow-hidden" style={{ background: topic.accentBg }}>
          <motion.div
            initial={{ width: 0 }}
            whileInView={{ width: `${pct}%` }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: index * 0.06 + 0.25, ease: "easeOut" }}
            className="h-full rounded-full opacity-75"
            style={{ background: topic.accent }}
          />
        </div>

        <div className="mt-3.5 flex items-center justify-between">
          <span className="text-[12.5px] font-semibold" style={{ color: topic.accent }}>
            Start practicing
          </span>
          <span
            className="text-[15px] leading-none transition-transform duration-150 group-hover:translate-x-0.5"
            style={{ color: topic.accent }}
          >
            →
          </span>
        </div>
      </Link>
    </motion.div>
  );
}

export default function PopularTopics() {
  const [activeFilter, setActiveFilter] = useState("All");

  const filtered =
    activeFilter === "All" ? topics : topics.filter((t) => t.level === activeFilter);

  return (
    <section id="topics" className="relative bg-surface py-[100px] pb-[110px] overflow-hidden">
      <div
        aria-hidden
        className="absolute top-0 left-0 w-[420px] h-[420px] pointer-events-none opacity-60 bg-[radial-gradient(circle,#f0edff_0%,transparent_65%)]"
      />
      <div
        aria-hidden
        className="absolute bottom-0 right-0 w-[500px] h-[500px] pointer-events-none opacity-80 bg-[radial-gradient(ellipse_at_bottom_right,#fff7ed_0%,transparent_65%)]"
      />

      <div className="relative max-w-[1160px] mx-auto px-7">
        <div className="text-center mb-10">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 rounded-full px-4 py-[7px] mb-5 bg-brand-bg border border-violet-200"
          >
            <span className="w-[7px] h-[7px] rounded-full bg-violet-500 shadow-[0_0_8px_#8b5cf6]" />
            <span className="text-[11px] font-bold tracking-[0.12em] uppercase text-brand">
              Curated Content
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.05, ease }}
            className="text-[clamp(2rem,4vw,3rem)] font-extrabold tracking-tight text-ink mx-auto mb-3.5 leading-tight"
          >
            Explore trending <span className="text-gradient-brand">topics</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="max-w-[440px] mx-auto mb-8 text-[15.5px] text-[#7a7a9a] leading-relaxed"
          >
            Pick a topic, dive into curated questions, and build real depth — not just surface
            familiarity.
          </motion.p>

          {/* Level filters */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.15 }}
            className="inline-flex flex-wrap items-center justify-center gap-2 p-1.5 rounded-2xl bg-white border border-border shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
          >
            {FILTERS.map((f) => {
              const active = activeFilter === f;
              const count =
                f === "All" ? topics.length : topics.filter((t) => t.level === f).length;
              return (
                <button
                  key={f}
                  type="button"
                  onClick={() => setActiveFilter(f)}
                  className={`relative px-4 py-2 rounded-xl text-[13px] font-semibold transition-colors cursor-pointer ${
                    active ? "text-brand" : "text-[#6b6b8a] hover:text-brand hover:bg-brand-bg/60"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="topic-filter-pill"
                      className="absolute inset-0 rounded-xl bg-brand-bg border border-violet-200"
                      transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-1.5">
                    {f}
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                        active ? "bg-white/80 text-brand" : "bg-[#f1f0f7] text-[#9b8fb5]"
                      }`}
                    >
                      {count}
                    </span>
                  </span>
                </button>
              );
            })}
          </motion.div>
        </div>

        <motion.div layout className="grid grid-cols-1 min-[420px]:grid-cols-2 lg:grid-cols-4 gap-4">
          <AnimatePresence mode="popLayout">
            {filtered.map((t, i) => (
              <TopicCard key={t.name} topic={t} index={i} />
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Summary + CTA */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-11 flex flex-col lg:flex-row items-center justify-between gap-6 px-6 py-5 rounded-[20px] bg-white border border-border shadow-[0_2px_12px_rgba(0,0,0,0.04)]"
        >
          <div className="flex flex-wrap items-center justify-center gap-5 lg:gap-6">
            {SUMMARY.map((item, i) => (
              <div key={item.label} className="contents">
                {i > 0 && <div className="hidden sm:block w-px h-9 bg-border shrink-0" />}
                <div className="text-center sm:text-left">
                  <div className="text-xl font-extrabold text-ink">{item.value}</div>
                  <div className="text-xs text-brand-muted mt-0.5">{item.label}</div>
                </div>
              </div>
            ))}
          </div>

          <Link to="/result">
            <motion.span
              whileHover={{ scale: 1.04, boxShadow: "0 8px 24px rgba(107,92,246,0.28)" }}
              whileTap={{ scale: 0.97 }}
              className="inline-block px-5 py-2.5 rounded-xl bg-gradient-brand text-white font-semibold text-[13px] cursor-pointer shadow-brand whitespace-nowrap"
            >
              Browse all questions →
            </motion.span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
