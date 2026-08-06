import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

function NotFoundPage() {
  return (
    <>
      <Helmet>
        <title>404 | TaskFlow</title>
      </Helmet>

      <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <h1 className="text-7xl font-bold text-blue-600">404</h1>
        <h2 className="text-2xl font-semibold mt-4">Page Not Found</h2>
        <p className="text-gray-500 mt-2">
          The page you're looking for doesn't exist.
        </p>

        <Link
          to="/"
          className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Go to Dashboard
        </Link>
      </div>
    </>
  );
}

export default NotFoundPage;