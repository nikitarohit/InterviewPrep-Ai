const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function getToken() {
  return localStorage.getItem("token");
}

function useMockFlag() {
  return String(localStorage.getItem("forceMockAI") || "").toLowerCase();
}

async function request(path, options = {}) {
  const token = getToken();
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
      ...(useMockFlag() === "1" || useMockFlag() === "true"
        ? { "X-Use-Mock": "1" }
        : {}),
    },
  });

  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { message: text };
  }

  if (!res.ok) {
    if (res.status === 401) {
      localStorage.removeItem("token");
    }
    const e = new Error(data.message || "Request failed");
    e.status = res.status;
    e.details = data;
    throw e;
  }
  return data;
}

export const api = {
  // ── Auth ──────────────────────────────────────────────────────────────────
  register: (body) =>
    request("/auth/register", { method: "POST", body: JSON.stringify(body) }),
  login: (body) =>
    request("/auth/login", { method: "POST", body: JSON.stringify(body) }),
  getMe: () => request("/auth/me"),
  updateProfile: (body) =>
    request("/auth/profile", { method: "PATCH", body: JSON.stringify(body) }),

  // ── AI ────────────────────────────────────────────────────────────────────
  generate: (topic) =>
    request("/ai/generate", { method: "POST", body: JSON.stringify({ topic }) }),
  generateMock: (topic) =>
    request("/ai/generate", {
      method: "POST",
      body: JSON.stringify({ topic }),
      headers: { "X-Use-Mock": "1" },
    }),

  // ── Notes ─────────────────────────────────────────────────────────────────
  getNotes: (params = {}) => {
    const q = new URLSearchParams(params).toString();
    return request(`/notes${q ? "?" + q : ""}`);
  },
  createNote: (body) =>
    request("/notes", { method: "POST", body: JSON.stringify(body) }),
  // FIX: backend notes.routes.js uses PUT /:id — was incorrectly PATCH
  updateNote: (id, body) =>
    request(`/notes/${id}`, { method: "PUT", body: JSON.stringify(body) }),
  deleteNote: (id) =>
    request(`/notes/${id}`, { method: "DELETE" }),

  // ── Dashboard ─────────────────────────────────────────────────────────────
  getDashboardStats: () => request("/dashboard"),

  // ── Progress ──────────────────────────────────────────────────────────────
  getProgress: () => request("/progress"),
  /**
   * Increment a progress counter.
   * Body shape expected by progress.controller.js:
   *   { type: "questions" | "mcqs" | "coding" | "roadmaps", count: number }
   */
  updateProgress: (body) =>
    request("/progress/increment", { method: "POST", body: JSON.stringify(body) }),
  /**
   * Log a recent-activity item.
   * Body: { text, label, accent, accentBg }
   */
  addActivity: (body) =>
    request("/progress/activity", { method: "POST", body: JSON.stringify(body) }),
};