import { useForm } from "react-hook-form";
import { useState, useEffect } from "react";
import Input from "../common/Input";
import Button from "../common/Button";
import { statusOptions, priorityOptions } from "../../constants/taskConstants";
import { getCategories } from "../../services/categoryService";

function TaskFilters({ onApply }) {
    const { register, handleSubmit, reset } = useForm();

    const handleClear = () => {
        reset();
        onApply({});
    }
    const [categories, setCategories] = useState([]);

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

    const onSubmit = (data) => {
        const cleaned = Object.fromEntries(
            Object.entries(data).filter(([, value]) => value !== "")
        );
        onApply(cleaned);
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-wrap items-end gap-4 bg-white p-4 rounded-lg shadow mb-6">
            <Input
                select
                id="status"
                label="Status"
                options={[{ value: "", label: "All statuses" }, ...statusOptions]}
                {...register("status")}
            />
            <Input
                select
                id="priority"
                label="Priority"
                options={[{ value: "", label: "All priorities" }, ...priorityOptions]}
                {...register("priority")}
            />
            <Input
                select
                id="category"
                label="Category"
                options={[
                    { value: "", label: "All categories" },
                    ...categories.map((cat) => ({ value: cat._id, label: cat.category })),
                ]}
                {...register("category")}
            />
            <Input
                select
                id="sortBy"
                label="Sort by"
                options={[
                    { value: "createdAt", label: "Created date" },
                    { value: "dueDate", label: "Due date" },
                    { value: "priority", label: "Priority" },
                    { value: "status", label: "Status" },
                    { value: "title", label: "Title" },
                ]}
                {...register("sortBy")}
            />
            <Input
                select
                id="order"
                label="Order"
                options={[
                    { value: "desc", label: "Descending" },
                    { value: "asc", label: "Ascending" },
                ]}
                {...register("order")}
            />
            <div className="flex gap-2">
                <Button type="submit" fullWidth={false} className="px-6">
                    Apply
                </Button>
                <Button
                    type="button"
                    fullWidth={false}
                    onClick={handleClear}
                    className="bg-gray-100! text-gray-700! hover:bg-gray-200! px-6"
                >
                    Clear
                </Button>
            </div>
        </form>
    );
}

export default TaskFilters;