import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getCategories } from "../../services/categoryService";
import CategoryCard from "../../components/categories/CategoryCard";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import Pagination from "../../components/common/Pagination";
import { Helmet } from "react-helmet-async";

function CategoryListPage() {
    const [categories, setCategories] = useState([]);
    const [pagination, setPagination] = useState(null);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchCategories = async () => {
            setLoading(true);
            setError("");
            try {
                const res = await getCategories({ page });
                setCategories(res.data.categories);
                setPagination(res.data.pagination);
            } catch (err) {
                setError(err.response?.data?.message || "Failed to load categories.");
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, [page]);

    if (loading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return <p className="text-center text-red-500 py-10">{error}</p>;
    }

    return (
        <>
            <Helmet>
                <title>Categories | TaskFlow</title>
            </Helmet>
            <div>
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-3xl font-bold">Categories</h1>
                    <Link
                        to="/categories/new"
                        className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition"
                    >
                        + New Category
                    </Link>
                </div>

                {categories.length === 0 ? (
                    <p className="text-gray-500">No categories yet. Create your first one!</p>
                ) : (
                    <div className="space-y-3">
                        {categories.map((category) => (
                            <CategoryCard
                                key={category._id}
                                id={category._id}
                                color={category.color}
                                category={category.category}
                                onDeleted={(deletedId) =>
                                    setCategories((prev) => prev.filter((c) => c._id !== deletedId))
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
        </>
    );
}

export default CategoryListPage;