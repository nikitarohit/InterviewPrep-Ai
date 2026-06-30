import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";

const ease = [0.22, 1, 0.36, 1];

const Q = "Walk me through how you'd design a rate limiter for a distributed system.";
const A = `I'd start with token bucket — each user gets N tokens/sec, requests consume one. For distributed state, I'd use Redis with atomic INCR + TTL so all nodes share the same counter. Add a sliding window for smoother enforcement and fail-open on Redis timeout so a cache blip doesn't take down the API.`;

const STATS = [
  { v: "50k+", l: "Interviews practiced" },
  { v: "94%", l: "Offer success rate" },
  { v: "4.9★", l: "Average rating" },
];

const TRACKS = [
  "Software Engineering",
  "Product Management",
  "Data Science",
  "UX Design",
  "Marketing",
  "Finance",
  "Consulting",
  "Operations",
];

function useTypewriter(text, speed = 26, delay = 0) {
  const [displayed, setDisplayed] = useState("");
  const [done, setDone] = useState(false);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) {
      setDisplayed(text);
      setDone(true);
      return;
    }
    setDisplayed("");
    setDone(false);
    let i = 0;
    const t = setTimeout(() => {
      const iv = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) {
          clearInterval(iv);
          setDone(true);
        }
      }, speed);
      return () => clearInterval(iv);
    }, delay);
    return () => clearTimeout(t);
  }, [text, speed, delay, reduced]);

  return { displayed, done };
}

function Cursor({ orange = false }) {
  return (
    <span
      className={`inline-block w-0.5 h-[0.85em] ml-0.5 align-middle animate-blink ${
        orange ? "bg-orange-500" : "bg-violet-500"
      }`}
    />
  );
}

