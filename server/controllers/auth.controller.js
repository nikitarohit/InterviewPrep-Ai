import { signToken } from "../middleware/auth.js";
import User from "../models/User.js";
import { Progress } from "../models/Progress.js";
import { asyncHandler } from "../middleware/errorHandler.js";

function userResponse(user) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    plan: user.plan,
  };
}

async function ensureProgress(userId) {
  let progress = await Progress.findOne({ userId });
  if (!progress) {
    progress = await Progress.create({ userId });
  }
  return progress;
}

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ success: false, message: "Name, email and password are required" });
  }

  if (password.length < 6) {
    return res.status(400).json({ success: false, message: "Password must be at least 6 characters" });
  }

  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(409).json({ success: false, message: "Email already registered" });
  }

  const user = await User.create({ name, email, password });
  await ensureProgress(user._id);

  const token = signToken(user._id);

  res.status(201).json({
    success: true,
    token,
    user: userResponse(user),
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Email and password are required" });
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ success: false, message: "Invalid email or password" });
  }

  const token = signToken(user._id);

  res.json({
    success: true,
    token,
    user: userResponse(user),
  });
});

export const getMe = asyncHandler(async (req, res) => {
  res.json({ success: true, user: userResponse(req.user) });
});
