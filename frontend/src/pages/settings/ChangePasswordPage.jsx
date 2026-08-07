import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import OtpInput from "../../components/otp/OtpInput";
import { requestPasswordChangeOTP, verifyPasswordChangeOTP } from "../../services/userService";
import { logout } from "../../services/authService";
import { Helmet } from "react-helmet-async";

function ChangePasswordPage() {
    const [stage, setStage] = useState("request"); // "request" | "verify"
    const [requesting, setRequesting] = useState(false);
    const [serverError, setServerError] = useState("");
    const [otp, setOtp] = useState("");
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
    } = useForm();

    const newPassword = watch("newPassword");

    const handleRequestOtp = async () => {
        setRequesting(true);
        setServerError("");
        try {
            await requestPasswordChangeOTP();
            setOtp(""); // reset in case this is a resend
            setStage("verify");
        } catch (error) {
            setServerError(error.response?.data?.message || "Failed to send OTP. Please try again.");
        } finally {
            setRequesting(false);
        }
    };

    const onSubmit = async (data) => {
        setServerError("");
        try {
            await verifyPasswordChangeOTP({ otp, newPassword: data.newPassword });
            logout();
            navigate("/login");
        } catch (error) {
            setServerError(error.response?.data?.message || "Failed to change password. Please try again.");
        }
    };

    return (
        <>
            <Helmet>
                <title>Change Password | TaskFlow</title>
            </Helmet>
            <div className="max-w-md mx-auto">
                <h1 className="text-3xl font-bold mb-8">Change Password</h1>

                <div className="bg-white p-8 rounded-xl shadow-xl space-y-4">
                    {stage === "request" ? (
                        <>
                            <p className="text-gray-600 text-sm">
                                We'll send a one-time code to your registered email to confirm this change.
                            </p>

                            {serverError && (
                                <p className="text-red-500 text-sm text-center">{serverError}</p>
                            )}

                            <Button
                                onClick={handleRequestOtp}
                                disabled={requesting}
                                children={requesting ? "Sending OTP..." : "Send OTP"}
                            />
                        </>
                    ) : (
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                            <p className="text-gray-600 text-sm">
                                Enter the 6-digit code sent to your email, along with your new password.
                            </p>

                            <OtpInput otp={otp} setOtp={setOtp} />

                            <Input
                                type="password"
                                id="newPassword"
                                label="New password"
                                error={errors.newPassword?.message}
                                {...register("newPassword", {
                                    required: "New password is required",
                                    validate: (value) =>
                                        value === value.trim() || "Password should not start or end with spaces",
                                    minLength: { value: 6, message: "Password must be at least 6 characters" },
                                })}
                            />

                            <Input
                                type="password"
                                id="confirmPassword"
                                label="Confirm new password"
                                error={errors.confirmPassword?.message}
                                {...register("confirmPassword", {
                                    required: "Please confirm your new password",
                                    validate: (value) => value === newPassword || "Passwords do not match",
                                })}
                            />

                            {serverError && (
                                <p className="text-red-500 text-sm text-center">{serverError}</p>
                            )}

                            <div className="flex items-center gap-4">
                                <Button
                                    type="submit"
                                    disabled={isSubmitting || otp.length !== 6}
                                    children={isSubmitting ? "Changing..." : "Change Password"}
                                />
                                <button
                                    type="button"
                                    onClick={handleRequestOtp}
                                    disabled={requesting}
                                    className="text-sm text-blue-600 hover:underline whitespace-nowrap cursor-pointer"
                                >
                                    {requesting ? "Resending..." : "Resend OTP"}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </>
    );
}

export default ChangePasswordPage;