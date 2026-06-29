import Note from "../models/Note.js";

// ── GET /api/notes ────────────────────────────────────────────────────────────
export async function getNotes(req, res) {
  try {
    const filter = { userId: req.user._id };

    // optional ?category= filter
    if (req.query.category) {
      filter.category = req.query.category;
    }

    const notes = await Note.find(filter)
      .sort({ pinned: -1, createdAt: -1 }) // pinned first, then newest
      .lean();

    res.json({ success: true, count: notes.length, data: notes });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// ── GET /api/notes/:id ────────────────────────────────────────────────────────
export async function getNote(req, res) {
  try {
    const note = await Note.findOne({ _id: req.params.id, userId: req.user._id });
    if (!note) return res.status(404).json({ success: false, message: "Note not found" });
    res.json({ success: true, data: note });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}

// ── POST /api/notes ───────────────────────────────────────────────────────────
export async function createNote(req, res) {
  try {
    const { title, excerpt, content, category, pinned, topic } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: "Title is required" });
    }

    const note = await Note.create({
      userId: req.user._id,
      title: title.trim(),
      excerpt: excerpt?.trim() || content?.substring(0, 150).trim() || "",
      content: content?.trim() || "",
      category: category || "Theories",
      pinned: pinned || false,
      topic: topic?.trim() || "",
    });

    res.status(201).json({ success: true, data: note });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
}

// ── PUT /api/notes/:id ────────────────────────────────────────────────────────
export async function updateNote(req, res) {
  try {
    const note = await Note.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!note) return res.status(404).json({ success: false, message: "Note not found" });
    res.json({ success: true, data: note });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
}

// ── DELETE /api/notes/:id ─────────────────────────────────────────────────────
export async function deleteNote(req, res) {
  try {
    const note = await Note.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    if (!note) return res.status(404).json({ success: false, message: "Note not found" });
    res.json({ success: true, message: "Note deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}