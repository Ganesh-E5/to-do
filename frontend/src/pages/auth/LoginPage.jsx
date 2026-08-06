import { useForm } from "react-hook-form"
import Input from "../../components/common/Input"
import Button from "../../components/common/Button";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { login } from "../../services/authService";

function LoginPage() {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting, isValid }
    } = useForm({
        mode: "onChange"
    });

    const [serverError, setServerError] = useState("");
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        setServerError("");
        try {
            const response = await login(data);
            
            navigate("/");
        } catch (error) {
            if (!error.response) {
                setServerError("Unable to connect to the server.");
                return;
            }
            setServerError(error.response?.data?.message || "Invalid credentials. Please try again.");
        }
    };

    return (
        <div className="bg-gray-900 min-h-screen flex items-center justify-center py-4">
            <div className="bg-white w-full max-w-md mx-4 p-8 rounded-xl shadow-xl">
                <h1 className="text-center text-5xl font-bold">
                    To-Do
                </h1>

                <p className="text-center text-lg text-gray-500 mt-3 mb-8">
                    Login
                </p>

                <form
                    className="space-y-4"
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <Input
                        type="text"
                        id="identifier"
                        label="Email or Username"
                        autoComplete="username"
                        error={errors.identifier?.message}
                        {...register("identifier", {
                            required: { value: true, message: "Email or Username is required" },
                            validate: (value) => {
                                if (value.includes("@")) {
                                    return (
                                        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ||
                                        "Please enter a valid email address"
                                    );
                                }
                                return (
                                    /^[A-Za-z0-9_]+$/.test(value) ||
                                    "Username can only contain letters, numbers, and underscores"
                                );
                            }
                        })}
                    />
                    <Input
                        type="password"
                        id="password"
                        label="Password"
                        autoComplete="current-password"
                        error={errors.password?.message}
                        {...register("password", {
                            required: { value: true, message: "Password is required" },
                        })}
                    />

                    {serverError && (
                        <p className="text-center text-sm text-red-500">
                            {serverError}
                        </p>
                    )}

                    <div className="flex justify-end">
                        <Link
                            to="/forgot-password"
                            className="text-sm text-blue-600 hover:underline"
                        >
                            Forgot Password?
                        </Link>
                    </div>

                    <div className="flex justify-center mt-10">
                        <Button
                            type="submit"
                            disabled={!isValid || isSubmitting}
                        >
                            {isSubmitting ? "Logging in..." : "Login"}
                        </Button>
                    </div>

                    <p className="text-center mt-6 text-sm">
                        Don't have an account?{" "}
                        <Link className="text-blue-600 font-medium hover:text-blue-700 hover:underline" to="/signup">Sign Up</Link>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default LoginPage;