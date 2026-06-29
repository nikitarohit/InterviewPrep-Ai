import { motion, useReducedMotion } from "framer-motion";

const ease = [0.22, 1, 0.36, 1];

const companies = [
  { name: "Google", abbr: "G", accent: "#4285F4", accentBg: "#eff6ff", role: "SWE" },
  { name: "Microsoft", abbr: "M", accent: "#00A4EF", accentBg: "#f0f9ff", role: "SDE" },
  { name: "Amazon", abbr: "A", accent: "#FF9900", accentBg: "#fff7ed", role: "SDE II" },
  { name: "Adobe", abbr: "Ad", accent: "#EB1000", accentBg: "#fff1f2", role: "Frontend" },
  { name: "Netflix", abbr: "N", accent: "#E50914", accentBg: "#fef2f2", role: "Backend" },
  { name: "Meta", abbr: "Me", accent: "#0866FF", accentBg: "#eff6ff", role: "E4" },
  { name: "Apple", abbr: "Ap", accent: "#555555", accentBg: "#f5f5f5", role: "iOS" },
  { name: "Uber", abbr: "U", accent: "#000000", accentBg: "#f5f5f5", role: "Platform" },
];

const testimonials = [
  {
    quote: "Mock interviews felt eerily real. Got my offer in 3 weeks.",
    name: "Riya S.",
    role: "SWE @ Google",
    accent: "#6b5cf6",
    accentBg: "#f0edff",
  },
  {
    quote: "The MCQ explanations saved me hours of googling before my Amazon loop.",
    name: "Arjun K.",
    role: "SDE @ Amazon",
    accent: "#ea580c",
    accentBg: "#fff7ed",
  },
  {
    quote: "Roadmaps kept me on track — went from 0 system design to confident in a month.",
    name: "Priya M.",
    role: "PM @ Microsoft",
    accent: "#0ea5e9",
    accentBg: "#f0f9ff",
  },
];

const stats = [
  { value: "10K+", label: "Active learners", icon: "👥" },
  { value: "500+", label: "Companies represented", icon: "🏢" },
  { value: "4.9★", label: "Average rating", icon: "⭐" },
];

function LogoChip({ company, index, staticAnim = true }) {
  const chip = (
    <div className="group flex items-center gap-2.5 shrink-0 px-4 py-2.5 rounded-xl bg-surface border border-border transition-all duration-200 hover:border-violet-200 hover:bg-brand-bg hover:shadow-[0_4px_16px_rgba(107,92,246,0.08)]">
      <div
        className="w-8 h-8 rounded-lg border flex items-center justify-center text-[11px] font-extrabold transition-colors"
        style={{
          background: company.accentBg,
          borderColor: `${company.accent}33`,
          color: company.accent,
        }}
      >
        {company.abbr}
      </div>
      <div className="flex flex-col">
        <span className="text-[14px] font-semibold text-[#8a8aa8] tracking-tight group-hover:text-ink transition-colors leading-tight">
          {company.name}
        </span>
        <span className="text-[10px] text-brand-muted font-medium">{company.role}</span>
      </div>
    </div>
  );

  if (!staticAnim) return chip;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: index * 0.06, ease }}
    >
      {chip}
    </motion.div>
  );
}

function MarqueeRow({ items, reverse = false }) {
  const reduced = useReducedMotion();

  if (reduced) {
    return (
      <div className="flex flex-wrap items-center justify-center gap-3">
        {companies.map((c, i) => (
          <LogoChip key={c.name} company={c} index={i} staticAnim={false} />
        ))}
      </div>
    );
  }

  return (
    <div className="relative group/marquee">
      <div
        aria-hidden
        className="absolute inset-y-0 left-0 w-16 z-10 bg-gradient-to-r from-white to-transparent pointer-events-none"
      />
      <div
        aria-hidden
        className="absolute inset-y-0 right-0 w-16 z-10 bg-gradient-to-l from-white to-transparent pointer-events-none"
      />
      <div className="overflow-hidden">
        <motion.div
          animate={{ x: reverse ? ["-50%", "0%"] : ["0%", "-50%"] }}
          transition={{ duration: 32, repeat: Infinity, ease: "linear" }}
          className="flex gap-3 w-max group-hover/marquee:[animation-play-state:paused]"
          style={{ animationPlayState: "running" }}
        >
          {items.map((c, i) => (
            <LogoChip key={`${c.name}-${i}`} company={c} index={0} staticAnim={false} />
          ))}
        </motion.div>
      </div>
    </div>
  );
}

