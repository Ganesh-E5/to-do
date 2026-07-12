import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

import authRoutes from "./routes/authRoutes.js";
import taskRoutes from "./routes/taskRoutes.js"
import categoryRoutes from "./routes/categoryRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();
connectDB();

const app = express();

app.use(cors({
    origin: process.env.FRONTEND_URL
}));
app.use(express.json());

app.use((err, req, res, next) => {
    if (err.type === "entity.parse.failed") {
        return res.status(400).json({ message: "Invalid JSON in request body" });
    }
    next(err);
});

app.get("/", (req, res) => {
    res.send("API is running...");
})

app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/categories",categoryRoutes);
app.use("/api/users", userRoutes);

app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: "Something went wrong on the server" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})