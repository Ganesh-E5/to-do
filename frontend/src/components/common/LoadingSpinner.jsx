function LoadingSpinner({ size = 8, className = "" }) {
    return (
        <div className={`flex items-center justify-center py-10 ${className}`}>
            <div
                className={`animate-spin rounded-full border-4 border-gray-200 border-t-gray-900`}
                style={{ width: `${size * 4}px`, height: `${size * 4}px` }}
            />
        </div>
    );
}

export default LoadingSpinner;