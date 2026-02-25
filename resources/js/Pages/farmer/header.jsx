import { Link, usePage } from "@inertiajs/react";
import {
    Bell,
    Search,
    User,
    Settings,
    LogOut,
    Menu,
    Package,
    Plus,
} from "lucide-react";

export default function FarmerHeader({ user }) {
    const { props } = usePage();
    const notificationCount = props.unreadNotifications || 0;
    return (
        <header className="bg-white border-b border-gray-200">
            <div className="flex items-center justify-between h-16 px-6">
                {/* Left side - Menu button and Search */}
                <div className="flex items-center gap-4 flex-1">
                    <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg lg:hidden">
                        <Menu className="w-5 h-5" />
                    </button>
                    <div className="relative hidden md:block max-w-md w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search products..."
                            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
                        />
                    </div>
                </div>

                {/* Right side - Add Product, Notifications, Settings, Profile */}
                <div className="flex items-center gap-3">
                    {/* Add Product Button */}
                    <Link
                        href="/farmer/products/create"
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors"
                    >
                        <Plus className="w-4 h-4" />
                        <span className="hidden md:inline">Add Product</span>
                    </Link>

                    {/* Notifications */}
                    <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
                        <Bell className="w-5 h-5" />
                        {notificationCount > 0 && (
                            <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-xs font-medium rounded-full flex items-center justify-center px-1">
                                {notificationCount > 99
                                    ? "99+"
                                    : notificationCount}
                            </span>
                        )}
                    </button>

                    {/* Settings */}
                    <Link
                        href="/farmer/settings"
                        className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <Settings className="w-5 h-5" />
                    </Link>

                    {/* Divider */}
                    <div className="h-8 w-px bg-gray-200"></div>

                    {/* Profile Dropdown */}
                    <div className="relative group">
                        <button className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                                <User className="w-4 h-4 text-gray-600" />
                            </div>
                            <div className="hidden md:block text-left">
                                <p className="text-sm font-medium text-gray-900">
                                    {user?.name || "Farmer"}
                                </p>
                                <p className="text-xs text-gray-500">
                                    Farmer Account
                                </p>
                            </div>
                        </button>

                        {/* Dropdown Menu */}
                        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                            <div className="px-4 py-3 border-b border-gray-100">
                                <p className="text-sm font-medium text-gray-900">
                                    {user?.name || "Farmer"}
                                </p>
                                <p className="text-xs text-gray-500 mt-0.5">
                                    {user?.email || "farmer@example.com"}
                                </p>
                            </div>
                            <Link
                                href="/farmer/profile"
                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                <User className="w-4 h-4 text-gray-500" />
                                My Profile
                            </Link>
                            <Link
                                href="/farmer/products"
                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                <Package className="w-4 h-4 text-gray-500" />
                                My Products
                            </Link>
                            <Link
                                href="/farmer/settings"
                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                <Settings className="w-4 h-4 text-gray-500" />
                                Settings
                            </Link>
                            <hr className="my-1 border-gray-100" />
                            <Link
                                href="/logout"
                                method="post"
                                as="button"
                                className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                            >
                                <LogOut className="w-4 h-4" />
                                Logout
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
