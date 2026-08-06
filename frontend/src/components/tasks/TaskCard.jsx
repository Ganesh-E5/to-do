import { Link } from "react-router-dom";
import { useState } from "react";
import { priorityColors, statusColors, statusOptions, getPriorityLabel } from "../../constants/taskConstants";
import Dot from "../common/Dot";
import Button from "../common/Button";
import { deleteTask, updateTask } from "../../services/taskService";

function TaskCard({ id, title, dueDate, status, priority, category, onDeleted, onStatusChange }) {
    const [isDeleting, setIsDeleting] = useState(false);
    const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
    const [serverError, setServerError] = useState("");

    const handleDelete = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDeleting(true);
        setServerError("");
        try {
            await deleteTask(id);
            onDeleted?.(id);
        } catch (error) {
            setServerError(error.response?.data?.message || "Failed to delete task.");
        } finally {
            setIsDeleting(false);
        }
    };

    const handleStatusChange = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        const newStatus = e.target.value;
        setIsUpdatingStatus(true);
        setServerError("");
        try {
            const res = await updateTask(id, { status: newStatus });
            onStatusChange?.(id, res.data.task.status);
        } catch (error) {
            setServerError(error.response?.data?.message || "Failed to update status.");
        } finally {
            setIsUpdatingStatus(false);
        }
    };

    return (
        <Link
            to={`/tasks/${id}`}
            className="block bg-white shadow rounded-lg p-4 hover:shadow-md transition border-l-[10px]"
            style={{ borderLeftColor: category?.color || "#9CA3AF" }}
        >
            <div className="flex items-center justify-between">
                <h1 className="font-medium text-lg">{title}</h1>
                <div className="flex items-center gap-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${priorityColors[priority]}`}>
                        {getPriorityLabel(priority)}
                    </span>
                    <Button
                        onClick={handleDelete}
                        children={isDeleting ? "Deleting..." : "Delete"}
                        disabled={isDeleting}
                        fullWidth={false}
                        className="!bg-red-500 hover:!bg-red-600 px-3 py-1 text-sm"
                    />
                </div>
            </div>

            <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <div className="relative inline-block">
                        <select
                            value={status}
                            onChange={handleStatusChange}
                            onClick={(e) => e.stopPropagation()}
                            disabled={isUpdatingStatus}
                            className={`appearance-none text-xs pl-3 pr-7 py-1 rounded-full font-medium border-none outline-none cursor-pointer disabled:opacity-60 ${statusColors[status]}`}
                        >
                            {statusOptions.map((opt) => (
                                <option key={opt.value} value={opt.value} className="bg-white text-gray-900">
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                        <svg
                            className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-current"
                            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                    <Dot />
                    <span>{category ? category.category : "No category"}</span>
                </div>
                <p className="text-sm text-gray-500">{new Date(dueDate).toLocaleDateString()}</p>
            </div>

            {serverError && (
                <p className="text-red-500 text-sm mt-2">{serverError}</p>
            )}
        </Link>
    );
}

export default TaskCard;