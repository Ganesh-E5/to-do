import bcrypt from "bcrypt";
import User from "../models/User.js";
import OTP from "../models/OTP.js"
import sendEmail from "../utils/sendEmail.js";
import jwt from "jsonwebtoken";

export const signupController = async (req, res) => {
    try {
        const {
            firstName,
            lastName,
            userName,
            email,
            password,
            contactNumber,
        } = req.body;

        const existingUsername = await User.findOne({ userName });
        const existingEmail = await User.findOne({ email });

        // Check verified username
        if (existingUsername?.verified) {
            return res.status(400).json({
                code: "USERNAME_EXISTS",
                field: "userName",
                message: "Username already exists",
            });
        }

        // Check verified email
        if (existingEmail?.verified) {
            return res.status(400).json({
                code: "EMAIL_EXISTS",
                field: "email",
                message: "Email already exists",
            });
        }

        const staleThreshold = 24 * 60 * 60 * 1000;

        // Handle unverified username
        if (existingUsername && !existingUsername.verified) {
            const accountAge =
                Date.now() - existingUsername.createdAt.getTime();

            if (accountAge < staleThreshold) {
                const isSameEmail = existingUsername.email === email;

                return res.status(400).json({
                    code: isSameEmail ? "VERIFICATION_PENDING" : "USERNAME_EXISTS",
                    field: isSameEmail ? undefined : "userName",
                    message: isSameEmail
                        ? "This username is pending for verification. Please verify it or try again later."
                        : "Username already exists",
                });
            }

            await OTP.deleteMany({ user: existingUsername._id });
            await User.findByIdAndDelete(existingUsername._id);
        }

        // Handle unverified email
        if (
            existingEmail &&
            !existingEmail.verified &&
            (!existingUsername ||
                existingEmail._id.toString() !== existingUsername._id.toString())
        ) {
            const accountAge =
                Date.now() - existingEmail.createdAt.getTime();

            if (accountAge < staleThreshold) {
                const isSameUsername = existingEmail.userName === userName;

                return res.status(400).json({
                    code: isSameUsername ? "VERIFICATION_PENDING" : "EMAIL_EXISTS",
                    field: isSameUsername ? undefined : "email",
                    message: isSameUsername
                        ? "This email is pending verification. Please verify it or try again later."
                        : "Email already exists",
                });
            }

            await OTP.deleteMany({ user: existingEmail._id });
            await User.findByIdAndDelete(existingEmail._id);
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const newUser = await User.create({
            firstName,
            lastName,
            userName,
            email,
            password: hashedPassword,
            contactNumber,
        });

        // Generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000);

        const newOTP = await OTP.create({
            otp,
            user: newUser._id,
        });

        try {
            await sendEmail(
                newUser.email,
                "Verify your account",
                `Your OTP is: ${otp}`
            );
        } catch (emailError) {
            await OTP.findByIdAndDelete(newOTP._id);
            await User.findByIdAndDelete(newUser._id);

            return res.status(500).json({
                code: "EMAIL_SEND_FAILED",
                message:
                    "Failed to send verification email. Please try again.",
            });
        }

        return res.status(201).json({
            message: "Signup successful. OTP sent to your email.",
            email: newUser.email,
        });
    } catch (error) {
        return res.status(500).json({
            code: "INTERNAL_SERVER_ERROR",
            message: "Something went wrong.",
        });
    }
};

export const verifyotpController = async (req, res) => {

    try {

        const identifier = req.body.identifier?.trim();
        const otp = req.body.otp;

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

        const otpAgeInSeconds = (Date.now() - existingOTP.createdAt.getTime()) / 1000;
        if (otpAgeInSeconds > 300) {
            await OTP.findByIdAndDelete(existingOTP._id);
            return res.status(400).json({ message: "OTP expired, please resend" });
        }

        if (existingOTP.otp != otp) {
            existingOTP.attempts += 1;
            if (existingOTP.attempts >= 5) {
                await OTP.findByIdAndDelete(existingOTP._id);
                return res.status(400).json({ message: "Too many incorrect attempts. Please request a new OTP." });
            }
            await existingOTP.save();
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
        const { identifier } = req.body;

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