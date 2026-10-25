import express from "express";
import "dotenv/config";
import cookieParser from "cookie-parser"
import cors from "cors"

import authRoutes from "./routes/auth.routes.js"
import userRoutes from "./routes/user.routes.js"
import chatRoutes from "./routes/chat.routes.js";
import aiRoutes from "./routes/ai.routes.js";

import { connectDB } from "./db/db.js";

const app = express();
const PORT = process.env.PORT;

app.use(cors({
    origin: [
        "https://talkmate-frontend-kohl.vercel.app",
        "http://localhost:5173"   // for local development
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes)
app.use("/api/chat", chatRoutes)
app.use("/api/ai", aiRoutes)

connectDB();   // runs at startup on Vercel too

if (process.env.NODE_ENV !== "production") {
    app.listen(PORT, () => console.log(`Server running on ${PORT}`));
}

export default app;