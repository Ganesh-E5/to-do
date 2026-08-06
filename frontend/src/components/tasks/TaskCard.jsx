import { Link } from "react-router-dom";
import { useState } from "react";
import {
    priorityColors,
    statusColors,
    statusOptions,
    getPriorityLabel,
} from "../../constants/taskConstants";
import Dot from "../common/Dot";
import Button from "../common/Button";
import { deleteTask, updateTask } from "../../services/taskService";

function TaskCard({
    id,
    title,
    dueDate,
    status,
    priority,
    category,
    onDeleted,
    onStatusChange,
}) {
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
            setServerError(
                error.response?.data?.message || "Failed to delete task."
            );
        } finally {
            setIsDeleting(false);
        }
    };

    const handleStatusChange = async (e) => {
        const newStatus = e.target.value;

        setIsUpdatingStatus(true);
        setServerError("");

        try {
            const res = await updateTask(id, { status: newStatus });
            onStatusChange?.(id, res.data.task.status);
        } catch (error) {
            setServerError(
                error.response?.data?.message || "Failed to update status."
            );
        } finally {
            setIsUpdatingStatus(false);
        }
    };

    return (
        <div
            className="bg-white shadow rounded-lg p-4 hover:shadow-md transition border-l-[10px]"
            style={{ borderLeftColor: category?.color || "#9CA3AF" }}
        >
            <div className="flex items-start justify-between gap-4">
                <Link
                    to={`/tasks/${id}`}
                    className="flex-1 min-w-0"
                >
                    <h2 className="font-medium text-lg hover:text-blue-600 transition">
                        {title}
                    </h2>

                    <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                        <span>{category ? category.category : "No category"}</span>
                        <Dot />
                        <span>{new Date(dueDate).toLocaleDateString()}</span>
                    </div>
                </Link>

                <div className="flex items-center gap-2 shrink-0">
                    <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium ${priorityColors[priority]}`}
                    >
                        {getPriorityLabel(priority)}
                    </span>

                    <Button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        fullWidth={false}
                        className="!bg-red-500 hover:!bg-red-600 px-3 py-1 text-sm"
                    >
                        {isDeleting ? "Deleting..." : "Delete"}
                    </Button>
                </div>
            </div>

            <div className="mt-3">
                <div className="relative inline-block">
                    <select
                        value={status}
                        onChange={handleStatusChange}
                        disabled={isUpdatingStatus}
                        className={`appearance-none text-xs pl-3 pr-7 py-1 rounded-full font-medium border-none outline-none cursor-pointer disabled:opacity-60 ${statusColors[status]}`}
                    >
                        {statusOptions.map((opt) => (
                            <option
                                key={opt.value}
                                value={opt.value}
                                className="bg-white text-gray-900"
                            >
                                {opt.label}
                            </option>
                        ))}
                    </select>

                    <svg
                        className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-current"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19 9l-7 7-7-7"
                        />
                    </svg>
                </div>
            </div>

            {serverError && (
                <p className="text-red-500 text-sm mt-2">{serverError}</p>
            )}
        </div>
    );
}

export default TaskCard;