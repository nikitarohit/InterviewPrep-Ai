import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { api } from "../utils/api";

const ease = [0.22, 1, 0.36, 1];

function SectionHeader({ icon, label, accent, accentBg, count }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
      <div style={{ width: 38, height: 38, borderRadius: 11, background: accentBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{icon}</div>
      <h2 style={{ fontSize: 17, fontWeight: 700, color: "#1a1a2e", margin: 0 }}>{label}</h2>
      {count && <span style={{ marginLeft: "auto", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 99, background: accentBg, color: accent }}>{count}</span>}
    </div>
  );
}

function MCQItem({ mcq, onAnswered }) {
  const [selected, setSelected] = useState(null);
  const answered = selected !== null;
  const handleSelect = (i) => {
    if (answered) return;
    setSelected(i);
    onAnswered(i === mcq.answer);
  };
  return (
    <div style={{ marginBottom: 20 }}>
      <p style={{ fontSize: 14, fontWeight: 600, color: "#1a1a2e", marginBottom: 12, lineHeight: 1.5 }}>{mcq.question}</p>
      <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
        {mcq.options.map((opt, i) => {
          const isCorrect = i === mcq.answer;
          const isSelected = selected === i;
          let bg = "#f7f6fb", border = "#ece8f5", color = "#4a4a6a";
          if (answered && isCorrect) { bg = "#f0fdf4"; border = "#86efac"; color = "#15803d"; }
          if (answered && isSelected && !isCorrect) { bg = "#fff1f2"; border = "#fca5a5"; color = "#dc2626"; }
          return (
            <motion.button key={i} whileTap={{ scale: 0.98 }} onClick={() => handleSelect(i)}
              style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderRadius: 12, background: bg, border: `1px solid ${border}`, cursor: answered ? "default" : "pointer", textAlign: "left", transition: "all 0.2s" }}>
              <span style={{ width: 22, height: 22, borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, background: answered && isCorrect ? "#22c55e" : answered && isSelected ? "#ef4444" : "#e8e4f5", color: answered && (isCorrect || isSelected) ? "#fff" : "#9b8fb5" }}>
                {answered && isCorrect ? "✓" : answered && isSelected ? "✗" : String.fromCharCode(65 + i)}
              </span>
              <span style={{ fontSize: 13.5, color, fontWeight: answered && isCorrect ? 600 : 400 }}>{opt}</span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}

function CodingCard({ problem, selected, onToggle }) {
  const [showCode, setShowCode] = useState(false);
  const diffColor = problem.difficulty === "Easy" ? { bg: "#f0fdf4", text: "#16a34a" } : { bg: "#fff7ed", text: "#ea580c" };
  return (
    <div style={{ borderRadius: 16, border: `1px solid ${selected ? "#ea580c" : "#ece8f5"}`, background: selected ? "#fff7ed" : "#fafaf8", overflow: "hidden", marginBottom: 12, transition: "all 0.2s" }}>
      <div style={{ padding: "16px 18px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
          <input type="checkbox" checked={selected} onChange={() => onToggle(problem.id)} style={{ cursor: "pointer", accentColor: "#ea580c", width: 15, height: 15, flexShrink: 0 }} />
          <span style={{ fontSize: 15, fontWeight: 700, color: "#1a1a2e" }}>{problem.title}</span>
          <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 9px", borderRadius: 99, background: diffColor.bg, color: diffColor.text }}>{problem.difficulty}</span>
          <span style={{ fontSize: 11, color: "#9b8fb5", marginLeft: "auto" }}>{problem.tag}</span>
        </div>
        <p style={{ fontSize: 13.5, color: "#6b6b8a", lineHeight: 1.65, margin: "0 0 12px" }}>{problem.description}</p>
        <button onClick={() => setShowCode((s) => !s)} style={{ fontSize: 12.5, fontWeight: 600, color: "#6b5cf6", background: "#f0edff", border: "none", borderRadius: 8, padding: "6px 14px", cursor: "pointer" }}>
          {showCode ? "Hide solution ↑" : "Show solution ↓"}
        </button>
      </div>
      <AnimatePresence>
        {showCode && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} style={{ overflow: "hidden" }}>
            <div style={{ background: "#1e1b2e", borderTop: "1px solid #312d4b", padding: "14px 18px" }}>
              <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
                {["#ff6b6b","#ffd93d","#6bcb77"].map((c) => <div key={c} style={{ width: 9, height: 9, borderRadius: "50%", background: c, opacity: 0.8 }} />)}
                <span style={{ fontSize: 10, color: "#6b6b9b", marginLeft: 6 }}>solution.js</span>
              </div>
              <pre style={{ margin: 0, fontSize: 12.5, lineHeight: 1.8, color: "#c4b5fd", fontFamily: "monospace", overflowX: "auto", whiteSpace: "pre-wrap" }}>{problem.code}</pre>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function QuestionCard({ q, index, accent, accentBg, selected, onToggle }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.08, duration: 0.4, ease }}
      style={{ borderRadius: 14, border: `1px solid ${selected ? accent : "#ece8f5"}`, background: selected ? accentBg : "#fafaf8", marginBottom: 10, overflow: "hidden", transition: "all 0.2s" }}>
      <button onClick={() => setOpen((o) => !o)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", background: "none", border: "none", cursor: "pointer", textAlign: "left" }}>
        <input type="checkbox" checked={selected} onChange={() => onToggle(q.id)} onClick={(e) => e.stopPropagation()} style={{ cursor: "pointer", accentColor: accent, width: 15, height: 15, flexShrink: 0 }} />
        <span style={{ width: 26, height: 26, borderRadius: 8, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", background: accentBg, fontSize: 11, fontWeight: 700, color: accent }}>Q{q.id}</span>
        <span style={{ fontSize: 14, fontWeight: 600, color: "#1a1a2e", flex: 1 }}>{q.question}</span>
        <span style={{ fontSize: 16, color: "#9b8fb5", transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>↓</span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} style={{ overflow: "hidden" }}>
            <div style={{ padding: "0 16px 14px 54px", display: "flex", flexDirection: "column", gap: 12 }}>
              {q.answer && <div style={{ display: "flex", gap: 8 }}><span style={{ fontSize: 15, flexShrink: 0 }}>✓</span><p style={{ fontSize: 13.5, color: "#1a1a2e", lineHeight: 1.7, margin: 0, fontWeight: 500 }}>{q.answer}</p></div>}
              {q.tip && <div style={{ display: "flex", gap: 8 }}><span style={{ fontSize: 13, flexShrink: 0 }}>💡</span><p style={{ fontSize: 12.5, color: "#6b6b8a", lineHeight: 1.6, margin: 0 }}>{q.tip}</p></div>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function RoadmapCard({ step, index }) {
  const [done, setDone] = useState(false);
  const palettes = [
    { accent: "#6b5cf6", accentBg: "#f0edff" }, { accent: "#0ea5e9", accentBg: "#f0f9ff" },
    { accent: "#16a34a", accentBg: "#f0fdf4" }, { accent: "#ea580c", accentBg: "#fff7ed" },
    { accent: "#c026d3", accentBg: "#fdf4ff" },
  ];
  const { accent, accentBg } = palettes[index % palettes.length];
  return (
    <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.07, duration: 0.4, ease }}
      onClick={() => setDone((d) => !d)}
      style={{ display: "flex", gap: 14, alignItems: "flex-start", padding: "14px 16px", borderRadius: 14, border: `1px solid ${done ? accent + "44" : "#ece8f5"}`, background: done ? accentBg : "#fafaf8", marginBottom: 10, transition: "all 0.25s", cursor: "pointer" }}>
      <div style={{ width: 32, height: 32, borderRadius: "50%", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", background: done ? accent : accentBg, color: done ? "#fff" : accent, fontWeight: 700, fontSize: 13, border: `2px solid ${accent}`, transition: "all 0.25s" }}>
        {done ? "✓" : index + 1}
      </div>
      <div style={{ flex: 1 }}>
        <p style={{ fontSize: 14, fontWeight: 600, color: "#1a1a2e", margin: "0 0 4px", textDecoration: done ? "line-through" : "none", opacity: done ? 0.6 : 1 }}>{step.title}</p>
        {step.description && <p style={{ fontSize: 12.5, color: "#6b6b8a", margin: 0, lineHeight: 1.6 }}>{step.description}</p>}
        {step.resources?.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8 }}>
            {step.resources.map((r, i) => <span key={i} style={{ fontSize: 11, fontWeight: 600, padding: "2px 9px", borderRadius: 99, background: accentBg, color: accent }}>{r}</span>)}
          </div>
        )}
      </div>
    </motion.div>
  );
}

function SaveBanner({ selectedCount, saving, saveSuccess, onSave, onSelectAll, onClearAll, totalCount }) {
  if (totalCount === 0) return null;
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease }}
      style={{ position: "sticky", bottom: 24, zIndex: 50, maxWidth: 860, margin: "0 auto", padding: "0 24px" }}>
      <div style={{ background: saveSuccess ? "#f0fdf4" : "#1a1a2e", borderRadius: 18, padding: "14px 20px", display: "flex", alignItems: "center", gap: 14, boxShadow: saveSuccess ? "0 8px 32px rgba(34,197,94,0.25)" : "0 8px 32px rgba(0,0,0,0.28)", border: saveSuccess ? "1px solid #86efac" : "1px solid #2d2a4a", transition: "all 0.35s ease" }}>
        {saveSuccess ? (
          <>
            <span style={{ fontSize: 22 }}>✅</span>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 14, fontWeight: 700, color: "#15803d", margin: 0 }}>Saved to Notes!</p>
              <p style={{ fontSize: 12, color: "#16a34a", margin: "2px 0 0" }}>Notes page and dashboard stats have been updated.</p>
            </div>
            <a href="/notes" style={{ fontSize: 12.5, fontWeight: 600, color: "#15803d", background: "#dcfce7", padding: "7px 14px", borderRadius: 10, textDecoration: "none", border: "1px solid #86efac" }}>View Notes →</a>
          </>
        ) : (
          <>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: "#fff", margin: 0 }}>
                {selectedCount === 0 ? "Select questions or theory to save as notes" : `${selectedCount} item${selectedCount !== 1 ? "s" : ""} selected`}
              </p>
              <p style={{ fontSize: 11, color: "#9b8fb5", margin: "2px 0 0" }}>Check any item · click Save to Notes</p>
            </div>
            <button onClick={onSelectAll} style={{ fontSize: 12, fontWeight: 600, color: "#a78bfa", background: "transparent", border: "1px solid #3d3960", borderRadius: 9, padding: "6px 12px", cursor: "pointer" }}>All</button>
            {selectedCount > 0 && <button onClick={onClearAll} style={{ fontSize: 12, fontWeight: 600, color: "#9b8fb5", background: "transparent", border: "1px solid #3d3960", borderRadius: 9, padding: "6px 12px", cursor: "pointer" }}>Clear</button>}
            <motion.button whileHover={selectedCount > 0 ? { scale: 1.04 } : {}} whileTap={selectedCount > 0 ? { scale: 0.97 } : {}}
              onClick={onSave} disabled={saving || selectedCount === 0}
              style={{ padding: "9px 20px", borderRadius: 12, border: "none", background: selectedCount === 0 ? "#2d2a4a" : "linear-gradient(135deg, #6b5cf6, #a78bfa)", color: selectedCount === 0 ? "#5a5780" : "#fff", fontWeight: 700, fontSize: 13, cursor: selectedCount === 0 ? "default" : "pointer", transition: "all 0.2s", boxShadow: selectedCount > 0 ? "0 3px 12px rgba(107,92,246,0.35)" : "none", minWidth: 130, flexShrink: 0 }}>
              {saving ? "Saving…" : "💾 Save to Notes"}
            </motion.button>
          </>
        )}
      </div>
    </motion.div>
  );
}

export default function Result() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [theorySelected, setTheorySelected] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [mcqAnswered, setMcqAnswered] = useState(0);

  useEffect(() => {
    const stored = sessionStorage.getItem("resultData");
    if (stored) {
      try { setData(JSON.parse(stored)); } catch { navigate("/dashboard"); }
    } else { navigate("/dashboard"); }
  }, []);

  if (!data) return (
    <div style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 32, height: 32, borderRadius: "50%", border: "3px solid #f0edff", borderTopColor: "#6b5cf6", animation: "spin 0.8s linear infinite" }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  const topic = data.topic || "Your practice pack";
  const content = data.content || data.pack || data;
  const source = data.source || "unknown";
  const allInterviewQs = content.interviewQuestions || [];
  const allHrQs = content.hrQuestions || [];
  const allCodingPs = content.codingProblems || [];
  const roadmapSteps = content.roadmap || content.learningPath || [];

  const totalSelectableCount = allInterviewQs.length + allHrQs.length + allCodingPs.length + (content.theory ? 1 : 0);

  const toggleId = (id) => setSelectedIds((prev) => { const n = new Set(prev); n.has(id) ? n.delete(id) : n.add(id); return n; });

  const selectAll = () => {
    setSelectedIds(new Set([
      ...allInterviewQs.map((q) => `iq-${q.id}`),
      ...allHrQs.map((q) => `hr-${q.id}`),
      ...allCodingPs.map((p) => `cp-${p.id}`),
    ]));
    setTheorySelected(true);
  };

  const clearAll = () => { setSelectedIds(new Set()); setTheorySelected(false); };

  const handleMCQAnswered = () => {
    setMcqAnswered((n) => n + 1);
    api.updateProgress({ type: "mcqs", count: 1 }).catch(() => {});
    api.addActivity({ text: `Answered an MCQ on "${topic}"`, label: "MCQ", accent: "#16a34a", accentBg: "#f0fdf4" }).catch(() => {});
  };

  const saveToNotes = async () => {
    const totalSelected = selectedIds.size + (theorySelected ? 1 : 0);
    if (totalSelected === 0) return;
    setSaving(true);
    try {
      const saveOps = [];

      if (theorySelected && content.theory) {
        saveOps.push(api.createNote({ title: `Theory: ${topic}`, category: "Theories", excerpt: content.theory.substring(0, 150), content: content.theory, topic }));
      }
      for (const q of allInterviewQs) {
        if (!selectedIds.has(`iq-${q.id}`)) continue;
        saveOps.push(api.createNote({ title: q.question, category: "Interview Questions", excerpt: (q.answer || q.tip || q.question).substring(0, 150), content: [q.answer, q.tip].filter(Boolean).join("\n\n"), topic }));
      }
      for (const q of allHrQs) {
        if (!selectedIds.has(`hr-${q.id}`)) continue;
        saveOps.push(api.createNote({ title: q.question, category: "HR Questions", excerpt: (q.answer || q.tip || q.question).substring(0, 150), content: [q.answer, q.tip].filter(Boolean).join("\n\n"), topic }));
      }
      for (const p of allCodingPs) {
        if (!selectedIds.has(`cp-${p.id}`)) continue;
        saveOps.push(api.createNote({ title: p.title, category: "Coding Notes", excerpt: (p.description || p.title).substring(0, 150), content: [p.description, p.code ? `// Solution\n${p.code}` : ""].filter(Boolean).join("\n\n"), topic }));
      }

      await Promise.all(saveOps);

      const interviewSaved = allInterviewQs.filter((q) => selectedIds.has(`iq-${q.id}`)).length;
      const codingSaved = allCodingPs.filter((p) => selectedIds.has(`cp-${p.id}`)).length;
      const progressOps = [];
      if (interviewSaved > 0) progressOps.push(api.updateProgress({ type: "questions", count: interviewSaved }).catch(() => {}));
      if (codingSaved > 0) progressOps.push(api.updateProgress({ type: "coding", count: codingSaved }).catch(() => {}));
      progressOps.push(api.addActivity({ text: `Saved ${saveOps.length} note${saveOps.length !== 1 ? "s" : ""} from "${topic}"`, label: "Notes", accent: "#6b5cf6", accentBg: "#f0edff" }).catch(() => {}));
      await Promise.all(progressOps);

      setSaveSuccess(true);
      clearAll();
      setTimeout(() => setSaveSuccess(false), 5000);
    } catch (err) {
      alert("Failed to save notes: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  const defaultRoadmap = roadmapSteps.length > 0 ? roadmapSteps : [
    { title: `Understand the basics of ${topic}`, description: "Build a solid foundation before moving forward.", resources: ["Docs", "MDN", "YouTube"] },
    { title: "Practice core concepts", description: "Work through the interview questions and MCQs above.", resources: ["LeetCode", "HackerRank"] },
    { title: "Build a small project", description: "Apply your knowledge in a real mini-project.", resources: ["GitHub", "CodePen"] },
    { title: "Review system design aspects", description: "Understand how this concept scales in production.", resources: ["System Design Primer"] },
    { title: "Mock interview practice", description: "Simulate a real interview using the HR questions above.", resources: ["Pramp", "Interviewing.io"] },
  ];

  const currentSelected = selectedIds.size + (theorySelected ? 1 : 0);

  return (
    <div style={{ background: "#fafaf8", minHeight: "100vh", padding: "40px 0 120px" }}>
      <div style={{ maxWidth: 860, margin: "0 auto", padding: "0 24px" }}>

        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
            <div style={{ padding: "5px 14px", borderRadius: 99, background: "#f0edff", border: "1px solid #ddd6fe", fontSize: 12, fontWeight: 600, color: "#6b5cf6" }}>{topic}</div>
            <div style={{ marginLeft: 8, padding: "4px 10px", borderRadius: 12, background: "#f3f4f6", color: "#374151", fontSize: 12 }}>Source: {source}</div>
            <button onClick={() => navigate("/dashboard")} style={{ marginLeft: "auto", fontSize: 12.5, color: "#9b8fb5", background: "none", border: "none", cursor: "pointer", fontWeight: 500 }}>← Back to Dashboard</button>
          </div>
          <h1 style={{ fontSize: "clamp(1.6rem,3.5vw,2.4rem)", fontWeight: 800, color: "#1a1a2e", letterSpacing: "-0.03em", margin: "0 0 8px" }}>Your Interview Prep Results</h1>
          <p style={{ fontSize: 15, color: "#7a7a9a", margin: 0 }}>6 sections · AI-generated for "{topic}" · Check items and save to notes</p>
        </motion.div>

        {/* Theory */}
        {content.theory && (
          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1, ease }}
            style={{ background: "#fff", borderRadius: 22, padding: 24, border: `1px solid ${theorySelected ? "#6b5cf6" : "#ece8f5"}`, boxShadow: "0 2px 8px rgba(0,0,0,0.04)", marginBottom: 16, transition: "border-color 0.2s" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <div style={{ width: 38, height: 38, borderRadius: 11, background: "#f0edff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M3 4h12M3 8h8M3 12h10" stroke="#6b5cf6" strokeWidth="1.5" strokeLinecap="round" /></svg>
              </div>
              <h2 style={{ fontSize: 17, fontWeight: 700, color: "#1a1a2e", margin: 0 }}>Theory Explanation</h2>
              <label style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 7, cursor: "pointer", fontSize: 13, color: theorySelected ? "#6b5cf6" : "#9b8fb5", fontWeight: 600, userSelect: "none" }}>
                <input type="checkbox" checked={theorySelected} onChange={(e) => setTheorySelected(e.target.checked)} style={{ cursor: "pointer", accentColor: "#6b5cf6", width: 15, height: 15 }} />
                Save theory
              </label>
            </div>
            <p style={{ fontSize: 14.5, color: "#4a4a6a", lineHeight: 1.8, margin: 0 }}>{content.theory}</p>
          </motion.section>
        )}

        {/* Interview Questions */}
        {allInterviewQs.length > 0 && (
          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.18, ease }}
            style={{ background: "#fff", borderRadius: 22, padding: 24, border: "1px solid #ece8f5", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", marginBottom: 16 }}>
            <SectionHeader label="Top Interview Questions" accent="#0ea5e9" accentBg="#f0f9ff" count={`${allInterviewQs.length} questions`}
              icon={<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="9" r="7.5" stroke="#0ea5e9" strokeWidth="1.4" /><path d="M9 10V9c1.2 0 2-.6 2-1.5S10.2 6 9 6s-1.6.5-1.8 1.3" stroke="#0ea5e9" strokeWidth="1.4" strokeLinecap="round" /><circle cx="9" cy="12.5" r=".75" fill="#0ea5e9" /></svg>} />
            {allInterviewQs.map((q, i) => (
              <QuestionCard key={q.id} q={q} index={i} accent="#0ea5e9" accentBg="#f0f9ff" selected={selectedIds.has(`iq-${q.id}`)} onToggle={(id) => toggleId(`iq-${id}`)} />
            ))}
          </motion.section>
        )}

        {/* MCQs */}
        {content.mcqs?.length > 0 && (
          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.26, ease }}
            style={{ background: "#fff", borderRadius: 22, padding: 24, border: "1px solid #ece8f5", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", marginBottom: 16 }}>
            <SectionHeader label="MCQs — Practice Quiz" accent="#16a34a" accentBg="#f0fdf4" count={`${content.mcqs.length} questions · ${mcqAnswered} answered`}
              icon={<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><rect x="1.5" y="1.5" width="15" height="15" rx="3.5" stroke="#16a34a" strokeWidth="1.4" /><path d="M5 9l3 3 5-5" stroke="#16a34a" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>} />
            {content.mcqs.map((mcq) => <MCQItem key={mcq.id} mcq={mcq} onAnswered={handleMCQAnswered} />)}
          </motion.section>
        )}

        {/* Coding */}
        {allCodingPs.length > 0 && (
          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.34, ease }}
            style={{ background: "#fff", borderRadius: 22, padding: 24, border: "1px solid #ece8f5", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", marginBottom: 16 }}>
            <SectionHeader label="Coding Problems" accent="#ea580c" accentBg="#fff7ed" count={`${allCodingPs.length} problems`}
              icon={<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M5 6L1.5 9 5 12M13 6l3.5 3L13 12M10 3l-2 12" stroke="#ea580c" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" /></svg>} />
            {allCodingPs.map((p) => (
              <CodingCard key={p.id} problem={p} selected={selectedIds.has(`cp-${p.id}`)} onToggle={(id) => toggleId(`cp-${id}`)} />
            ))}
          </motion.section>
        )}

        {/* HR Questions */}
        {allHrQs.length > 0 && (
          <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.42, ease }}
            style={{ background: "#fff", borderRadius: 22, padding: 24, border: "1px solid #ece8f5", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", marginBottom: 16 }}>
            <SectionHeader label="HR Questions" accent="#c026d3" accentBg="#fdf4ff" count={`${allHrQs.length} questions`}
              icon={<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="9" cy="6" r="3" stroke="#c026d3" strokeWidth="1.4" /><path d="M2 16c0-3.314 3.134-5 7-5s7 1.686 7 5" stroke="#c026d3" strokeWidth="1.4" strokeLinecap="round" /></svg>} />
            {allHrQs.map((q, i) => (
              <QuestionCard key={q.id} q={q} index={i} accent="#c026d3" accentBg="#fdf4ff" selected={selectedIds.has(`hr-${q.id}`)} onToggle={(id) => toggleId(`hr-${id}`)} />
            ))}
          </motion.section>
        )}

        {/* Roadmap */}
        <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5, ease }}
          style={{ background: "#fff", borderRadius: 22, padding: 24, border: "1px solid #ece8f5", boxShadow: "0 2px 8px rgba(0,0,0,0.04)", marginBottom: 16 }}>
          <SectionHeader label={`Learning Roadmap · ${topic}`} accent="#f59e0b" accentBg="#fffbeb" count={`${defaultRoadmap.length} steps`}
            icon={<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><circle cx="4" cy="4" r="2" stroke="#f59e0b" strokeWidth="1.4" /><circle cx="14" cy="9" r="2" stroke="#f59e0b" strokeWidth="1.4" /><circle cx="4" cy="14" r="2" stroke="#f59e0b" strokeWidth="1.4" /><path d="M6 4h4a2 2 0 012 2v1M12 11v1a2 2 0 01-2 2H6" stroke="#f59e0b" strokeWidth="1.3" strokeLinecap="round" /></svg>} />
          <p style={{ fontSize: 13, color: "#9b8fb5", margin: "0 0 16px" }}>Click each step to mark it complete. Track your progress as you go.</p>
          {defaultRoadmap.map((step, i) => <RoadmapCard key={i} step={step} index={i} />)}
        </motion.section>

      </div>

      <SaveBanner
        selectedCount={currentSelected}
        totalCount={totalSelectableCount}
        saving={saving}
        saveSuccess={saveSuccess}
        onSave={saveToNotes}
        onSelectAll={selectAll}
        onClearAll={clearAll}
      />
    </div>
  );
}