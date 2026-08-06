import { Link } from "react-router-dom";
import Button from "../common/Button";
import { deleteCategory } from "../../services/categoryService";
import { useState } from "react";

function CategoryCard({ id, color, category, onDeleted }) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [serverError, setServerError] = useState("");

    const onSubmit = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsSubmitting(true);
        setServerError("");
        try {
            await deleteCategory(id);
            onDeleted?.(id);
        } catch (error) {
            setServerError(error.response?.data?.message || "Failed to delete category.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Link
            to={`/categories/${id}/edit`}
            className="block bg-white shadow rounded-lg p-4 hover:shadow-md transition border-l-[10px]"
            style={{ borderLeftColor: color }}
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <span className="w-10 h-10 rounded-full" style={{ backgroundColor: color }}></span>
                    <h1 className="font-medium text-lg">{category}</h1>
                </div>
                <Button
                    onClick={onSubmit}
                    children={isSubmitting ? "Deleting..." : "Delete"}
                    disabled={isSubmitting}
                    fullWidth={false}
                    className="bg-red-500! hover:bg-red-600! px-4"
                />
            </div>
            {serverError && (
                <p className="text-red-500 text-sm mt-2">{serverError}</p>
            )}
        </Link>
    );
}

export default CategoryCard;