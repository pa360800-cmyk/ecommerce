import DashboardLayout from "@/Components/DashboardLayout";

export default function BuyerLayout({ children, title = "Dashboard" }) {
    const navigation = [
        { name: "Dashboard", href: "/dashboard", emoji: "🏠" },
        { name: "Products", href: "/products", emoji: "🛍️" },
        { name: "Cart", href: "/cart", emoji: "🛒" },
        { name: "Orders", href: "/orders", emoji: "📦" },
        { name: "Profile", href: "/profile", emoji: "👤" },
    ];

    return (
        <DashboardLayout
            title={title}
            role="buyer"
            roleLabel="Buyer"
            roleEmoji="🛒"
            brandName="BSAB Buyer"
            brandEmoji="🛒"
            primaryColor="#2d5016"
            secondaryColor="#1a2f0f"
            navigation={navigation}
        >
            {children}
        </DashboardLayout>
    );
}
