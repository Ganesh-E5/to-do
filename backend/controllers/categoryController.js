import { matchedData } from "express-validator";
import Category from "../models/Category.js";
import Task from "../models/Task.js";
import mongoose from "mongoose";

export const createCategoryController = async (req, res) => {
    try {

        const userId = req.user.id;
        const { category, color } = req.body;

        const existCategory = await Category.findOne({ userId, category })

        if (existCategory) {
            return res.status(400).json({ message: "Category already exists" })
        }

        const newCategory = await Category.create({
            userId,
            category,
            color
        })

        return res.status(201).json({
            message: "Category created successfully",
            category: newCategory
        })

    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: "Category already exists" })
        }
        return res.status(500).json({
            message: "Something went wrong",
            error: error.message
        })
    }
}

export const getAllCategoriesController = async (req, res) => {
    try {

        const userId = req.user.id;
        const { sortBy = "createdAt", page = 1, limit = 10, order = "desc" } = matchedData(req, { locations: ["query"] })

        const filter = { userId: new mongoose.Types.ObjectId(userId) };
        const skip = (page - 1) * limit;
        const sortOrder = order === "asc" ? 1 : -1;

        const [categories, totalCount] = await Promise.all([
            Category.find(filter)
                .sort({ [sortBy]: sortOrder })
                .skip(skip)
                .limit(limit),
            Category.countDocuments(filter)
        ])

        return res.status(200).json({
            message: "Categories fetched successfully",
            categories,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalCount / limit),
                totalCategories: totalCount,
                hasNextPage: skip + categories.length < totalCount
            }
        })

    } catch (error) {
        return res.status(500).json({
            message: "Something went wrong",
            error: error.message
        })
    }
}

export const getCategoryByIdController = async (req, res) => {
    try {

        const userId = req.user.id;
        const categoryId = req.params.id;

        const category = await Category.findOne({ _id: categoryId, userId: userId })

        if (!category) {
            return res.status(404).json({
                message: "Category not found"
            })
        }

        return res.status(200).json({
            message: "Category found successfully",
            category: category
        })

    } catch (error) {
        return res.status(500).json({
            message: "Something went wrong",
            error: error.message
        })
    }
}

export const updateCategoryController = async (req, res) => {
    try {

        const userId = req.user.id;
        const categoryId = req.params.id;
        const { category, color } = req.body;

        const updatedFields = {};
        if (category !== undefined) updatedFields.category = category;
        if (color !== undefined) updatedFields.color = color;

        const updatedCategory = await Category.findOneAndUpdate(
            { _id: categoryId, userId: userId },
            { $set: updatedFields },
            { returnDocument: "after", runValidators: true }
        )

        if (!updatedCategory) {
            return res.status(404).json({
                message: "Category not found"
            })
        }

        return res.status(200).json({
            message: "Category updated successfully",
            category: updatedCategory
        })

    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: "Category already exists" });
        }
        return res.status(500).json({
            message: "Something went wrong",
            error: error.message
        })
    }
}

export const deleteCategoryController = async (req, res) => {
    try {
        const userId = req.user.id;
        const categoryId = req.params.id;

        const category = await Category.findOne({ _id: categoryId, userId });
        if (!category) {
            return res.status(404).json({ message: "Category not found" });
        }

        await Task.updateMany(
            { userId, category: categoryId },
            { $set: { category: null} },
        );

        await Category.findByIdAndDelete(categoryId);

        return res.status(200).json({
            message: "Category deleted successfully."
        });
    } catch (error) {
        await session.abortTransaction();
        return res.status(500).json({
            message: "Something went wrong",
            error: error.message
        })
    }
}