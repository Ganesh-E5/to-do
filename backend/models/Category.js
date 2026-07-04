import mongoose from "mongoose";

const { Schema } = mongoose;

const categorySchema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    category: { type: String, required: true },
    color: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model("Category", categorySchema);