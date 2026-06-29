import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import FeatureCard, { featureCards } from "./FeatureCard.jsx";

const ease = [0.22, 1, 0.36, 1];

const HIGHLIGHTS = [
  { value: "6", label: "Core tools" },
  { value: "AI", label: "Powered feedback" },
  { value: "Free", label: "To get started" },
];

const container = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

export default function Feature() {
  return (
    <section id="features" className="relative bg-surface py-[100px] pb-[120px] overflow-hidden">
      <div
        aria-hidden
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] pointer-events-none opacity-70 bg-[radial-gradient(ellipse_at_top,#f0edff_0%,transparent_65%)]"
      />
      <div
        aria-hidden
        className="absolute bottom-0 right-0 w-[460px] h-[460px] pointer-events-none opacity-55 bg-[radial-gradient(circle,#fff7ed_0%,transparent_65%)]"
      />

      <div className="relative max-w-[1160px] mx-auto px-7">
        {/* Header */}
        <div className="text-center mb-14">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="inline-flex items-center gap-2 rounded-full px-4 py-[7px] mb-5 bg-brand-bg border border-violet-200"
          >
            <span className="w-[7px] h-[7px] rounded-full bg-violet-500 shadow-[0_0_8px_#8b5cf6]" />
            <span className="text-[11px] font-bold tracking-[0.12em] uppercase text-brand">
              Platform Features
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.05, ease }}
            className="text-[clamp(2rem,4vw,3rem)] font-extrabold tracking-tight text-ink mx-auto mb-4 leading-tight"
          >
            Everything you need to <span className="text-gradient-brand">succeed</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.12 }}
            className="max-w-[480px] mx-auto mb-8 text-[15.5px] text-[#7a7a9a] leading-relaxed"
          >
            Six tools, one goal — turning nervous candidates into people who enjoy the
            interview process.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: 0.18 }}
            className="inline-flex flex-wrap items-center justify-center gap-3 px-2"
          >
            {HIGHLIGHTS.map((h, i) => (
              <div
                key={h.label}
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-white border border-border shadow-[0_2px_8px_rgba(0,0,0,0.04)] ${
                  i === 1 ? "ring-1 ring-violet-100" : ""
                }`}
              >
                <span className="text-base font-extrabold text-ink tracking-tight">{h.value}</span>
                <span className="text-[12px] text-brand-muted font-medium">{h.label}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Card grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-4"
        >
          {featureCards.map((c, i) => (
            <FeatureCard key={c.key} card={c} index={i} />
          ))}
        </motion.div>

        {/* Bottom CTA strip */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, delay: 0.15, ease }}
          className="mt-12 flex flex-col sm:flex-row items-center justify-between gap-5 px-6 py-5 rounded-[20px] bg-white border border-border shadow-[0_2px_12px_rgba(0,0,0,0.04)]"
        >
          <div className="text-center sm:text-left">
            <p className="text-[15px] font-bold text-ink m-0 mb-1">
              All features included on the free plan
            </p>
            <p className="text-[13px] text-brand-muted m-0">
              No credit card · Upgrade anytime for unlimited AI sessions
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
            <a
              href="#ai-preview"
              className="px-5 py-2.5 rounded-xl bg-[#f7f5ff] text-brand font-semibold text-[13px] border border-[#ede9ff] hover:bg-brand-bg transition-colors"
            >
              See AI in action
            </a>
            <Link to="/dashboard">
              <motion.span
                whileHover={{ scale: 1.04, boxShadow: "0 8px 24px rgba(107,92,246,0.28)" }}
                whileTap={{ scale: 0.97 }}
                className="inline-block px-5 py-2.5 rounded-xl bg-gradient-brand text-white font-semibold text-[13px] cursor-pointer shadow-brand"
              >
                Open dashboard →
              </motion.span>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
