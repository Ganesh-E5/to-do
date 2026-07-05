import express from "express";
import { signupController,loginController,verifyotpController,resendOTPController } from "../controllers/authController.js";

const router = express.Router();

router.post("/signup",signupController)
router.post("/verify-otp",verifyotpController)
router.post("/login",loginController)
router.post("/resend-otp",resendOTPController)

export default router;