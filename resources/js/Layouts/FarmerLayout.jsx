import DashboardLayout from "@/Components/DashboardLayout";

export default function FarmerLayout({ children, title = "Dashboard" }) {
    const navigation = [
        { name: "Dashboard", href: "/dashboard", emoji: "🏠" },
        { name: "My Products", href: "/products", emoji: "🌾" },
        { name: "Add Product", href: "/products/create", emoji: "➕" },
        { name: "Orders", href: "/orders", emoji: "📦" },
        { name: "Profile", href: "/profile", emoji: "👤" },
    ];

    return (
        <DashboardLayout
            title={title}
            role="farmer"
            roleLabel="Farmer"
            roleEmoji="👨‍🌾"
            brandName="BSAB Farmer"
            brandEmoji="🌾"
            primaryColor="#2d5016"
            secondaryColor="#1a2f0f"
            navigation={navigation}
        >
            {children}
        </DashboardLayout>
    );
}
