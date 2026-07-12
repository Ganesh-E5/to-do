import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { createCategoryController, getAllCategoriesController, getCategoryByIdController, updateCategoryController, deleteCategoryController } from "../controllers/categoryController.js";
import { createCategoryValidator, getAllCategoriesValidator, categoryIdValidator, updateCategoryValidator } from "../validators/categoryValidators.js";
import { validateRequest } from "../middleware/validateRequest.js";

const router = express.Router();

router.post("/",protect, createCategoryValidator, validateRequest, createCategoryController)
router.get("/",protect, getAllCategoriesValidator, validateRequest, getAllCategoriesController)
router.get("/:id",protect, categoryIdValidator, validateRequest, getCategoryByIdController)
router.patch("/:id",protect, categoryIdValidator, updateCategoryValidator, validateRequest, updateCategoryController)
router.delete("/:id",protect, categoryIdValidator, validateRequest, deleteCategoryController)

export default router;