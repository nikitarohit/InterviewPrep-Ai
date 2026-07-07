import {
  generateInterviewContent,
  isGeminiConfigured,
  MOCK_PACK,
} from "../services/gemini.service.js";

export async function generate(req, res) {
  const { topic, language } = req.body;

  if (!topic || typeof topic !== "string" || !topic.trim()) {
    return res.status(400).json({ success: false, message: "Topic is required" });
  }

  const cleanTopic = topic.trim().slice(0, 200);

  // FIX: read language from request body, fallback to Python
  const cleanLanguage = (typeof language === "string" && language.trim())
    ? language.trim()
    : "Python";

  const forceMock =
    req.headers["x-use-mock"] === "1" || req.headers["x-use-mock"] === "true";

  if (forceMock || !isGeminiConfigured()) {
    console.log(`[AI] Mock data for topic: "${cleanTopic}" lang: ${cleanLanguage}`);
    return res.json({ success: true, topic: cleanTopic, pack: MOCK_PACK, source: "mock" });
  }

  try {
    console.log(`[AI] Generating for topic: "${cleanTopic}" lang: ${cleanLanguage}`);

    // FIX: pass language to generateInterviewContent
    const pack = await generateInterviewContent(cleanTopic, cleanLanguage);
    const source = pack._source || "gemini";
    const { _source, ...cleanPack } = pack;

    return res.json({ success: true, topic: cleanTopic, pack: cleanPack, source });
  } catch (err) {
    console.error("[AI] generate error:", err?.message || err);
    const userMessage =
      err?.message?.includes("API key")
        ? "AI service is not properly configured."
        : err?.message?.includes("temporarily unavailable") || err?.message?.includes("high demand")
        ? "AI is experiencing high demand. Please try again in a moment."
        : "Failed to generate content. Please try again.";
    return res.status(503).json({ success: false, message: userMessage });
  }
}

// alias exports for ai.routes.js
export const generateQuestions = generate;
export const explainTopic = generate;
export default { generate, generateQuestions, explainTopic };