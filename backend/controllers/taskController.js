import Task from "../models/Task.js";
import Category from "../models/Category.js"
import mongoose from "mongoose";
import { matchedData } from "express-validator";

export const createTaskController = async (req, res) => {
    try {
        const user = req.user.id;

        const { title, description, dueDate, priority, category } = req.body;

        const newTask = await Task.create({
            userId: user,
            title,
            description,
            dueDate,
            priority,
            category: category || null
        })

        res.status(201).json({ message: "Task created successfully", task: newTask })

    } catch (error) {
        res.status(500).json({ message: "Something went wrong", error: error.message })
    }
}

export const getAllTasksController = async (req, res) => {
    try {
        const userId = req.user.id;
        const { status, priority, category, page = 1, limit = 20, sortBy = "createdAt", order = "desc" } = matchedData(req, { locations:["query"]});

        const filter = { userId: new mongoose.Types.ObjectId(userId) };
        if (status) filter.status = status;
        if (priority) filter.priority = priority;
        if (category) filter.category = new mongoose.Types.ObjectId(category);

        const skip = (page - 1) * limit;
        const sortOrder = order === "asc" ? 1 : -1;

        const pipeline = [{ $match: filter }];
        if (sortBy === "priority") {
            pipeline.push({
                $addFields: {
                    priorityRank: {
                        $switch: {
                            branches: [
                                { case: { $eq: ["$priority", "low"] }, then: 1 },
                                { case: { $eq: ["$priority", "medium"] }, then: 2 },
                                { case: { $eq: ["$priority", "high"] }, then: 3 },

                            ],
                            default: 0
                        }
                    }
                }
            });
            pipeline.push({ $sort: { priorityRank: sortOrder } })
        } else {
            pipeline.push({ $sort: { [sortBy]: sortOrder } });
        }

        pipeline.push(
            { $skip: skip },
            { $limit: limit },
            {
                $lookup: {
                    from: "categories",
                    localField: "category",
                    foreignField: "_id",
                    as: "category"
                }
            },
            { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },
            {
                $project: {
                    "category.userId": 0,
                    priorityRank: 0
                }
            }
        );
        const [tasks, totalCount] = await Promise.all([
            Task.aggregate(pipeline),
            Task.countDocuments(filter)
        ]);

        res.status(200).json({
            message: "Tasks fetched successfully",
            tasks,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(totalCount / limit),
                totalTasks: totalCount,
                hasNextPage: skip + tasks.length < totalCount
            }
        })
    } catch (error) {
        res.status(500).json({ message: "Something went wrong", error: error.message })
    }
}

export const getTaskByIdController = async (req, res) => {
    try {
        const userId = req.user.id;
        const id = req.params.id;
        const task = await Task.findOne({ _id: id, userId: userId }).populate("category", "category color");
        if (!task) {
            return res.status(404).json({ message: "Task not found" })
        }
        res.status(200).json({ message: "Task found successfully", task: task })
    } catch (error) {
        res.status(500).json({ message: "Something went wrong", error: error.message })
    }
}

export const updateTaskController = async (req, res) => {
    try {
        const taskId = req.params.id;
        const userId = req.user.id;
        const { title, description, dueDate, status, priority, category } = req.body;

        const updateFields = {};
        if (title !== undefined) updateFields.title = title;
        if (description !== undefined) updateFields.description = description;
        if (dueDate !== undefined) updateFields.dueDate = dueDate;
        if (status !== undefined) updateFields.status = status;
        if (priority !== undefined) updateFields.priority = priority;
        if (category !== undefined) updateFields.category = category;

        const updatedTask = await Task.findOneAndUpdate(
            { _id: taskId, userId },
            { $set: updateFields },
            { returnDocument: "after", runValidators: true }
        ).populate("category", "category color")

        if (!updatedTask) {
            return res.status(404).json({ message: "Task not found" })
        }

        return res.status(200).json({
            message: "Task updated successfully",
            task: updatedTask
        })

    } catch (error) {
        return res.status(500).json({
            message: "Something went wrong",
            error: error.message
        })
    }
}

export const deleteTaskController = async (req, res) => {
    try {
        const userId = req.user.id;
        const taskId = req.params.id;
        const deletedTask = await Task.findOneAndDelete({ _id: taskId, userId });
        if (!deletedTask) {
            return res.status(404).json({
                message: "Task not found"
            })
        }
        return res.status(200).json({
            message: "Task deleted successfully"
        })

    } catch (error) {
        return res.status(500).json({
            message: "Something went wrong",
            error: error.message
        })
    }
}

