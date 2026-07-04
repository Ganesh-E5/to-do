import mongoose from "mongoose";

const { Schema } = mongoose;

const projectSchema = new Schema({
    leader: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    tasks: [{ type: mongoose.Schema.Types.ObjectId, ref: "Task" }],
    title: { type: String, required: true },
}, { timestamps: true });

export default mongoose.model("Project", projectSchema);