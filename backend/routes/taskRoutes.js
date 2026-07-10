import express from "express";
import { createTaskController, getAllTasksController, getTaskByIdController, updateTaskController, deleteTaskController } from "../controllers/taskController.js";
import { createTaskValidator, taskIdValidator, getAllTasksValidator, updateTaskValidator } from "../validators/taskValidators.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createTaskValidator, validateRequest, createTaskController);
router.get("/", protect, getAllTasksValidator, validateRequest, getAllTasksController);
router.get("/:id", protect, taskIdValidator, validateRequest, getTaskByIdController);
router.patch("/:id", protect, taskIdValidator, updateTaskValidator, validateRequest, updateTaskController);
router.delete("/:id", protect, taskIdValidator, validateRequest, deleteTaskController)

export default router;