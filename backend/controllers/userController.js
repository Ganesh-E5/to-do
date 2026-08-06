import User from "../models/User.js";
import OTP from "../models/OTP.js";
import sendEmail from "../utils/sendEmail.js"
import bcrypt from "bcrypt"
import mongoose from "mongoose";

export const getProfileController = async (req, res) => {
    try {

        const userId = req.user.id;

        const user = await User.findById(userId).select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            })
        }

        return res.status(200).json({
            message: "Profile fetched successfully",
            user
        })
    } catch (error) {
        return res.status(500).json({ 
            message: "Something went wrong", 
            error: error.message 
        });
    }
}

export const updateProfileController = async (req, res) => {
    try {
        const userId = req.user.id;
        const { firstName, lastName, userName, contactNumber } = req.body;

        const updatedFields = {};
        if( firstName !== undefined) updatedFields.firstName = firstName;
        if( lastName !== undefined) updatedFields.lastName = lastName;
        if( userName !== undefined) updatedFields.userName = userName;
        if( contactNumber !== undefined) updatedFields.contactNumber = contactNumber;

        const updatedUser = await User.findByIdAndUpdate(
            userId,
            { $set: updatedFields },
            { returnDocument: "after", runValidators: true }
        ).select("-password");

        if(!updatedUser){
            return res.status(404).json({
                message: "User not found"
            })
        }

        return res.status(200).json({ message: "Profile updated successfully", user: updatedUser})

    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: "Username already exists" });
        }
        return res.status(500).json({ 
            message: "Something went wrong", 
            error: error.message 
        });
    }
}

export const requestPasswordChangeOTPController = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await User.findById(userId);
        
        if(!user){
            return res.status(404).json({ message: "User not found"});
        }

        if( !user.verified ) {
            return res.status(403).json({
                message : "Please verify your email before changing password"
            })
        }

        await OTP.deleteMany({user: userId})

        const otp = Math.floor(100000 + Math.random() * 900000);
        await OTP.create({
            user: userId,
            otp
        })

        await sendEmail(user.email, "Password Change OTP",`Your OTP  to change yourpassword is: ${otp}`);

        return res.status(200).json({
            message: "OTP sent to your registered email"
        })

    } catch (error) {
        return res.status(500).json({ 
            message: "Something went wrong", 
            error: error.message 
        });
    }
}

export const verifyPasswordChangeOTPController = async (req, res) => {
    const session = await mongoose.startSession();
    try {   
        session.startTransaction();

        const userId = req.user.id;
        const { otp, newPassword } = req.body;

        const existingOTP = await OTP.findOne({ user: userId }).session(session);
        if (!existingOTP) {
            await session.abortTransaction();
            return res.status(400).json({ message: "OTP expired , please request again" });
        }

        const otpAgeInSeconds = (Date.now() - existingOTP.createdAt.getTime()) / 1000;
        if (otpAgeInSeconds > 300) {
            await OTP.findByIdAndDelete(existingOTP._id).session(session);
            await session.commitTransaction();
            return res.status(400).json({ message: "OTP expired, please request again" });
        }

        if (existingOTP.otp != otp) {
            existingOTP.attempts += 1;
            if (existingOTP.attempts >= 5) {
                await OTP.findByIdAndDelete(existingOTP._id).session(session);
                await session.commitTransaction();
                return res.status(400).json({ message: "Too many incorrect attempts. Please request a new OTP." });
            }
            await existingOTP.save({ session });
            await session.commitTransaction();
            return res.status(400).json({ message: "Incorrect OTP" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await User.findByIdAndUpdate(userId, { password: hashedPassword }, { session });
        await OTP.findByIdAndDelete(existingOTP._id,{ session });

        await session.commitTransaction();

        return res.status(200).json({ message: "Password changed successfully" });

    } catch (error) {
        await session.abortTransaction();
        return res.status(500).json({ 
            message: "Something went wrong", 
            error: error.message 
        });
    } finally {
        session.endSession();
    }
}
