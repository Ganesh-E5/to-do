import { body } from "express-validator";

export const updateProfileValidator = [
    body("firstName")
        .optional()
        .trim()
        .notEmpty().withMessage("First name is required")
        .bail()
        .matches(/^[A-Za-z]+$/).withMessage("First name should contain only letters"),

    body("lastName")
        .optional()
        .trim()
        .matches(/^[A-Za-z]+$/).withMessage("Last name should contain only letters"),

    body("userName")
        .optional()
        .trim()
        .notEmpty().withMessage("Username is required")
        .bail()
        .matches(/^[a-zA-Z0-9_]+$/).withMessage("Username can only contain letters, numbers, and underscores"),

    body("contactNumber")
        .optional()
        .trim()
        .matches(/^[0-9]{10}$/).withMessage("Contact number must be exactly 10 digits"),
];

export const verifyPasswordChangeValidator = [
    body("otp")
        .notEmpty().withMessage("OTP is required")
        .bail()
        .isNumeric().withMessage("OTP must be numeric")
        .isLength({ min: 6, max: 6 }).withMessage("OTP must be 6 digits"),

    body("newPassword")
        .notEmpty().withMessage("New password is required")
        .bail()
        .custom((value) => value === value.trim()).withMessage("Password should not start or end with spaces")
        .isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
];