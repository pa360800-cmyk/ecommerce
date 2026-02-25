import { Head, Link } from "@inertiajs/react";
import LogisticsSidebar from "./sidebar";
import LogisticsHeader from "./header";
import {
    Package,
    Clock,
    MapPin,
    User,
    Phone,
    ChevronRight,
} from "lucide-react";

export default function LogisticsPending({ auth, orders = [] }) {
    const user = auth?.user;

    // Filter pending orders (status: pending, confirmed, preparing)
    const pendingOrders = orders.filter((order) =>
        ["pending", "confirmed", "preparing"].includes(order.order_status),
    );

    // Helper function to get status color
    const getStatusColor = (status) => {
        switch (status) {
            case "confirmed":
                return "bg-amber-50 text-amber-700 border border-amber-200";
            case "preparing":
                return "bg-purple-50 text-purple-700 border border-purple-200";
            case "pending":
                return "bg-yellow-50 text-yellow-700 border border-yellow-200";
            default:
                return "bg-gray-50 text-gray-700 border border-gray-200";
        }
    };

    // Helper function to get status label
    const getStatusLabel = (status) => {
        switch (status) {
            case "confirmed":
                return "Confirmed";
            case "preparing":
                return "Preparing";
            case "pending":
                return "Pending";
            default:
                return status;
        }
    };

    // Format date
    const formatDate = (date) => {
        if (!date) return "-";
        return new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <LogisticsSidebar />
            <div className="flex-1 flex flex-col">
                <LogisticsHeader user={user} />
                <main className="flex-1 p-8 overflow-y-auto">
                    <Head title="Pending Deliveries - Logistic" />

                    <div className="mb-8">
                        <h1 className="text-2xl font-semibold text-gray-900">
                            Pending Deliveries
                        </h1>
                        <p className="text-sm text-gray-600 mt-1">
                            View and manage pending delivery requests
                        </p>
                    </div>

                    {/* Pending Orders List */}
                    <div className="bg-white border border-gray-200 rounded-lg">
                        <div className="flex items-center justify-between p-6 border-b border-gray-200">
                            <h2 className="text-lg font-semibold text-gray-900">
                                Pending Delivery Requests
                            </h2>
                            <span className="px-3 py-1 bg-amber-100 text-amber-700 text-sm font-medium rounded-full">
                                {pendingOrders.length}{" "}
                                {pendingOrders.length === 1
                                    ? "order"
                                    : "orders"}{" "}
                                waiting
                            </span>
                        </div>

                        {pendingOrders && pendingOrders.length > 0 ? (
                            <div className="divide-y divide-gray-200">
                                {pendingOrders.map((order) => (
                                    <div
                                        key={order.id}
                                        className="p-6 hover:bg-gray-50 transition-colors"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <span className="text-lg font-semibold text-gray-900">
                                                        Order #{order.id}
                                                    </span>
                                                    <span
                                                        className={`px-2.5 py-1 rounded-md text-xs font-medium ${getStatusColor(order.order_status)}`}
                                                    >
                                                        {getStatusLabel(
                                                            order.order_status,
                                                        )}
                                                    </span>
                                                </div>

                                                {/* Customer Info */}
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                                        <User className="w-4 h-4" />
                                                        <span>
                                                            {order.customer_name ||
                                                                "Customer"}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                                        <Phone className="w-4 h-4" />
                                                        <span>
                                                            {order.customer_phone ||
                                                                "N/A"}
                                                        </span>
                                                    </div>
                                                </div>

                                                {/* Shipping Address */}
                                                <div className="flex items-start gap-2 text-sm text-gray-600 mb-4">
                                                    <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                                    <span>
                                                        {order.shipping_address ||
                                                            "Address not set"}
                                                    </span>
                                                </div>

                                                {/* Order Details */}
                                                <div className="flex items-center gap-4 text-sm">
                                                    <div className="flex items-center gap-2">
                                                        <Package className="w-4 h-4 text-gray-400" />
                                                        <span className="text-gray-600">
                                                            {order.items
                                                                ?.length ||
                                                                0}{" "}
                                                            items
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Clock className="w-4 h-4 text-gray-400" />
                                                        <span className="text-gray-600">
                                                            {formatDate(
                                                                order.created_at,
                                                            )}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Action Button */}
                                            <div className="ml-4">
                                                <Link
                                                    href={`/logistic/orders/${order.id}`}
                                                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                                                >
                                                    View Details
                                                    <ChevronRight className="w-4 h-4" />
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Clock className="w-8 h-8 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    No pending deliveries
                                </h3>
                                <p className="text-gray-500">
                                    All caught up! There are no pending delivery
                                    requests at the moment.
                                </p>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}
