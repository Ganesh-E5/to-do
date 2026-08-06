import { body, param, query } from "express-validator";
import Category from "../models/Category.js";

export const createTaskValidator = [
    body("title").trim().notEmpty().withMessage("Title is required"),
    body("description").optional().trim(),
    body("category")
        .optional({
            checkFalsy: true
        })
        .isMongoId().withMessage("Invalid category id")
        .bail()
        .custom(async (value, { req }) => {
            const category = await Category.findOne({ _id: value, userId: req.user.id });
            if (!category) {
                throw new Error("Category not found");
            }
            return true;
        }),
    body("dueDate")
        .notEmpty().withMessage("Due date is required")
        .bail()
        .isISO8601().withMessage("Due date must be a valid date")
        .bail()
        .custom((value) => {
            const inputDate = new Date(value);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (inputDate < today) {
                throw new Error("Due date cannot be in the past")
            }
            return true;
        }),
    body("priority")
        .optional({ checkFalsy: true })
        .isIn(["low", "medium", "high"]).withMessage("Priority must be low, medium, or high"),
];

export const taskIdValidator = [
    param("id").isMongoId().withMessage("Invalid task id"),
]

export const getAllTasksValidator = [
    query("status")
        .optional()
        .isIn(["not started", "in progress", "completed"])
        .withMessage("Status must be 'not started', 'in progress', or 'completed'"),

    query("priority")
        .optional()
        .isIn(["low", "medium", "high"])
        .withMessage("Priority must be low, medium, or high"),

    query("category")
        .optional()
        .isMongoId()
        .withMessage("Invalid category id"),

    query("page")
        .optional()
        .isInt({ min: 1 }).withMessage("Page must be a positive integer")
        .toInt(),

    query("limit")
        .optional()
        .isInt({ min: 1, max: 100 }).withMessage("Limit must be between 1 and 100")
        .toInt(),

    query("sortBy")
        .optional()
        .isIn(["createdAt", "dueDate", "priority", "status", "title"])
        .withMessage("Invalid sortBy field"),

    query("order")
        .optional()
        .isIn(["asc", "desc"])
        .withMessage("Order must be 'asc' or 'desc'"),
];

export const updateTaskValidator = [
    body("title")
        .optional()
        .trim()
        .notEmpty().withMessage("Title is required"),
    body("description")
        .optional()
        .trim(),
    body("dueDate")
        .optional()
        .isISO8601().withMessage("Due date must be a valid date")
        .bail()
        .custom((value) => {
            const inputDate = new Date(value);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (inputDate < today) {
                throw new Error("Due date cannot be in the past")
            }
            return true;
        }),
    body("status")
        .optional()
        .isIn(["completed", "not started", "in progress"]).withMessage("Status must be not started, in progress, or completed"),
    body("priority")
        .optional()
        .isIn(["low", "medium", "high"]).withMessage("Priority must be low, medium, or high"),
    body("category")
        .optional({ checkFalsy: true })
        .isMongoId().withMessage("Invalid category id")
        .bail()
        .custom(async (value, { req }) => {
            const category = await Category.findOne({ _id: value, userId: req.user.id });
            if (!category) {
                throw new Error("Category not found");
            }
            return true;
        }),
]