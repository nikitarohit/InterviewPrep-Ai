import { Progress } from "../models/Progress.js";
import { asyncHandler } from "../middleware/errorHandler.js";

export const getProgress = asyncHandler(async (req, res) => {
  let progress = await Progress.findOne({ userId: req.user._id });
  if (!progress) {
    progress = await Progress.create({ userId: req.user._id });
  }
  res.json({ success: true, progress });
});

export const updateProgress = asyncHandler(async (req, res) => {
  const allowed = [
    "streak",
    "questionsSolved",
    "mcqsAttempted",
    "codingSolved",
    "roadmapsStarted",
    "goals",
    "dailyGoals",
  ];

  const updates = {};
  for (const key of allowed) {
    if (req.body[key] !== undefined) updates[key] = req.body[key];
  }

  const progress = await Progress.findOneAndUpdate(
    { userId: req.user._id },
    { $set: updates },
    { new: true, upsert: true, runValidators: true }
  );

  res.json({ success: true, progress });
});

export const addActivity = asyncHandler(async (req, res) => {
  const { text, label, accent, accentBg } = req.body;

  if (!text || !label) {
    return res
      .status(400)
      .json({ success: false, message: "Text and label are required" });
  }

  // Both `activities` and `recentActivity` arrays kept in sync so
  // dashboard.controller can read from either.
  const activityEntry = {
    text,
    label,
    accent: accent || "#6b5cf6",
    accentBg: accentBg || "#f0edff",
    createdAt: new Date(),
  };

  const progress = await Progress.findOneAndUpdate(
    { userId: req.user._id },
    {
      $push: {
        activities: {
          $each: [activityEntry],
          $slice: -20,
        },
        recentActivity: {
          $each: [activityEntry],
          $slice: -20,
        },
      },
    },
    { new: true, upsert: true }
  );

  res.status(201).json({ success: true, activities: progress.activities });
});

// ── POST /api/progress/increment ─────────────────────────────────────────────
// Accepts { type: "questions"|"mcqs"|"coding"|"roadmaps", count: N }
// Also increments dailyGoals for progress bar tracking
export const incrementStat = asyncHandler(async (req, res) => {
  // Support both `count` (our api.js) and `amount` (old callers)
  const { type, count, amount } = req.body;
  const n = Number(count ?? amount ?? 1);

  const fieldMap = {
    questions: "questionsSolved",
    mcqs: "mcqsAttempted",
    coding: "codingSolved",
    roadmaps: "roadmapsStarted",
  };

  const dailyFieldMap = {
    questions: "dailyGoals.questions",
    mcqs: "dailyGoals.mcqs",
    coding: "dailyGoals.coding",
  };

  const field = fieldMap[type];
  if (!field) {
    return res
      .status(400)
      .json({ success: false, message: `Invalid stat type: ${type}` });
  }

  const incPayload = { [field]: n };
  // Also track daily progress if this type has a daily goal
  if (dailyFieldMap[type]) {
    incPayload[dailyFieldMap[type]] = n;
  }

  const progress = await Progress.findOneAndUpdate(
    { userId: req.user._id },
    { $inc: incPayload },
    { new: true, upsert: true }
  );

  res.json({ success: true, progress });
});