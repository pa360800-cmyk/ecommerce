import { Head } from "@inertiajs/react";
import { useState } from "react";
import { router, usePage } from "@inertiajs/react";
import AdminSidebar from "./sidebar";
import AdminHeader from "./header";

export default function Settings({ auth, settings }) {
    const user = auth?.user;
    const { props } = usePage();
    const csrfToken = props.csrf_token || props.csrfToken;

    // Active tab state
    const [activeTab, setActiveTab] = useState("general");

    // Loading state
    const [loading, setLoading] = useState(false);

    // Success/Error messages
    const [message, setMessage] = useState({ type: "", text: "" });

    // Settings data - convert from grouped array to flat object for form
    const [formData, setFormData] = useState(() => {
        const initialData = {};
        Object.values(settings || {}).forEach((groupSettings) => {
            groupSettings.forEach((setting) => {
                let value = setting.value;
                // Parse value based on type
                if (setting.type === "boolean") {
                    value = value === "true" || value === true;
                } else if (setting.type === "number") {
                    value = value ? parseFloat(value) : 0;
                }
                initialData[setting.key] = value;
            });
        });
        return initialData;
    });

    // Setting groups configuration
    const tabs = [
        {
            id: "general",
            label: "General",
            icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z",
        },
        {
            id: "commission",
            label: "Commission",
            icon: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
        },
        {
            id: "tax",
            label: "Tax",
            icon: "M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2zM10 8.5a.5.5 0 11-1 0 .5.5 0 011 0zm5 5a.5.5 0 11-1 0 .5.5 0 011 0z",
        },
        {
            id: "shipping",
            label: "Shipping",
            icon: "M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4",
        },
        {
            id: "payment",
            label: "Payment",
            icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z",
        },
        {
            id: "notification",
            label: "Notification",
            icon: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9",
        },
    ];

    // Get settings for active tab
    const getSettingsForTab = (tabId) => {
        if (!settings || !settings[tabId]) return [];
        return settings[tabId];
    };

    // Handle input change
    const handleInputChange = (key, value, type) => {
        let parsedValue = value;

        if (type === "number") {
            parsedValue = value === "" ? 0 : parseFloat(value);
        } else if (type === "boolean") {
            parsedValue = value;
        }

        setFormData((prev) => ({
            ...prev,
            [key]: parsedValue,
        }));
    };

    // Handle save
    const handleSave = () => {
        setLoading(true);
        setMessage({ type: "", text: "" });

        // Convert formData to array format expected by controller
        const settingsArray = [];
        Object.keys(formData).forEach((key) => {
            // Find the setting to get its type
            let settingType = "text";
            let found = false;
            Object.values(settings || {}).forEach((groupSettings) => {
                groupSettings.forEach((setting) => {
                    if (setting.key === key) {
                        settingType = setting.type;
                        found = true;
                    }
                });
            });

            settingsArray.push({
                key: key,
                value: formData[key],
                type: settingType,
            });
        });

        router.post(
            route("admin.settings.update"),
            { settings: settingsArray },
            {
                headers: {
                    "X-CSRF-TOKEN": csrfToken,
                },
                onSuccess: () => {
                    setLoading(false);
                    setMessage({
                        type: "success",
                        text: "Settings saved successfully!",
                    });
                    setTimeout(() => {
                        setMessage({ type: "", text: "" });
                    }, 3000);
                },
                onError: () => {
                    setLoading(false);
                    setMessage({
                        type: "error",
                        text: "Failed to save settings. Please try again.",
                    });
                },
            },
        );
    };

    // Render input based on setting type
    const renderInput = (setting) => {
        const value = formData[setting.key] ?? "";
        const type = setting.type;

        switch (type) {
            case "boolean":
                return (
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            checked={value === true || value === "true"}
                            onChange={(e) =>
                                handleInputChange(
                                    setting.key,
                                    e.target.checked,
                                    "boolean",
                                )
                            }
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                        <span className="ml-3 text-sm font-medium text-gray-500">
                            {value ? "Enabled" : "Disabled"}
                        </span>
                    </label>
                );
            case "number":
                return (
                    <input
                        type="number"
                        step="any"
                        value={value}
                        onChange={(e) =>
                            handleInputChange(
                                setting.key,
                                e.target.value,
                                "number",
                            )
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                );
            case "json":
                return (
                    <textarea
                        value={
                            typeof value === "object"
                                ? JSON.stringify(value, null, 2)
                                : value
                        }
                        onChange={(e) =>
                            handleInputChange(
                                setting.key,
                                e.target.value,
                                "text",
                            )
                        }
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 font-mono text-sm"
                    />
                );
            default:
                // Check if value contains newlines
                if (typeof value === "string" && value.includes("\n")) {
                    return (
                        <textarea
                            value={value}
                            onChange={(e) =>
                                handleInputChange(
                                    setting.key,
                                    e.target.value,
                                    "text",
                                )
                            }
                            rows={4}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        />
                    );
                }
                return (
                    <input
                        type="text"
                        value={value || ""}
                        onChange={(e) =>
                            handleInputChange(
                                setting.key,
                                e.target.value,
                                "text",
                            )
                        }
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    />
                );
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <AdminSidebar />
            <div className="flex-1 flex flex-col">
                <AdminHeader user={user} />
                <main className="flex-1 p-8 overflow-y-auto">
                    <Head title="Settings - Admin" />
                    <div className="mb-8">
                        <h1 className="text-2xl font-semibold text-gray-900">
                            Settings
                        </h1>
                        <p className="text-sm text-gray-600 mt-1">
                            Manage platform settings
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
                                    <svg
                                        className="w-5 h-5 mr-2"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                ) : (
                                    <svg
                                        className="w-5 h-5 mr-2"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
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
                                                ? "border-green-500 text-green-600"
                                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                        }`}
                                    >
                                        <svg
                                            className={`mr-2 w-5 h-5 ${
                                                activeTab === tab.id
                                                    ? "text-green-500"
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
                            {getSettingsForTab(activeTab).length > 0 ? (
                                <div className="space-y-6">
                                    {getSettingsForTab(activeTab).map(
                                        (setting) => (
                                            <div
                                                key={setting.id}
                                                className="bg-gray-50 rounded-lg p-4"
                                            >
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    <div className="md:col-span-1">
                                                        <label className="block text-sm font-medium text-gray-900 mb-1">
                                                            {setting.label ||
                                                                setting.key}
                                                        </label>
                                                        <p className="text-xs text-gray-500">
                                                            {setting.description ||
                                                                `Configure ${setting.key}`}
                                                        </p>
                                                    </div>
                                                    <div className="md:col-span-2">
                                                        {renderInput(setting)}
                                                    </div>
                                                </div>
                                            </div>
                                        ),
                                    )}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <svg
                                        className="mx-auto h-12 w-12 text-gray-400"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                                        />
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                        />
                                    </svg>
                                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                                        No settings
                                    </h3>
                                    <p className="mt-1 text-sm text-gray-500">
                                        No settings configured for this category
                                        yet.
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Save Button */}
                        {getSettingsForTab(activeTab).length > 0 && (
                            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end">
                                <button
                                    onClick={handleSave}
                                    disabled={loading}
                                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
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
                                            <svg
                                                className="w-4 h-4 mr-2"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M5 13l4 4L19 7"
                                                />
                                            </svg>
                                            Save Changes
                                        </>
                                    )}
                                </button>
                            </div>
                        )}
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
                                        Settings are organized by categories.
                                        Click on each tab to view and edit
                                        settings for that category. Don't forget
                                        to save your changes!
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
