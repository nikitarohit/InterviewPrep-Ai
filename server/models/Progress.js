import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    // Removed enum — allows "Theory","Coding","MCQ","Roadmap","HR","Notes" freely
    label: { type: String, default: "Notes" },
    accent: { type: String, default: "#6b5cf6" },
    accentBg: { type: String, default: "#f0edff" },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const progressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    streak: { type: Number, default: 0 },

    // ── Lifetime counters (shown on stat cards) ───────────────────────────
    questionsSolved: { type: Number, default: 0 },
    mcqsAttempted: { type: Number, default: 0 },
    codingSolved: { type: Number, default: 0 },
    roadmapsStarted: { type: Number, default: 0 },

    // ── Daily goal targets (how many per day to aim for) ──────────────────
    goals: {
      questions: { type: Number, default: 10 },
      mcqs: { type: Number, default: 10 },
      coding: { type: Number, default: 5 },
    },

    // ── Daily goal progress (how many done today) ─────────────────────────
    // These drive the progress bars on the dashboard.
    // Reset daily via a cron job or on first login of the day (future feature).
    dailyGoals: {
      questions: { type: Number, default: 0 },
      mcqs: { type: Number, default: 0 },
      coding: { type: Number, default: 0 },
    },

    // ── Activity feed (shown in Recent Activity panel) ────────────────────
    activities: { type: [activitySchema], default: [] },
    recentActivity: { type: [activitySchema], default: [] },

    // ── Weekly sparkline data ─────────────────────────────────────────────
    weeklyActivity: {
      type: [Number],
      default: [0, 0, 0, 0, 0, 0, 0],
    },

    // Legacy fields kept for backward compat
    questionsGenerated: { type: Number, default: 0 },
    codingProblems: { type: Number, default: 0 },
    roadmaps: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const Progress = mongoose.model("Progress", progressSchema);