import { Head } from "@inertiajs/react";
import { useState } from "react";
import { router, usePage } from "@inertiajs/react";
import AdminSidebar from "./sidebar";
import AdminHeader from "./header";
import Modal from "@/Components/Modal";

export default function Users({ auth, users }) {
    const user = auth?.user;
    const { props } = usePage();
    const csrfToken = props.csrf_token || props.csrfToken;

    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState("");

    // Modal states
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [editModalOpen, setEditModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

    // Selected user state
    const [selectedUser, setSelectedUser] = useState(null);

    // Loading states
    const [loading, setLoading] = useState(false);

    // Form data for edit
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        role: "",
        is_approved: false,
        farm_location: "",
        farm_description: "",
    });

    // Filter users based on search and role (client-side filtering for displayed users)
    const filteredUsers = users.data.filter((userItem) => {
        const matchesSearch =
            userItem.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            userItem.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            userItem.phone?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === "" || userItem.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    const getRoleBadgeClass = (role) => {
        switch (role) {
            case "admin":
            case "super_admin":
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
            super_admin: "Super Admin",
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

    // Action handlers
    const handleView = (userItem) => {
        setSelectedUser(userItem);
        setViewModalOpen(true);
    };

    const handleEdit = (userItem) => {
        setSelectedUser(userItem);
        setFormData({
            name: userItem.name || "",
            email: userItem.email || "",
            phone: userItem.phone || "",
            address: userItem.address || "",
            role: userItem.role || "",
            is_approved: userItem.is_approved || false,
            farm_location: userItem.farm_location || "",
            farm_description: userItem.farm_description || "",
        });
        setEditModalOpen(true);
    };

    const handleDelete = (userItem) => {
        setSelectedUser(userItem);
        setDeleteModalOpen(true);
    };

    const handleApprove = (userItem) => {
        setLoading(true);
        router.post(
            route("users.approve", userItem.id),
            {},
            {
                onSuccess: () => {
                    setLoading(false);
                },
                onError: () => {
                    setLoading(false);
                },
            },
        );
    };

    const handleDeleteConfirm = () => {
        if (!selectedUser) return;
        setLoading(true);
        router.delete(route("users.destroy", selectedUser.id), {
            onSuccess: () => {
                setLoading(false);
                setDeleteModalOpen(false);
                setSelectedUser(null);
            },
            onError: () => {
                setLoading(false);
            },
        });
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        if (!selectedUser) return;
        setLoading(true);

        const formDataToSend = new FormData();
        formDataToSend.append("_token", csrfToken);
        formDataToSend.append("_method", "PUT");
        Object.keys(formData).forEach((key) => {
            if (formData[key] !== null && formData[key] !== undefined) {
                formDataToSend.append(key, formData[key]);
            }
        });

        router.post(route("users.update", selectedUser.id), formDataToSend, {
            onSuccess: () => {
                setLoading(false);
                setEditModalOpen(false);
                setSelectedUser(null);
            },
            onError: () => {
                setLoading(false);
            },
        });
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <AdminSidebar />
            <div className="flex-1 flex flex-col">
                <AdminHeader user={user} />
                <main className="flex-1 p-8 overflow-y-auto">
                    <Head title="Users - Admin" />
                    <div className="mb-8">
                        <h1 className="text-2xl font-semibold text-gray-900">
                            User Management
                        </h1>
                        <p className="text-sm text-gray-600 mt-1">
                            Manage platform users
                        </p>
                    </div>

                    {/* Filters */}
                    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
                        <div className="flex flex-wrap gap-4">
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
                                    onChange={(e) =>
                                        setRoleFilter(e.target.value)
                                    }
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                >
                                    <option value="">All Roles</option>
                                    <option value="buyer">Buyer</option>
                                    <option value="farmer">Farmer</option>
                                    <option value="logistics">Logistics</option>
                                    <option value="admin">Admin</option>
                                    <option value="super_admin">
                                        Super Admin
                                    </option>
                                </select>
                            </div>
                        </div>
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
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredUsers.length > 0 ? (
                                        filteredUsers.map((userItem) => (
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
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() =>
                                                                handleView(
                                                                    userItem,
                                                                )
                                                            }
                                                            className="text-blue-600 hover:text-blue-900"
                                                        >
                                                            View
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                handleEdit(
                                                                    userItem,
                                                                )
                                                            }
                                                            className="text-yellow-600 hover:text-yellow-900"
                                                        >
                                                            Edit
                                                        </button>
                                                        {!userItem.is_approved &&
                                                            userItem.role ===
                                                                "farmer" && (
                                                                <button
                                                                    onClick={() =>
                                                                        handleApprove(
                                                                            userItem,
                                                                        )
                                                                    }
                                                                    className="text-green-600 hover:text-green-900"
                                                                    disabled={
                                                                        loading
                                                                    }
                                                                >
                                                                    Approve
                                                                </button>
                                                            )}
                                                        <button
                                                            onClick={() =>
                                                                handleDelete(
                                                                    userItem,
                                                                )
                                                            }
                                                            className="text-red-600 hover:text-red-900"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan="8"
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

                    {/* Pagination Info */}
                    {users.data && users.data.length > 0 && (
                        <div className="mt-4 flex items-center justify-between">
                            <div className="text-sm text-gray-600">
                                Showing {users.from || 1} to{" "}
                                {users.to || users.data.length} of {users.total}{" "}
                                users
                            </div>
                            <div className="flex gap-2">
                                {users.prev_page_url && (
                                    <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
                                        Previous
                                    </button>
                                )}
                                {users.next_page_url && (
                                    <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50">
                                        Next
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </main>
            </div>

            {/* View Modal */}
            <Modal
                show={viewModalOpen}
                onClose={() => setViewModalOpen(false)}
                maxWidth="2xl"
            >
                <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                        <h2 className="text-xl font-semibold text-gray-900">
                            User Details
                        </h2>
                        <button
                            onClick={() => setViewModalOpen(false)}
                            className="text-gray-400 hover:text-gray-500"
                        >
                            <svg
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>
                    {selectedUser && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-500">
                                        Name
                                    </label>
                                    <p className="text-gray-900">
                                        {selectedUser.name || "-"}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500">
                                        Email
                                    </label>
                                    <p className="text-gray-900">
                                        {selectedUser.email}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500">
                                        Role
                                    </label>
                                    <span
                                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadgeClass(selectedUser.role)}`}
                                    >
                                        {formatRole(selectedUser.role)}
                                    </span>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500">
                                        Phone
                                    </label>
                                    <p className="text-gray-900">
                                        {selectedUser.phone || "-"}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500">
                                        Status
                                    </label>
                                    {selectedUser.is_approved ? (
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                            Approved
                                        </span>
                                    ) : (
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                            Pending
                                        </span>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500">
                                        Email Verified
                                    </label>
                                    <p className="text-gray-900">
                                        {selectedUser.email_verified_at
                                            ? "✓ Verified"
                                            : "Not Verified"}
                                    </p>
                                </div>
                                {selectedUser.role === "farmer" && (
                                    <>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-500">
                                                Farm Location
                                            </label>
                                            <p className="text-gray-900">
                                                {selectedUser.farm_location ||
                                                    "-"}
                                            </p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-500">
                                                Farm Description
                                            </label>
                                            <p className="text-gray-900">
                                                {selectedUser.farm_description ||
                                                    "-"}
                                            </p>
                                        </div>
                                    </>
                                )}
                                <div>
                                    <label className="block text-sm font-medium text-gray-500">
                                        Joined At
                                    </label>
                                    <p className="text-gray-900">
                                        {formatDate(selectedUser.created_at)}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500">
                                        Last Updated
                                    </label>
                                    <p className="text-gray-900">
                                        {formatDate(selectedUser.updated_at)}
                                    </p>
                                </div>
                            </div>
                            <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
                                <button
                                    onClick={() => setViewModalOpen(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                                >
                                    Close
                                </button>
                                <button
                                    onClick={() => {
                                        setViewModalOpen(false);
                                        handleEdit(selectedUser);
                                    }}
                                    className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
                                >
                                    Edit
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </Modal>

            {/* Edit Modal */}
            <Modal
                show={editModalOpen}
                onClose={() => setEditModalOpen(false)}
                maxWidth="2xl"
            >
                <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                        <h2 className="text-xl font-semibold text-gray-900">
                            Edit User
                        </h2>
                        <button
                            onClick={() => setEditModalOpen(false)}
                            className="text-gray-400 hover:text-gray-500"
                        >
                            <svg
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>
                    <form onSubmit={handleEditSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Phone
                                </label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Role
                                </label>
                                <select
                                    name="role"
                                    value={formData.role}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
                                >
                                    <option value="">Select Role</option>
                                    <option value="buyer">Buyer</option>
                                    <option value="farmer">Farmer</option>
                                    <option value="logistics">Logistics</option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Address
                                </label>
                                <textarea
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    rows={2}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
                                />
                            </div>
                            {formData.role === "farmer" && (
                                <>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Farm Location
                                        </label>
                                        <input
                                            type="text"
                                            name="farm_location"
                                            value={formData.farm_location}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Farm Description
                                        </label>
                                        <input
                                            type="text"
                                            name="farm_description"
                                            value={formData.farm_description}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
                                        />
                                    </div>
                                </>
                            )}
                            <div>
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        name="is_approved"
                                        checked={formData.is_approved}
                                        onChange={handleInputChange}
                                        className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300 rounded"
                                    />
                                    <span className="ml-2 text-sm text-gray-700">
                                        Approved
                                    </span>
                                </label>
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
                            <button
                                type="button"
                                onClick={() => setEditModalOpen(false)}
                                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:opacity-50"
                            >
                                {loading ? "Saving..." : "Save Changes"}
                            </button>
                        </div>
                    </form>
                </div>
            </Modal>

            {/* Delete Modal */}
            <Modal
                show={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                maxWidth="sm"
            >
                <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                        <h2 className="text-xl font-semibold text-gray-900">
                            Delete User
                        </h2>
                        <button
                            onClick={() => setDeleteModalOpen(false)}
                            className="text-gray-400 hover:text-gray-500"
                        >
                            <svg
                                className="h-6 w-6"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            </svg>
                        </button>
                    </div>
                    <p className="text-gray-600 mb-6">
                        Are you sure you want to delete this user? This action
                        cannot be undone.
                    </p>
                    {selectedUser && (
                        <div className="bg-gray-50 p-3 rounded-lg mb-6">
                            <p className="text-sm font-medium text-gray-900">
                                {selectedUser.name}
                            </p>
                            <p className="text-sm text-gray-500">
                                {selectedUser.email}
                            </p>
                        </div>
                    )}
                    <div className="flex justify-end gap-2">
                        <button
                            onClick={() => setDeleteModalOpen(false)}
                            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleDeleteConfirm}
                            disabled={loading}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                        >
                            {loading ? "Deleting..." : "Delete"}
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
