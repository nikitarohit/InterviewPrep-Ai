import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import SearchBar from "../components/SearchBar.jsx";
import { useAuth } from "../hooks/useAuth";
import { api } from "../utils/api";

const ease = [0.22, 1, 0.36, 1];

const defaultStatCards = [
  { title: "Questions", accent: "#6b5cf6", accentBg: "#f0edff", icon: (<svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden><path d="M10 2a8 8 0 100 16A8 8 0 0010 2z" stroke="#6b5cf6" strokeWidth="1.4" /><path d="M10 11V9.5c1.5 0 2.5-.8 2.5-2S11.5 6 10 6s-2 .8-2.2 1.8" stroke="#6b5cf6" strokeWidth="1.4" strokeLinecap="round" /><circle cx="10" cy="13.5" r=".75" fill="#6b5cf6" /></svg>), spark: [30, 45, 38, 60, 55, 80, 72, 95] },
  { title: "MCQs", accent: "#e11d48", accentBg: "#fff1f2", icon: (<svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden><rect x="2" y="2" width="16" height="16" rx="4" stroke="#e11d48" strokeWidth="1.4" /><path d="M6 10l3 3 5-5" stroke="#e11d48" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>), spark: [20, 35, 30, 50, 45, 60, 65, 80] },
  { title: "Coding", accent: "#0ea5e9", accentBg: "#f0f9ff", icon: (<svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden><path d="M5.5 7L2 10l3.5 3M14.5 7L18 10l-3.5 3M11 4l-2 12" stroke="#0ea5e9" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>), spark: [10, 22, 18, 35, 30, 45, 50, 60] },
  { title: "Roadmaps", accent: "#16a34a", accentBg: "#f0fdf4", icon: (<svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden><circle cx="4" cy="4" r="2" stroke="#16a34a" strokeWidth="1.4" /><circle cx="16" cy="10" r="2" stroke="#16a34a" strokeWidth="1.4" /><circle cx="4" cy="16" r="2" stroke="#16a34a" strokeWidth="1.4" /><path d="M6 4h5a3 3 0 013 3v1M14 12v1a3 3 0 01-3 3H6" stroke="#16a34a" strokeWidth="1.3" strokeLinecap="round" /></svg>), spark: [5, 8, 12, 15, 18, 22, 28, 32] },
];

function Spark({ points, color }) {
  const safePoints = Array.isArray(points) && points.length ? points : [0, 0, 0, 0, 0, 0, 0, 0];
  const w = 64;
  const h = 24;
  const max = Math.max(...safePoints);
  const min = Math.min(...safePoints);
  const xs = safePoints.map((_, i) => (i / (safePoints.length - 1)) * w);
  const ys = safePoints.map((p) => h - ((p - min) / (max - min || 1)) * h * 0.85 - 2);
  const d = xs.map((x, i) => `${i === 0 ? "M" : "L"}${x},${ys[i]}`).join(" ");

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none" aria-hidden>
      <path d={d} stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" />
    </svg>
  );
}

function StatCard({ card, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="rounded-[20px] bg-white border border-border shadow-[0_2px_8px_rgba(0,0,0,0.04)] px-5 pt-5 pb-4"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: card.accentBg }}>
          {card.icon}
        </div>
        <Spark points={card.spark} color={card.accent} />
      </div>
      <div className="text-[1.9rem] font-extrabold text-ink tracking-tight leading-none">{card.value}</div>
      <div className="flex items-center justify-between mt-1.5">
        <span className="text-[13px] text-brand-muted font-medium">{card.title}</span>
        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full" style={{ background: card.accentBg, color: card.accent }}>
          {card.change}
        </span>
      </div>
    </motion.div>
  );
}

// ── Activity row — single item in the Recent Activity list ───────────────────
function ActivityRow({ a, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: Math.min(index * 0.05, 0.5), duration: 0.3 }}
      className="flex items-center gap-3 p-3 rounded-[14px] bg-[#fafaf8] border border-[#f0edfa]"
    >
      <div className="w-[34px] h-[34px] rounded-[10px] shrink-0 flex items-center justify-center text-[10px] font-bold" style={{ background: a.accentBg, color: a.accent }}>
        {a.label[0]}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[13px] font-semibold text-ink truncate">{a.text}</div>
        <div className="text-[11px] text-brand-muted mt-0.5">{a.time}</div>
      </div>
      <span className="text-[10px] font-bold px-2 py-1 rounded-full shrink-0" style={{ background: a.accentBg, color: a.accent }}>
        {a.label}
      </span>
    </motion.div>
  );
}

const COLLAPSED_LIMIT = 5;

