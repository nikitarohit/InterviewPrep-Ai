import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';

const links = [
  { to: '/', label: 'Home' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/notes', label: 'Notes' },
  { to: '/profile', label: 'Profile' },
  { to: '/result', label: 'Results' },
];

export default function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => setMenuOpen(false), [location.pathname]);

  const isActive = (to) =>
    to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);
  const { user } = useAuth();
  // Only show Start Free on the landing page and when user is not logged in
  const showStartFree = location.pathname === '/' && !user;

  return (
    <>
      <nav
        style={{
          position: 'sticky', top: 0, zIndex: 50,
          transition: 'background 0.3s, box-shadow 0.3s, border-color 0.3s',
          background: scrolled ? 'rgba(250,250,248,0.85)' : 'rgba(250,250,248,0.6)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: scrolled ? '1px solid #ece8f5' : '1px solid transparent',
          boxShadow: scrolled ? '0 2px 20px rgba(107,92,246,0.07)' : 'none',
        }}
      >
        <div style={{
          maxWidth: 1160, margin: '0 auto',
          padding: '0 28px',
          height: 64,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>

          {/* ── Logo ── */}
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'linear-gradient(135deg, #6b5cf6 0%, #a78bfa 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(107,92,246,0.3)',
              flexShrink: 0,
            }}>
              <span style={{ color: '#fff', fontWeight: 800, fontSize: 13, letterSpacing: '-0.02em' }}>IP</span>
            </div>
            <span style={{
              fontSize: 16, fontWeight: 700, color: '#1a1a2e',
              letterSpacing: '-0.02em',
            }}>
              InterviewPrep <span style={{
                background: 'linear-gradient(130deg, #6b5cf6, #a78bfa)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              }}>AI</span>
            </span>
          </Link>

          {/* ── Desktop links ── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }} className="nav-desktop">
            {links.map(({ to, label }) => {
              const active = isActive(to);
              return (
                <Link
                  key={to}
                  to={to}
                  style={{
                    position: 'relative',
                    padding: '6px 14px', borderRadius: 10,
                    fontSize: 14, fontWeight: active ? 600 : 500,
                    color: active ? '#6b5cf6' : '#5a5a7a',
                    background: active ? '#f0edff' : 'transparent',
                    textDecoration: 'none',
                    transition: 'all 0.18s',
                  }}
                  onMouseEnter={e => {
                    if (!active) {
                      e.currentTarget.style.background = '#f7f5ff';
                      e.currentTarget.style.color = '#6b5cf6';
                    }
                  }}
                  onMouseLeave={e => {
                    if (!active) {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = '#5a5a7a';
                    }
                  }}
                >
                  {label}
                  {active && (
                    <motion.div
                      layoutId="nav-pill"
                      style={{
                        position: 'absolute', inset: 0, borderRadius: 10,
                        background: '#f0edff', zIndex: -1,
                      }}
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}

            {/* CTA button */}
            {showStartFree && (
            <motion.button
              whileHover={{ scale: 1.04, boxShadow: '0 6px 20px rgba(107,92,246,0.28)' }}
              whileTap={{ scale: 0.97 }}
              style={{
                marginLeft: 8,
                padding: '8px 18px', borderRadius: 12, border: 'none',
                background: 'linear-gradient(135deg, #6b5cf6, #7c6df7)',
                color: '#fff', fontWeight: 600, fontSize: 13.5,
                cursor: 'pointer',
                boxShadow: '0 3px 12px rgba(107,92,246,0.22)',
              }}
            >
              Start Free →
            </motion.button>
            )}
          </div>

          {/* ── Hamburger ── */}
          <button
            onClick={() => setMenuOpen(o => !o)}
            className="nav-hamburger"
            style={{
              display: 'none',
              background: 'none', border: 'none', cursor: 'pointer',
              padding: 6, borderRadius: 8, color: '#5a5a7a',
            }}
            aria-label="Toggle menu"
          >
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              {menuOpen ? (
                <path d="M5 5l12 12M17 5L5 17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              ) : (
                <path d="M3 6h16M3 11h16M3 16h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
              )}
            </svg>
          </button>

        </div>
      </nav>

      {/* ── Mobile menu ── */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'fixed', top: 64, left: 0, right: 0, zIndex: 49,
              background: 'rgba(250,250,248,0.96)',
              backdropFilter: 'blur(16px)',
              borderBottom: '1px solid #ece8f5',
              padding: '12px 20px 20px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.08)',
            }}
          >
            {links.map(({ to, label }, i) => {
              const active = isActive(to);
              return (
                <motion.div
                  key={to}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    to={to}
                    style={{
                      display: 'block', padding: '11px 14px', borderRadius: 12,
                      fontSize: 15, fontWeight: active ? 600 : 500,
                      color: active ? '#6b5cf6' : '#4a4a6a',
                      background: active ? '#f0edff' : 'transparent',
                      textDecoration: 'none', marginBottom: 4,
                      transition: 'all 0.15s',
                    }}
                  >
                    {label}
                  </Link>
                </motion.div>
              );
            })}
            {showStartFree && (
            <div style={{ marginTop: 8, paddingTop: 12, borderTop: '1px solid #ede9f5' }}>
              <button style={{
                width: '100%', padding: '12px', borderRadius: 12, border: 'none',
                background: 'linear-gradient(135deg, #6b5cf6, #7c6df7)',
                color: '#fff', fontWeight: 600, fontSize: 14, cursor: 'pointer',
              }}>
                Start Free →
              </button>
            </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          .nav-hamburger { display: flex !important; }
        }
      `}</style>
    </>
  );
}