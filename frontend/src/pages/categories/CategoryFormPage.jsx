import { useForm } from "react-hook-form"
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import {createCategory, getCategoryById, updateCategory} from "../../services/categoryService"

function CategoryFormPage() {
    const { id } = useParams();
    const isEditMode = Boolean(id);
    const navigate = useNavigate();

    const [serverError, setServerError] = useState("");
    const [loading, setLoading] = useState(isEditMode);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting }
    } = useForm({
        defaultValues: {
            category: "",
            color: "#64748b"
        }
    });

    useEffect(() => {
        if (!isEditMode) return;
        const fetchCategory = async () => {
            try {
                const res = await getCategoryById(id);
                const cat = res.data.category;
                reset({ category: cat.category, color: cat.color });
            } catch (error) {
                setServerError("Could not load this category.");
            } finally {
                setLoading(false);
            }
        }
    }, [id])

    const onSubmit = async (data) => {
        setServerError("");
        try {
            if (isEditMode) {
                await updateCategory(id, data);
            } else {
                await createCategory(data);
            }
            navigate("/categories");
        } catch (error) {
            setServerError(error.message?.data?.message || "Failed to Save category")
        }
    }

    return (
        <>
            <div>
                <h1  className="text-3xl font-bold mb-8">
                    { isEditMode ? "Edit Category": "New Category"}
                </h1>
                <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded-xl shadow-xl space-y-4">
                    <Input
                        type="color"
                        id="color"
                        label="Category color"
                        className="m-3 h-10 w-20 cursor-pointer rounded-full"
                        {...register("color")}
                    />
                    <Input
                        id="category"
                        label="Category name"
                        {...register("category", {
                            required: "Category name is required"
                        })}
                        error={errors.category?.message}
                    />

                    {serverError && (
                        <p className="text-red-500 text-sm text-center">{serverError}</p>
                    )}

                    <Button
                        type="submit"
                        disabled={isSubmitting}
                          children={
                            isSubmitting
                                ? isEditMode ? "Saving..." : "Creating..."
                                : isEditMode ? "Save Changes" : "Create Category"
                        }
                    />
                </form>
            </div>
        </>
    )
}

export default CategoryFormPage