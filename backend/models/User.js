import mongoose from "mongoose";

const { Schema } = mongoose;

const userSchema = new Schema({
    firstName: {type:String,required:true,trim: true},
    lastName: {type: String,trim:true},
    userName: { type: String, required: true, unique: true,trim:true },
    email: { type: String, required: true, unique: true ,trim:true},
    password: { type: String, required: true, select: false },
    contactNumber: {type: String ,trim:true},
    verified: { type: Boolean, default: false },
    profileURL: String,
}, { timestamps: true });

export default mongoose.model("User", userSchema);