function TestimonialCard({ t, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08, ease }}
      className="flex flex-col h-full p-4 rounded-2xl bg-[#fafaf8] border border-[#f0edfa] hover:border-violet-200 hover:bg-brand-bg/40 transition-colors duration-200"
    >
      <p className="text-[13px] leading-relaxed text-[#4a4a6a] flex-1 m-0 mb-3">
        &ldquo;{t.quote}&rdquo;
      </p>
      <div className="flex items-center gap-2.5">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0"
          style={{ background: t.accentBg, color: t.accent }}
        >
          {t.name[0]}
        </div>
        <div>
          <div className="text-[12.5px] font-semibold text-ink leading-tight">{t.name}</div>
          <div className="text-[11px] text-brand-muted">{t.role}</div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Trusted() {
  const marqueeItems = [...companies, ...companies];

  return (
    <section id="trusted" className="relative bg-surface py-16 md:py-20 overflow-hidden">
      <div
        aria-hidden
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[400px] pointer-events-none opacity-50 bg-[radial-gradient(ellipse,#f0edff_0%,transparent_70%)]"
      />

      <div className="relative max-w-[1160px] mx-auto px-7">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, ease }}
          className="rounded-[24px] bg-white border border-border shadow-card px-6 py-10 md:px-10 md:py-12 overflow-hidden"
        >
          {/* Header */}
          <div className="text-center mb-8 md:mb-10">
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 rounded-full px-4 py-[7px] mb-4 bg-brand-bg border border-violet-200"
            >
              <span className="w-[7px] h-[7px] rounded-full bg-green-500 shadow-[0_0_8px_#22c55e]" />
              <span className="text-[11px] font-bold tracking-[0.12em] uppercase text-brand">
                Trusted worldwide
              </span>
            </motion.div>

            <h2 className="text-xl md:text-2xl font-extrabold text-ink tracking-tight mb-2">
              Learners hired at top companies
            </h2>
            <p className="text-sm text-[#7a7a9a] max-w-md mx-auto leading-relaxed">
              Join 10,000+ candidates who used InterviewPrep AI to land offers at leading tech
              firms.
            </p>
          </div>

          {/* Company logos — desktop static, mobile marquee */}
          <div className="hidden md:flex flex-wrap items-center justify-center gap-3 mb-8">
            {companies.map((c, i) => (
              <LogoChip key={c.name} company={c} index={i} />
            ))}
          </div>

          <div className="md:hidden mb-8">
            <MarqueeRow items={marqueeItems} />
          </div>

          {/* Testimonials */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
            {testimonials.map((t, i) => (
              <TestimonialCard key={t.name} t={t} index={i} />
            ))}
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.35, duration: 0.5 }}
            className="pt-6 border-t border-border-soft flex flex-wrap items-center justify-center gap-4 md:gap-0"
          >
            {stats.map((s, i) => (
              <div key={s.label} className="contents">
                {i > 0 && <div className="hidden md:block w-px h-10 bg-border mx-8 shrink-0" />}
                <div className="flex items-center gap-2.5 px-2">
                  <span className="text-base leading-none">{s.icon}</span>
                  <div>
                    <div className="text-base font-extrabold text-ink leading-tight">{s.value}</div>
                    <div className="text-[11px] text-brand-muted font-medium">{s.label}</div>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
