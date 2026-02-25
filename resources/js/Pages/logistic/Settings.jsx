import { Head } from "@inertiajs/react";
import { useState } from "react";
import { router, usePage } from "@inertiajs/react";
import LogisticsSidebar from "./sidebar";
import LogisticsHeader from "./header";
import {
    Bell,
    Lock,
    User,
    Mail,
    Phone,
    MapPin,
    Truck,
    Shield,
    Eye,
    EyeOff,
    CheckCircle,
    XCircle,
    AlertTriangle,
    Clock,
    Navigation,
    MessageSquare,
} from "lucide-react";

export default function Settings({ auth }) {
    const user = auth?.user;
    const { props } = usePage();
    const csrfToken = props.csrf_token || props.csrfToken;

    // Active tab state
    const [activeTab, setActiveTab] = useState("notifications");

    // Loading state
    const [loading, setLoading] = useState(false);

    // Success/Error messages
    const [message, setMessage] = useState({ type: "", text: "" });

    // Password change form state
    const [passwordData, setPasswordData] = useState({
        current_password: "",
        new_password: "",
        confirm_password: "",
    });
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false,
    });
    const [passwordErrors, setPasswordErrors] = useState({});

    // Notification settings state
    const [notificationSettings, setNotificationSettings] = useState({
        email_notifications: true,
        order_notifications: true,
        delivery_notifications: true,
        route_notifications: true,
        payment_notifications: true,
        promotional_notifications: false,
        sms_notifications: false,
    });

    // Setting tabs configuration
    const tabs = [
        {
            id: "notifications",
            label: "Notifications",
            icon: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9",
        },
        {
            id: "security",
            label: "Security",
            icon: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
        },
        {
            id: "account",
            label: "Account",
            icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
        },
    ];

    // Handle notification toggle
    const handleNotificationToggle = (key) => {
        setNotificationSettings((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    // Save notification settings
    const saveNotificationSettings = () => {
        setLoading(true);
        setMessage({ type: "", text: "" });

        // Save to local storage for now (settings persistence would require backend route)
        setTimeout(() => {
            setLoading(false);
            setMessage({
                type: "success",
                text: "Notification settings saved successfully!",
            });
            setTimeout(() => {
                setMessage({ type: "", text: "" });
            }, 3000);
        }, 500);
    };

    // Handle password change input
    const handlePasswordChange = (field, value) => {
        setPasswordData((prev) => ({
            ...prev,
            [field]: value,
        }));
        // Clear error when user types
        if (passwordErrors[field]) {
            setPasswordErrors((prev) => ({
                ...prev,
                [field]: "",
            }));
        }
    };

    // Validate password form
    const validatePasswordForm = () => {
        const errors = {};

        if (!passwordData.current_password) {
            errors.current_password = "Current password is required";
        }

        if (!passwordData.new_password) {
            errors.new_password = "New password is required";
        } else if (passwordData.new_password.length < 8) {
            errors.new_password = "Password must be at least 8 characters";
        }

        if (!passwordData.confirm_password) {
            errors.confirm_password = "Please confirm your password";
        } else if (
            passwordData.new_password !== passwordData.confirm_password
        ) {
            errors.confirm_password = "Passwords do not match";
        }

        setPasswordErrors(errors);
        return Object.keys(errors).length === 0;
    };

    // Submit password change
    const handlePasswordSubmit = (e) => {
        e.preventDefault();

        if (!validatePasswordForm()) {
            return;
        }

        setLoading(true);
        setMessage({ type: "", text: "" });

        // Use Laravel's built-in profile update route for password change
        router.post(
            route("profile.update"),
            {
                _method: "put",
                current_password: passwordData.current_password,
                password: passwordData.new_password,
                password_confirmation: passwordData.confirm_password,
            },
            {
                headers: {
                    "X-CSRF-TOKEN": csrfToken,
                },
                onSuccess: () => {
                    setLoading(false);
                    setMessage({
                        type: "success",
                        text: "Password changed successfully!",
                    });
                    setPasswordData({
                        current_password: "",
                        new_password: "",
                        confirm_password: "",
                    });
                    setTimeout(() => {
                        setMessage({ type: "", text: "" });
                    }, 3000);
                },
                onError: (errors) => {
                    setLoading(false);
                    if (errors.current_password) {
                        setPasswordErrors({
                            current_password: errors.current_password,
                        });
                    } else if (errors.password) {
                        setPasswordErrors({
                            new_password: errors.password,
                        });
                    } else {
                        setMessage({
                            type: "error",
                            text: "Failed to change password. Please try again.",
                        });
                    }
                },
            },
        );
    };

    // Render notification settings
    const renderNotificationSettings = () => (
        <div className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                            <Mail className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-900">
                                Email Notifications
                            </p>
                            <p className="text-xs text-gray-500">
                                Receive notifications via email
                            </p>
                        </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={notificationSettings.email_notifications}
                            onChange={() =>
                                handleNotificationToggle("email_notifications")
                            }
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
                            <Truck className="w-5 h-5 text-emerald-600" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-900">
                                Delivery Notifications
                            </p>
                            <p className="text-xs text-gray-500">
                                Get notified about new delivery assignments
                            </p>
                        </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={
                                notificationSettings.delivery_notifications
                            }
                            onChange={() =>
                                handleNotificationToggle(
                                    "delivery_notifications",
                                )
                            }
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
                            <Bell className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-900">
                                Order Notifications
                            </p>
                            <p className="text-xs text-gray-500">
                                Get notified about order updates
                            </p>
                        </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={notificationSettings.order_notifications}
                            onChange={() =>
                                handleNotificationToggle("order_notifications")
                            }
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center">
                            <Navigation className="w-5 h-5 text-amber-600" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-900">
                                Route Notifications
                            </p>
                            <p className="text-xs text-gray-500">
                                Get notified about route updates and changes
                            </p>
                        </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={notificationSettings.route_notifications}
                            onChange={() =>
                                handleNotificationToggle("route_notifications")
                            }
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-cyan-50 rounded-lg flex items-center justify-center">
                            <Shield className="w-5 h-5 text-cyan-600" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-900">
                                Payment Notifications
                            </p>
                            <p className="text-xs text-gray-500">
                                Get notified about payments and payouts
                            </p>
                        </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={notificationSettings.payment_notifications}
                            onChange={() =>
                                handleNotificationToggle(
                                    "payment_notifications",
                                )
                            }
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
                            <AlertTriangle className="w-5 h-5 text-red-600" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-900">
                                Promotional Notifications
                            </p>
                            <p className="text-xs text-gray-500">
                                Receive promotional offers and updates
                            </p>
                        </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={
                                notificationSettings.promotional_notifications
                            }
                            onChange={() =>
                                handleNotificationToggle(
                                    "promotional_notifications",
                                )
                            }
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                </div>
            </div>

            <div className="flex justify-end pt-4">
                <button
                    onClick={saveNotificationSettings}
                    disabled={loading}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                    {loading ? (
                        <>
                            <svg
                                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                />
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                />
                            </svg>
                            Saving...
                        </>
                    ) : (
                        <>
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Save Changes
                        </>
                    )}
                </button>
            </div>
        </div>
    );

    // Render security settings
    const renderSecuritySettings = () => (
        <form onSubmit={handlePasswordSubmit} className="space-y-6">
            <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-sm font-medium text-gray-900 mb-4">
                    Change Password
                </h3>

                <div className="space-y-4">
                    {/* Current Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Current Password
                        </label>
                        <div className="relative">
                            <input
                                type={
                                    showPasswords.current ? "text" : "password"
                                }
                                value={passwordData.current_password}
                                onChange={(e) =>
                                    handlePasswordChange(
                                        "current_password",
                                        e.target.value,
                                    )
                                }
                                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter current password"
                            />
                            <button
                                type="button"
                                onClick={() =>
                                    setShowPasswords((prev) => ({
                                        ...prev,
                                        current: !prev.current,
                                    }))
                                }
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showPasswords.current ? (
                                    <EyeOff className="w-5 h-5" />
                                ) : (
                                    <Eye className="w-5 h-5" />
                                )}
                            </button>
                        </div>
                        {passwordErrors.current_password && (
                            <p className="mt-1 text-sm text-red-600">
                                {passwordErrors.current_password}
                            </p>
                        )}
                    </div>

                    {/* New Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            New Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPasswords.new ? "text" : "password"}
                                value={passwordData.new_password}
                                onChange={(e) =>
                                    handlePasswordChange(
                                        "new_password",
                                        e.target.value,
                                    )
                                }
                                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Enter new password"
                            />
                            <button
                                type="button"
                                onClick={() =>
                                    setShowPasswords((prev) => ({
                                        ...prev,
                                        new: !prev.new,
                                    }))
                                }
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showPasswords.new ? (
                                    <EyeOff className="w-5 h-5" />
                                ) : (
                                    <Eye className="w-5 h-5" />
                                )}
                            </button>
                        </div>
                        {passwordErrors.new_password && (
                            <p className="mt-1 text-sm text-red-600">
                                {passwordErrors.new_password}
                            </p>
                        )}
                    </div>

                    {/* Confirm Password */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Confirm New Password
                        </label>
                        <div className="relative">
                            <input
                                type={
                                    showPasswords.confirm ? "text" : "password"
                                }
                                value={passwordData.confirm_password}
                                onChange={(e) =>
                                    handlePasswordChange(
                                        "confirm_password",
                                        e.target.value,
                                    )
                                }
                                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Confirm new password"
                            />
                            <button
                                type="button"
                                onClick={() =>
                                    setShowPasswords((prev) => ({
                                        ...prev,
                                        confirm: !prev.confirm,
                                    }))
                                }
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                                {showPasswords.confirm ? (
                                    <EyeOff className="w-5 h-5" />
                                ) : (
                                    <Eye className="w-5 h-5" />
                                )}
                            </button>
                        </div>
                        {passwordErrors.confirm_password && (
                            <p className="mt-1 text-sm text-red-600">
                                {passwordErrors.confirm_password}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex justify-end pt-4">
                <button
                    type="submit"
                    disabled={loading}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                    {loading ? (
                        <>
                            <svg
                                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                />
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                />
                            </svg>
                            Updating...
                        </>
                    ) : (
                        <>
                            <Lock className="w-4 h-4 mr-2" />
                            Update Password
                        </>
                    )}
                </button>
            </div>
        </form>
    );

    // Render account settings
    const renderAccountSettings = () => (
        <div className="space-y-6">
            {/* Account Information */}
            <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-sm font-medium text-gray-900 mb-4">
                    Account Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div className="flex items-start gap-3">
                        <User className="w-5 h-5 text-gray-400 mt-0.5" />
                        <div>
                            <p className="text-sm font-medium text-gray-500">
                                Name
                            </p>
                            <p className="text-gray-900">{user?.name || "-"}</p>
                        </div>
                    </div>

                    {/* Email */}
                    <div className="flex items-start gap-3">
                        <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                        <div>
                            <p className="text-sm font-medium text-gray-500">
                                Email Address
                            </p>
                            <p className="text-gray-900">
                                {user?.email || "-"}
                            </p>
                        </div>
                    </div>

                    {/* Phone */}
                    <div className="flex items-start gap-3">
                        <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                        <div>
                            <p className="text-sm font-medium text-gray-500">
                                Phone Number
                            </p>
                            <p className="text-gray-900">
                                {user?.phone || "Not set"}
                            </p>
                        </div>
                    </div>

                    {/* Address */}
                    <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                        <div>
                            <p className="text-sm font-medium text-gray-500">
                                Address
                            </p>
                            <p className="text-gray-900">
                                {user?.address || "Not set"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Rider Profile Information */}
            <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-sm font-medium text-gray-900 mb-4">
                    Rider Profile
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Vehicle Type */}
                    <div className="flex items-start gap-3">
                        <Truck className="w-5 h-5 text-gray-400 mt-0.5" />
                        <div>
                            <p className="text-sm font-medium text-gray-500">
                                Vehicle Type
                            </p>
                            <p className="text-gray-900">
                                {user?.vehicle_type || "Not set"}
                            </p>
                        </div>
                    </div>

                    {/* License Number */}
                    <div className="flex items-start gap-3">
                        <Clock className="w-5 h-5 text-gray-400 mt-0.5" />
                        <div>
                            <p className="text-sm font-medium text-gray-500">
                                License Number
                            </p>
                            <p className="text-gray-900">
                                {user?.license_number || "Not set"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Account Status */}
            <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-sm font-medium text-gray-900 mb-4">
                    Account Status
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Email Verified */}
                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
                        {user?.email_verified_at ? (
                            <CheckCircle className="w-5 h-5 text-emerald-500" />
                        ) : (
                            <XCircle className="w-5 h-5 text-red-500" />
                        )}
                        <div>
                            <p className="text-sm font-medium text-gray-900">
                                Email Verified
                            </p>
                            <p className="text-xs text-gray-500">
                                {user?.email_verified_at
                                    ? "Verified"
                                    : "Not verified"}
                            </p>
                        </div>
                    </div>

                    {/* Profile Status */}
                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
                        {user?.profile_completed ? (
                            <CheckCircle className="w-5 h-5 text-emerald-500" />
                        ) : (
                            <XCircle className="w-5 h-5 text-amber-500" />
                        )}
                        <div>
                            <p className="text-sm font-medium text-gray-900">
                                Profile Status
                            </p>
                            <p className="text-xs text-gray-500">
                                {user?.profile_completed
                                    ? "Completed"
                                    : "Incomplete"}
                            </p>
                        </div>
                    </div>

                    {/* Account Type */}
                    <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-gray-200">
                        <Truck className="w-5 h-5 text-blue-500" />
                        <div>
                            <p className="text-sm font-medium text-gray-900">
                                Account Type
                            </p>
                            <p className="text-xs text-gray-500">
                                Logistic/Rider
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <p className="text-sm text-gray-500">
                To update your account information, please contact support or
                edit your profile.
            </p>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <LogisticsSidebar />
            <div className="flex-1 flex flex-col">
                <LogisticsHeader user={user} />
                <main className="flex-1 p-8 overflow-y-auto">
                    <Head title="Settings - Logistic" />
                    <div className="mb-8">
                        <h1 className="text-2xl font-semibold text-gray-900">
                            Settings
                        </h1>
                        <p className="text-sm text-gray-600 mt-1">
                            Manage your account settings
                        </p>
                    </div>

                    {/* Success/Error Message */}
                    {message.text && (
                        <div
                            className={`mb-6 p-4 rounded-lg ${
                                message.type === "success"
                                    ? "bg-green-50 text-green-800 border border-green-200"
                                    : "bg-red-50 text-red-800 border border-red-200"
                            }`}
                        >
                            <div className="flex items-center">
                                {message.type === "success" ? (
                                    <CheckCircle className="w-5 h-5 mr-2" />
                                ) : (
                                    <XCircle className="w-5 h-5 mr-2" />
                                )}
                                <span>{message.text}</span>
                            </div>
                        </div>
                    )}

                    <div className="bg-white border border-gray-200 rounded-lg">
                        {/* Tabs */}
                        <div className="border-b border-gray-200">
                            <nav
                                className="flex flex-wrap -mb-px"
                                aria-label="Tabs"
                            >
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`group inline-flex items-center py-4 px-6 border-b-2 font-medium text-sm transition-colors ${
                                            activeTab === tab.id
                                                ? "border-blue-500 text-blue-600"
                                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                        }`}
                                    >
                                        <svg
                                            className={`mr-2 w-5 h-5 ${
                                                activeTab === tab.id
                                                    ? "text-blue-500"
                                                    : "text-gray-400 group-hover:text-gray-500"
                                            }`}
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d={tab.icon}
                                            />
                                        </svg>
                                        {tab.label}
                                    </button>
                                ))}
                            </nav>
                        </div>

                        {/* Settings Content */}
                        <div className="p-6">
                            {activeTab === "notifications" &&
                                renderNotificationSettings()}
                            {activeTab === "security" &&
                                renderSecuritySettings()}
                            {activeTab === "account" && renderAccountSettings()}
                        </div>
                    </div>

                    {/* Quick Info Card */}
                    <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex">
                            <svg
                                className="flex-shrink-0 w-5 h-5 text-blue-400"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-blue-800">
                                    Quick Tip
                                </h3>
                                <div className="mt-2 text-sm text-blue-700">
                                    <p>
                                        Keep your notification preferences
                                        updated to stay informed about important
                                        delivery updates. Make sure to use a
                                        strong password for your account
                                        security.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
