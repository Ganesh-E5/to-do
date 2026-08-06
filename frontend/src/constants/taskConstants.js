export const priorityColors = {
    low: "bg-emerald-100 text-emerald-700",
    medium: "bg-amber-100 text-amber-700",
    high: "bg-rose-100 text-rose-700",
};

export const statusColors = {
    "not started": "bg-gray-100 text-gray-600",
    "in progress": "bg-blue-100 text-blue-700",
    "completed": "bg-emerald-100 text-emerald-700",
};

export const priorityOptions = [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
];

export const statusOptions = [
    { value: "not started", label: "Not Started" },
    { value: "in progress", label: "In Progress" },
    { value: "completed", label: "Completed" },
];

export const getPriorityLabel = (value) => {
    return priorityOptions.find((opt) => opt.value === value)?.label || value
}

export const getStatusLabel = (value) => {
    return statusOptions.find((opt) => opt.value === value)?.label || value
}
