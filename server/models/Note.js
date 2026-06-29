import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    excerpt: {
      type: String,
      default: "",
    },
    content: {
      type: String,
      default: "",
    },
    category: {
      type: String,
      enum: ["Interview Questions", "Coding Notes", "Theories", "HR Questions"],
      default: "Theories",
    },
    // The search topic that generated this note (e.g. "React Hooks")
    topic: {
      type: String,
      default: "",
      trim: true,
    },
    pinned: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Note = mongoose.model("Note", noteSchema);
export default Note;