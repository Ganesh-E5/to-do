import { body } from "express-validator";

export const signupValidator = [
    body("firstName")
        .trim()
        .notEmpty().withMessage("First name is required")
        .bail()
        .matches(/^[A-Za-z]+$/).withMessage("First name should contain only letters"),

    body("userName")
        .trim()
        .notEmpty().withMessage("User name is required")
        .bail()
        .matches(/^[a-zA-Z0-9_]+$/).withMessage("Username can only contain letters, numbers, and underscores"),

    body("email")
        .notEmpty().withMessage("Email is required")
        .bail()
        .matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/).withMessage("Please enter a valid email address"),

    body("password")
        .notEmpty().withMessage("Password is required")
        .bail()
        .custom((value) => value === value.trim()).withMessage("Password should not start or end with spaces")
        .isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),

    body("contactNumber")
        .optional()
        .matches(/^[0-9]{10}$/).withMessage("Contact number must be exactly 10 digits"),
];

export const loginValidator = [
    body("identifier")
        .trim()
        .notEmpty().withMessage("Email or username is required"),

    body("password")
        .notEmpty().withMessage("Password is required"),
];

export const verifyOTPValidator = [
    body("identifier")
        .trim()
        .notEmpty().withMessage("EMail or username is required"),
    body("otp")
        .notEmpty().withMessage("OTP is required")
        .bail()
        .isNumeric().withMessage("OTP must be numeric")
        .isLength({ min: 6, max: 6 }).withMessage("OTP must be 6 digits")
]

export const resendOTPValidator = [
    body("identifier")
        .trim()
        .notEmpty().withMessage("Email or username is required"),
];