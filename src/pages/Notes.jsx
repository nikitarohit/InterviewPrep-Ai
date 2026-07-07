import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { api } from '../utils/api';

const categories = ['All', 'Interview Questions', 'Coding Notes', 'Theories', 'HR Questions'];

const catStyle = {
  'Interview Questions': { color: '#16a34a', bg: '#f0fdf4' },
  'Coding Notes':        { color: '#0ea5e9', bg: '#f0f9ff' },
  'Theories':            { color: '#6b5cf6', bg: '#f0edff' },
  'HR Questions':        { color: '#c026d3', bg: '#fdf4ff' },
};

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

function readTime(content = '') {
  const words = content.trim().split(/\s+/).length;
  return `${Math.max(1, Math.round(words / 200))} min read`;
}

function shapeNote(doc) {
  const cs = catStyle[doc.category] || catStyle['Theories'];
  return {
    id: doc._id,
    title: doc.title,
    excerpt: doc.excerpt || doc.content?.substring(0, 150) || '',
    content: doc.content || '',
    category: doc.category,
    pinned: doc.pinned || false,
    catColor: cs.color,
    catBg: cs.bg,
    updated: relativeTime(doc.updatedAt || doc.createdAt),
    readTime: readTime(doc.content),
    topic: doc.topic || 'General',
  };
}

// ── Single Note Card ──────────────────────────────────────────────────────────
function NoteCard({ note, onDelete }) {
  const [expanded, setExpanded] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (!window.confirm('Delete this note?')) return;
    setDeleting(true);
    try { await api.deleteNote(note.id); onDelete(note.id); }
    catch { setDeleting(false); }
  };

  return (
    // FIX: no height:100%, no motion.div with whileHover y-shift
    // Those two things together caused cards to overlap when expanded.
    // Now each card is fully self-contained height, sits in its own grid cell.
    <div
      onClick={() => setExpanded(s => !s)}
      style={{
        background: '#fff',
        border: '1px solid #e5e7eb',
        borderRadius: 12,
        padding: '16px',
        cursor: 'pointer',
        transition: 'border-color 0.15s',
        // no fixed height, no overflow hidden — card grows naturally
      }}
      onMouseEnter={e => e.currentTarget.style.borderColor = '#c4b5fd'}
      onMouseLeave={e => e.currentTarget.style.borderColor = '#e5e7eb'}
    >
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 10, gap: 8 }}>
        <span style={{
          fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 4,
          background: note.catBg, color: note.catColor, whiteSpace: 'nowrap',
        }}>
          {note.category}
        </span>
        <button
          onClick={handleDelete} disabled={deleting}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', fontSize: 13, padding: '0 2px', opacity: deleting ? 0.4 : 1, flexShrink: 0 }}
          title="Delete"
        >✕</button>
      </div>

      {/* Title */}
      <h3 style={{ fontSize: 14, fontWeight: 600, color: '#111827', margin: '0 0 8px', lineHeight: 1.4 }}>
        {note.title}
      </h3>

      {/* Content — expands on click */}
      <p style={{
        fontSize: 13, color: '#6b7280', lineHeight: 1.6, margin: '0 0 12px',
        // FIX: use line-clamp only when collapsed; let it grow when expanded
        ...(expanded ? { whiteSpace: 'pre-wrap' } : {
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }),
      }}>
        {expanded ? (note.content || note.excerpt) : note.excerpt}
      </p>

      {expanded && (
        <p style={{ fontSize: 11, color: '#6b5cf6', fontWeight: 500, margin: '0 0 10px' }}>
          Click to collapse ↑
        </p>
      )}

      {/* Footer */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, borderTop: '1px solid #f3f4f6', paddingTop: 10 }}>
        <span style={{ fontSize: 11, color: '#9ca3af' }}>{note.readTime}</span>
        <span style={{ fontSize: 11, color: '#d1d5db' }}>·</span>
        <span style={{ fontSize: 11, color: '#9ca3af' }}>{note.updated}</span>
        {note.pinned && (
          <span style={{ marginLeft: 'auto', fontSize: 10, color: '#ea580c', fontWeight: 600 }}>📌 Pinned</span>
        )}
      </div>
    </div>
  );
}

