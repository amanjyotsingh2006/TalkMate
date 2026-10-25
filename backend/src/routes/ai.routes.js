import express from "express"
import { aiActions } from "../controllers/ai.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/assist", protectRoute, aiActions)

export default router