function AICard() {
  const [phase, setPhase] = useState("q");
  const { displayed: qText, done: qDone } = useTypewriter(Q, 20, 700);
  const { displayed: aText } = useTypewriter(A, 14, phase === "a" ? 0 : 1e7);

  useEffect(() => {
    if (!qDone) return;
    const t1 = setTimeout(() => setPhase("thinking"), 300);
    const t2 = setTimeout(() => setPhase("a"), 1400);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [qDone]);

  const scoreVisible = aText.length > A.length * 0.85;

  return (
    // FIX: added w-full so the card shrinks on narrow screens instead of
    // forcing overflow when squeezed by flex justify-center on mobile.
    <motion.div
      initial={{ opacity: 0, x: 40, rotate: 1 }}
      animate={{ opacity: 1, x: 0, rotate: 0 }}
      transition={{ duration: 0.8, delay: 0.35, ease }}
      className="relative w-full max-w-[440px]"
    >
      <div
        aria-hidden
        className="absolute -inset-6 rounded-[40px] opacity-55 blur-[20px] -z-0"
        style={{
          background:
            "conic-gradient(from 180deg at 50% 50%, #ede9ff 0deg, #fff7ed 120deg, #e0f2fe 240deg, #ede9ff 360deg)",
        }}
      />

      <div className="relative z-10 overflow-hidden rounded-[28px] bg-white border border-violet-500/15 shadow-[0_0_0_1px_rgba(255,255,255,0.9)_inset,0_20px_60px_rgba(107,92,246,0.13),0_4px_16px_rgba(0,0,0,0.06)]">
        <div className="flex items-center gap-2 px-[18px] py-3 bg-[#faf9ff] border-b border-[#f0edff]">
          {["bg-[#ff6b6b]", "bg-[#ffd93d]", "bg-[#6bcb77]"].map((c) => (
            <div key={c} className={`w-2.5 h-2.5 rounded-full opacity-85 ${c}`} />
          ))}
          <span className="ml-1.5 text-[11px] font-semibold tracking-[0.08em] uppercase text-brand-muted truncate">
            InterviewPrep AI — Mock Session
          </span>
          <span className="ml-auto flex items-center gap-1.5 shrink-0">
            <span className="w-[7px] h-[7px] rounded-full bg-green-500 shadow-[0_0_6px_#22c55e]" />
            <span className="text-[11px] text-brand-muted">Live</span>
          </span>
        </div>

        <div className="px-5 pt-5 pb-1">
          <div className="flex gap-2.5 mb-4">
            <div className="shrink-0 w-[30px] h-[30px] rounded-full bg-gradient-brand-soft flex items-center justify-center text-[11px] font-bold text-white">
              AI
            </div>
            <div className="flex-1 min-w-0 bg-[#f7f5ff] rounded-2xl rounded-bl-sm px-3.5 py-2.5 text-[13px] leading-relaxed text-[#3d3560]">
              {qText}
              {phase === "q" && <Cursor />}
            </div>
          </div>

          {phase === "thinking" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-2.5 items-center mb-4"
            >
              <div className="shrink-0 w-[30px] h-[30px] rounded-full bg-[#fff3ee] flex items-center justify-center text-[11px] font-bold text-orange-600">
                Y
              </div>
              <div className="flex gap-1.5 px-3.5 py-2.5">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="w-1.5 h-1.5 rounded-full bg-violet-300 animate-dotbounce"
                    style={{ animationDelay: `${i * 0.18}s` }}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {phase === "a" && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-2.5 mb-4"
            >
              <div className="shrink-0 w-[30px] h-[30px] rounded-full bg-[#fff3ee] flex items-center justify-center text-[11px] font-bold text-orange-600">
                Y
              </div>
              <div className="flex-1 min-w-0 bg-[#fffaf7] border border-[#ffe4d0] rounded-2xl rounded-bl-sm px-3.5 py-2.5 text-[13px] leading-relaxed text-[#3a2e28]">
                {aText}
                {aText.length < A.length && <Cursor orange />}
              </div>
            </motion.div>
          )}
        </div>

        {scoreVisible && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-4 mb-4 px-3.5 py-3 rounded-[14px] border border-green-200 bg-gradient-to-br from-green-50 to-green-100 flex items-center gap-2.5"
          >
            <div className="flex-1 min-w-0">
              <div className="text-[11px] font-semibold text-green-700 mb-1.5">
                Technical depth · Structured reasoning
              </div>
              <div className="h-[5px] rounded-full bg-green-100 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "91%" }}
                  transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
                  className="h-full rounded-full bg-gradient-to-r from-green-500 to-green-400"
                />
              </div>
            </div>
            <div className="text-[22px] font-bold text-green-600 leading-none shrink-0">91</div>
          </motion.div>
        )}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 3.5 }}
        className="absolute -bottom-[18px] right-5 z-20 flex items-center gap-2 rounded-full bg-white px-3.5 py-[7px] border border-border-soft shadow-[0_4px_20px_rgba(0,0,0,0.10)]"
      >
        <span className="text-[13px]">🏆</span>
        <span className="text-xs font-semibold text-[#4a4a6a] whitespace-nowrap">Top 8% answer</span>
      </motion.div>
    </motion.div>
  );
}

