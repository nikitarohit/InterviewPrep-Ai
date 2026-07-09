import { GoogleGenerativeAI } from "@google/generative-ai";
import { env } from "../config/env.js";

const MODEL_CHAIN = [
  "gemini-1.5-flash",
  "gemini-1.5-flash-8b",
  "gemini-2.5-flash",
];

const genAI = env.geminiApiKey ? new GoogleGenerativeAI(env.geminiApiKey) : null;

function getModel(modelName) {
  if (!genAI) return null;
  return genAI.getGenerativeModel({ model: modelName });
}

async function withRetry(fn, maxAttempts = 2, baseDelayMs = 800) {
  let lastError;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      const msg = err?.message || "";
      const isRetryable =
        msg.includes("503") || msg.includes("429") ||
        msg.includes("high demand") || msg.includes("Service Unavailable") ||
        msg.includes("Too Many Requests");
      if (!isRetryable || attempt === maxAttempts) throw err;
      const delay = baseDelayMs * Math.pow(2, attempt - 1);
      console.warn(`[Gemini] Attempt ${attempt} failed. Retrying in ${delay}ms…`);
      await new Promise((r) => setTimeout(r, delay));
    }
  }
  throw lastError;
}

export const MOCK_PACK = {
  theory: "This topic is a core interview concept. Focus on explaining the core idea, real-world use cases, and trade-offs clearly.",
  interviewQuestions: [
    { id: 1, question: "What is this concept and why is it important?", answer: "It is fundamental because it solves a common problem efficiently.", tip: "Explain it in simple terms first." },
    { id: 2, question: "How does it work in practice?", answer: "In practice, you apply it by breaking the problem into smaller parts.", tip: "Give a short example." },
    { id: 3, question: "What are its limitations?", answer: "Key limitations include scalability concerns and edge cases.", tip: "Mention trade-offs and constraints." },
  ],
  mcqs: [
    { id: 1, question: "Which statement best describes this concept?", options: ["It improves performance", "It reduces readability", "It is always synchronous", "It only works in JavaScript"], answer: 0 },
    { id: 2, question: "What is a common use case?", options: ["Styling web pages", "Managing application state", "Writing database queries", "Configuring servers"], answer: 1 },
  ],
  codingProblems: [
    { id: 1, title: "Practice Problem", difficulty: "Easy", description: "Write a function that demonstrates your understanding of this concept.", code: "function solution(input) {\n  // Your implementation here\n  return input;\n}", tag: "#practice" },
  ],
  hrQuestions: [
    { id: 1, question: "Tell me about yourself.", answer: "Keep it to 2 minutes: past experience, current skills, future goals.", tip: "Keep it concise and relevant." },
    { id: 2, question: "Why do you want to learn this topic?", answer: "Connect it to your career goals and explain how it helps you solve real problems.", tip: "Connect it to your goals." },
  ],
};

export function isGeminiConfigured() {
  return Boolean(env.geminiApiKey && genAI);
}

export function buildStudyPackPrompt(topic, language = "Python") {
  return `You are an expert interview coach helping candidates prepare for job interviews.

IMPORTANT RULE: First, check if "${topic}" is a valid, meaningful interview preparation topic (e.g. Java, System Design, Marketing Strategy, Financial Analysis, HR Management, React, DSA, SQL, OOP, etc.).

If "${topic}" is NOT a valid topic — for example it is a greeting ("hello", "hey", "hi"), a random word, gibberish, a single letter, or anything unrelated to interviews or learning — respond with ONLY this JSON:
{"error": "invalid_topic", "message": "Please enter a valid interview topic like 'Java Collections', 'System Design', or 'Marketing Strategy'."}

If it IS a valid topic, generate a JSON response with exactly this structure.
IMPORTANT: All code examples must be written in ${language}.
{
  "theory": "2-3 paragraph explanation of the topic for interview prep",
  "interviewQuestions": [
    {"id": 1, "question": "...", "answer": "...", "tip": "..."},
    {"id": 2, "question": "...", "answer": "...", "tip": "..."},
    {"id": 3, "question": "...", "answer": "...", "tip": "..."},
    {"id": 4, "question": "...", "answer": "...", "tip": "..."},
    {"id": 5, "question": "...", "answer": "...", "tip": "..."}
  ],
  "mcqs": [
    {"id": 1, "question": "...", "options": ["A", "B", "C", "D"], "answer": 0},
    {"id": 2, "question": "...", "options": ["A", "B", "C", "D"], "answer": 1},
    {"id": 3, "question": "...", "options": ["A", "B", "C", "D"], "answer": 2},
    {"id": 4, "question": "...", "options": ["A", "B", "C", "D"], "answer": 0}
  ],
  "codingProblems": [
    {"id": 1, "title": "...", "difficulty": "Easy", "description": "...", "code": "// ${language} solution here", "tag": "#tag"},
    {"id": 2, "title": "...", "difficulty": "Medium", "description": "...", "code": "// ${language} solution here", "tag": "#tag"}
  ],
  "hrQuestions": [
    {"id": 1, "question": "...", "answer": "...", "tip": "..."},
    {"id": 2, "question": "...", "answer": "...", "tip": "..."},
    {"id": 3, "question": "...", "answer": "...", "tip": "..."}
  ]
}
Return ONLY valid JSON. No markdown fences, no explanation, no extra text.`;
}

export function parseStudyPack(text) {
  const cleaned = text.replace(/```json|```/g, "").trim();
  try {
    return JSON.parse(cleaned);
  } catch (err) {
    console.error("[Gemini] parseStudyPack failed:", err?.message, "snippet:", cleaned.slice(0, 500));
    throw new Error("Unable to parse AI response as JSON");
  }
}

export async function generateText(prompt) {
  if (!genAI) throw new Error("Gemini API key is not configured");
  for (const modelName of MODEL_CHAIN) {
    const mdl = getModel(modelName);
    try {
      console.log(`[Gemini] Trying model: ${modelName}`);
      const rawText = await withRetry(async () => {
        const result = await mdl.generateContent(prompt);
        return result.response.text();
      });
      console.log(`[Gemini] ✓ Success with model: ${modelName}`);
      return rawText.replace(/```json|```/g, "").trim();
    } catch (err) {
      const msg = err?.message || "";
      console.warn(`[Gemini] ✗ Model ${modelName} failed: ${msg.slice(0, 120)}`);
      if (modelName === MODEL_CHAIN[MODEL_CHAIN.length - 1]) {
        throw new Error("AI service is temporarily unavailable. Please try again in a few moments.");
      }
    }
  }
}

export async function generateInterviewContent(topic, language = "Python") {
  if (!isGeminiConfigured()) {
    console.warn("[Gemini] Not configured — returning mock data");
    return { ...MOCK_PACK, _source: "mock" };
  }
  try {
    const prompt = buildStudyPackPrompt(topic, language);
    const text = await generateText(prompt);
    const pack = parseStudyPack(text);

    // If Gemini says topic is invalid — throw clean error
    if (pack.error === "invalid_topic") {
      throw new Error(pack.message);
    }

    return { ...pack, _source: "gemini" };
  } catch (err) {
    // Don't fallback to mock for invalid topic errors
    if (err.message.includes("valid interview topic") || err.message.includes("invalid_topic")) {
      throw err;
    }

    const isOverload =
      err.message.includes("temporarily unavailable") ||
      err.message.includes("503") ||
      err.message.includes("high demand");
    if (isOverload) {
      console.warn("[Gemini] All models overloaded — falling back to mock data");
      return { ...MOCK_PACK, _source: "mock-fallback" };
    }
    throw err;
  }
}