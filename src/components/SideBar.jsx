import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export const navItems = [
  {
    to: "/dashboard",
    label: "Dashboard",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
        <rect x="1" y="1" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <rect x="10" y="1" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <rect x="1" y="10" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <rect x="10" y="10" width="7" height="7" rx="2" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    ),
  },
  {
    to: "/result",
    label: "Results",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
        <path
          d="M4 10l3 3 6-7"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <rect x="2" y="2" width="14" height="14" rx="4" stroke="currentColor" strokeWidth="1.4" />
      </svg>
    ),
  },
  {
    to: "/notes",
    label: "Notes",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
        <path
          d="M3 3h12v10l-4 4H3V3z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path d="M11 13v4M11 13h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M6 7h6M6 10h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    to: "/profile",
    label: "Profile",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
        <circle cx="9" cy="6" r="3" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M2 16c0-3.314 3.134-6 7-6s7 2.686 7 6"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    to: "/settings",
    label: "Settings",
    icon: (
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
        <circle cx="9" cy="9" r="2.5" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M9 1v2M9 15v2M1 9h2M15 9h2M3.22 3.22l1.42 1.42M13.36 13.36l1.42 1.42M3.22 14.78l1.42-1.42M13.36 4.64l1.42-1.42"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
];

function Logo({ onClick }) {
  return (
    <Link
      to="/"
      onClick={onClick}
      className="flex items-center gap-2.5 pl-2 mb-9 no-underline group"
    >
      <div className="w-8 h-8 rounded-[9px] bg-gradient-brand-soft flex items-center justify-center shadow-[0_3px_10px_rgba(107,92,246,0.28)] transition-transform duration-200 group-hover:scale-105">
        <span className="text-white font-extrabold text-[11px]">IP</span>
      </div>
      <div>
        <div className="text-[13px] font-bold text-ink leading-tight">InterviewPrep</div>
        <div className="text-[11px] font-bold text-gradient-brand leading-tight">AI</div>
      </div>
    </Link>
  );
}

function NavLink({ to, label, icon, onNavigate }) {
  const location = useLocation();
  const active = location.pathname === to;

  return (
    <Link to={to} onClick={onNavigate} className="no-underline block">
      <div
        className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[14px] transition-all duration-150 cursor-pointer ${
          active
            ? "bg-brand-bg text-brand font-semibold"
            : "text-[#6b6b8a] font-medium hover:bg-[#f7f5ff] hover:text-brand"
        }`}
      >
        <span className="shrink-0">{icon}</span>
        {label}
        {active && (
          <span className="ml-auto w-1.5 h-1.5 rounded-full bg-brand shrink-0" />
        )}
      </div>
    </Link>
  );
}

function SidebarContent({ onNavigate, className = "" }) {
  return (
    <div className={`flex flex-col h-full ${className}`}>
      <Logo onClick={onNavigate} />

      <nav className="flex flex-col gap-1 flex-1">
        {navItems.map((item) => (
          <NavLink key={item.to} {...item} onNavigate={onNavigate} />
        ))}
      </nav>

      {/* Profile card - moved to bottom */}
      <Link to="/profile" onClick={onNavigate} className="no-underline mb-3">
        <div className="flex items-center gap-2.5 p-3 rounded-[14px] bg-[#f7f5ff] border border-[#ede9f5] hover:border-violet-200 hover:bg-brand-bg/60 transition-colors duration-150">
          <div className="w-[34px] h-[34px] rounded-[10px] bg-gradient-brand-soft flex items-center justify-center text-[12px] font-bold text-white shrink-0">
            N
          </div>
          <div className="min-w-0">
            <div className="text-[13px] font-semibold text-ink truncate">Nikita</div>
            <div className="text-[11px] text-brand-muted">Pro plan</div>
          </div>
          <span className="ml-auto text-brand-muted text-xs">→</span>
        </div>
      </Link>
    </div>
  );
}

/** Desktop sidebar — hidden below md */
export function SideBarDesktop({ className = "" }) {
  return (
    <aside
      className={`hidden md:flex w-[220px] shrink-0 flex-col bg-white border-r border-border px-4 py-7 min-h-[calc(100vh-64px)] sticky top-16 ${className}`}
    >
      <SidebarContent />
    </aside>
  );
}

/** Mobile drawer toggle button */
export function SideBarToggle({ open, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={open ? "Close menu" : "Open menu"}
      aria-expanded={open}
      className="md:hidden flex items-center justify-center w-9 h-9 rounded-xl border border-border bg-white text-[#6b6b8a] hover:text-brand hover:border-violet-200 hover:bg-brand-bg transition-colors cursor-pointer"
    >
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden>
        {open ? (
          <path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        ) : (
          <path d="M3 5h12M3 9h12M3 13h12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        )}
      </svg>
    </button>
  );
}

/** Full sidebar with mobile drawer — use in app shell layouts */
export default function SideBar({ mobileOpen = false, onMobileClose }) {
  return (
    <>
      <SideBarDesktop />

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[2px] md:hidden"
              onClick={onMobileClose}
              aria-hidden
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 380, damping: 32 }}
              className="fixed top-0 left-0 bottom-0 z-50 w-[260px] bg-white border-r border-border px-4 py-7 md:hidden shadow-[4px_0_32px_rgba(0,0,0,0.12)]"
            >
              <SidebarContent onNavigate={onMobileClose} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
