import { Link } from "@inertiajs/react";
import {
    LayoutDashboard,
    Users,
    Package,
    ShoppingCart,
    BarChart3,
    FileText,
    Bell,
    Settings,
    LogOut,
    Shield,
    ScrollText,
} from "lucide-react";

export default function AdminSidebar() {
    const navigation = [
        { name: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
        { name: "Users", href: "/admin/users", icon: Users },
        { name: "Products", href: "/admin/products", icon: Package },
        { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
        { name: "Reports", href: "/admin/reports", icon: BarChart3 },
        { name: "Documents", href: "/admin/documents", icon: FileText },
        { name: "Roles", href: "/admin/roles", icon: Shield },
        { name: "Logs", href: "/admin/logs", icon: ScrollText },
        { name: "Notifications", href: "/admin/notifications", icon: Bell },
        { name: "Settings", href: "/admin/settings", icon: Settings },
    ];

    return (
        <aside className="w-60 bg-white h-full flex flex-col border-r border-gray-200 sticky top-0">
            {/* Logo */}
            <div className="flex items-center justify-center h-16 px-4 border-b border-gray-200">
                <h1 className="text-xl font-bold text-black">Admin Panel</h1>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
                {navigation.map((item) => {
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className="flex items-center px-4 py-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                        >
                            <Icon className="w-5 h-5 mr-3" />
                            {item.name}
                        </Link>
                    );
                })}
            </nav>

            {/* Profile Link */}
            <div className="px-2 py-2">
                <Link
                    href="/admin/profile"
                    className="flex items-center px-4 py-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                >
                    <Users className="w-5 h-5 mr-3" />
                    My Profile
                </Link>
            </div>

            {/* Logout */}
            <div className="p-4 border-t border-gray-200">
                <Link
                    href="/logout"
                    method="post"
                    as="button"
                    className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                </Link>
                <p className="text-xs text-gray-500 text-center mt-3">
                    © 2024 Admin Panel
                </p>
            </div>
        </aside>
    );
}
