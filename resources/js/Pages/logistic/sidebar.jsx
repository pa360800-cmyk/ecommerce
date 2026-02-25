import { Link } from "@inertiajs/react";
import {
    LayoutDashboard,
    Truck,
    Package,
    MapPin,
    Clock,
    CheckCircle,
    Bell,
    Settings,
    LogOut,
    Navigation,
    User,
} from "lucide-react";

export default function LogisticsSidebar() {
    const navigation = [
        {
            name: "Dashboard",
            href: "/logistic/dashboard",
            icon: LayoutDashboard,
        },
        { name: "Pending Deliveries", href: "/logistic/pending", icon: Clock },
        { name: "Active Deliveries", href: "/logistic/active", icon: Truck },
        { name: "Delivered", href: "/logistic/delivered", icon: CheckCircle },
        { name: "All Orders", href: "/logistic/orders", icon: Package },
        { name: "Route Map", href: "/logistic/routes", icon: MapPin },
        { name: "Navigation", href: "/logistic/navigation", icon: Navigation },
        { name: "Notifications", href: "/logistic/notifications", icon: Bell },
        { name: "Settings", href: "/logistic/settings", icon: Settings },
        { name: "Profile", href: "/logistic/profile", icon: User },
    ];

    return (
        <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
            {/* Logo */}
            <div className="h-16 flex items-center px-6 border-b border-gray-200">
                <h1 className="text-xl font-semibold text-gray-900">
                    Logistics Panel
                </h1>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
                {navigation.map((item) => {
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className="flex items-center px-3 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-colors"
                        >
                            <Icon className="w-5 h-5 mr-3 text-gray-500" />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>


            {/* Footer */}
            <div className="p-4 border-t border-gray-200">
                <Link
                    href="/logout"
                    method="post"
                    as="button"
                    className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors mb-2"
                >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                </Link>
                <p className="text-xs text-gray-500 text-center">
                    © 2024 Logistics Panel. All rights reserved.
                </p>
            </div>
        </div>
    );
}
