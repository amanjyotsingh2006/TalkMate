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
    origin: ["http://localhost:5173", "http://192.168.1.4:5173"],
    credentials: true  //allow frontend to send cookies
}));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes)
app.use("/api/chat", chatRoutes)
app.use("/api/ai", aiRoutes)

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    connectDB();
})