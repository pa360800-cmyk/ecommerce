import { Head } from "@inertiajs/react";
import { useState } from "react";
import LogisticSidebar from "./sidebar";
import LogisticHeader from "./header";

export default function Navigation({ auth, deliveries, stats }) {
    const user = auth?.user;
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedDelivery, setSelectedDelivery] = useState(null);

    // Filter deliveries based on search
    const filteredDeliveries =
        deliveries?.filter((delivery) => {
            const matchesSearch =
                delivery.id?.toString().includes(searchTerm.toLowerCase()) ||
                delivery.tracking_number
                    ?.toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                delivery.name
                    ?.toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                delivery.address
                    ?.toLowerCase()
                    .includes(searchTerm.toLowerCase());
            return matchesSearch;
        }) || [];

    const getStatusBadgeClass = (status) => {
        const statusClasses = {
            pending: "bg-yellow-100 text-yellow-800",
            shipped: "bg-purple-100 text-purple-800",
            delivered: "bg-green-100 text-green-800",
        };
        return statusClasses[status] || "bg-gray-100 text-gray-800";
    };

    const formatStatus = (status) => {
        const statusLabels = {
            pending: "Pending",
            shipped: "Out for Delivery",
            delivered: "Delivered",
        };
        return statusLabels[status] || status;
    };

    const formatDate = (dateString) => {
        if (!dateString) return "-";
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const handleNavigate = (delivery) => {
        // In production, this would open a maps app or navigation
        const address = encodeURIComponent(delivery.address);
        window.open(
            `https://www.google.com/maps/search/?api=1&query=${address}`,
            "_blank",
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <LogisticSidebar />
            <div className="flex-1 flex flex-col">
                <LogisticHeader user={user} />
                <main className="flex-1 p-8 overflow-y-auto">
                    <Head title="Navigation - Logistic" />
                    <div className="mb-8">
                        <h1 className="text-2xl font-semibold text-gray-900">
                            Navigation
                        </h1>
                        <p className="text-sm text-gray-600 mt-1">
                            Navigate deliveries
                        </p>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="bg-white border border-gray-200 p-4 rounded-lg">
                            <p className="text-sm font-medium text-gray-600">
                                Total Deliveries
                            </p>
                            <p className="text-2xl font-semibold text-blue-600 mt-1">
                                {stats?.totalDeliveries || 0}
                            </p>
                        </div>
                        <div className="bg-white border border-gray-200 p-4 rounded-lg">
                            <p className="text-sm font-medium text-gray-600">
                                Out for Delivery
                            </p>
                            <p className="text-2xl font-semibold text-purple-600 mt-1">
                                {stats?.shippedDeliveries || 0}
                            </p>
                        </div>
                        <div className="bg-white border border-gray-200 p-4 rounded-lg">
                            <p className="text-sm font-medium text-gray-600">
                                Pending
                            </p>
                            <p className="text-2xl font-semibold text-yellow-600 mt-1">
                                {stats?.pendingDeliveries || 0}
                            </p>
                        </div>
                    </div>

                    {/* Search Filter */}
                    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
                        <div className="flex flex-wrap gap-4">
                            <div className="flex-1 min-w-[200px]">
                                <input
                                    type="text"
                                    placeholder="Search by order ID, tracking number, address..."
                                    value={searchTerm}
                                    onChange={(e) =>
                                        setSearchTerm(e.target.value)
                                    }
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Deliveries List */}
                    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full divide-y divide-gray-100">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Order ID
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Customer
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Address
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Tracking #
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Date
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {filteredDeliveries.length > 0 ? (
                                        filteredDeliveries.map((delivery) => (
                                            <tr
                                                key={delivery.id}
                                                className="hover:bg-gray-50"
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        #{delivery.id}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-normal break-words">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {delivery.name || "-"}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        {delivery.phone || "-"}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-normal break-words">
                                                    <div className="text-sm text-gray-900">
                                                        {delivery.address ||
                                                            "-"}
                                                    </div>
                                                    <div className="text-xs text-gray-500">
                                                        {delivery.city || "-"}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span
                                                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(delivery.status)}`}
                                                    >
                                                        {formatStatus(
                                                            delivery.status,
                                                        )}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-500">
                                                        {delivery.tracking_number ||
                                                            "-"}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-500">
                                                        {formatDate(
                                                            delivery.created_at,
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                    <button
                                                        onClick={() =>
                                                            handleNavigate(
                                                                delivery,
                                                            )
                                                        }
                                                        className="text-purple-600 hover:text-purple-900 mr-3"
                                                    >
                                                        Navigate
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            setSelectedDelivery(
                                                                delivery,
                                                            )
                                                        }
                                                        className="text-blue-600 hover:text-blue-900"
                                                    >
                                                        Details
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td
                                                colSpan="7"
                                                className="px-6 py-12 text-center text-gray-500"
                                            >
                                                {searchTerm
                                                    ? "No deliveries found matching your search"
                                                    : "No deliveries to navigate"}
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