export default function Dashboard() {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activityExpanded, setActivityExpanded] = useState(false); // FIX: collapse state
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      try {
        const data = await api.getDashboardStats();
        setProgress(data.dashboard);
      } catch (err) {
        if (err.message?.toLowerCase().includes("not authorized") || err.message?.toLowerCase().includes("invalid or expired token")) {
          navigate("/login", { replace: true });
          return;
        }
        setProgress(null);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [navigate]);

  const today = new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  const defaultSparks = {
    Questions: [30, 45, 38, 60, 55, 80, 72, 95],
    MCQs: [20, 35, 30, 50, 45, 60, 65, 80],
    Coding: [10, 22, 18, 35, 30, 45, 50, 60],
    Roadmaps: [5, 8, 12, 15, 18, 22, 28, 32],
  };

  const statCards = (progress?.stats || defaultStatCards).map((card, index) => ({
    ...card,
    value: card.value || (progress ? String(progress.stats?.[index]?.value || 0) : "0"),
    change: card.change || (progress ? progress.stats?.[index]?.change || "+0%" : "+0%"),
    spark: Array.isArray(card.spark) && card.spark.length ? card.spark : defaultSparks[card.title] || [0, 0, 0, 0, 0, 0, 0, 0],
  }));

  const allActivities = (progress?.activities || []).map((a) => ({
    text: a.text,
    time: a.time,
    accent: a.accent || "#6b5cf6",
    accentBg: a.accentBg || "#f0edff",
    label: a.label || "Theory",
  }));

  // FIX: only show first 5 by default, rest behind "View all" toggle
  const visibleActivities = activityExpanded ? allActivities : allActivities.slice(0, COLLAPSED_LIMIT);
  const hasMore = allActivities.length > COLLAPSED_LIMIT;

  const goals = (progress?.goals || []).map((g) => ({
    ...g,
    progress: Number(g.progress ?? 0),
    accentBg: g.accentBg || "#f0edff",
  }));

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-surface min-h-[calc(100vh-64px)]">
      <header className="sticky top-16 z-10 flex flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8 border-b border-border bg-surface/85 backdrop-blur-md">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="min-w-0">
              <h1 className="text-lg sm:text-xl font-bold text-ink tracking-tight m-0 truncate">Dashboard</h1>
              <p className="text-xs text-brand-muted m-0 truncate">{today}</p>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-3 shrink-0">
            <span className="text-[13.5px] text-[#6b6b8a]">Welcome back, {user?.name?.split(" ")[0] || "there"} 👋</span>
            <Link to="/profile" className="w-9 h-9 rounded-[10px] bg-gradient-brand-soft flex items-center justify-center text-[13px] font-bold text-white hover:opacity-90 transition-opacity">
              {(user?.name || "U").charAt(0).toUpperCase()}
            </Link>
          </div>
        </div>
        <SearchBar compact showSuggestions={false} className="max-w-none" />
      </header>

      <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 overflow-y-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
          {loading ? (
            <div className="col-span-full text-sm text-brand-muted">Loading your progress…</div>
          ) : statCards.map((card, i) => <StatCard key={card.title} card={card} index={i} />)}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Recent Activity */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.35, ease }}
            className="rounded-[20px] bg-white border border-border shadow-[0_2px_8px_rgba(0,0,0,0.04)] p-6"
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-[15px] font-bold text-ink m-0">Recent Activity</h2>
              {/* FIX: "View all" now toggles in-place expand/collapse instead of
                  linking to /result (which made no sense — there's no activity
                  list there). Only shown when there's actually more to expand. */}
              {hasMore && (
                <button
                  onClick={() => setActivityExpanded((e) => !e)}
                  className="text-xs text-brand font-semibold hover:opacity-80 bg-transparent border-none cursor-pointer flex items-center gap-1"
                >
                  {activityExpanded ? "Show less" : `View all (${allActivities.length})`}
                  <span className={`inline-block transition-transform duration-200 ${activityExpanded ? "rotate-180" : ""}`}>↓</span>
                </button>
              )}
            </div>

            <div className="flex flex-col gap-3" style={{ maxHeight: activityExpanded ? 480 : "none", overflowY: activityExpanded ? "auto" : "visible" }}>
              {allActivities.length === 0 ? (
                <div className="text-sm text-brand-muted">No recent activity yet. Start a practice session to build your streak.</div>
              ) : (
                <AnimatePresence initial={false}>
                  {visibleActivities.map((a, i) => (
                    <ActivityRow key={`${a.text}-${a.time}-${i}`} a={a} index={i} />
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Bottom "show less" for convenience when expanded and scrolled down */}
            {activityExpanded && hasMore && (
              <button
                onClick={() => setActivityExpanded(false)}
                className="w-full mt-3 text-xs text-brand-muted font-medium hover:text-brand bg-transparent border-none cursor-pointer py-1"
              >
                ↑ Show less
              </button>
            )}
          </motion.section>

          {/* Daily Goals */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.42, ease }}
            className="rounded-[20px] bg-white border border-border shadow-[0_2px_8px_rgba(0,0,0,0.04)] p-6"
          >
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-[15px] font-bold text-ink m-0">Daily Goals</h2>
              <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-green-50 text-green-600">🔥 14-day streak</span>
            </div>

            <div className="flex flex-col gap-[18px]">
              {goals.map((g, i) => (
                <div key={g.label}>
                  <div className="flex justify-between mb-2">
                    <span className="text-[13px] font-semibold text-[#4a4a6a]">{g.label}</span>
                    <span className="text-[13px] font-bold" style={{ color: g.accent }}>{g.progress}/100</span>
                  </div>
                  <div className="h-[7px] rounded-full overflow-hidden" style={{ background: g.accentBg }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${g.progress}%` }}
                      transition={{ duration: 1.1, delay: 0.5 + i * 0.12, ease: "easeOut" }}
                      className="h-full rounded-full opacity-80"
                      style={{ background: g.accent }}
                    />
                  </div>
                </div>
              ))}
            </div>

            <Link to="/result">
              <motion.span
                whileHover={{ scale: 1.02, boxShadow: "0 6px 20px rgba(107,92,246,0.2)" }}
                whileTap={{ scale: 0.97 }}
                className="mt-[22px] w-full inline-flex items-center justify-center py-3 rounded-[14px] bg-gradient-brand text-white font-semibold text-sm cursor-pointer shadow-[0_3px_12px_rgba(107,92,246,0.22)]"
              >
                Start Today&apos;s Practice →
              </motion.span>
            </Link>
          </motion.section>
        </div>
      </main>
    </div>
  );
}