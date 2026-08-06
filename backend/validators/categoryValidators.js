import { body, param, query } from 'express-validator';

export const createCategoryValidator = [
    body("category")
        .trim()
        .notEmpty().withMessage("Category is required"),
    body("color")
        .trim()
        .notEmpty().withMessage("Color is required")
        .bail()
        .isHexColor().withMessage("Color must be a valid hex code")
]

export const getAllCategoriesValidator = [
    query("page")
        .optional()
        .isInt({ min: 1}).withMessage("Page must be a positive integer")
        .toInt(),
    
    query("limit")
        .optional()
        .isInt({ min: 1, max: 100}).withMessage("Limit must be between 1 and 100")
        .toInt(),
    
    query("sortBy")
        .optional()
        .isIn(["createdAt", "category"])
        .withMessage("Invalid sortBy field"),
    
    query("order")
        .optional()
        .isIn(["asc", "desc"])
        .withMessage("Order must be 'asc' or 'desc'")
]

export const categoryIdValidator = [
    param("id").isMongoId().withMessage("Invalid category id")
]

export const updateCategoryValidator = [

    body("category")
        .optional()
        .trim()
        .notEmpty().withMessage("Category is required"),

    body("color")
        .optional()
        .trim()
        .notEmpty().withMessage("Color is required")
        .bail()
        .isHexColor().withMessage("Color must be a valid hex code")
]

