import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema({
    firstName: String,
    lastName: String,
    userName: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    contactNumber: String,
    verified: { type: Boolean, default: false },
    profileURL: String,
}, { timestamps: true });

export default mongoose.model("User", userSchema);