export default function Hero() {
  return (
    // FIX 1: min-h-screen → min-h-[100dvh] with min-h-screen fallback for
    // older browsers. 100vh on mobile doesn't account for the address bar
    // showing/hiding, which causes content jumping and the "zoom" feeling.
    // FIX 2: added overflow-x-hidden as a hard safeguard against any
    // child element forcing horizontal scroll on narrow viewports.
    <section className="relative overflow-hidden overflow-x-hidden bg-surface min-h-screen min-h-[100dvh] w-full">
      <div
        aria-hidden
        className="absolute -top-[120px] -right-[100px] w-[700px] h-[700px] rounded-full opacity-80 bg-[radial-gradient(circle,#ede9ff_0%,transparent_65%)]"
      />
      <div
        aria-hidden
        className="absolute -bottom-20 -left-[60px] w-[500px] h-[500px] rounded-full opacity-90 bg-[radial-gradient(circle,#fff7ed_0%,transparent_65%)]"
      />
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none opacity-[0.18] bg-[radial-gradient(circle,#c4b5fd_1px,transparent_1px)] bg-size-[32px_32px]"
      />
      {/* FIX 3: diagonal clip-path panel hidden below md — on narrow screens
          this decorative element was contributing to layout instability.
          It only ever made visual sense in the 2-column desktop layout
          anyway, since the 1-column mobile layout stacks content vertically. */}
      <div
        aria-hidden
        className="hidden md:block absolute inset-0 top-0 left-[38%] right-0 bottom-0 z-0 bg-gradient-to-br from-[#f5f3ff] to-surface"
        style={{ clipPath: "polygon(8% 0%, 100% 0%, 100% 100%, 0% 100%)" }}
      />

      {/* FIX 4: px-8 → px-5 sm:px-8 — 32px of padding on each side ate too
          much width on small phones (375px - 64px padding = 311px usable). */}
      <div className="relative z-10 max-w-[1200px] mx-auto px-5 sm:px-8 pt-[clamp(90px,14vw,160px)] pb-[clamp(56px,8vw,100px)]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[clamp(32px,6vw,96px)] items-center">
          <div className="min-w-0">
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
              className="inline-flex items-center gap-2 rounded-full px-4 py-[7px] mb-7 bg-brand-bg border border-violet-200"
            >
              <span className="w-[7px] h-[7px] rounded-full bg-violet-500 shadow-[0_0_8px_#8b5cf6]" />
              <span className="text-xs font-semibold text-brand tracking-[0.07em] uppercase">
                AI-Powered Interview Training
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.08, ease }}
              className="text-[clamp(2.2rem,5.5vw,4.2rem)] font-extrabold leading-[1.06] tracking-tight text-ink mb-6 break-words"
            >
              Walk in
              <br />
              <span className="text-gradient-brand">confident.</span>
              <br />
              Answer brilliantly.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.18 }}
              className="text-[clamp(0.95rem,1.8vw,1.1rem)] leading-relaxed text-body max-w-[420px] mb-9"
            >
              Practice real questions, get instant AI feedback, and build the calm
              confidence that shows up when it matters most.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.28 }}
              className="flex flex-wrap gap-3 mb-12"
            >
              <Link to="/dashboard">
                <motion.span
                  whileHover={{ scale: 1.04, boxShadow: "0 10px 32px rgba(107,92,246,0.35)" }}
                  whileTap={{ scale: 0.97 }}
                  className="inline-block px-7 py-3.5 rounded-2xl bg-gradient-brand text-white font-bold text-sm cursor-pointer shadow-brand tracking-wide"
                >
                  Start Practicing Free →
                </motion.span>
              </Link>
              <motion.a
                href="#features"
                whileHover={{ scale: 1.03, backgroundColor: "#f0edff" }}
                whileTap={{ scale: 0.97 }}
                className="inline-block px-6 py-3.5 rounded-2xl bg-white text-[#4a4a6a] border border-[#e4e0f5] font-semibold text-sm cursor-pointer shadow-[0_2px_8px_rgba(0,0,0,0.06)]"
              >
                See how it works
              </motion.a>
            </motion.div>

            {/* FIX 5: STATS row — pr-6 mr-6 fixed-px gaps were too wide on
                small phones, squeezing 3 stat blocks into very little space.
                Switched to responsive gap with flex-wrap fallback so stats
                can wrap to 2 lines gracefully on very narrow screens instead
                of being crushed. */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap border-t border-border-soft pt-7 gap-x-4 gap-y-4"
            >
              {STATS.map((s, i) => (
                <motion.div
                  key={s.l}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.55 + i * 0.07 }}
                  className={`flex-1 min-w-[90px] ${i < 2 ? "sm:pr-6 sm:mr-6 sm:border-r border-border-soft" : ""}`}
                >
                  <div className="text-[clamp(1.15rem,2.2vw,1.7rem)] font-extrabold text-ink tracking-tight">
                    {s.v}
                  </div>
                  <div className="text-xs text-brand-muted mt-0.5">{s.l}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* FIX 6: justify-center → w-full + px on mobile so the card has
              breathing room instead of touching screen edges when squeezed. */}
          <div className="flex justify-center w-full pb-6">
            <AICard />
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.55 }}
          className="mt-[56px] sm:mt-[72px] pt-8 border-t border-border-soft"
        >
          <div className="text-[11px] font-semibold tracking-[0.14em] uppercase text-[#b0aac8] mb-3.5">
            Popular interview tracks
          </div>
          <div className="flex flex-wrap gap-2">
            {TRACKS.map((t, i) => (
              <motion.button
                key={t}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.85 + i * 0.04 }}
                whileHover={{ scale: 1.04, backgroundColor: "#f0edff", borderColor: "#c4b5fd" }}
                whileTap={{ scale: 0.97 }}
                className="px-4 py-2 rounded-xl bg-[#f5f3fb] text-body border border-[#e8e4f2] text-[13px] font-medium cursor-pointer transition-colors"
              >
                {t}
              </motion.button>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}