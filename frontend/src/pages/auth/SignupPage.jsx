import axios from "axios"
import { useState } from "react";
import { useForm } from "react-hook-form"
import Input from "../../components/common/Input"
import Button from "../../components/common/Button";
import { Link, useNavigate } from "react-router-dom";
import { signup } from "../../services/authService";
function SignupPage() {
    const {
        register,
        handleSubmit,
        watch,
        setError,
        clearErrors,
        formState: { errors, isSubmitting, isValid }
    } = useForm({
        mode: "onChange"
    });

    const [serverError, setServerError] = useState("");

    let navigate = useNavigate();
    const password = watch("password")
    const onSubmit = async (data) => {
        clearErrors();
        setServerError("");
        try {
            const response = await signup(data);
            sessionStorage.setItem("todo-email", response.data.email);

            navigate("/verify-otp");

        } catch (error) {
            if (!error.response) {
                alert("Unable to connect to the server.");
                return;
            }

            const response = error.response?.data;

            switch (response?.code) {

                case "USERNAME_EXISTS":
                    setError("userName", {
                        type: "server",
                        message: response.message
                    });
                    break;

                case "EMAIL_EXISTS":
                    setError("email", {
                        type: "server",
                        message: response.message
                    });
                    break;

                case "VERIFICATION_PENDING":
                    setServerError(response.message);
                    break;

                case "EMAIL_SEND_FAILED":
                    setServerError(response.message);
                    break;

                case "VALIDATION_ERROR":
                    response.errors.forEach((err) => {
                        setError(err.field, {
                            type: "server",
                            message: err.message,
                        });
                    });
                    break;

                default:
                    alert("Something went wrong. Please try again.");
            }
        }
    };
    return (
        <>
            <div className="bg-gray-900 min-h-screen  flex items-center justify-center py-4">
                <div className="bg-white w-full max-w-md mx-4 p-8 rounded-xl shadow-xl">
                    <h1 className="text-center text-5xl font-bold">
                        To-Do
                    </h1>

                    <p className="text-center text-lg text-gray-500 mt-3 mb-8">
                        Create your account
                    </p>
                    <form
                        className="space-y-4"
                        onSubmit={handleSubmit(onSubmit)}
                    >
                        <Input type="text" id="firstName" label="First name" error={errors.firstName?.message} {...register("firstName", {
                            required: { value: true, message: "First name is required" },
                            pattern: { value: /^[A-Za-z]+$/, message: "First name should contain only letters" }
                        })} />
                        <Input type="text" id="lastName" label="Last name" error={errors.lastName?.message} {...register("lastName", {
                            pattern: { value: /^[A-Za-z]+$/, message: "Last name should contain only letters" }
                        })} />
                        <Input type="text" id="userName" label="Username" error={errors.userName?.message} {...register("userName", {
                            required: { value: true, message: "Username is required" },
                            pattern: { value: /^[A-Za-z0-9_]+$/, message: "Username can only contain letters, numbers, and underscores" }
                        })} />
                        <Input type="text" id="contactNumber" label="Contact Number" error={errors.contactNumber?.message} {...register("contactNumber", {
                            pattern: { value: /^[0-9]{10}$/, message: "Contact number must be exactly 10 digits" }
                        })} />
                        <Input type="email" id="email" label="Email" error={errors.email?.message} {...register("email", {
                            required: { value: true, message: "Email is required" },
                            pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Please enter a valid email address" }
                        })} />
                        <Input type="password" id="password" label="Password" error={errors.password?.message} {...register("password", {
                            required: { value: true, message: "Password is required" },
                            validate: (value) =>
                                value === value.trim() ||
                                "Password should not start or end with spaces",
                            minLength: { value: 6, message: "Password must be at least 6 characters" },
                        })} />
                        <Input type="password" id="confirmPassword" label="Confirm password" error={errors.confirmPassword?.message} {...register("confirmPassword", {
                            required: { value: true, message: "Confirm Password is required" },
                            validate: (value) =>
                                value === password || "Passwords do not match",
                        })} />
                        {serverError && (
                            <p className="text-red-500 text-center">
                                {serverError}
                            </p>
                        )}
                        <div className="flex justify-center mt-10">
                            <Button
                                type="submit"
                                disabled={!isValid || isSubmitting}
                                children={isSubmitting ? "Signing Up..." : "Sign Up"}
                            />
                        </div>
                        <p className="text-center mt-6 text-sm">
                            Already have an account?{" "}
                            <Link className="text-blue-600 font-medium hover:text-blue-700 hover:underline" to="/login">Login</Link>
                        </p>
                    </form>
                </div>
            </div>
        </>
    )
}

export default SignupPage