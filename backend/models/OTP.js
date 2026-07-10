import mongoose from "mongoose";

const { Schema } = mongoose;

const OTPSchema = new Schema({
    otp: { type: Number, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    createdAt: { type: Date, default: Date.now, expires: 300 }
});

export default mongoose.model("OTP", OTPSchema);