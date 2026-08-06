import mongoose from "mongoose";

const { Schema } = mongoose;

const OTPSchema = new Schema({
    otp: { type: Number, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    createdAt: { type: Date, default: Date.now, expires: 300 },
    attempts: { type: Number, default: 0 },
});

export default mongoose.model("OTP", OTPSchema);