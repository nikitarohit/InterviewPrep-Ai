import { Link } from "react-router-dom";

const platformLinks = [
  { to: "/", label: "Home" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/notes", label: "Notes" },
  { to: "/result", label: "Results" },
  { to: "/profile", label: "Profile" },
];

const exploreLinks = [
  { href: "#features", label: "Features" },
  { href: "#topics", label: "Popular Topics" },
  { href: "#ai-preview", label: "AI Preview" },
  { href: "#stats", label: "Stats" },
  { href: "#cta", label: "Get Started" },
];

const legalLinks = [
  { href: "#", label: "Privacy Policy" },
  { href: "#", label: "Terms of Service" },
  { href: "#", label: "Contact" },
];

const socialLinks = [
  {
    label: "GitHub",
    href: "#",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
        <path
          d="M9 1.5C4.86 1.5 1.5 4.97 1.5 9.18c0 3.43 2.22 6.34 5.3 7.37.39.07.53-.17.53-.38 0-.19-.01-.68-.01-1.34-2.16.47-2.62-1.04-2.62-1.04-.35-.9-.87-1.14-.87-1.14-.71-.49.05-.48.05-.48.79.06 1.2.81 1.2.81.7 1.2 1.84.85 2.29.65.07-.51.27-.85.49-1.05-1.72-.2-3.53-.86-3.53-3.84 0-.85.3-1.54.79-2.08-.08-.2-.34-.99.08-2.06 0 0 .65-.21 2.12.8a7.3 7.3 0 012-.27c.68 0 1.36.09 2 .27 1.47-1.01 2.12-.8 2.12-.8.42 1.07.16 1.86.08 2.06.49.54.79 1.23.79 2.08 0 2.99-1.82 3.64-3.55 3.83.28.24.53.72.53 1.45 0 1.05-.01 1.9-.01 2.16 0 .21.14.46.54.38A7.68 7.68 0 0016.5 9.18C16.5 4.97 13.14 1.5 9 1.5z"
          fill="currentColor"
        />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "#",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
        <rect x="2" y="2" width="14" height="14" rx="3" stroke="currentColor" strokeWidth="1.4" />
        <path d="M5.5 7.5v6M5.5 5.5v.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path
          d="M8 13.5V10c0-1 .8-1.5 1.5-1.5s1.5.5 1.5 1.5v3.5M8 10c.3-.8 1-1.5 2.5-1.5 1.8 0 2.5 1.2 2.5 2.5v2.5"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    label: "Twitter",
    href: "#",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
        <path
          d="M4 4.5l4.2 5.6L4 14h1.5l3.4-3.8 2.8 3.8H15l-4.5-6 4-3.5h-1.5L9.8 9 7.2 4.5H4z"
          fill="currentColor"
        />
      </svg>
    ),
  },
];

function FooterColumn({ title, children }) {
  return (
    <div>
      <h3 className="text-[13px] font-bold text-ink tracking-tight mb-4">{title}</h3>
      <ul className="flex flex-col gap-2.5 list-none m-0 p-0">{children}</ul>
    </div>
  );
}

function FooterLink({ to, href, label }) {
  const className =
    "text-[13.5px] text-[#6b6b8a] hover:text-brand transition-colors duration-150 no-underline";

  if (to) {
    return (
      <li>
        <Link to={to} className={className}>
          {label}
        </Link>
      </li>
    );
  }

  return (
    <li>
      <a href={href} className={className}>
        {label}
      </a>
    </li>
  );
}

export default function Footer() {
  return (
    <footer className="relative bg-surface border-t border-border overflow-hidden">
      <div
        aria-hidden
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[200px] pointer-events-none opacity-50 bg-[radial-gradient(ellipse,#f0edff_0%,transparent_70%)]"
      />

      <div className="relative max-w-[1160px] mx-auto px-7 pt-16 pb-8">
        {/* Top grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr] gap-10 lg:gap-8 mb-12">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link to="/" className="inline-flex items-center gap-2.5 no-underline mb-4">
              <div className="w-9 h-9 rounded-[10px] bg-gradient-brand-soft flex items-center justify-center shadow-[0_4px_12px_rgba(107,92,246,0.28)]">
                <span className="text-white font-extrabold text-[13px] tracking-tight">IP</span>
              </div>
              <span className="text-base font-bold text-ink tracking-tight">
                InterviewPrep <span className="text-gradient-brand">AI</span>
              </span>
            </Link>
            <p className="text-[13.5px] text-[#6b6b8a] leading-relaxed max-w-[260px] m-0 mb-5">
              AI-powered interview prep — questions, mock interviews, roadmaps, and progress
              tracking in one place.
            </p>
            <div className="flex items-center gap-2">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="w-9 h-9 rounded-xl bg-white border border-border flex items-center justify-center text-[#8a8aa8] hover:text-brand hover:border-violet-200 hover:bg-brand-bg transition-all duration-150"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          <FooterColumn title="Platform">
            {platformLinks.map((l) => (
              <FooterLink key={l.to} to={l.to} label={l.label} />
            ))}
          </FooterColumn>

          <FooterColumn title="Explore">
            {exploreLinks.map((l) => (
              <FooterLink key={l.href} href={l.href} label={l.label} />
            ))}
          </FooterColumn>

          <FooterColumn title="Legal">
            {legalLinks.map((l) => (
              <FooterLink key={l.label} href={l.href} label={l.label} />
            ))}
          </FooterColumn>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-border-soft flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
          <p className="text-[13px] text-brand-muted m-0">
            © 2026 InterviewPrep AI. All rights reserved.
          </p>
          <p className="text-[13px] text-brand-muted m-0">
            Built with <span className="text-red-400">♥</span> by Nikita
          </p>
        </div>
      </div>
    </footer>
  );
}
