import { Router } from "express";
import { generateQuestions, explainTopic } from "../controllers/ai.controller.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.use(protect);

router.post("/generate", generateQuestions);
router.post("/explain", explainTopic);

export default router;
