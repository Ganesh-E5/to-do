import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { Helmet } from "react-helmet-async";

import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import OtpInput from "../../components/otp/OtpInput";

import { resendOtp, verifyOtp } from "../../services/authService";

function VerifyOtpPage() {
    const navigate = useNavigate();

    const [otp, setOtp] = useState("");
    const [identifier, setIdentifier] = useState(
        sessionStorage.getItem("todo-email") || ""
    );

    const [serverError, setServerError] = useState("");
    const [resending, setResending] = useState(false);
    const [resendMessage, setResendMessage] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const onSubmit = async (e) => {
        e.preventDefault();

        setServerError("");
        setSubmitting(true);

        try {
            await verifyOtp({
                identifier,
                otp,
            });

            sessionStorage.removeItem("todo-email");

            navigate("/login");
        } catch (error) {
            if (!error.response) {
                setServerError("Unable to connect to the server.");
            } else {
                setServerError(
                    error.response?.data?.message ||
                        "Invalid OTP. Please try again."
                );
            }
        } finally {
            setSubmitting(false);
        }
    };

    const handleResendOtp = async () => {
        setResending(true);
        setServerError("");
        setResendMessage("");

        try {
            const res = await resendOtp({identifier});

            sessionStorage.setItem("todo-email", identifier);

            setResendMessage(
                res.data.message || "A new OTP has been sent to your email."
            );
        } catch (error) {
            setServerError(
                error.response?.data?.message ||
                    "Could not resend OTP. Please try again."
            );
        } finally {
            setResending(false);
        }
    };

    return (
        <>
            <Helmet>
                <title>Verify OTP | TaskFlow</title>
            </Helmet>

            <div className="bg-gray-900 min-h-screen flex items-center justify-center py-4">
                <div className="bg-white w-full max-w-md mx-4 p-8 rounded-xl shadow-xl">

                    <h1 className="text-center text-5xl font-bold">
                        To-Do
                    </h1>

                    <p className="text-center text-3xl font-bold mt-8">
                        Verify your email
                    </p>

                    <p className="text-center text-lg text-gray-500 mt-3 mb-8">
                        Enter your email and the 6-digit OTP sent to it.
                    </p>

                    <form
                        className="space-y-4"
                        onSubmit={onSubmit}
                    >

                        <Input
                            type="email"
                            id="identifier"
                            label="Email"
                            value={identifier}
                            onChange={(e) => setIdentifier(e.target.value)}
                        />

                        <OtpInput
                            otp={otp}
                            setOtp={setOtp}
                        />

                        {serverError && (
                            <p className="text-center text-sm text-red-500">
                                {serverError}
                            </p>
                        )}

                        {resendMessage && !serverError && (
                            <p className="text-center text-sm text-green-600">
                                {resendMessage}
                            </p>
                        )}

                        <div className="flex justify-end">
                            <button
                                type="button"
                                onClick={handleResendOtp}
                                disabled={
                                    resending ||
                                    !identifier.trim()
                                }
                                className="text-blue-500 hover:underline cursor-pointer disabled:text-gray-400"
                            >
                                {resending
                                    ? "Resending..."
                                    : "Resend OTP"}
                            </button>
                        </div>

                        <Button
                            type="submit"
                            disabled={
                                otp.length !== 6 ||
                                submitting ||
                                !identifier.trim()
                            }
                        >
                            {submitting
                                ? "Verifying..."
                                : "Confirm"}
                        </Button>

                        <p className="text-center mt-4 text-sm">
                            Already verified?{" "}
                            <Link
                                to="/login"
                                className="text-blue-600 hover:underline"
                            >
                                Login
                            </Link>
                        </p>

                    </form>
                </div>
            </div>
        </>
    );
}

export default VerifyOtpPage;