import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getTasks } from "../../services/taskService";
import TaskCard from "../../components/tasks/TaskCard";
import TaskFilters from "../../components/tasks/TaskFilters";
import Pagination from "../../components/common/Pagination";
import LoadingSpinner from "../../components/common/LoadingSpinner";

function TaskListPage() {
    const [tasks, setTasks] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [page, setPage] = useState(1);
    const [filters, setFilters] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchTasks = async () => {
            setLoading(true);
            setError("");
            try {
                const res = await getTasks({ page, ...filters });
                setTasks(res.data.tasks);
                setPagination(res.data.pagination);
            } catch (err) {
                setError(err.response?.data?.message || "Failed to load tasks.");
            } finally {
                setLoading(false);
            }
        };
        fetchTasks();
    }, [page, filters]);

    const handleApplyFilters = (newFilters) => {
        setFilters(newFilters);
        setPage(1); // reset pagination when filters change
    };

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold">Tasks</h1>
                <Link
                    to="/tasks/new"
                    className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
                >
                    + New Task
                </Link>
            </div>

            <TaskFilters onApply={handleApplyFilters} />

            {loading ? (
                <LoadingSpinner />
            ) : error ? (
                <p className="text-center text-red-500 py-10">{error}</p>
            ) : tasks.length === 0 ? (
                <p className="text-gray-500">No tasks match your filters.</p>
            ) : (
                <div className="space-y-3">
                    {tasks.map((task) => (
                        <TaskCard
                            key={task._id}
                            id={task._id}
                            title={task.title}
                            dueDate={task.dueDate}
                            status={task.status}
                            priority={task.priority}
                            category={task.category}
                            onDeleted={(deletedId) =>
                                setTasks((prev) => prev.filter((t) => t._id !== deletedId))
                            }
                            onStatusChange={(taskId, newStatus) =>
                                setTasks((prev) =>
                                    prev.map((t) => (t._id === taskId ? { ...t, status: newStatus } : t))
                                )
                            }
                        />
                    ))}
                </div>
            )}

            <Pagination
                currentPage={pagination?.currentPage}
                totalPages={pagination?.totalPages}
                onPageChange={setPage}
            />
        </div>
    );
}

export default TaskListPage;