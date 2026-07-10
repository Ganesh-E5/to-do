import express from "express";
import { signupController, loginController, verifyotpController, resendOTPController } from "../controllers/authController.js";
import { signupValidator, loginValidator, resendOTPValidator, verifyOTPValidator } from "../validators/authValidators.js";
import { validateRequest } from "../middleware/validateRequest.js";

const router = express.Router();

router.post("/signup", signupValidator, validateRequest, signupController)
router.post("/verify-otp", verifyOTPValidator, validateRequest, verifyotpController)
router.post("/login", loginValidator, validateRequest, loginController)
router.post("/resend-otp", resendOTPValidator, validateRequest, resendOTPController)

export default router;