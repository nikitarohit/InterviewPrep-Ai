import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '../utils/api';

const ease = [0.22, 1, 0.36, 1];

const categories = ['All', 'Interview Questions', 'Coding Notes', 'Theories', 'HR Questions'];

const catAccent = {
  'All':                  { accent: '#6b5cf6', accentBg: '#f0edff' },
  'Interview Questions':  { accent: '#16a34a', accentBg: '#f0fdf4' },
  'Coding Notes':         { accent: '#0ea5e9', accentBg: '#f0f9ff' },
  'Theories':             { accent: '#6b5cf6', accentBg: '#f0edff' },
  'HR Questions':         { accent: '#c026d3', accentBg: '#fdf4ff' },
};

const categoryIcons = {
  'Interview Questions': (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <circle cx="9" cy="9" r="7.5" stroke="#16a34a" strokeWidth="1.4"/>
      <path d="M9 10V9c1.2 0 2-.6 2-1.5S10.2 6 9 6s-1.6.5-1.8 1.3" stroke="#16a34a" strokeWidth="1.4" strokeLinecap="round"/>
      <circle cx="9" cy="12.5" r=".75" fill="#16a34a"/>
    </svg>
  ),
  'Coding Notes': (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M5 6L1.5 9 5 12M13 6l3.5 3L13 12M10 3l-2 12" stroke="#0ea5e9" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ),
  'Theories': (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M3 4h12M3 8h8M3 12h10" stroke="#6b5cf6" strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  ),
  'HR Questions': (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <circle cx="9" cy="6" r="3" stroke="#c026d3" strokeWidth="1.4"/>
      <path d="M2 16c0-3.314 3.134-5 7-5s7 1.686 7 5" stroke="#c026d3" strokeWidth="1.4" strokeLinecap="round"/>
    </svg>
  ),
};

// ── format relative time ──────────────────────────────────────────────────────
function relativeTime(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

// ── estimate read time ────────────────────────────────────────────────────────
function readTime(content = '') {
  const words = content.trim().split(/\s+/).length;
  const mins = Math.max(1, Math.round(words / 200));
  return `${mins} min read`;
}

// ── map MongoDB doc to display shape ─────────────────────────────────────────
function shapeNote(doc) {
  const ca = catAccent[doc.category] || catAccent['Theories'];
  return {
    id: doc._id,
    title: doc.title,
    excerpt: doc.excerpt || doc.content?.substring(0, 120) || '',
    category: doc.category,
    pinned: doc.pinned || false,
    accent: ca.accent,
    accentBg: ca.accentBg,
    icon: categoryIcons[doc.category] || categoryIcons['Theories'],
    updated: relativeTime(doc.updatedAt || doc.createdAt),
    readTime: readTime(doc.content),
    topic: doc.topic || '',
  };
}

// ── Note Card ────────────────────────────────────────────────────────────────
function NoteCard({ note, index, onDelete }) {
  const [showFull, setShowFull] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (!window.confirm('Delete this note?')) return;
    setDeleting(true);
    try {
      await api.deleteNote(note.id);
      onDelete(note.id);
    } catch {
      setDeleting(false);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.45, delay: index * 0.07, ease }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      style={{ cursor: 'pointer' }}
      onClick={() => setShowFull((s) => !s)}
    >
      <div
        style={{
          background: '#fff', borderRadius: 20, padding: '22px',
          border: '1px solid #ece8f5',
          boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
          height: '100%', transition: 'box-shadow 0.2s, border-color 0.2s',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.boxShadow = `0 12px 32px rgba(0,0,0,0.09), 0 0 0 2px ${note.accent}22`;
          e.currentTarget.style.borderColor = note.accent + '33';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)';
          e.currentTarget.style.borderColor = '#ece8f5';
        }}
      >
        {/* Top row */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 14 }}>
          <div style={{ width: 38, height: 38, borderRadius: 11, background: note.accentBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            {note.icon}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            {note.pinned && (
              <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 9px', borderRadius: 99, background: '#fff7ed', color: '#ea580c' }}>📌 Pinned</span>
            )}
            <button
              onClick={handleDelete}
              disabled={deleting}
              style={{ fontSize: 12, color: '#c4b5fd', background: 'none', border: 'none', cursor: deleting ? 'default' : 'pointer', padding: '2px 4px', borderRadius: 6, opacity: deleting ? 0.5 : 1 }}
              title="Delete note"
            >
              🗑
            </button>
          </div>
        </div>

        {/* Title */}
        <h3 style={{ fontSize: 15, fontWeight: 700, color: '#1a1a2e', margin: '0 0 8px', letterSpacing: '-0.01em', lineHeight: 1.4 }}>
          {note.title}
        </h3>

        {/* Excerpt / full content toggle */}
        <p style={{
          fontSize: 13, color: '#6b6b8a', lineHeight: 1.7, margin: '0 0 12px',
          ...(showFull ? {} : { display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }),
          whiteSpace: 'pre-wrap',
        }}>
          {note.excerpt}
        </p>
        {showFull && (
          <p style={{ fontSize: 11, color: note.accent, fontWeight: 600, margin: '0 0 12px' }}>
            Click to collapse ↑
          </p>
        )}

        {/* Topic tag */}
        {note.topic && (
          <div style={{ marginBottom: 10 }}>
            <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 99, background: '#f7f5fb', color: '#9b8fb5' }}>
              📚 {note.topic}
            </span>
          </div>
        )}

        {/* Footer */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 99, background: note.accentBg, color: note.accent }}>
            {note.category}
          </span>
          <span style={{ fontSize: 11, color: '#b0aac8', marginLeft: 'auto' }}>{note.readTime}</span>
          <span style={{ fontSize: 11, color: '#b0aac8' }}>· {note.updated}</span>
        </div>
      </div>
    </motion.div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────
export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadNotes = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.getNotes();
      const raw = res.data || res.notes || [];
      setNotes(raw.map(shapeNote));
    } catch (e) {
      setError('Could not load notes. Make sure you are logged in.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadNotes(); }, [loadNotes]);

  const handleDelete = (deletedId) => {
    setNotes((prev) => prev.filter((n) => n.id !== deletedId));
  };

  const filtered = notes.filter(n => {
    const matchCat = category === 'All' || n.category === category;
    const matchSearch =
      n.title.toLowerCase().includes(search.toLowerCase()) ||
      n.excerpt.toLowerCase().includes(search.toLowerCase()) ||
      (n.topic || '').toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const pinned = filtered.filter(n => n.pinned);
  const rest = filtered.filter(n => !n.pinned);

  const countFor = (cat) => cat === 'All' ? notes.length : notes.filter(n => n.category === cat).length;

  return (
    <div style={{ background: '#fafaf8', minHeight: '100vh', padding: '40px 0 80px' }}>
      <div style={{ maxWidth: 1080, margin: '0 auto', padding: '0 28px' }}>

        {/* Page header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 800, color: '#1a1a2e', letterSpacing: '-0.02em', margin: '0 0 6px' }}>
            Your Notes
          </h1>
          <p style={{ fontSize: 14, color: '#9b8fb5', margin: 0 }}>
            {loading ? 'Loading notes…' : `${notes.length} saved note${notes.length !== 1 ? 's' : ''} · Search, filter, and review`}
          </p>
        </motion.div>

        {/* Error */}
        {error && (
          <div style={{ background: '#fff1f2', border: '1px solid #fca5a5', borderRadius: 12, padding: '12px 16px', marginBottom: 20, color: '#dc2626', fontSize: 13 }}>
            {error}
          </div>
        )}

        {/* Search bar */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.07 }}
          style={{ display: 'flex', alignItems: 'center', gap: 10, background: '#fff', borderRadius: 16, border: '1px solid #ece8f5', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', padding: '10px 10px 10px 18px', marginBottom: 22 }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, color: '#9b8fb5' }}>
            <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <input
            type="text"
            placeholder="Search notes by title, content, or topic…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ flex: 1, border: 'none', outline: 'none', background: 'none', fontSize: 14, color: '#1a1a2e' }}
          />
          {search && (
            <button onClick={() => setSearch('')} style={{ fontSize: 12, color: '#9b8fb5', background: '#f7f5fb', border: 'none', borderRadius: 8, padding: '4px 10px', cursor: 'pointer', fontWeight: 500 }}>
              Clear
            </button>
          )}
          <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.97 }}
            style={{ padding: '9px 20px', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg, #6b5cf6, #a78bfa)', color: '#fff', fontWeight: 600, fontSize: 13.5, cursor: 'pointer', flexShrink: 0, boxShadow: '0 3px 10px rgba(107,92,246,0.22)' }}>
            Search
          </motion.button>
        </motion.div>

        {/* Category pills */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.12 }}
          style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 32 }}>
          {categories.map(cat => {
            const active = category === cat;
            const ca = catAccent[cat];
            return (
              <button key={cat} onClick={() => setCategory(cat)}
                style={{ padding: '7px 16px', borderRadius: 12, border: `1px solid ${active ? ca.accent + '44' : '#ece8f5'}`, background: active ? ca.accentBg : '#fff', color: active ? ca.accent : '#6b6b8a', fontWeight: active ? 700 : 500, fontSize: 13, cursor: 'pointer', transition: 'all 0.18s', boxShadow: active ? `0 2px 8px ${ca.accent}22` : 'none' }}>
                {cat}
                <span style={{ marginLeft: 6, fontSize: 11, fontWeight: 600, padding: '1px 6px', borderRadius: 99, background: active ? ca.accent + '22' : '#f0edfa', color: active ? ca.accent : '#9b8fb5' }}>
                  {countFor(cat)}
                </span>
              </button>
            );
          })}
        </motion.div>

        {/* Loading skeleton */}
        {loading && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 14 }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{ height: 180, borderRadius: 20, background: 'linear-gradient(90deg, #f0edff 0%, #e8e4f5 50%, #f0edff 100%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite', border: '1px solid #ece8f5' }} />
            ))}
            <style>{`@keyframes shimmer { 0%{background-position:200% 0} 100%{background-position:-200% 0} }`}</style>
          </div>
        )}

        {/* Empty state */}
        {!loading && notes.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ fontSize: 52, marginBottom: 16 }}>📭</div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: '#1a1a2e', margin: '0 0 8px' }}>No notes yet</h3>
            <p style={{ fontSize: 14, color: '#9b8fb5', margin: '0 0 24px' }}>
              Generate interview content on the Dashboard, then use the<br/>
              <strong style={{ color: '#6b5cf6' }}>Save to Notes</strong> button on the Results page.
            </p>
            <a href="/dashboard" style={{ display: 'inline-block', padding: '10px 24px', borderRadius: 12, background: 'linear-gradient(135deg, #6b5cf6, #a78bfa)', color: '#fff', fontWeight: 600, fontSize: 14, textDecoration: 'none' }}>
              Go to Dashboard →
            </a>
          </motion.div>
        )}

        {/* No search results */}
        {!loading && notes.length > 0 && filtered.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', padding: '60px 0' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
            <p style={{ fontSize: 15, color: '#9b8fb5', fontWeight: 500 }}>No notes found for "{search}"</p>
            <button onClick={() => { setSearch(''); setCategory('All'); }}
              style={{ marginTop: 12, fontSize: 13, color: '#6b5cf6', background: '#f0edff', border: 'none', borderRadius: 9, padding: '7px 16px', cursor: 'pointer', fontWeight: 600 }}>
              Clear filters
            </button>
          </motion.div>
        )}

        {/* Pinned notes */}
        {pinned.length > 0 && (
          <div style={{ marginBottom: 28 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#b0aac8' }}>📌 Pinned</span>
              <div style={{ flex: 1, height: 1, background: '#ece8f5' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 14 }}>
              <AnimatePresence>
                {pinned.map((note, i) => <NoteCard key={note.id} note={note} index={i} onDelete={handleDelete} />)}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* Regular notes */}
        {rest.length > 0 && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#b0aac8' }}>
                {pinned.length > 0 ? 'Other Notes' : 'Recent Notes'}
              </span>
              <div style={{ flex: 1, height: 1, background: '#ece8f5' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 14 }}>
              <AnimatePresence>
                {rest.map((note, i) => <NoteCard key={note.id} note={note} index={i} onDelete={handleDelete} />)}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* CTA footer */}
        {!loading && (
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.45 }}
            style={{ marginTop: 40, padding: '20px 24px', background: '#fff', borderRadius: 20, border: '1px dashed #ddd6fe', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
            <div>
              <p style={{ fontSize: 14, fontWeight: 600, color: '#1a1a2e', margin: '0 0 4px' }}>Save new notes as you practice</p>
              <p style={{ fontSize: 12.5, color: '#9b8fb5', margin: 0 }}>Notes save from your Results page after each session.</p>
            </div>
            <a href="/dashboard">
              <motion.span whileHover={{ scale: 1.04, boxShadow: '0 6px 20px rgba(107,92,246,0.22)' }} whileTap={{ scale: 0.97 }}
                style={{ display: 'inline-block', padding: '10px 20px', borderRadius: 12, background: 'linear-gradient(135deg, #6b5cf6, #a78bfa)', color: '#fff', fontWeight: 600, fontSize: 13.5, cursor: 'pointer', textDecoration: 'none', boxShadow: '0 3px 10px rgba(107,92,246,0.2)' }}>
                + New Session
              </motion.span>
            </a>
          </motion.div>
        )}
      </div>
    </div>
  );
}