import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { createTask, updateTask, getTaskById } from "../../services/taskService";
import { getCategories } from "../../services/categoryService";
import { statusOptions, priorityOptions } from "../../constants/taskConstants";

function TaskFormPage() {
    const { id } = useParams();
    const isEditMode = Boolean(id);
    const navigate = useNavigate();

    const [categories, setCategories] = useState([]);
    const [serverError, setServerError] = useState("");
    const [loading, setLoading] = useState(isEditMode);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({
        defaultValues: { priority: "low", category: "" },
    });

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await getCategories();
                setCategories(res.data.categories);
            } catch (error) {
                console.error("Failed to load categories", error);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        if (!isEditMode) return;
        const fetchTask = async () => {
            try {
                const res = await getTaskById(id);
                const task = res.data.task;
                reset({
                    title: task.title,
                    description: task.description || "",
                    dueDate: task.dueDate ? task.dueDate.split("T")[0] : "",
                    priority: task.priority,
                    status: task.status,
                    category: task.category?._id || "",
                });
            } catch (error) {
                setServerError("Could not load this task.");
            } finally {
                setLoading(false);
            }
        };
        fetchTask();
    }, [id]);

    const onSubmit = async (data) => {
        setServerError("");
        try {
            if (isEditMode) {
                await updateTask(id, data);
            } else {
                await createTask(data);
            }
            navigate("/tasks");
        } catch (error) {
            setServerError(error.response?.data?.message || "Failed to save task.");
        }
    };

    if (loading) {
        return <p className="text-center text-gray-500 py-10">Loading task...</p>;
    }

    return (
        <div className="max-w-xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">
                {isEditMode ? "Edit Task" : "Create Task"}
            </h1>

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="bg-white p-8 rounded-xl shadow-xl space-y-4"
            >
                <Input
                    type="text"
                    id="title"
                    label="Title"
                    error={errors.title?.message}
                    {...register("title", { required: "Title is required" })}
                />

                <Input
                    textarea={true}
                    id="description"
                    label="Description"
                    rows={4}
                    {...register("description")}
                />

                <Input
                    type="date"
                    id="dueDate"
                    label="Due date"
                    min={new Date().toISOString().split("T")[0]}
                    error={errors.dueDate?.message}
                    {...register("dueDate", {
                        required: "Due date is required",
                        validate: (value) =>
                            value >= new Date().toISOString().split("T")[0] ||
                            "Due date cannot be before today",
                    })}
                />

                <Input
                    select
                    id="priority"
                    label="Priority"
                    options={priorityOptions}
                    {...register("priority")}
                />

                {isEditMode && (
                    <Input
                        select
                        id="status"
                        label="Status"
                        options={statusOptions}
                        {...register("status")}
                    />
                )}

                <Input
                    select
                    id="category"
                    label="Category"
                    options={[
                        { value:"", label:"No category"},
                        ...categories.map((cat) => ({
                            value: cat._id,
                            label: cat.category,
                        })),
                    ]}
                    {...register("category")}
                />

                {serverError && (
                    <p className="text-red-500 text-sm text-center">{serverError}</p>
                )}

                <div className="flex items-center gap-4 pt-2">
                    <Button
                        type="submit"
                        disabled={isSubmitting}
                        children={
                            isSubmitting
                                ? isEditMode ? "Saving..." : "Creating..."
                                : isEditMode ? "Save Changes" : "Create Task"
                        }
                    />
                    <button
                        type="button"
                        onClick={() => navigate("/tasks")}
                        className="text-sm text-gray-500 hover:text-gray-700 whitespace-nowrap cursor-pointer"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
}

export default TaskFormPage;