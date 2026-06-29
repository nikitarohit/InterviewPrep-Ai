import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import { env } from "./config/env.js";
import { errorHandler } from "./middleware/errorHandler.js";
import authRoutes from "./routes/auth.routes.js";
import notesRoutes from "./routes/notes.routes.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import progressRoutes from "./routes/progress.routes.js";
import aiRoutes from "./routes/ai.routes.js";

const app = express();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://interview-prep-ai-kohl-theta.vercel.app",
      env.clientUrl,
    ],
    credentials: true,
  })
);
app.use(express.json({ limit: "1mb" }));

app.get("/api/health", (_req, res) => {
  res.json({
    success: true,
    message: "InterviewPrep AI API is running",
    gemini: Boolean(env.geminiApiKey),
    geminiModel: env.geminiModel || null,
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/notes", notesRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/ai", aiRoutes);

app.use(errorHandler);

async function start() {
  await connectDB();
  app.listen(env.port, () => {
    console.log(`Server running on http://localhost:${env.port}`);
    console.log(`Gemini configured: ${env.geminiConfigured}`);
    if (env.geminiConfigured) console.log(`Gemini model: ${env.geminiModel}`);
  });
}

start().catch((err) => {
  console.error("Failed to start server:", err.message);
  process.exit(1);
});