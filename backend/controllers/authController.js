import bcrypt from "bcrypt";
import User from "../models/User.js";
import OTP from "../models/OTP.js"
import sendEmail from "../utils/sendEmail.js";
import jwt from "jsonwebtoken";
import { validateSignup } from "../utils/validateSignup.js";

export const signupController = async (req, res) => {
    try {
        const data = req.body;
        const { firstName, lastName, userName, email, password, contactNumber } = data;

        const errors = validateSignup({firstName,userName,email,password,contactNumber})

        if(errors.length>0){
            return res.status(400).json({message:"Validation failed",errors})
        }
        const existingUser = await User.findOne({ userName });
        if (existingUser) {
            return res.status(400).json({
                message: "Username already exists"
            })
        }
        const existingEmail = await User.findOne({ email });
        if (existingEmail) {
            return res.status(400).json({
                message: "Email already exists"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            firstName,
            lastName,
            userName,
            email,
            password: hashedPassword,
            contactNumber
        })


        const otp = Math.floor(100000 + Math.random() * 900000);

        const newOTP = await OTP.create({
            otp,
            user: newUser._id
        });
        try {
            await sendEmail(newUser.email, "Verify your account", `Your OTP is: ${otp}`)
        } catch (emailError) {
            await User.findByIdAndDelete(newUser._id);
            await OTP.findByIdAndDelete(newOTP._id);
            return res.status(500).json({ message: "Failed to send verification email. Please check your email address and try again." });
        }

        res.status(201).json({ message: "Signup successful, OTP sent to email" })


    } catch (error) {
        res.status(500).json({ message: "Something went wrong", error: error.message })
    }
}
export const verifyotpController = async (req, res) => {

    try {

        const identifier = req.body.identifier?.trim();
        const otp=req.body.otp;

        if (!identifier) {
            return res.status(400).json({ message: "Email or username is required" });
        }
        if (!otp) {
            return res.status(400).json({ message: "OTP is required" });
        }

        const user = await User.findOne({
            $or: [{ email: identifier }, { userName: identifier }]
        });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        const existingOTP = await OTP.findOne({ user: user._id });
        if (!existingOTP) {
            return res.status(400).json({ message: "OTP expired or not found, please resend" });
        }

        if (existingOTP.otp != otp) {
            return res.status(400).json({ message: "Incorrect OTP" });
        }

        await OTP.findByIdAndDelete(existingOTP._id);
        await User.findByIdAndUpdate(user._id, { verified: true });
        res.status(200).json({ message: "OTP verified successfully" });
    } catch (error) {
        res.status(500).json({ message: "Something went wrong", error: error.message })
    }

}
export const loginController = async (req, res) => {
    try {
        const identifier = req.body.identifier?.trim();
        const password = req.body.password;

        if (!identifier) {
            return res.status(400).json({ message: "Email or username is required" });
        }

        if (!password) {
            return res.status(400).json({ message: "Password is required" });
        }

        const user = await User.findOne({
            $or: [{ email: identifier }, { userName: identifier }]
        });

        if (!user) {
            return res.status(400).json({ message: "No user found" })
        }


        if (!user.verified) {
            return res.status(403).json({ message: "Please verify your email before logging in", needsVerification: true });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Incorrect password" })
        }
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        )
        return res.status(200).json({
            message: "Login successful",
            token,
            user: {
                id: user._id,
                firstName: user.firstName,
                userName: user.userName,
                email: user.email
            }
        });

    } catch (error) {
        res.status(500).json({ message: "Something went wrong", error: error.message })
    }

}

export const resendOTPController = async (req, res) => {
    try {

        const identifier  = req.body.identifier?.trim();

        if (!identifier) {
            return res.status(400).json({ message: "Email or username is required" });
        }
        
        const user = await User.findOne({
            $or: [{ email: identifier }, { userName: identifier }]
        })
        if (!user) {
            return res.status(400).json({ message: "No user found" });
        }
        if (user.verified) {
            return res.status(200).json({ message: "User is already verified" })
        }
        await OTP.deleteMany({ user: user._id });
        const otp = Math.floor(100000 + Math.random() * 900000);
        const newOTP = await OTP.create({
            user: user._id,
            otp: otp
        })
        await sendEmail(user.email, "Your new OTP", `Your OTP is: ${otp}`)
        return res.status(201).json({ message: "OTP sent successfully" })
    } catch (error) {
        res.status(500).json({ message: "Something went wrong", error: error.message })
    }
}