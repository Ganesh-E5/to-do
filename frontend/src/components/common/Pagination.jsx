function Pagination({ currentPage, totalPages, onPageChange }) {
    if (!totalPages || totalPages <= 1) return null;

    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <div className="flex items-center justify-center gap-2 mt-6">
            <button
                type="button"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1.5 rounded-md text-sm font-medium border border-gray-200
                           text-gray-600 hover:bg-gray-100 transition
                           disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent
                           cursor-pointer"
            >
                Prev
            </button>

            {pages.map((p) => (
                <button
                    key={p}
                    type="button"
                    onClick={() => onPageChange(p)}
                    className={`w-9 h-9 rounded-md text-sm font-medium transition cursor-pointer
                        ${p === currentPage
                            ? "bg-gray-900 text-white"
                            : "text-gray-600 hover:bg-gray-100"
                        }`}
                >
                    {p}
                </button>
            ))}

            <button
                type="button"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1.5 rounded-md text-sm font-medium border border-gray-200
                           text-gray-600 hover:bg-gray-100 transition
                           disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent
                           cursor-pointer"
            >
                Next
            </button>
        </div>
    );
}

export default Pagination;