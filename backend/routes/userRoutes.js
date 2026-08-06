import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { getProfileController, updateProfileController, requestPasswordChangeOTPController, verifyPasswordChangeOTPController } from "../controllers/userController.js";
import { updateProfileValidator, verifyPasswordChangeValidator } from "../validators/userValidators.js"; 
import { otpVerifyLimiter, otpRequestLimiter } from "../middleware/rateLimiters.js";

const router = express.Router();

router.get('/profile', protect, getProfileController);
router.patch('/profile', protect, updateProfileValidator, validateRequest, updateProfileController);
router.post('/change-password/request', protect, otpRequestLimiter,requestPasswordChangeOTPController);
router.post('/change-password/verify', protect, otpVerifyLimiter,verifyPasswordChangeValidator, validateRequest, verifyPasswordChangeOTPController);

export default router;