import { aiActions } from "../controllers/ai.controller.js";
import express from "express"
import { GoogleGenAI } from "@google/genai"
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

const ai = new GoogleGenAI({
    apiKey: process.env.AI_API_Key
});

router.post("/assist", protectRoute, aiActions)

export default router