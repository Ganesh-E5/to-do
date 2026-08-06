import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import userRoutes from "./routes/userRoutes.js";

import { generalLimiter } from "./middleware/rateLimiters.js";

dotenv.config();

const app = express();

app.set("trust proxy", 1);

const allowedOrigins = [
    process.env.FRONTEND_URL,
    "http://localhost:5173",
].filter(Boolean);

app.use(cors({
    origin: allowedOrigins,
    credentials: true,
}));

app.use(express.json());
app.use(generalLimiter);

app.get("/", (req, res) => {
    res.send("API is running...");
});

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/users", userRoutes);

app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
    if (err.type === "entity.parse.failed") {
        return res.status(400).json({ message: "Invalid JSON in request body" });
    }
    console.error(err.stack);
    res.status(500).json({ message: "Something went wrong on the server" });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Failed to connect to database. Server not started.", error);
        process.exit(1);
    }
};

startServer();