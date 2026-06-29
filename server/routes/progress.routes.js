import { Router } from "express";
import {
  getProgress,
  updateProgress,
  addActivity,
  incrementStat,
} from "../controllers/progress.controller.js";
import { protect } from "../middleware/auth.js";

const router = Router();

router.use(protect);

router.get("/", getProgress);
router.put("/", updateProgress);
router.post("/activity", addActivity);
router.post("/increment", incrementStat);

export default router;
