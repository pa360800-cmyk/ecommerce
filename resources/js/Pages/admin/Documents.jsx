import { Head } from "@inertiajs/react";
import { useState } from "react";
import { router, usePage } from "@inertiajs/react";
import AdminSidebar from "./sidebar";
import AdminHeader from "./header";
import Modal from "@/Components/Modal";

export default function Documents({
    auth,
    sellerDocuments,
    riderDocuments,
    stats,
    filters,
}) {
    const user = auth?.user;
    const { props } = usePage();
    const csrfToken = props.csrf_token || props.csrfToken;

    // State for tabs
    const [activeTab, setActiveTab] = useState("seller");

    // State for search
    const [searchTerm, setSearchTerm] = useState(filters?.search || "");

    // Modal states
    const [viewModalOpen, setViewModalOpen] = useState(false);
    const [selectedDocument, setSelectedDocument] = useState(null);

    // Loading state
    const [loading, setLoading] = useState(false);

    // Get the appropriate documents based on active tab
    const documents = activeTab === "seller" ? sellerDocuments : riderDocuments;

    const handleSearch = (e) => {
        e.preventDefault();
        router.get(
            route("admin.documents"),
            {
                search: searchTerm,
                type: activeTab,
            },
            {
                preserveState: true,
            },
        );
    };

    const handleView = (document) => {
        setSelectedDocument(document);
        setViewModalOpen(true);
    };

    const handleApprove = (document) => {
        setLoading(true);
        const routeName =
            activeTab === "seller"
                ? "admin.seller-documents.approve"
                : "admin.rider-documents.approve";

        router.post(
            route(routeName, document.id),
            {},
            {
                onSuccess: () => {
                    setLoading(false);
                    setViewModalOpen(false);
                    router.reload();
                },
                onError: () => {
                    setLoading(false);
                },
            },
        );
    };

    const handleReject = (document) => {
        setLoading(true);
        const routeName =
            activeTab === "seller"
                ? "admin.seller-documents.reject"
                : "admin.rider-documents.reject";

        router.post(
            route(routeName, document.id),
            {},
            {
                onSuccess: () => {
                    setLoading(false);
                    setViewModalOpen(false);
                    router.reload();
                },
                onError: () => {
                    setLoading(false);
                },
            },
        );
    };

    const formatDate = (dateString) => {
        if (!dateString) return "-";
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case "verified":
                return "bg-green-100 text-green-800";
            case "pending":
                return "bg-yellow-100 text-yellow-800";
            case "rejected":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const formatStatus = (status) => {
        if (!status) return "Unknown";
        return status.charAt(0).toUpperCase() + status.slice(1);
    };

    const getDocumentTypes = (doc, type) => {
        if (type === "seller") {
            const types = [];
            if (doc.government_id) types.push("Government ID");
            if (doc.business_license) types.push("Business License");
            if (doc.tax_certificate) types.push("Tax Certificate");
            if (doc.selfie_verification) types.push("Selfie Verification");
            return types.length > 0 ? types.join(", ") : "No documents";
        } else {
            const types = [];
            if (doc.government_id) types.push("Government ID");
            if (doc.live_selfie) types.push("Live Selfie");
            if (doc.background_check_status)
                types.push(`Background Check: ${doc.background_check_status}`);
            return types.length > 0 ? types.join(", ") : "No documents";
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <AdminSidebar />
            <div className="flex-1 flex flex-col">
                <AdminHeader user={user} />
                <main className="flex-1 p-8 overflow-y-auto">
                    <Head title="Documents - Admin" />
                    <div className="mb-8">
                        <h1 className="text-2xl font-semibold text-gray-900">
                            Documents
                        </h1>
                        <p className="text-sm text-gray-600 mt-1">
                            Manage platform documents
                        </p>
                    </div>

                    {/* Stats Cards */}
                    {stats && (
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                            <div className="bg-white border border-gray-200 rounded-lg p-4">
                                <div className="text-sm text-gray-500">
                                    Total Seller Documents
                                </div>
                                <div className="text-2xl font-semibold text-gray-900">
                                    {stats.totalSellerDocuments || 0}
                                </div>
                            </div>
                            <div className="bg-white border border-gray-200 rounded-lg p-4">
                                <div className="text-sm text-gray-500">
                                    Pending Seller
                                </div>
                                <div className="text-2xl font-semibold text-yellow-600">
                                    {stats.pendingSellerDocuments || 0}
                                </div>
                            </div>
                            <div className="bg-white border border-gray-200 rounded-lg p-4">
                                <div className="text-sm text-gray-500">
                                    Total Rider Documents
                                </div>
                                <div className="text-2xl font-semibold text-gray-900">
                                    {stats.totalRiderDocuments || 0}
                                </div>
                            </div>
                            <div className="bg-white border border-gray-200 rounded-lg p-4">
                                <div className="text-sm text-gray-500">
                                    Pending Rider
                                </div>
                                <div className="text-2xl font-semibold text-yellow-600">
                                    {stats.pendingRiderDocuments || 0}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Tabs */}
                    <div className="mb-6 border-b border-gray-200">
                        <nav className="-mb-px flex space-x-8">
                            <button
                                onClick={() => setActiveTab("seller")}
                                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                    activeTab === "seller"
                                        ? "border-green-500 text-green-600"
                                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                }`}
                            >
                                Seller Documents
                            </button>
                            <button
                                onClick={() => setActiveTab("rider")}
                                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                                    activeTab === "rider"
                                        ? "border-green-500 text-green-600"
                                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                }`}
                            >
                                Rider Documents
                            </button>
                        </nav>
                    </div>

                    {/* Search */}
                    <form onSubmit={handleSearch} className="mb-6">
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <input
                                    type="text"
                                    placeholder="Search by name or email..."
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                                />
                            </div>
                            <button
                                type="submit"
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                            >
                                Search
                            </button>
                        </div>
                    </form>

                    {/* Documents Table */}
                    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full divide-y divide-gray-100">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            User
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Document Type
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Submitted
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {documents &&
                                    documents.data &&
                                    documents.data.length > 0 ? (
                                        documents.data.map((doc) => (
                                            <tr
                                                key={doc.id}
                                                className="hover:bg-gray-50"
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {doc.user?.name || "-"}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        {doc.user?.email || "-"}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">
                                                        {activeTab === "seller"
                                                            ? "Seller Documents"
                                                            : "Rider Documents"}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        {getDocumentTypes(
                                                            doc,
                                                            activeTab,
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span
                                                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(doc.verification_status)}`}
                                                    >
                                                        {formatStatus(
                                                            doc.verification_status,
                                                        )}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {formatDate(doc.created_at)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <button
                                                        onClick={() =>
                                                            handleView(doc)
                                                        }
                                                        className="text-blue-600 hover:text-blue-900 mr-3"
                                                    >
                                                        View
                                                    </button>
                                                    {doc.verification_status ===
                                                        "pending" && (
                                                        <>
                                                            <button
                                                                onClick={() =>
                                                                    handleApprove(
                                                                        doc,
                                                                    )
                                                                }
                                                                className="text-green-600 hover:text-green-900 mr-3"
                                                                disabled={
                                                                    loading
                                                                }
                                                            >
                                                                Approve
                                                            </button>
                                                            <button
                                                                onClick={() =>
                                                                    handleReject(
                                                                        doc,
                                                                    )
                                                                }
                                                                className="text-red-600 hover:text-red-900"
                                                                disabled={
                                                                    loading
                                                                }
                                                            >
                                                                Reject
                                                            </button>
                                                        </>
                                                    )}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan="5"
                                                className="px-6 py-12 text-center text-gray-500"
                                            >
                                                No documents found
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Pagination */}
                    {documents &&
                        documents.data &&
                        documents.data.length > 0 && (
                            <div className="mt-4 flex items-center justify-between">
                                <div className="text-sm text-gray-600">
                                    Showing {documents.from || 1} to{" "}
                                    {documents.to || documents.data.length} of{" "}
                                    {documents.total} documents
                                </div>
                                <div className="flex gap-2">
                                    {documents.prev_page_url && (
                                        <button
                                            onClick={() =>
                                                router.get(
                                                    documents.prev_page_url,
                                                )
                                            }
                                            className="px-4 py-2 border border-gray-300 rounded-lg text-sm text-gray-600 hover:bg-gray-50"
                                        >
                                            Previous
                                        </button>
                                    )}
                                    {documents.next_page_url && (
                                        <button
                                            onClick={() =>
                                                router.get(
                                                    documents.next_page_url,
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

            {/* View Modal */}
            <Modal
                show={viewModalOpen}
                onClose={() => setViewModalOpen(false)}
                maxWidth="2xl"
            >
                <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                        <h2 className="text-xl font-semibold text-gray-900">
                            {activeTab === "seller" ? "Seller" : "Rider"}{" "}
                            Document Details
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
                    {selectedDocument && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-500">
                                        User Name
                                    </label>
                                    <p className="text-gray-900">
                                        {selectedDocument.user?.name || "-"}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500">
                                        Email
                                    </label>
                                    <p className="text-gray-900">
                                        {selectedDocument.user?.email || "-"}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500">
                                        Status
                                    </label>
                                    <span
                                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(selectedDocument.verification_status)}`}
                                    >
                                        {formatStatus(
                                            selectedDocument.verification_status,
                                        )}
                                    </span>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500">
                                        Submitted
                                    </label>
                                    <p className="text-gray-900">
                                        {formatDate(
                                            selectedDocument.created_at,
                                        )}
                                    </p>
                                </div>
                                {selectedDocument.rejection_reason && (
                                    <div className="col-span-2">
                                        <label className="block text-sm font-medium text-gray-500">
                                            Rejection Reason
                                        </label>
                                        <p className="text-red-600">
                                            {selectedDocument.rejection_reason}
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="mt-4">
                                <label className="block text-sm font-medium text-gray-500 mb-2">
                                    Documents
                                </label>
                                <div className="bg-gray-50 rounded-lg p-4">
                                    {activeTab === "seller" ? (
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-700">
                                                    Government ID
                                                </span>
                                                <span
                                                    className={`px-2 py-1 text-xs rounded-full ${selectedDocument.government_id_verified ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}
                                                >
                                                    {selectedDocument.government_id_verified
                                                        ? "Verified"
                                                        : selectedDocument.government_id
                                                          ? "Uploaded"
                                                          : "Not Uploaded"}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-700">
                                                    Business License
                                                </span>
                                                <span
                                                    className={`px-2 py-1 text-xs rounded-full ${selectedDocument.business_license_verified ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}
                                                >
                                                    {selectedDocument.business_license_verified
                                                        ? "Verified"
                                                        : selectedDocument.business_license
                                                          ? "Uploaded"
                                                          : "Not Uploaded"}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-700">
                                                    Tax Certificate
                                                </span>
                                                <span
                                                    className={`px-2 py-1 text-xs rounded-full ${selectedDocument.tax_certificate_verified ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}
                                                >
                                                    {selectedDocument.tax_certificate_verified
                                                        ? "Verified"
                                                        : selectedDocument.tax_certificate
                                                          ? "Uploaded"
                                                          : "Not Uploaded"}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-700">
                                                    Selfie Verification
                                                </span>
                                                <span
                                                    className={`px-2 py-1 text-xs rounded-full ${selectedDocument.selfie_verified ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}
                                                >
                                                    {selectedDocument.selfie_verified
                                                        ? "Verified"
                                                        : selectedDocument.selfie_verification
                                                          ? "Uploaded"
                                                          : "Not Uploaded"}
                                                </span>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-700">
                                                    Government ID
                                                </span>
                                                <span
                                                    className={`px-2 py-1 text-xs rounded-full ${selectedDocument.government_id_verified ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}
                                                >
                                                    {selectedDocument.government_id_verified
                                                        ? "Verified"
                                                        : selectedDocument.government_id
                                                          ? "Uploaded"
                                                          : "Not Uploaded"}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-700">
                                                    Live Selfie
                                                </span>
                                                <span
                                                    className={`px-2 py-1 text-xs rounded-full ${selectedDocument.live_selfie_verified ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}
                                                >
                                                    {selectedDocument.live_selfie_verified
                                                        ? "Verified"
                                                        : selectedDocument.live_selfie
                                                          ? "Uploaded"
                                                          : "Not Uploaded"}
                                                </span>
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm text-gray-700">
                                                    Background Check
                                                </span>
                                                <span
                                                    className={`px-2 py-1 text-xs rounded-full ${
                                                        selectedDocument.background_check_status ===
                                                        "passed"
                                                            ? "bg-green-100 text-green-800"
                                                            : selectedDocument.background_check_status ===
                                                                "pending"
                                                              ? "bg-yellow-100 text-yellow-800"
                                                              : "bg-gray-100 text-gray-800"
                                                    }`}
                                                >
                                                    {selectedDocument.background_check_status ||
                                                        "Not Started"}
                                                </span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
                                <button
                                    onClick={() => setViewModalOpen(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                                >
                                    Close
                                </button>
                                {selectedDocument.verification_status ===
                                    "pending" && (
                                    <>
                                        <button
                                            onClick={() =>
                                                handleApprove(selectedDocument)
                                            }
                                            disabled={loading}
                                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                                        >
                                            {loading
                                                ? "Processing..."
                                                : "Approve"}
                                        </button>
                                        <button
                                            onClick={() =>
                                                handleReject(selectedDocument)
                                            }
                                            disabled={loading}
                                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                                        >
                                            {loading
                                                ? "Processing..."
                                                : "Reject"}
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </Modal>
        </div>
    );
}
