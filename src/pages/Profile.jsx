import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { api } from '../utils/api';

const ease = [0.22, 1, 0.36, 1];

const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

function Spark({ points, color }) {
  const w = 60, h = 22;
  const max = Math.max(...points), min = Math.min(...points);
  const xs = points.map((_, i) => (i / (points.length - 1)) * w);
  const ys = points.map(p => h - ((p - min) / (max - min || 1)) * h * 0.85 - 2);
  const d = xs.map((x, i) => `${i === 0 ? 'M' : 'L'}${x},${ys[i]}`).join(' ');
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} fill="none" aria-hidden>
      <path d={d} stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" opacity="0.7"/>
    </svg>
  );
}

const badges = [
  { label: 'Daily Practice', icon: '🔥', bg: '#fff7ed', color: '#ea580c' },
  { label: 'MCQ Ready', icon: '🧠', bg: '#f0fdf4', color: '#16a34a' },
  { label: 'Code Focused', icon: '💻', bg: '#f0f9ff', color: '#0ea5e9' },
  { label: 'Consistent', icon: '⭐', bg: '#fdf4ff', color: '#c026d3' },
];

export default function Profile() {
  const { user } = useAuth();
  const [progress, setProgress] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const data = await api.getProgress();
        setProgress(data.progress);
      } catch {
        setProgress(null);
      }
    }
    load();
  }, []);

  const skills = [
    { name: 'Questions', level: Math.min(100, Math.round((progress?.questionsSolved || 0) * 2)), accent: '#6b5cf6', accentBg: '#f0edff' },
    { name: 'MCQs', level: Math.min(100, Math.round((progress?.mcqsAttempted || 0) * 2)), accent: '#16a34a', accentBg: '#f0fdf4' },
    { name: 'Coding', level: Math.min(100, Math.round((progress?.codingSolved || 0) * 2)), accent: '#ea580c', accentBg: '#fff7ed' },
  ];

  const stats = [
    { label: 'Questions Solved', value: progress?.questionsSolved || 0, accent: '#6b5cf6', accentBg: '#f0edff', icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="8" stroke="#6b5cf6" strokeWidth="1.4"/><path d="M10 11V9.5c1.5 0 2.5-.8 2.5-2S11.5 6 10 6s-2 .8-2.2 1.8" stroke="#6b5cf6" strokeWidth="1.4" strokeLinecap="round"/><circle cx="10" cy="13.5" r=".75" fill="#6b5cf6"/></svg>, spark: [10, 20, 18, 30, 28, 40, 44, 50] },
    { label: 'MCQs Attempted', value: progress?.mcqsAttempted || 0, accent: '#16a34a', accentBg: '#f0fdf4', icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><rect x="2" y="2" width="16" height="16" rx="4" stroke="#16a34a" strokeWidth="1.4"/><path d="M6 10l3 3 5-5" stroke="#16a34a" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>, spark: [8, 12, 16, 20, 22, 26, 30, 34] },
    { label: 'Coding Problems', value: progress?.codingSolved || 0, accent: '#ea580c', accentBg: '#fff7ed', icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M5.5 7L2 10l3.5 3M14.5 7L18 10l-3.5 3M11 4l-2 12" stroke="#ea580c" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>, spark: [5, 8, 10, 14, 16, 20, 24, 28] },
  ];

  const activity = progress?.weeklyActivity || [0, 0, 0, 0, 0, 0, 0];

  return (
    <div style={{ background: '#fafaf8', minHeight: '100vh', padding: '40px 0 80px' }}>
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 24px' }}>

        {/* ── Hero card ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease }}
          style={{
            background: '#fff', borderRadius: 24,
            border: '1px solid #ece8f5',
            boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
            overflow: 'hidden', marginBottom: 16,
          }}
        >
          {/* Cover strip */}
          <div style={{
            height: 96,
            background: 'linear-gradient(130deg, #1a0f3c 0%, #2d1b5e 50%, #1e2d5a 100%)',
            position: 'relative',
          }}>
            <div aria-hidden style={{
              position: 'absolute', inset: 0,
              backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }} />
          </div>

          {/* Profile info */}
          <div style={{ padding: '0 28px 28px', position: 'relative' }}>
            {/* Avatar — overlaps cover */}
            <div style={{
              width: 80, height: 80, borderRadius: 22,
              background: 'linear-gradient(135deg, #6b5cf6, #a78bfa)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 26, fontWeight: 800, color: '#fff',
              border: '4px solid #fff',
              boxShadow: '0 4px 16px rgba(107,92,246,0.28)',
              position: 'relative', marginTop: -40,
              marginBottom: 14,
            }}>{(user?.name || 'U').charAt(0).toUpperCase()}</div>

            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
              <div>
                <h1 style={{ fontSize: 22, fontWeight: 800, color: '#1a1a2e', margin: '0 0 4px', letterSpacing: '-0.02em' }}>
                  {user?.name || 'Your Profile'}
                </h1>
                <p style={{ fontSize: 13.5, color: '#7a7a9a', margin: '0 0 14px' }}>
                  {user?.plan || 'free'} plan · Interview prep enthusiast
                </p>
                {/* Badges */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 7 }}>
                  {badges.map(b => (
                    <span key={b.label} style={{
                      fontSize: 11.5, fontWeight: 600,
                      padding: '4px 12px', borderRadius: 99,
                      background: b.bg, color: b.color,
                      display: 'flex', alignItems: 'center', gap: 5,
                    }}>
                      {b.icon} {b.label}
                    </span>
                  ))}
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.04, boxShadow: '0 6px 20px rgba(107,92,246,0.22)' }}
                whileTap={{ scale: 0.97 }}
                style={{
                  padding: '9px 20px', borderRadius: 12, border: 'none',
                  background: 'linear-gradient(135deg, #6b5cf6, #a78bfa)',
                  color: '#fff', fontWeight: 600, fontSize: 13.5, cursor: 'pointer',
                  boxShadow: '0 3px 10px rgba(107,92,246,0.2)',
                }}
              onClick={() => window.location.href = '/settings'}
              >
                Edit Profile
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* ── Stat cards ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 16 }}>
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.08, ease }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              style={{
                background: '#fff', borderRadius: 20, padding: '20px',
                border: '1px solid #ece8f5', boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
                <div style={{
                  width: 38, height: 38, borderRadius: 11, background: s.accentBg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>{s.icon}</div>
                <Spark points={s.spark} color={s.accent} />
              </div>
              <div style={{ fontSize: '1.9rem', fontWeight: 800, color: '#1a1a2e', letterSpacing: '-0.03em', lineHeight: 1 }}>
                {s.value}
              </div>
              <div style={{ fontSize: 12.5, color: '#9b8fb5', marginTop: 5, fontWeight: 500 }}>{s.label}</div>
            </motion.div>
          ))}
        </div>

        {/* ── Bottom two panels ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>

          {/* Skills */}
          <motion.div
            initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.32, ease }}
            style={{
              background: '#fff', borderRadius: 20, padding: '24px',
              border: '1px solid #ece8f5', boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            }}
          >
            <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1a1a2e', margin: '0 0 20px' }}>Skill Levels</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              {skills.map((skill, i) => (
                <div key={skill.name}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: skill.accent }} />
                      <span style={{ fontSize: 13.5, fontWeight: 600, color: '#1a1a2e' }}>{skill.name}</span>
                    </div>
                    <span style={{
                      fontSize: 11, fontWeight: 700, padding: '2px 9px', borderRadius: 99,
                      background: skill.accentBg, color: skill.accent,
                    }}>{skill.level}%</span>
                  </div>
                  <div style={{ height: 6, borderRadius: 99, background: skill.accentBg, overflow: 'hidden' }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${skill.level}%` }}
                      transition={{ duration: 1.1, delay: 0.4 + i * 0.1, ease: 'easeOut' }}
                      style={{ height: '100%', borderRadius: 99, background: skill.accent, opacity: 0.85 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Streak + weekly activity */}
          <motion.div
            initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.4, ease }}
            style={{
              background: '#fff', borderRadius: 20, padding: '24px',
              border: '1px solid #ece8f5', boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              display: 'flex', flexDirection: 'column', gap: 20,
            }}
          >
            {/* Streak */}
            <div style={{
              borderRadius: 16,
              background: 'linear-gradient(135deg, #1a0f3c 0%, #2d1b5e 100%)',
              padding: '20px', textAlign: 'center', position: 'relative', overflow: 'hidden',
            }}>
              <div aria-hidden style={{
                position: 'absolute', inset: 0,
                backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.05) 1px, transparent 1px)',
                backgroundSize: '20px 20px',
              }} />
              <div style={{ position: 'relative', zIndex: 1 }}>
                <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#c4b5fd', margin: '0 0 8px' }}>
                  Current Streak
                </p>
                <p style={{
                  fontSize: '2.8rem', fontWeight: 900, letterSpacing: '-0.04em',
                  background: 'linear-gradient(120deg, #c084fc, #f0abfc)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text', margin: '0 0 4px', lineHeight: 1,
                }}>{progress?.streak || 0} Days 🔥</p>
                <p style={{ fontSize: 12, color: 'rgba(196,181,253,0.75)', margin: 0 }}>
                  Keep it up! Consistency is key.
                </p>
              </div>
            </div>

            {/* Weekly activity bars */}
            <div>
              <p style={{ fontSize: 13, fontWeight: 700, color: '#1a1a2e', margin: '0 0 14px' }}>This Week's Activity</p>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 60 }}>
                {activity.map((val, i) => (
                  <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, height: '100%', justifyContent: 'flex-end' }}>
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: `${(val / 7) * 50}px` }}
                      transition={{ duration: 0.8, delay: 0.5 + i * 0.07, ease: 'easeOut' }}
                      style={{
                        width: '100%', borderRadius: 6,
                        background: i === 6
                          ? 'linear-gradient(180deg, #a78bfa, #6b5cf6)'
                          : '#f0edff',
                        minHeight: 4,
                      }}
                    />
                    <span style={{ fontSize: 10, color: '#b0aac8', fontWeight: 500 }}>{weekDays[i]}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}