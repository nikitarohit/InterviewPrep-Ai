import Note from "../models/Note.js";
import { Progress } from "../models/Progress.js";
import { asyncHandler } from "../middleware/errorHandler.js";

export const getDashboard = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  let progress = await Progress.findOne({ userId });
  if (!progress) {
    progress = await Progress.create({ userId });
  }

  const notesCount = await Note.countDocuments({ userId });
  const p = progress.toObject ? progress.toObject() : progress;

  // ── Stat cards ──────────────────────────────────────────────────────────
  const statCards = [
    {
      title: "Questions",
      value: String(p.questionsSolved || 0),
      change: "+12%",
      accent: "#6b5cf6",
      accentBg: "#f0edff",
      spark: [30, 45, 38, 60, 55, 80, 72, Math.min(95, (p.questionsSolved || 0) + 10)],
    },
    {
      title: "MCQs",
      value: String(p.mcqsAttempted || 0),
      change: "+8%",
      accent: "#e11d48",
      accentBg: "#fff1f2",
      spark: [20, 35, 30, 50, 45, 60, 65, Math.min(80, (p.mcqsAttempted || 0) + 5)],
    },
    {
      title: "Coding",
      value: String(p.codingSolved || 0),
      change: "+5%",
      accent: "#0ea5e9",
      accentBg: "#f0f9ff",
      spark: [10, 22, 18, 35, 30, 45, 50, Math.min(60, (p.codingSolved || 0) + 3)],
    },
    {
      title: "Roadmaps",
      value: String(p.roadmapsStarted || 0),
      change: "+15%",
      accent: "#16a34a",
      accentBg: "#f0fdf4",
      spark: [5, 8, 12, 15, 18, 22, 28, Math.min(32, (p.roadmapsStarted || 0) + 1)],
    },
  ];

  // ── Daily Goals ──────────────────────────────────────────────────────────
  const dailyGoals = p.dailyGoals || { questions: 0, mcqs: 0, coding: 0 };
  const targets = p.goals || { questions: 10, mcqs: 10, coding: 5 };
  const goalProgress = (done, target) => Math.min(100, Math.round(((done || 0) / (target || 10)) * 100));

  const goals = [
    { label: "Questions", progress: goalProgress(dailyGoals.questions, targets.questions), accent: "#6b5cf6", accentBg: "#f0edff" },
    { label: "MCQs", progress: goalProgress(dailyGoals.mcqs, targets.mcqs), accent: "#e11d48", accentBg: "#fff1f2" },
    { label: "Coding", progress: goalProgress(dailyGoals.coding, targets.coding), accent: "#0ea5e9", accentBg: "#f0f9ff" },
  ];

  // ── Recent Activity — merge, sort, GROUP, then limit ──────────────────────
  const allActivities = [
    ...(Array.isArray(p.activities) ? p.activities : []),
    ...(Array.isArray(p.recentActivity) ? p.recentActivity : []),
  ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  // FIX: group consecutive activities that share the same label + topic
  // within a 2-hour window into a single line, e.g. 8x "Answered an MCQ on
  // 'JavaScript Closures'" becomes one "Answered 8 MCQs on 'JavaScript
  // Closures'" entry. Previously every single MCQ click created its own
  // permanent activity row, flooding the feed with repeats.
  const groupedActivities = groupActivities(allActivities);

  const activities = groupedActivities.slice(0, 30).map((a) => ({
    text: a.text,
    label: a.label || "Notes",
    accent: a.accent || "#6b5cf6",
    accentBg: a.accentBg || "#f0edff",
    time: formatRelativeTime(a.createdAt),
    count: a.count || 1,
  }));

  res.json({
    success: true,
    dashboard: {
      user: { name: req.user.name, plan: req.user.plan },
      stats: statCards,
      goals,
      activities,
      streak: p.streak || 0,
      notesCount,
    },
  });
});

// ── Extract a "topic" from activity text for grouping purposes ────────────
// Matches: Answered an MCQ on "X"  |  Saved 3 notes from "X"
function extractTopic(text) {
  const match = text?.match(/(?:on|from)\s+"([^"]+)"/);
  return match ? match[1] : null;
}

// ── Group consecutive same-label/same-topic activities within 2 hours ─────
function groupActivities(activities) {
  const TWO_HOURS_MS = 2 * 60 * 60 * 1000;
  const result = [];

  for (const activity of activities) {
    const topic = extractTopic(activity.text);
    const last = result[result.length - 1];

    const lastTopic = last ? extractTopic(last.text) : null;
    const sameGroup =
      last &&
      last.label === activity.label &&
      lastTopic === topic &&
      topic !== null &&
      Math.abs(new Date(last.createdAt) - new Date(activity.createdAt)) < TWO_HOURS_MS;

    if (sameGroup) {
      last.count = (last.count || 1) + 1;
      // Use the earliest createdAt in the group? No — keep most recent for
      // accurate relative time display, but update the text with the count.
      const verb = inferVerb(activity.label);
      last.text = `${verb} ${last.count} ${pluralizeLabel(activity.label, last.count)} on "${topic}"`;
    } else {
      result.push({ ...activity, count: 1 });
    }
  }

  return result;
}

function inferVerb(label) {
  const map = { MCQ: "Answered", Notes: "Saved", Coding: "Solved", Theory: "Reviewed", Roadmap: "Completed", HR: "Practiced" };
  return map[label] || "Completed";
}

function pluralizeLabel(label, count) {
  const map = { MCQ: "MCQs", Notes: "notes", Coding: "problems", Theory: "theory sections", Roadmap: "steps", HR: "questions" };
  const base = map[label] || "items";
  return count === 1 ? base.replace(/s$/, "") : base;
}

function formatRelativeTime(date) {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} min${mins > 1 ? "s" : ""} ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hour${hrs > 1 ? "s" : ""} ago`;
  const days = Math.floor(hrs / 24);
  return `${days} day${days > 1 ? "s" : ""} ago`;
}