import express from "express";
import { forgotPassword, googleLogin, login, logout, onboard, resetPassword, signup } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/google-login", googleLogin)
router.post("/logout", logout)

router.post("/onboarding", protectRoute, onboard)

router.get("/me", protectRoute, (req, res) => {
    res.status(200).json({ success: true, user: req.user })
})

router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

export default router;