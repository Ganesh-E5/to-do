import { useParams, useNavigate } from "react-router-dom";
import { getTaskById } from "../../services/taskService";
import { useState, useEffect } from "react";
import { priorityColors, statusColors, getPriorityLabel, getStatusLabel } from "../../constants/taskConstants";
import Dot from "../../components/common/Dot";
import Button from "../../components/common/Button";
function TaskDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [task, setTask] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    useEffect(() => {
        const fetchTask = async () => {
            setLoading(true);
            setError("");
            try {
                const response = await getTaskById(id);
                setTask(response.data.task);
            } catch (error) {
                setError(error.response?.data?.message || "Failed to load task.");
            } finally {
                setLoading(false);
            }
        };
        fetchTask();
    }, [id]);

    if (loading) {
        return <p className="text-center text-gray-500 py-10">Loading task...</p>;
    }

    if (error) {
        return <p className="text-center text-red-500 py-10">{error}</p>;
    }

    if (!task) {
        return <p className="text-center text-gray-500 py-10">Task not found.</p>;
    }

    return (
        <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-xl p-8 space-y-4 border-l-10"
            style={{borderLeftColor:task.category.color}}        
        >
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">{task.title}</h1>
                <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-gray-100 text-gray-600">
                    {getPriorityLabel(task.priority)}
                </span>
            </div>

            {task.description && (
                <p className="text-gray-600">{task.description}</p>
            )}

            <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>{getStatusLabel(task.status)}</span>
                <span>{<Dot />}</span>
                <span>{task.category ? task.category.category : "No category"}</span>
                <span>{<Dot />}</span>
                <span>Due {new Date(task.dueDate).toLocaleDateString()}</span>
            </div>
            <div className="flex gap-3 pt-4">
                <Button
                    fullWidth={false}
                    className="px-6"
                    onClick={() => navigate(`/tasks/${id}/edit`)}
                >
                    Edit
                </Button>
                <Button
                    fullWidth={false}
                    className="px-6 bg-gray-100! text-gray-700! hover:bg-gray-200!"
                    onClick={() => navigate("/tasks")}
                >
                    Back to Tasks
                </Button>
            </div>
        </div>
    );
}

export default TaskDetailPage;