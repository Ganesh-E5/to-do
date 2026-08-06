import express from "express";
import { signupController, loginController, verifyotpController, resendOTPController } from "../controllers/authController.js";
import { signupValidator, loginValidator, resendOTPValidator, verifyOTPValidator } from "../validators/authValidators.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { otpVerifyLimiter, otpRequestLimiter, loginLimiter } from "../middleware/rateLimiters.js";

const router = express.Router();

router.post("/signup", signupValidator, validateRequest, signupController)
router.post("/verify-otp", otpVerifyLimiter, verifyOTPValidator, validateRequest, verifyotpController)
router.post("/login", loginLimiter, loginValidator, validateRequest, loginController)
router.post("/resend-otp", otpRequestLimiter, resendOTPValidator, validateRequest, resendOTPController)

export default router;