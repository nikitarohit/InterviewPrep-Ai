import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useInView, useReducedMotion } from "framer-motion";

const ease = [0.22, 1, 0.36, 1];

function Sparkline({ points, color, animate = false }) {
  const w = 80;
  const h = 28;
  const max = Math.max(...points);
  const min = Math.min(...points);
  const xs = points.map((_, i) => (i / (points.length - 1)) * w);
  const ys = points.map((p) => h - ((p - min) / (max - min || 1)) * h * 0.85 - 2);
  const d = xs.map((x, i) => `${i === 0 ? "M" : "L"}${x},${ys[i]}`).join(" ");
  const fill =
    xs.map((x, i) => `${i === 0 ? "M" : "L"}${x},${ys[i]}`).join(" ") + ` L${w},${h} L0,${h} Z`;

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none" aria-hidden>
      <path d={fill} fill={color} fillOpacity="0.12" />
      <motion.path
        d={d}
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={animate ? { pathLength: 0, opacity: 0.4 } : false}
        animate={animate ? { pathLength: 1, opacity: 1 } : false}
        transition={{ duration: 1.2, ease: "easeOut" }}
      />
    </svg>
  );
}

function useCountUp(target, active, duration = 1200, isPercent = false) {
  const [value, setValue] = useState(0);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!active) return;
    if (reduced || target === null) {
      setValue(target ?? 0);
      return;
    }
    let start = 0;
    const t0 = performance.now();
    const tick = (now) => {
      const p = Math.min((now - t0) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      start = Math.round(eased * target);
      setValue(start);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target, active, duration, reduced]);

  if (target === null) return null;
  if (isPercent) return `${value}%`;
  if (target >= 1000) return value >= 1000 ? `${Math.round(value / 1000)}K+` : `${value}+`;
  return `${value}${target !== value && value === target ? "" : "+"}`.replace("++", "+");
}

const stats = [
  {
    key: "questions",
    value: 10000,
    display: "10K+",
    label: "Questions Generated",
    sub: "Across 8 core topics",
    trend: "+18% this month",
    accent: "#6b5cf6",
    accentBg: "#f0edff",
    accentBorder: "#ddd6fe",
    barWidth: "100%",
    sparkPoints: [30, 45, 38, 60, 55, 72, 68, 90, 85, 100],
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
        <path d="M10 2a8 8 0 100 16A8 8 0 0010 2z" stroke="#6b5cf6" strokeWidth="1.4" />
        <path
          d="M10 11V9.5c1.5 0 2.5-.8 2.5-2S11.5 6 10 6s-2 .8-2.2 1.8"
          stroke="#6b5cf6"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
        <circle cx="10" cy="13.5" r=".75" fill="#6b5cf6" />
      </svg>
    ),
  },
  {
    key: "topics",
    value: 500,
    display: "500+",
    label: "Topics Covered",
    sub: "From DSA to System Design",
    trend: "+24 new topics",
    accent: "#16a34a",
    accentBg: "#f0fdf4",
    accentBorder: "#bbf7d0",
    barWidth: "100%",
    sparkPoints: [20, 30, 28, 45, 50, 48, 65, 70, 80, 100],
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
        <path d="M4 10h12M4 6h8M4 14h6" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    key: "success",
    value: 95,
    display: "95%",
    label: "Success Rate",
    sub: "Users who landed offers",
    trend: "+3% vs last year",
    accent: "#0ea5e9",
    accentBg: "#f0f9ff",
    accentBorder: "#bae6fd",
    barWidth: "95%",
    sparkPoints: [60, 65, 70, 68, 75, 80, 78, 88, 92, 95],
    isPercent: true,
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
        <path
          d="M4 10l4 4 8-8"
          stroke="#0ea5e9"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    key: "ai",
    value: null,
    display: "24/7",
    label: "AI Assistance",
    sub: "Always on, always ready",
    trend: "Live now",
    accent: "#c026d3",
    accentBg: "#fdf4ff",
    accentBorder: "#e9d5ff",
    barWidth: "100%",
    sparkPoints: [100, 100, 100, 100, 100, 100, 100, 100, 100, 100],
    live: true,
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
        <circle cx="10" cy="10" r="7.5" stroke="#c026d3" strokeWidth="1.4" />
        <path
          d="M10 6v4l2.5 2.5"
          stroke="#c026d3"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

function StatCard({ stat, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const counted = useCountUp(stat.value, inView, 1200, stat.isPercent);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, delay: index * 0.1, ease }}
      whileHover={{ y: -6, transition: { duration: 0.22, ease: "easeOut" } }}
    >
      <div
        className="group h-full rounded-3xl px-[26px] pt-7 pb-6 bg-white border border-border shadow-card transition-all duration-250 hover:shadow-[0_14px_40px_rgba(0,0,0,0.09)] hover:ring-2 hover:ring-[var(--accent-border)]"
        style={{ "--accent-border": stat.accentBorder }}
      >
        <div className="flex items-start justify-between mb-5">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform duration-200 group-hover:scale-105"
            style={{ background: stat.accentBg }}
          >
            {stat.icon}
          </div>
          <Sparkline points={stat.sparkPoints} color={stat.accent} animate={inView} />
        </div>

        <div className="flex items-end justify-between gap-2 mb-2">
          <div
            className="text-[clamp(2.4rem,4vw,3.2rem)] font-extrabold tracking-tight leading-none"
            style={{ color: stat.accent }}
          >
            {stat.value === null ? stat.display : counted}
          </div>
          <span
            className={`text-[10px] font-bold px-2 py-1 rounded-full shrink-0 mb-1 flex items-center gap-1 ${
              stat.live ? "bg-green-50 text-green-600" : ""
            }`}
            style={!stat.live ? { background: stat.accentBg, color: stat.accent } : undefined}
          >
            {stat.live && (
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            )}
            {stat.trend}
          </span>
        </div>

        <div className="text-[15px] font-semibold text-ink mb-1">{stat.label}</div>
        <div className="text-[12.5px] text-brand-muted">{stat.sub}</div>

        <div className="mt-5 h-[3px] rounded-full overflow-hidden" style={{ background: stat.accentBg }}>
          <motion.div
            initial={{ width: 0 }}
            animate={inView ? { width: stat.barWidth } : { width: 0 }}
            transition={{ duration: 1.2, delay: index * 0.1 + 0.3, ease: "easeOut" }}
            className="h-full rounded-full opacity-70"
            style={{ background: stat.accent }}
          />
        </div>
      </div>
    </motion.div>
  );
}

