import { Head, usePage } from "@inertiajs/react";
import { useState } from "react";
import AdminSidebar from "./sidebar";
import AdminHeader from "./header";

export default function Profile({ auth }) {
    const user = auth?.user;
    const { errors } = usePage().props;

    const [isEditing, setIsEditing] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [previewImage, setPreviewImage] = useState(null);

    const [formData, setFormData] = useState({
        name: user?.name || "",
        email: user?.email || "",
        phone: user?.phone || "",
        address: user?.address || "",
        farm_location: user?.farm_location || "",
        farm_description: user?.farm_description || "",
        profile_image: null,
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData((prev) => ({
                ...prev,
                profile_image: file,
            }));
            // Create preview URL
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSuccessMessage("");

        const form = new FormData();
        form.append("name", formData.name);
        form.append("email", formData.email);
        form.append("phone", formData.phone || "");
        form.append("address", formData.address || "");
        form.append("farm_location", formData.farm_location || "");
        form.append("farm_description", formData.farm_description || "");
        if (formData.profile_image) {
            form.append("profile_image", formData.profile_image);
        }
        form.append("_method", "PATCH");

        try {
            const response = await fetch("/profile", {
                method: "POST",
                headers: {
                    "X-CSRF-TOKEN": document.querySelector(
                        'meta[name="csrf-token"]',
                    )?.content,
                },
                body: form,
            });

            if (response.ok) {
                setSuccessMessage("Profile updated successfully!");
                setIsEditing(false);
                setPreviewImage(null);
                // Reset form with new data from response or keep current
                window.location.reload();
            } else {
                const data = await response.json();
                console.error("Update failed:", data);
            }
        } catch (error) {
            console.error("Error updating profile:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        setFormData({
            name: user?.name || "",
            email: user?.email || "",
            phone: user?.phone || "",
            address: user?.address || "",
            farm_location: user?.farm_location || "",
            farm_description: user?.farm_description || "",
            profile_image: null,
        });
        setPreviewImage(null);
        setIsEditing(false);
        setSuccessMessage("");
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <AdminSidebar />
            <div className="flex-1 flex flex-col">
                <AdminHeader user={user} />
                <main className="flex-1 p-8 overflow-y-auto">
                    <Head title="Profile - Admin" />
                    <div className="mb-8 flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-semibold text-gray-900">
                                My Profile
                            </h1>
                            <p className="text-sm text-gray-600 mt-1">
                                Manage your profile
                            </p>
                        </div>
                        {!isEditing && (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="px-4 py-2 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
                            >
                                Edit Profile
                            </button>
                        )}
                    </div>

                    {/* Success Message */}
                    {successMessage && (
                        <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                            {successMessage}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        {/* Profile Information */}
                        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-semibold text-gray-900">
                                    Profile Information
                                </h2>
                            </div>

                            {/* Profile Image */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-500 mb-2">
                                    Profile Photo
                                </label>
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <img
                                            src={
                                                previewImage ||
                                                user?.profile_image ||
                                                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                                    user?.name || "User",
                                                )}&background=random`
                                            }
                                            alt="Profile"
                                            className="w-20 h-20 rounded-full object-cover border-2 border-gray-200"
                                        />
                                        {isEditing && (
                                            <label
                                                htmlFor="profile_image"
                                                className="absolute bottom-0 right-0 bg-green-600 text-white p-1.5 rounded-full cursor-pointer hover:bg-green-700"
                                            >
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    className="h-4 w-4"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                                                    />
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                                                    />
                                                </svg>
                                            </label>
                                        )}
                                    </div>
                                    {isEditing && (
                                        <input
                                            type="file"
                                            id="profile_image"
                                            name="profile_image"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="hidden"
                                        />
                                    )}
                                    <div className="text-sm text-gray-500">
                                        <p>
                                            Click the camera icon to upload a
                                            new photo
                                        </p>
                                        <p>
                                            Supported: JPG, PNG, GIF, WebP (max
                                            2MB)
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Name */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">
                                        Full Name
                                    </label>
                                    {isEditing ? (
                                        <div>
                                            <input
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                                required
                                            />
                                            {errors?.name && (
                                                <p className="mt-1 text-sm text-red-600">
                                                    {errors.name}
                                                </p>
                                            )}
                                        </div>
                                    ) : (
                                        <p className="text-gray-900">
                                            {user?.name || "-"}
                                        </p>
                                    )}
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">
                                        Email Address
                                    </label>
                                    {isEditing ? (
                                        <div>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                                required
                                            />
                                            {errors?.email && (
                                                <p className="mt-1 text-sm text-red-600">
                                                    {errors.email}
                                                </p>
                                            )}
                                        </div>
                                    ) : (
                                        <p className="text-gray-900">
                                            {user?.email || "-"}
                                        </p>
                                    )}
                                </div>

                                {/* Phone */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">
                                        Phone Number
                                    </label>
                                    {isEditing ? (
                                        <div>
                                            <input
                                                type="text"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleInputChange}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                                placeholder="Enter phone number"
                                            />
                                            {errors?.phone && (
                                                <p className="mt-1 text-sm text-red-600">
                                                    {errors.phone}
                                                </p>
                                            )}
                                        </div>
                                    ) : (
                                        <p className="text-gray-900">
                                            {user?.phone || "-"}
                                        </p>
                                    )}
                                </div>

                                {/* Role */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">
                                        Role
                                    </label>
                                    <span
                                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                            user?.role === "admin" ||
                                            user?.role === "super_admin"
                                                ? "bg-purple-100 text-purple-800"
                                                : user?.role === "farmer"
                                                  ? "bg-green-100 text-green-800"
                                                  : user?.role === "logistics"
                                                    ? "bg-blue-100 text-blue-800"
                                                    : "bg-gray-100 text-gray-800"
                                        }`}
                                    >
                                        {user?.role || "buyer"}
                                    </span>
                                </div>

                                {/* Address */}
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-500 mb-1">
                                        Address
                                    </label>
                                    {isEditing ? (
                                        <div>
                                            <textarea
                                                name="address"
                                                value={formData.address}
                                                onChange={handleInputChange}
                                                rows={3}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                                placeholder="Enter your address"
                                            />
                                            {errors?.address && (
                                                <p className="mt-1 text-sm text-red-600">
                                                    {errors.address}
                                                </p>
                                            )}
                                        </div>
                                    ) : (
                                        <p className="text-gray-900">
                                            {user?.address || "-"}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Farm Details (for farmers) */}
                        {user?.role === "farmer" && (
                            <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                                <h2 className="text-lg font-semibold text-gray-900 mb-6">
                                    Farm Information
                                </h2>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Farm Location */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-500 mb-1">
                                            Farm Location
                                        </label>
                                        {isEditing ? (
                                            <div>
                                                <input
                                                    type="text"
                                                    name="farm_location"
                                                    value={
                                                        formData.farm_location
                                                    }
                                                    onChange={handleInputChange}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                                    placeholder="Enter farm location"
                                                />
                                                {errors?.farm_location && (
                                                    <p className="mt-1 text-sm text-red-600">
                                                        {errors.farm_location}
                                                    </p>
                                                )}
                                            </div>
                                        ) : (
                                            <p className="text-gray-900">
                                                {user?.farm_location || "-"}
                                            </p>
                                        )}
                                    </div>

                                    {/* Farm Description */}
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-gray-500 mb-1">
                                            Farm Description
                                        </label>
                                        {isEditing ? (
                                            <div>
                                                <textarea
                                                    name="farm_description"
                                                    value={
                                                        formData.farm_description
                                                    }
                                                    onChange={handleInputChange}
                                                    rows={4}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                                    placeholder="Describe your farm"
                                                />
                                                {errors?.farm_description && (
                                                    <p className="mt-1 text-sm text-red-600">
                                                        {
                                                            errors.farm_description
                                                        }
                                                    </p>
                                                )}
                                            </div>
                                        ) : (
                                            <p className="text-gray-900">
                                                {user?.farm_description || "-"}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Edit Mode Buttons */}
                        {isEditing && (
                            <div className="flex justify-end gap-4 mb-6">
                                <button
                                    type="button"
                                    onClick={handleCancel}
                                    className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-green-400"
                                >
                                    {isSubmitting
                                        ? "Saving..."
                                        : "Save Changes"}
                                </button>
                            </div>
                        )}
                    </form>

                    {/* Account Status */}
                    {!isEditing && (
                        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-6">
                                Account Status
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Email Verified */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">
                                        Email Verification
                                    </label>
                                    {user?.email_verified_at ? (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            <svg
                                                className="mr-1.5 h-2 w-2 text-green-400"
                                                fill="currentColor"
                                                viewBox="0 0 8 8"
                                            >
                                                <circle cx="4" cy="4" r="3" />
                                            </svg>
                                            Verified
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                            Unverified
                                        </span>
                                    )}
                                </div>

                                {/* Account Status */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">
                                        Account Status
                                    </label>
                                    {user?.is_approved ? (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            Approved
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                            Pending Approval
                                        </span>
                                    )}
                                </div>

                                {/* 2FA Status */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">
                                        Two-Factor Authentication
                                    </label>
                                    {user?.two_factor_enabled ? (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            Enabled
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                            Disabled
                                        </span>
                                    )}
                                </div>

                                {/* Member Since */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-500 mb-1">
                                        Member Since
                                    </label>
                                    <p className="text-gray-900">
                                        {user?.created_at
                                            ? new Date(
                                                  user.created_at,
                                              ).toLocaleDateString("en-US", {
                                                  year: "numeric",
                                                  month: "long",
                                                  day: "numeric",
                                              })
                                            : "-"}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Security Section */}
                    {!isEditing && (
                        <div className="bg-white border border-gray-200 rounded-lg p-6">
                            <h2 className="text-lg font-semibold text-gray-900 mb-6">
                                Security
                            </h2>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">
                                            Change Password
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            Update your account password
                                        </p>
                                    </div>
                                    <button className="text-sm text-green-600 hover:text-green-900 font-medium">
                                        Change
                                    </button>
                                </div>

                                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">
                                            Two-Factor Authentication
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            Add an extra layer of security to
                                            your account
                                        </p>
                                    </div>
                                    <button className="text-sm text-green-600 hover:text-green-900 font-medium">
                                        {user?.two_factor_enabled
                                            ? "Manage"
                                            : "Enable"}
                                    </button>
                                </div>

                                <div className="flex items-center justify-between py-3">
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">
                                            Active Sessions
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            Manage your active sessions
                                        </p>
                                    </div>
                                    <button className="text-sm text-green-600 hover:text-green-900 font-medium">
                                        View
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
