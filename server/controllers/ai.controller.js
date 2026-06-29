import {
  generateInterviewContent,
  isGeminiConfigured,
  MOCK_PACK,
} from "../services/gemini.service.js";

// ── POST /api/ai/generate ─────────────────────────────────────────────────────
export async function generate(req, res) {
  const { topic } = req.body;

  if (!topic || typeof topic !== "string" || !topic.trim()) {
    return res.status(400).json({ success: false, message: "Topic is required" });
  }

  const cleanTopic = topic.trim().slice(0, 200);
  const forceMock =
    req.headers["x-use-mock"] === "1" || req.headers["x-use-mock"] === "true";

  if (forceMock || !isGeminiConfigured()) {
    console.log(`[AI] Returning mock data for topic: "${cleanTopic}"`);
    return res.json({ success: true, topic: cleanTopic, pack: MOCK_PACK, source: "mock" });
  }

  try {
    console.log(`[AI] Generating content for topic: "${cleanTopic}"`);
    const pack = await generateInterviewContent(cleanTopic);
    const source = pack._source || "gemini";
    const { _source, ...cleanPack } = pack;
    return res.json({ success: true, topic: cleanTopic, pack: cleanPack, source });
  } catch (err) {
    console.error("[AI] generate error:", err?.message || err);
    const userMessage =
      err?.message?.includes("API key")
        ? "AI service is not properly configured. Please contact support."
        : err?.message?.includes("temporarily unavailable") || err?.message?.includes("high demand")
        ? "AI is experiencing high demand right now. Please try again in a moment."
        : "Failed to generate content. Please try again.";
    return res.status(503).json({ success: false, message: userMessage });
  }
}

// ── Alias exports so ai.routes.js keeps working without changes ───────────────
// Your routes file imports { generateQuestions, explainTopic } — these map to `generate`
export const generateQuestions = generate;
export const explainTopic = generate;

// Also export as default for any default-import usage
export default { generate, generateQuestions, explainTopic };