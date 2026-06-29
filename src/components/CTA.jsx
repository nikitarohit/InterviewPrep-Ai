import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";

const ease = [0.22, 1, 0.36, 1];

const checks = [
  "No credit card required",
  "1,000+ questions on day one",
  "Cancel anytime",
];

const proofStats = [
  { v: "50k+", l: "Interviews done" },
  { v: "94%", l: "Offer rate" },
];

function OrbRing({ size, opacity, duration, color, paused }) {
  return (
    <div
      aria-hidden
      className="absolute top-1/2 left-1/2 rounded-full pointer-events-none"
      style={{
        width: size,
        height: size,
        border: `1px solid ${color}`,
        opacity,
        transform: "translate(-50%, -50%)",
        animation: paused ? "none" : `ctaSpin ${duration}s linear infinite`,
      }}
    />
  );
}

function ProofCard({ className = "" }) {
  return (
    <div
      className={`rounded-3xl bg-white/[0.06] border border-violet-400/20 backdrop-blur-md p-6 flex flex-col gap-[18px] ${className}`}
    >
      <div>
        <div className="flex gap-[3px] mb-2">
          {[...Array(5)].map((_, i) => (
            <span key={i} className="text-base text-amber-400">
              ★
            </span>
          ))}
        </div>
        <p className="text-[13px] text-violet-100/85 leading-relaxed m-0">
          &ldquo;Got my Google offer after 3 weeks of practice. The mock interviews are scary
          good.&rdquo;
        </p>
        <p className="text-[11.5px] text-violet-300/70 mt-2 mb-0 font-semibold">
          — Riya S., SWE @ Google
        </p>
      </div>

      <div className="h-px bg-violet-400/15" />

      {proofStats.map((s) => (
        <div key={s.l} className="flex justify-between items-baseline">
          <span className="text-[11px] text-violet-300/65 font-medium">{s.l}</span>
          <span className="text-lg font-extrabold text-violet-200 tracking-tight">{s.v}</span>
        </div>
      ))}

      <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-green-500/10 border border-green-500/20">
        <span className="w-[7px] h-[7px] rounded-full bg-green-500 shadow-[0_0_6px_#22c55e] shrink-0 animate-pulse" />
        <span className="text-xs text-green-200/90 font-semibold">1,243 practicing right now</span>
      </div>
    </div>
  );
}

export default function CTA() {
  const reduced = useReducedMotion();

  return (
    <section id="cta" className="relative bg-surface py-[100px] pb-[120px] overflow-hidden">
      <div className="relative max-w-[1160px] mx-auto px-7">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease }}
          className="relative rounded-[36px] overflow-hidden shadow-[0_32px_80px_rgba(107,92,246,0.28),0_8px_32px_rgba(0,0,0,0.2)] px-8 py-12 md:px-14 md:py-16 lg:px-20 lg:py-[88px]"
          style={{
            background: "linear-gradient(135deg, #1a0f3c 0%, #2d1b5e 40%, #1e2d5a 100%)",
          }}
        >
          {/* Background decorations */}
          <div className="absolute -top-[60px] -right-[60px] w-[420px] h-[420px] pointer-events-none">
            <OrbRing size={420} opacity={0.08} duration={40} color="#a78bfa" paused={reduced} />
            <OrbRing size={300} opacity={0.1} duration={28} color="#c084fc" paused={reduced} />
            <OrbRing size={180} opacity={0.14} duration={18} color="#e879f9" paused={reduced} />
            <div
              aria-hidden
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full"
              style={{
                background: "radial-gradient(circle, rgba(168,139,250,0.5) 0%, transparent 70%)",
              }}
            />
          </div>

          <div
            aria-hidden
            className="absolute -bottom-[60px] -left-10 w-[340px] h-[340px] rounded-full pointer-events-none"
            style={{
              background: "radial-gradient(circle, rgba(249,115,22,0.18) 0%, transparent 65%)",
            }}
          />

          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none opacity-100"
            style={{
              backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)",
              backgroundSize: "28px 28px",
            }}
          />

          <div
            aria-hidden
            className="absolute inset-y-0 left-[55%] right-0 pointer-events-none"
            style={{
              background: "linear-gradient(160deg, rgba(168,139,250,0.07) 0%, transparent 60%)",
            }}
          />

          {/* Content */}
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-10 lg:gap-16 items-center">
            <div>
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 mb-6 bg-violet-400/15 border border-violet-400/30"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400 shadow-[0_0_8px_#a78bfa]" />
                <span className="text-[11px] font-bold text-violet-200 tracking-[0.1em] uppercase">
                  Start today — it&apos;s free
                </span>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.65, delay: 0.15, ease }}
                className="text-[clamp(2.2rem,5vw,3.8rem)] font-extrabold leading-[1.08] tracking-tight text-white mb-5 m-0"
              >
                Ace your next
                <br />
                <span
                  className="bg-clip-text text-transparent"
                  style={{
                    backgroundImage:
                      "linear-gradient(120deg, #c084fc 0%, #f0abfc 50%, #fda4af 100%)",
                  }}
                >
                  interview
                </span>{" "}
                with AI.
              </motion.h2>

              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.22 }}
                className="text-[clamp(1rem,1.8vw,1.1rem)] leading-[1.75] text-violet-200/85 max-w-[480px] mb-8 m-0"
              >
                Generate questions, coding challenges, and personalised roadmaps. Practice with an
                AI that gives you real feedback — not just a score.
              </motion.p>

              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: 0.28 }}
                className="flex flex-wrap gap-x-5 gap-y-2 mb-9"
              >
                {checks.map((c) => (
                  <span
                    key={c}
                    className="flex items-center gap-1.5 text-[13px] text-violet-200/90 font-medium"
                  >
                    <span className="w-[18px] h-[18px] rounded-full bg-violet-400/20 flex items-center justify-center text-[10px] text-violet-300 shrink-0">
                      ✓
                    </span>
                    {c}
                  </span>
                ))}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.32 }}
                className="flex gap-3 flex-wrap"
              >
                <Link to="/dashboard">
                  <motion.span
                    whileHover={{ scale: 1.04, boxShadow: "0 10px 36px rgba(192,132,252,0.45)" }}
                    whileTap={{ scale: 0.97 }}
                    className="inline-block px-[30px] py-[15px] rounded-2xl border-0 text-white font-bold text-[15px] cursor-pointer tracking-wide"
                    style={{
                      background: "linear-gradient(135deg, #a78bfa, #c084fc)",
                      boxShadow:
                        "0 4px 20px rgba(167,139,250,0.35), 0 1px 0 rgba(255,255,255,0.2) inset",
                    }}
                  >
                    Get started free →
                  </motion.span>
                </Link>

                <a href="#ai-preview">
                  <motion.span
                    whileHover={{ scale: 1.03, backgroundColor: "rgba(255,255,255,0.1)" }}
                    whileTap={{ scale: 0.97 }}
                    className="inline-block px-6 py-[15px] rounded-2xl bg-white/[0.07] text-violet-100/90 border border-violet-400/30 font-semibold text-[15px] cursor-pointer"
                  >
                    See a demo
                  </motion.span>
                </a>
              </motion.div>

              {/* Mobile proof card */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.38 }}
                className="mt-8 lg:hidden"
              >
                <ProofCard />
              </motion.div>
            </div>

            {/* Desktop proof card */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.65, delay: 0.3, ease }}
              className="hidden lg:block min-w-[240px]"
            >
              <ProofCard />
            </motion.div>
          </div>
        </motion.div>
      </div>

      <style>{`
        @keyframes ctaSpin {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
      `}</style>
    </section>
  );
}
