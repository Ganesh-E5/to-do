import rateLimit from "express-rate-limit";

export const otpVerifyLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, 
    max: 5,
    message: { message: "Too many attempts. Please try again later." },
    standardHeaders: true,
    legacyHeaders: false,
});

export const otpRequestLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, 
    max: 3,
    message: { message: "Too many OTP requests. Please try again later." },
    standardHeaders: true,
    legacyHeaders: false,
});

export const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 10,
    message: { message: "Too many login attempts. Please try again later." },
    standardHeaders: true,
    legacyHeaders: false,
});

export const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 300,
    message: { message: "Too many requests. Please slow down." },
    standardHeaders: true,
    legacyHeaders: false,
});