export default function Stats() {
  return (
    <section id="stats" className="relative bg-surface py-[100px] overflow-hidden">
      <div
        aria-hidden
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[280px] pointer-events-none opacity-65 bg-[radial-gradient(ellipse_at_top,#f0edff_0%,transparent_65%)]"
      />
      <div
        aria-hidden
        className="absolute bottom-0 left-0 w-[400px] h-[400px] pointer-events-none opacity-50 bg-[radial-gradient(circle,#fff7ed_0%,transparent_65%)]"
      />

      <div className="relative max-w-[1160px] mx-auto px-7">
        <div className="text-center mb-[52px]">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 rounded-full px-4 py-[7px] mb-5 bg-brand-bg border border-violet-200"
          >
            <span className="w-[7px] h-[7px] rounded-full bg-violet-500 shadow-[0_0_8px_#8b5cf6]" />
            <span className="text-[11px] font-bold tracking-[0.12em] uppercase text-brand">
              By the numbers
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.05, ease }}
            className="text-[clamp(2rem,4vw,3rem)] font-extrabold tracking-tight text-ink mx-auto mb-3.5 leading-tight"
          >
            Trusted by candidates <span className="text-gradient-brand">worldwide</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="max-w-[420px] mx-auto text-[15.5px] text-[#7a7a9a] leading-relaxed"
          >
            Real numbers from real users who went from nervous to hired.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-12">
          {stats.map((s, i) => (
            <StatCard key={s.key} stat={s} index={i} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-5 rounded-[20px] bg-white border border-border shadow-[0_2px_12px_rgba(0,0,0,0.04)]"
        >
          <p className="text-[14px] text-[#4a4a6a] m-0 text-center sm:text-left">
            <span className="font-bold text-ink">10,000+ learners</span> practicing right now — join
            them and start for free.
          </p>
          <Link to="/dashboard">
            <motion.span
              whileHover={{ scale: 1.04, boxShadow: "0 8px 24px rgba(107,92,246,0.28)" }}
              whileTap={{ scale: 0.97 }}
              className="inline-block px-5 py-2.5 rounded-xl bg-gradient-brand text-white font-semibold text-[13px] cursor-pointer shadow-brand whitespace-nowrap"
            >
              Start practicing →
            </motion.span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
