import { Head, Link } from "@inertiajs/react";
import LogisticsSidebar from "./sidebar";
import LogisticsHeader from "./header";
import {
    Truck,
    Package,
    Clock,
    CheckCircle,
    Box,
    TrendingUp,
    ArrowUpRight,
    MapPin,
    Navigation,
    AlertCircle,
} from "lucide-react";

export default function LogisticsDashboard({ auth, stats = {}, orders = [] }) {
    const user = auth?.user;

    // Ensure stats has default values
    const safeStats = {
        pendingDeliveries: stats?.pendingDeliveries ?? 0,
        inTransit: stats?.inTransit ?? 0,
        deliveredToday: stats?.deliveredToday ?? 0,
        totalDelivered: stats?.totalDelivered ?? 0,
    };

    // Helper function to get status color
    const getStatusColor = (status) => {
        switch (status) {
            case "delivered":
            case "completed":
                return "bg-emerald-50 text-emerald-700 border border-emerald-200";
            case "shipped":
            case "in_transit":
                return "bg-blue-50 text-blue-700 border border-blue-200";
            case "preparing":
                return "bg-purple-50 text-purple-700 border border-purple-200";
            case "confirmed":
                return "bg-amber-50 text-amber-700 border border-amber-200";
            case "pending":
                return "bg-yellow-50 text-yellow-700 border border-yellow-200";
            case "cancelled":
                return "bg-red-50 text-red-700 border border-red-200";
            default:
                return "bg-gray-50 text-gray-700 border border-gray-200";
        }
    };

    // Helper function to get status label
    const getStatusLabel = (status) => {
        switch (status) {
            case "delivered":
                return "Delivered";
            case "completed":
                return "Completed";
            case "shipped":
                return "Shipped";
            case "in_transit":
                return "In Transit";
            case "preparing":
                return "Preparing";
            case "confirmed":
                return "Confirmed";
            case "pending":
                return "Pending";
            case "cancelled":
                return "Cancelled";
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

    // Filter orders
    const pendingOrders = orders.filter((o) =>
        ["pending", "confirmed", "preparing"].includes(o.order_status),
    );
    const activeOrders = orders.filter((o) =>
        ["shipped", "in_transit"].includes(o.order_status),
    );

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <LogisticsSidebar />

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col">
                <LogisticsHeader user={user} />

                {/* Page Content */}
                <main className="flex-1 p-8 overflow-y-auto">
                    <Head title="Logistics Dashboard" />

                    {/* Page Header */}
                    <div className="mb-8">
                        <h1 className="text-2xl font-semibold text-gray-900">
                            Dashboard Overview
                        </h1>
                        <p className="text-sm text-gray-600 mt-1">
                            Welcome back, manage deliveries and track shipments
                        </p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        {/* Pending Deliveries */}
                        <div className="bg-white border border-gray-200 p-6 rounded-lg hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">
                                        Pending Deliveries
                                    </p>
                                    <p className="text-3xl font-semibold text-gray-900 mt-2">
                                        {safeStats.pendingDeliveries}
                                    </p>
                                    <div className="flex items-center mt-2">
                                        <Clock className="w-4 h-4 text-amber-600" />
                                        <span className="text-sm text-gray-500 ml-1">
                                            Awaiting pickup
                                        </span>
                                    </div>
                                </div>
                                <div className="w-12 h-12 bg-amber-50 rounded-lg flex items-center justify-center">
                                    <Clock className="w-6 h-6 text-amber-600" />
                                </div>
                            </div>
                        </div>

                        {/* In Transit */}
                        <div className="bg-white border border-gray-200 p-6 rounded-lg hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">
                                        In Transit
                                    </p>
                                    <p className="text-3xl font-semibold text-gray-900 mt-2">
                                        {safeStats.inTransit}
                                    </p>
                                    <div className="flex items-center mt-2">
                                        <TrendingUp className="w-4 h-4 text-blue-600" />
                                        <span className="text-sm text-blue-600 ml-1">
                                            On the way
                                        </span>
                                    </div>
                                </div>
                                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                                    <Truck className="w-6 h-6 text-blue-600" />
                                </div>
                            </div>
                        </div>

                        {/* Delivered Today */}
                        <div className="bg-white border border-gray-200 p-6 rounded-lg hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">
                                        Delivered Today
                                    </p>
                                    <p className="text-3xl font-semibold text-gray-900 mt-2">
                                        {safeStats.deliveredToday}
                                    </p>
                                    <div className="flex items-center mt-2">
                                        <ArrowUpRight className="w-4 h-4 text-emerald-600" />
                                        <span className="text-sm text-emerald-600 ml-1">
                                            Great progress
                                        </span>
                                    </div>
                                </div>
                                <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center">
                                    <CheckCircle className="w-6 h-6 text-emerald-600" />
                                </div>
                            </div>
                        </div>

                        {/* Total Delivered */}
                        <div className="bg-white border border-gray-200 p-6 rounded-lg hover:shadow-md transition-shadow">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">
                                        Total Delivered
                                    </p>
                                    <p className="text-3xl font-semibold text-gray-900 mt-2">
                                        {safeStats.totalDelivered}
                                    </p>
                                    <div className="flex items-center mt-2">
                                        <Box className="w-4 h-4 text-purple-600" />
                                        <span className="text-sm text-gray-500 ml-1">
                                            All time
                                        </span>
                                    </div>
                                </div>
                                <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                                    <Box className="w-6 h-6 text-purple-600" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">
                            Quick Actions
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <Link
                                href="/logistic/orders"
                                className="flex items-center justify-center gap-2 p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                <Truck className="w-5 h-5" />
                                <span className="font-medium">
                                    View All Orders
                                </span>
                            </Link>
                            <Link
                                href="/logistic/pending"
                                className="flex items-center justify-center gap-2 p-4 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors"
                            >
                                <Package className="w-5 h-5" />
                                <span className="font-medium">
                                    Pending Deliveries
                                </span>
                            </Link>
                            <Link
                                href="/logistic/navigation"
                                className="flex items-center justify-center gap-2 p-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                            >
                                <Navigation className="w-5 h-5" />
                                <span className="font-medium">
                                    Start Navigation
                                </span>
                            </Link>
                        </div>
                    </div>

                    {/* Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                        {/* Pending Delivery Requests */}
                        <div className="bg-white border border-gray-200 rounded-lg">
                            <div className="flex items-center justify-between p-6 border-b border-gray-200">
                                <h2 className="text-lg font-semibold text-gray-900">
                                    Pending Delivery Requests
                                </h2>
                                <Link
                                    href="/logistic/pending"
                                    className="text-sm font-medium text-blue-600 hover:text-blue-700"
                                >
                                    View All →
                                </Link>
                            </div>
                            <div className="p-6">
                                {pendingOrders && pendingOrders.length > 0 ? (
                                    <div className="space-y-4">
                                        {pendingOrders
                                            .slice(0, 5)
                                            .map((order) => (
                                                <div
                                                    key={order.id}
                                                    className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg hover:bg-white hover:shadow-sm transition-all"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                                                            <Package className="w-5 h-5 text-amber-600" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-900">
                                                                Order #
                                                                {order.id}
                                                            </p>
                                                            <p className="text-xs text-gray-500">
                                                                {order.shipping_address ||
                                                                    "Address not set"}
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <Link
                                                        href={`/logistic/orders/${order.id}`}
                                                        className="px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors"
                                                    >
                                                        Details
                                                    </Link>
                                                </div>
                                            ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <Clock className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                                        <p className="text-sm text-gray-500">
                                            No pending deliveries
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Active Deliveries */}
                        <div className="bg-white border border-gray-200 rounded-lg">
                            <div className="flex items-center justify-between p-6 border-b border-gray-200">
                                <h2 className="text-lg font-semibold text-gray-900">
                                    Active Deliveries
                                </h2>
                                <Link
                                    href="/logistic/active"
                                    className="text-sm font-medium text-blue-600 hover:text-blue-700"
                                >
                                    View All →
                                </Link>
                            </div>
                            <div className="p-6">
                                {activeOrders && activeOrders.length > 0 ? (
                                    <div className="space-y-4">
                                        {activeOrders
                                            .slice(0, 5)
                                            .map((order) => (
                                                <div
                                                    key={order.id}
                                                    className="p-4 bg-gray-50 border border-gray-200 rounded-lg"
                                                >
                                                    <div className="flex items-center justify-between mb-3">
                                                        <span className="text-sm font-medium text-gray-900">
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
                                                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                                                        <MapPin className="w-4 h-4" />
                                                        <span>
                                                            {order.shipping_city ||
                                                                "N/A"}
                                                        </span>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <Link
                                                            href={`/logistic/orders/${order.id}`}
                                                            className="flex-1 px-3 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors text-center"
                                                        >
                                                            Update Status
                                                        </Link>
                                                        {order.order_status ===
                                                            "shipped" && (
                                                            <Link
                                                                href={`/logistic/orders/${order.id}/deliver`}
                                                                className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors text-center"
                                                            >
                                                                Mark Delivered
                                                            </Link>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <Truck className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                                        <p className="text-sm text-gray-500">
                                            No active deliveries
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Today's Route Alert */}
                    {safeStats.inTransit > 0 && (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Navigation className="w-6 h-6 text-blue-600" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-blue-900 mb-1">
                                        Active Route Today
                                    </h3>
                                    <p className="text-sm text-blue-700 mb-4">
                                        You have {safeStats.inTransit} active
                                        deliver
                                        {safeStats.inTransit !== 1
                                            ? "ies"
                                            : "y"}{" "}
                                        in progress. Use navigation to optimize
                                        your route.
                                    </p>
                                    <Link
                                        href="/logistic/navigation"
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        Start Navigation
                                        <ArrowUpRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
