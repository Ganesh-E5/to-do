import mongoose from "mongoose";

const { Schema } = mongoose;

const taskSchema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    description: { type: String },
    dueDate: { type: Date, required: true },
    status: { type: String, enum: ["Not Started", "In Progress", "Completed"], default: "Not Started" },
    priority: { type: String, enum: ["low", "medium", "high"], default: "low" },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },

}, { timestamps: true });

export default mongoose.model("Task", taskSchema);