import { Head } from "@inertiajs/react";
import { useState } from "react";
import { router, usePage } from "@inertiajs/react";
import AdminSidebar from "./sidebar";
import AdminHeader from "./header";

export default function Roles({ auth, roleStats, users, filters }) {
    const user = auth?.user;
    const { props } = usePage();
    const csrfToken = props.csrf_token || props.csrfToken;

    const [searchTerm, setSearchTerm] = useState(filters?.search || "");
    const [roleFilter, setRoleFilter] = useState(filters?.role || "");

    const getRoleBadgeClass = (role) => {
        switch (role) {
            case "admin":
                return "bg-purple-100 text-purple-800";
            case "farmer":
                return "bg-green-100 text-green-800";
            case "logistics":
                return "bg-blue-100 text-blue-800";
            case "buyer":
                return "bg-gray-100 text-gray-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const formatRole = (role) => {
        const roleLabels = {
            admin: "Admin",
            farmer: "Farmer",
            logistics: "Logistics",
            buyer: "Buyer",
        };
        return roleLabels[role] || role;
    };

    const formatDate = (dateString) => {
        if (!dateString) return "-";
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(
            route("admin.roles"),
            { search: searchTerm, role: roleFilter },
            { preserveState: true },
        );
    };

    const handleRoleFilterChange = (e) => {
        const value = e.target.value;
        setRoleFilter(value);
        router.get(
            route("admin.roles"),
            { search: searchTerm, role: value },
            { preserveState: true },
        );
    };

    const handleClearFilters = () => {
        setSearchTerm("");
        setRoleFilter("");
        router.get(route("admin.roles"), {}, { preserveState: true });
    };

    const stats = [
        {
            label: "Total Users",
            value: roleStats?.total || 0,
            color: "bg-gray-100",
            textColor: "text-gray-800",
        },
        {
            label: "Admins",
            value: roleStats?.admins || 0,
            color: "bg-purple-100",
            textColor: "text-purple-800",
        },
        {
            label: "Farmers",
            value: roleStats?.farmers || 0,
            color: "bg-green-100",
            textColor: "text-green-800",
        },
        {
            label: "Buyers",
            value: roleStats?.buyers || 0,
            color: "bg-gray-100",
            textColor: "text-gray-800",
        },
        {
            label: "Logistics",
            value: roleStats?.logistics || 0,
            color: "bg-blue-100",
            textColor: "text-blue-800",
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <AdminSidebar />
            <div className="flex-1 flex flex-col">
                <AdminHeader user={user} />
                <main className="flex-1 p-8 overflow-y-auto">
                    <Head title="Roles & Permissions - Admin" />
                    <div className="mb-8">
                        <h1 className="text-2xl font-semibold text-gray-900">
                            Roles & Permissions
                        </h1>
                        <p className="text-sm text-gray-600 mt-1">
                            Manage roles and permissions
                        </p>
                    </div>

                    {/* Role Statistics Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
                        {stats.map((stat, index) => (
                            <div
                                key={index}
                                className={`${stat.color} rounded-lg p-4 shadow-sm`}
                            >
                                <div className="text-sm font-medium text-gray-600">
                                    {stat.label}
                                </div>
                                <div
                                    className={`text-2xl font-bold ${stat.textColor} mt-1`}
                                >
                                    {stat.value}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Filters */}
                    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
                        <form
                            onSubmit={handleSearch}
                            className="flex flex-wrap gap-4"
                        >
                            <div className="flex-1 min-w-[200px]">
                                <input
                                    type="text"
                                    placeholder="Search by name, email, or phone..."
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                />
                            </div>
                            <div className="w-48">
                                <select
                                    value={roleFilter}
                                    onChange={handleRoleFilterChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                >
                                    <option value="">All Roles</option>
                                    <option value="buyer">Buyer</option>
                                    <option value="farmer">Farmer</option>
                                    <option value="logistics">Logistics</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                >
                                    Search
                                </button>
                                <button
                                    type="button"
                                    onClick={handleClearFilters}
                                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                                >
                                    Clear
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Users Table */}
                    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full divide-y divide-gray-100">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Name
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Email
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Role
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Phone
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Email Verified
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Joined
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {users &&
                                    users.data &&
                                    users.data.length > 0 ? (
                                        users.data.map((userItem) => (
                                            <tr
                                                key={userItem.id}
                                                className="hover:bg-gray-50"
                                            >
                                                <td className="px-6 py-4 whitespace-normal break-words">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {userItem.name || "-"}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-normal break-words">
                                                    <div className="text-sm text-gray-500">
                                                        {userItem.email}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-normal break-words">
                                                    <span
                                                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadgeClass(userItem.role)}`}
                                                    >
                                                        {formatRole(
                                                            userItem.role,
                                                        ) || "buyer"}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-normal break-words">
                                                    <div className="text-sm text-gray-500">
                                                        {userItem.phone || "-"}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-normal break-words">
                                                    {userItem.is_approved ? (
                                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                            Approved
                                                        </span>
                                                    ) : (
                                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                                            Pending
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-normal break-words">
                                                    {userItem.email_verified_at ? (
                                                        <span className="text-green-600 text-sm">
                                                            ✓ Verified
                                                        </span>
                                                    ) : (
                                                        <span className="text-gray-400 text-sm">
                                                            -
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-normal break-words">
                                                    <div className="text-sm text-gray-500">
                                                        {formatDate(
                                                            userItem.created_at,
                                                        )}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan="7"
                                                className="px-6 py-12 text-center text-gray-500"
                                            >
                                                {searchTerm || roleFilter
                                                    ? "No users found matching your criteria"
                                                    : "No users found"}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Pagination */}
                    {users && users.data && users.data.length > 0 && (
                        <div className="mt-4 flex items-center justify-between">
                            <div className="text-sm text-gray-600">
                                Showing {users.from || 1} to{" "}
                                {users.to || users.data.length} of {users.total}{" "}
                                users
                            </div>
                            <div className="flex gap-2">
                                {users.prev_page_url && (
                                    <button
                                        onClick={() =>
                                            router.get(
                                                users.prev_page_url,
                                                {},
                                                { preserveState: true },
                                            )
                                        }
                                        className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
                                    >
                                        Previous
                                    </button>
                                )}
                                {users.next_page_url && (
                                    <button
                                        onClick={() =>
                                            router.get(
                                                users.next_page_url,
                                                {},
                                                { preserveState: true },
                                            )
                                        }
                                        className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
                                    >
                                        Next
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
