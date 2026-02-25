import { Head, useForm } from "@inertiajs/react";
import { useState } from "react";
import BuyerSidebar from "./sidebar";
import BuyerHeader from "./header";

export default function Notifications({
    auth,
    notifications,
    stats,
    types,
    filters,
}) {
    const user = auth?.user;
    const { post, delete: destroy } = useForm();

    const [localFilters, setLocalFilters] = useState({
        search: filters?.search || "",
        type: filters?.type || "",
        status: filters?.status || "",
    });

    const handleFilterChange = (key, value) => {
        setLocalFilters((prev) => ({ ...prev, [key]: value }));
    };

    const applyFilters = () => {
        const params = new URLSearchParams();
        if (localFilters.search) params.append("search", localFilters.search);
        if (localFilters.type) params.append("type", localFilters.type);
        if (localFilters.status) params.append("status", localFilters.status);

        const queryString = params.toString();
        window.location.href =
            route("buyer.notifications") +
            (queryString ? `?${queryString}` : "");
    };

    const clearFilters = () => {
        setLocalFilters({
            search: "",
            type: "",
            status: "",
        });
        window.location.href = route("buyer.notifications");
    };

    const markAsRead = (id) => {
        post(route("buyer.notifications.mark-as-read", { id }), {
            preserveScroll: true,
        });
    };

    const markAllAsRead = () => {
        post(route("buyer.notifications.mark-all-as-read"), {
            preserveScroll: true,
        });
    };

    const deleteNotification = (id) => {
        if (confirm("Are you sure you want to delete this notification?")) {
            destroy(route("buyer.notifications.delete", { id }), {
                preserveScroll: true,
            });
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return "Just now";
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;

        return date.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const getNotificationIcon = (type) => {
        switch (type) {
            case "order":
                return (
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <svg
                            className="w-5 h-5 text-blue-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                            />
                        </svg>
                    </div>
                );
            case "payment":
                return (
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                        <svg
                            className="w-5 h-5 text-green-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    </div>
                );
            case "alert":
                return (
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                        <svg
                            className="w-5 h-5 text-red-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            />
                        </svg>
                    </div>
                );
            case "info":
            default:
                return (
                    <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                        <svg
                            className="w-5 h-5 text-gray-600"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <BuyerSidebar />
            <div className="flex-1 flex flex-col">
                <BuyerHeader user={user} />
                <main className="flex-1 p-8 overflow-y-auto">
                    <Head title="Notifications - Buyer" />

                    <div className="mb-8">
                        <h1 className="text-2xl font-semibold text-gray-900">
                            Notifications
                        </h1>
                        <p className="text-sm text-gray-600 mt-1">
                            View and manage your notifications
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        <div className="bg-white border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">
                                        Total
                                    </p>
                                    <p className="text-2xl font-semibold text-gray-900">
                                        {stats?.total || 0}
                                    </p>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                                    <svg
                                        className="w-5 h-5 text-gray-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                                        />
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">
                                        Unread
                                    </p>
                                    <p className="text-2xl font-semibold text-blue-600">
                                        {stats?.unread || 0}
                                    </p>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                                    <svg
                                        className="w-5 h-5 text-blue-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                                        />
                                    </svg>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-gray-600">
                                        Read
                                    </p>
                                    <p className="text-2xl font-semibold text-green-600">
                                        {stats?.read || 0}
                                    </p>
                                </div>
                                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                                    <svg
                                        className="w-5 h-5 text-green-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M5 13l4 4L19 7"
                                        />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
                        <div className="flex flex-wrap items-end gap-4">
                            <div className="flex-1 min-w-[200px]">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Search
                                </label>
                                <input
                                    type="text"
                                    value={localFilters.search}
                                    onChange={(e) =>
                                        handleFilterChange(
                                            "search",
                                            e.target.value,
                                        )
                                    }
                                    placeholder="Search notifications..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div className="w-40">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Type
                                </label>
                                <select
                                    value={localFilters.type}
                                    onChange={(e) =>
                                        handleFilterChange(
                                            "type",
                                            e.target.value,
                                        )
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">All Types</option>
                                    {types?.map((type) => (
                                        <option key={type} value={type}>
                                            {type.charAt(0).toUpperCase() +
                                                type.slice(1)}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="w-40">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Status
                                </label>
                                <select
                                    value={localFilters.status}
                                    onChange={(e) =>
                                        handleFilterChange(
                                            "status",
                                            e.target.value,
                                        )
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                >
                                    <option value="">All</option>
                                    <option value="unread">Unread</option>
                                    <option value="read">Read</option>
                                </select>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={applyFilters}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Filter
                                </button>
                                <button
                                    onClick={clearFilters}
                                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    Clear
                                </button>
                                {stats?.unread > 0 && (
                                    <button
                                        onClick={markAllAsRead}
                                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                    >
                                        Mark All Read
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="bg-white border border-gray-200 rounded-lg">
                        {notifications?.data?.length > 0 ? (
                            <div className="divide-y divide-gray-200">
                                {notifications.data.map((notification) => (
                                    <div
                                        key={notification.id}
                                        className={`p-4 hover:bg-gray-50 transition-colors ${
                                            !notification.is_read
                                                ? "bg-blue-50"
                                                : ""
                                        }`}
                                    >
                                        <div className="flex items-start gap-4">
                                            {getNotificationIcon(
                                                notification.type,
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-2">
                                                    <div className="flex-1">
                                                        <h3
                                                            className={`text-sm font-medium ${
                                                                !notification.is_read
                                                                    ? "text-gray-900"
                                                                    : "text-gray-700"
                                                            }`}
                                                        >
                                                            {notification.title}
                                                        </h3>
                                                        <p className="text-sm text-gray-600 mt-1">
                                                            {
                                                                notification.message
                                                            }
                                                        </p>
                                                        <div className="flex items-center gap-3 mt-2">
                                                            <span className="text-xs text-gray-500">
                                                                {formatDate(
                                                                    notification.created_at,
                                                                )}
                                                            </span>
                                                            {notification.type && (
                                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                                                    {
                                                                        notification.type
                                                                    }
                                                                </span>
                                                            )}
                                                            {!notification.is_read && (
                                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                                                    Unread
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        {!notification.is_read && (
                                                            <button
                                                                onClick={() =>
                                                                    markAsRead(
                                                                        notification.id,
                                                                    )
                                                                }
                                                                className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                                                                title="Mark as read"
                                                            >
                                                                <svg
                                                                    className="w-5 h-5"
                                                                    fill="none"
                                                                    stroke="currentColor"
                                                                    viewBox="0 0 24 24"
                                                                >
                                                                    <path
                                                                        strokeLinecap="round"
                                                                        strokeLinejoin="round"
                                                                        strokeWidth={
                                                                            2
                                                                        }
                                                                        d="M5 13l4 4L19 7"
                                                                    />
                                                                </svg>
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() =>
                                                                deleteNotification(
                                                                    notification.id,
                                                                )
                                                            }
                                                            className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                                                            title="Delete"
                                                        >
                                                            <svg
                                                                className="w-5 h-5"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                viewBox="0 0 24 24"
                                                            >
                                                                <path
                                                                    strokeLinecap="round"
                                                                    strokeLinejoin="round"
                                                                    strokeWidth={
                                                                        2
                                                                    }
                                                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                                />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-8 text-center">
                                <div className="flex justify-center mb-4">
                                    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                                        <svg
                                            className="w-8 h-8 text-gray-400"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                                            />
                                        </svg>
                                    </div>
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-1">
                                    No notifications
                                </h3>
                                <p className="text-sm text-gray-600">
                                    You don't have any notifications yet.
                                </p>
                            </div>
                        )}
                    </div>

                    {notifications?.data?.length > 0 &&
                        notifications?.last_page > 1 && (
                            <div className="mt-6 flex justify-center">
                                <div className="flex items-center gap-2">
                                    {notifications.links.map((link, index) => {
                                        let buttonClass =
                                            "px-4 py-2 rounded-lg text-sm ";
                                        if (link.active) {
                                            buttonClass +=
                                                "bg-blue-600 text-white";
                                        } else if (link.url) {
                                            buttonClass +=
                                                "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50";
                                        } else {
                                            buttonClass +=
                                                "bg-gray-100 text-gray-400 cursor-not-allowed";
                                        }
                                        return (
                                            <button
                                                key={index}
                                                onClick={() => {
                                                    if (link.url) {
                                                        window.location.href =
                                                            link.url;
                                                    }
                                                }}
                                                disabled={link.url === null}
                                                className={buttonClass}
                                            >
                                                <span
                                                    dangerouslySetInnerHTML={{
                                                        __html: link.label,
                                                    }}
                                                />
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                </main>
            </div>
        </div>
    );
}
