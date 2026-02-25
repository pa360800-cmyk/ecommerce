import DashboardLayout from "@/Components/DashboardLayout";

export default function AdminLayout({ children, title = "Dashboard" }) {
    const navigation = [
        { name: "Dashboard", href: "/dashboard", emoji: "📊" },
        { name: "Products", href: "/products", emoji: "📦" },
        { name: "Orders", href: "/orders", emoji: "🛒" },
        { name: "Customers", href: "/users", emoji: "👥" },
        { name: "Profile", href: "/profile", emoji: "👤" },
    ];

    return (
        <DashboardLayout
            title={title}
            role="admin"
            roleLabel="Admin"
            roleEmoji="👨‍💼"
            brandName="BSAB Agri"
            brandEmoji="🌾"
            primaryColor="#2d5016"
            secondaryColor="#1a2f0f"
            navigation={navigation}
        >
            {children}
        </DashboardLayout>
    );
}
