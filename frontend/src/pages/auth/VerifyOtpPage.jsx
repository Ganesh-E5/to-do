import Button from "../../components/common/Button";
import OtpInput from "../../components/otp/OtpInput";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { resendOtp, verifyOtp } from "../../services/authService";

function VerifyOtpPage() {
    const [otp, setOtp] = useState("");
    const [serverError, setServerError] = useState("");
    const [resending, setResending] = useState(false);
    const [resendMessage, setResendMessage] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const navigate = useNavigate();
    const identifier = sessionStorage.getItem("todo-email");

    useEffect(() => {
        if (!identifier) {
            navigate("/signup");
        }
    }, [identifier, navigate]);

    const onSubmit = async (e) => {
        e.preventDefault();
        setServerError("");
        setSubmitting(true);
        try {
            await verifyOtp({ identifier, otp });
            sessionStorage.removeItem("todo-email");
            navigate("/login");
        } catch (error) {
            if (!error.response) {
                setServerError("Unable to connect to the server.");
            } else {
                setServerError(error.response?.data?.message || "Invalid OTP. Please try again.");
            }
        } finally {
            setSubmitting(false);
        }
    };

    const handleResendOtp = async () => {
        setResending(true);
        setResendMessage("");
        setServerError("");
        try {
            const res = await resendOtp(identifier);
            setResendMessage(res.data.message || "A new OTP has been sent to your email.");
        } catch (error) {
            setServerError(
                error.response?.data?.message || "Could not resend OTP. Please try again."
            );
        } finally {
            setResending(false);
        }
    };

    if (!identifier) {
        return null;
    }

    return (
        <div className="bg-gray-900 min-h-screen flex items-center justify-center py-4">
            <div className="bg-white w-full max-w-md mx-4 p-8 rounded-xl shadow-xl">
                <h1 className="text-center text-5xl font-bold">To-Do</h1>

                <p className="text-center text-3xl font-bold mt-8 mb-8">
                    Verify your email
                </p>
                <p className="text-center text-lg text-gray-500 mt-3">
                    Please enter the 6 digit code sent to
                </p>
                <p className="text-center text-lg text-gray-500 mb-8">
                    {identifier}
                </p>

                <form className="space-y-4" onSubmit={onSubmit}>
                    <OtpInput otp={otp} setOtp={setOtp} />

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
                            className="text-blue-500 hover:underline cursor-pointer"
                            onClick={handleResendOtp}
                            disabled={resending}
                        >
                            {resending ? "Resending..." : "Resend OTP"}
                        </button>
                    </div>

                    <Button
                        children={submitting ? "Verifying..." : "Confirm"}
                        type="submit"
                        disabled={otp.length !== 6 || submitting}
                    />
                </form>
            </div>
        </div>
    );
}

export default VerifyOtpPage;