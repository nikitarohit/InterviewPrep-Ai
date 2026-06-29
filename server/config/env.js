import dotenv from "dotenv";

dotenv.config();

const geminiApiKey = (process.env.GEMINI_API_KEY || "").trim();

export const env = {
  port: Number(process.env.PORT) || 5000,
  nodeEnv: process.env.NODE_ENV || "development",
  mongoUri: process.env.MONGODB_URI || "mongodb+srv://nikitarohit12_db_user:<Nikitarohit_mongo_22>@timetable.plk12on.mongodb.net/?appName=timetable",
  jwtSecret: process.env.JWT_SECRET || "dev-secret-change-in-production",
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
  geminiApiKey,
  geminiModel: process.env.GEMINI_MODEL || "gemini-2.5-flash",
  geminiConfigured: Boolean(geminiApiKey),
  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",
};