// ── Topic Folder ──────────────────────────────────────────────────────────────
function TopicFolder({ topic, notes, onDelete, defaultOpen }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div style={{ marginBottom: 20 }}>
      {/* Folder header */}
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex', alignItems: 'center', gap: 10, width: '100%',
          background: 'none', border: 'none', cursor: 'pointer',
          padding: '10px 14px', borderRadius: 8,
          background: open ? '#f9fafb' : 'transparent',
          border: '1px solid ' + (open ? '#e5e7eb' : 'transparent'),
          marginBottom: open ? 12 : 0,
          transition: 'all 0.15s',
        }}
      >
        {/* Folder icon */}
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ flexShrink: 0, color: open ? '#6b5cf6' : '#9ca3af' }}>
          <path d="M1.5 3.5A1 1 0 012.5 2.5h3l1.5 1.5H13.5a1 1 0 011 1v7a1 1 0 01-1 1h-11a1 1 0 01-1-1V3.5z"
            stroke="currentColor" strokeWidth="1.2" fill={open ? '#f0edff' : 'none'} strokeLinejoin="round"/>
        </svg>

        {/* Topic name */}
        <span style={{ fontSize: 14, fontWeight: 600, color: '#111827', flex: 1, textAlign: 'left' }}>
          {topic}
        </span>

        {/* Note count badge */}
        <span style={{
          fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 99,
          background: '#f0edff', color: '#6b5cf6',
        }}>
          {notes.length} note{notes.length !== 1 ? 's' : ''}
        </span>

        {/* Chevron */}
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0, color: '#9ca3af', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
          <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {/* Notes grid — only renders when open */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            style={{ overflow: 'hidden' }}
          >
            {/* FIX: align-items: start prevents cards from stretching to match
                the tallest sibling — eliminates the overlap-on-expand bug */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: 12,
              alignItems: 'start',  // KEY FIX — cards don't stretch to match row height
            }}>
              {notes.map(note => (
                <NoteCard key={note.id} note={note} onDelete={onDelete} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Main Notes Page ───────────────────────────────────────────────────────────
export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [category, setCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  // 'folder' view groups by topic; 'flat' shows all in one grid
  const [viewMode, setViewMode] = useState('folder');

  const loadNotes = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const res = await api.getNotes();
      const raw = res.data || res.notes || [];
      setNotes(raw.map(shapeNote));
    } catch {
      setError('Could not load notes. Make sure you are logged in.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadNotes(); }, [loadNotes]);

  const handleDelete = (id) => setNotes(prev => prev.filter(n => n.id !== id));

  // Filter by category + search
  const filtered = notes.filter(n => {
    const matchCat = category === 'All' || n.category === category;
    const q = search.toLowerCase();
    const matchSearch = !q || n.title.toLowerCase().includes(q) ||
      n.excerpt.toLowerCase().includes(q) || n.topic.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  // Group filtered notes by topic
  const folders = filtered.reduce((acc, note) => {
    const key = note.topic || 'General';
    if (!acc[key]) acc[key] = [];
    acc[key].push(note);
    return acc;
  }, {});

  // Sort folders: pinned topics first, then by note count desc
  const sortedTopics = Object.keys(folders).sort((a, b) => {
    const aPinned = folders[a].some(n => n.pinned);
    const bPinned = folders[b].some(n => n.pinned);
    if (aPinned !== bPinned) return aPinned ? -1 : 1;
    return folders[b].length - folders[a].length;
  });

  const countFor = (cat) => cat === 'All' ? notes.length : notes.filter(n => n.category === cat).length;

  return (
    <div style={{ background: '#fafaf8', minHeight: '100vh', padding: '32px 0 80px' }}>
      <div style={{ maxWidth: 1080, margin: '0 auto', padding: '0 24px' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: '#111827', margin: '0 0 4px', letterSpacing: '-0.01em' }}>
              Your Notes
            </h1>
            <p style={{ fontSize: 13, color: '#9ca3af', margin: 0 }}>
              {loading ? 'Loading…' : `${notes.length} note${notes.length !== 1 ? 's' : ''} · ${sortedTopics.length || 0} topic${sortedTopics.length !== 1 ? 's' : ''}`}
            </p>
          </div>

          {/* View toggle — folder vs flat */}
          <div style={{ display: 'flex', background: '#f3f4f6', borderRadius: 8, padding: 3, gap: 2, alignSelf: 'flex-start' }}>
            {[['folder', '📁 Folders'], ['flat', '≡ All notes']].map(([mode, label]) => (
              <button key={mode} onClick={() => setViewMode(mode)}
                style={{
                  padding: '5px 12px', borderRadius: 6, border: 'none', fontSize: 12, fontWeight: 500,
                  cursor: 'pointer', transition: 'all 0.15s',
                  background: viewMode === mode ? '#fff' : 'transparent',
                  color: viewMode === mode ? '#111827' : '#6b7280',
                  boxShadow: viewMode === mode ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                }}>
                {label}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '10px 14px', marginBottom: 16, color: '#dc2626', fontSize: 13 }}>
            {error}
          </div>
        )}

        {/* Search */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8, background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, padding: '8px 12px' }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ color: '#9ca3af', flexShrink: 0 }}>
              <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.3"/>
              <path d="M10 10l2.5 2.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round"/>
            </svg>
            <input type="text" placeholder="Search notes by title, content, or topic…" value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ flex: 1, border: 'none', outline: 'none', background: 'none', fontSize: 13, color: '#111827' }} />
            {search && (
              <button onClick={() => setSearch('')}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', fontSize: 12 }}>
                ✕
              </button>
            )}
          </div>
          <button style={{
            padding: '8px 18px', background: '#5B21B6', color: '#fff', border: 'none',
            borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: 'pointer',
          }}>
            Search
          </button>
        </div>

        {/* Category pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 28 }}>
          {categories.map(cat => {
            const active = category === cat;
            const cs = catStyle[cat] || { color: '#6b5cf6', bg: '#f0edff' };
            return (
              <button key={cat} onClick={() => setCategory(cat)}
                style={{
                  padding: '5px 12px', borderRadius: 6, border: '1px solid ' + (active ? cs.color + '55' : '#e5e7eb'),
                  background: active ? cs.bg : '#fff', color: active ? cs.color : '#6b7280',
                  fontWeight: active ? 600 : 400, fontSize: 12, cursor: 'pointer', transition: 'all 0.15s',
                }}>
                {cat}
                <span style={{ marginLeft: 5, fontSize: 11, opacity: 0.75 }}>{countFor(cat)}</span>
              </button>
            );
          })}
        </div>

        {/* Loading skeletons */}
        {loading && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 12, alignItems: 'start' }}>
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} style={{ height: 140, borderRadius: 12, background: '#f3f4f6', animation: 'shimmer 1.4s infinite' }} />
            ))}
            <style>{`@keyframes shimmer { 0%,100%{opacity:1} 50%{opacity:0.5} }`}</style>
          </div>
        )}

        {/* Empty state */}
        {!loading && notes.length === 0 && (
          <div style={{ textAlign: 'center', padding: '64px 0' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
            <h3 style={{ fontSize: 16, fontWeight: 600, color: '#111827', margin: '0 0 8px' }}>No notes yet</h3>
            <p style={{ fontSize: 13, color: '#9ca3af', margin: '0 0 20px' }}>
              Generate interview content on the Dashboard, then save questions as notes from the Results page.
            </p>
            <a href="/dashboard" style={{ display: 'inline-block', padding: '8px 20px', borderRadius: 8, background: '#5B21B6', color: '#fff', fontWeight: 500, fontSize: 13, textDecoration: 'none' }}>
              Go to Dashboard
            </a>
          </div>
        )}

        {/* No search results */}
        {!loading && notes.length > 0 && filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '48px 0' }}>
            <p style={{ fontSize: 14, color: '#9ca3af', margin: '0 0 12px' }}>No notes match "{search}"</p>
            <button onClick={() => { setSearch(''); setCategory('All'); }}
              style={{ fontSize: 12, color: '#6b5cf6', background: '#f0edff', border: 'none', borderRadius: 6, padding: '6px 14px', cursor: 'pointer' }}>
              Clear filters
            </button>
          </div>
        )}

        {/* ── FOLDER VIEW ── */}
        {!loading && filtered.length > 0 && viewMode === 'folder' && (
          <div>
            {sortedTopics.map((topic, i) => (
              <TopicFolder
                key={topic}
                topic={topic}
                notes={folders[topic]}
                onDelete={handleDelete}
                defaultOpen={i === 0} // first folder open by default
              />
            ))}
          </div>
        )}

        {/* ── FLAT VIEW ── */}
        {!loading && filtered.length > 0 && viewMode === 'flat' && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 12,
            alignItems: 'start', // FIX for overlap
          }}>
            {filtered.map(note => (
              <NoteCard key={note.id} note={note} onDelete={handleDelete} />
            ))}
          </div>
        )}

        {/* Footer CTA */}
        {!loading && (
          <div style={{ marginTop: 40, padding: '16px 20px', background: '#fff', borderRadius: 10, border: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: '#111827', margin: '0 0 2px' }}>Save new notes as you practice</p>
              <p style={{ fontSize: 12, color: '#9ca3af', margin: 0 }}>Notes save from your Results page after each session.</p>
            </div>
            <a href="/dashboard" style={{ padding: '7px 16px', background: '#5B21B6', color: '#fff', borderRadius: 7, fontSize: 13, fontWeight: 500, textDecoration: 'none', whiteSpace: 'nowrap' }}>
              + New session
            </a>
          </div>
        )}
      </div>
    </div>
  );
}