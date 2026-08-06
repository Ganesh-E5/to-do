import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import Input from "../../components/common/Input";
import Button from "../../components/common/Button";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { getProfile, updateProfile } from "../../services/userService";
import { Helmet } from "react-helmet-async";

function ProfilePage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [serverError, setServerError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm();

    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            setError("");
            try {
                const response = await getProfile();
                const user = response.data.user;
                setEmail(user.email);
                reset({
                    firstName: user.firstName,
                    lastName: user.lastName || "",
                    userName: user.userName,
                    contactNumber: user.contactNumber || "",
                });
            } catch (err) {
                setError(err.response?.data?.message || "Failed to load profile.");
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, [reset]);

    const onSubmit = async (data) => {
        setServerError("");
        setSuccessMessage("");
        try {
            await updateProfile(data);
            setSuccessMessage("Profile updated successfully.");
        } catch (err) {
            setServerError(err.response?.data?.message || "Failed to update profile.");
        }
    };

    if (loading) return <LoadingSpinner />;
    if (error) return <p className="text-center text-red-500 py-10">{error}</p>;

    return (
        <>
        <Helmet>
            <title>Profile | TaskFlow</title>
        </Helmet>
        <div className="max-w-xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Profile</h1>

            <form
                onSubmit={handleSubmit(onSubmit)}
                className="bg-white p-8 rounded-xl shadow-xl space-y-4"
            >
                <div>
                    <p className="text-sm text-gray-500 mb-1">Email</p>
                    <p className="text-gray-900">{email}</p>
                </div>

                <Input
                    type="text"
                    id="firstName"
                    label="First name"
                    error={errors.firstName?.message}
                    {...register("firstName", {
                        required: "First name is required",
                        pattern: { value: /^[A-Za-z]+$/, message: "First name should contain only letters" },
                    })}
                />
                <Input
                    type="text"
                    id="lastName"
                    label="Last name"
                    error={errors.lastName?.message}
                    {...register("lastName", {
                        pattern: { value: /^[A-Za-z]+$/, message: "Last name should contain only letters" },
                    })}
                />
                <Input
                    type="text"
                    id="userName"
                    label="Username"
                    error={errors.userName?.message}
                    {...register("userName", {
                        required: "Username is required",
                        pattern: {
                            value: /^[A-Za-z0-9_]+$/,
                            message: "Username can only contain letters, numbers, and underscores",
                        },
                    })}
                />
                <Input
                    type="text"
                    id="contactNumber"
                    label="Contact number"
                    error={errors.contactNumber?.message}
                    {...register("contactNumber", {
                        pattern: { value: /^[0-9]{10}$/, message: "Contact number must be exactly 10 digits" },
                    })}
                />

                {serverError && <p className="text-red-500 text-sm text-center">{serverError}</p>}
                {successMessage && <p className="text-green-600 text-sm text-center">{successMessage}</p>}

                <Button
                    type="submit"
                    disabled={isSubmitting}
                    children={isSubmitting ? "Saving..." : "Save Changes"}
                />
            </form>

            <p className="text-center mt-6">
                <Link to="/settings/change-password" className="text-blue-600 font-medium hover:underline">
                    Change Password
                </Link>
            </p>
        </div>
        </>
    );
}

export default ProfilePage;