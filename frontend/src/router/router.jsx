import { createBrowserRouter } from "react-router-dom";

import Layout from "../components/layout/Layout"
import ProtectedRoute from "../components/layout/ProtectedRoute"

import SignupPage from "../pages/auth/SignupPage";
import VerifyOtpPage from "../pages/auth/VerifyOtpPage";
import LoginPage from "../pages/auth/LoginPage";

import TaskListPage from "../pages/tasks/TaskListPage"
import TaskFormPage from "../pages/tasks/TaskFormPage"
import TaskDetailPage from "../pages/tasks/TaskDetailPage"

import CategoryListPage from "../pages/categories/CategoryListPage"
import CategoryFormPage from "../pages/categories/CategoryFormPage"

import ProfilePage from "../pages/settings/ProfilePage"
import ChangePasswordPage from "../pages/settings/ChangePasswordPage"

import NotFoundPage from "../pages/NotFoundPage";

const router = createBrowserRouter([
    { path: "/signup", element: <SignupPage /> },
    { path: "/verify-otp", element: <VerifyOtpPage /> },
    { path: "/login", element: <LoginPage /> },

    {
        element: (
            <ProtectedRoute>
                <Layout />
            </ProtectedRoute>
        ),
        children: [
            { path: "/", element: <TaskListPage /> },
            { path: "/tasks", element: <TaskListPage /> },
            { path: "/tasks/new", element: <TaskFormPage /> },
            { path: "/tasks/:id", element: <TaskDetailPage /> },
            { path: "/tasks/:id/edit", element: <TaskFormPage /> },

            { path: "/categories", element: <CategoryListPage /> },
            { path: "/categories/new", element: <CategoryFormPage /> },
            { path: "/categories/:id/edit", element: <CategoryFormPage /> },

            { path: "/settings/profile", element: <ProfilePage /> },
            { path: "/settings/change-password", element: <ChangePasswordPage /> },
        ]
    },

    { path: "*", element: <NotFoundPage /> }
])

export default router;