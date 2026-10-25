import express from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import aiRoutes from "./routes/ai.routes.js";

import { connectDB } from "./db/db.js";

const app = express();
const PORT = process.env.PORT;

app.set("trust proxy", 1);

app.use(cors({
    origin: [
        "https://talkmate-frontend-kohl.vercel.app",
        "http://localhost:5173",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json());
app.use(cookieParser());

// Make sure the DB is connected before any route runs
app.use(async (req, res, next) => {
    try {
        await connectDB();
        next();
    } catch (error) {
        console.log("DB connection failed:", error.message);
        res.status(503).json({ message: "Database unavailable, please retry" });
    }
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/ai", aiRoutes);

if (process.env.NODE_ENV !== "production") {
    app.listen(PORT, () => console.log(`Server running on ${PORT}`));
}

export default app;