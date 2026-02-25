import DashboardLayout from "@/Components/DashboardLayout";

export default function LogisticsLayout({ children, title = "Dashboard" }) {
    const navigation = [
        { name: "Dashboard", href: "/dashboard", emoji: "🏠" },
        { name: "Deliveries", href: "/orders", emoji: "🚚" },
        { name: "Orders", href: "/orders", emoji: "📦" },
        { name: "Profile", href: "/profile", emoji: "👤" },
    ];

    return (
        <DashboardLayout
            title={title}
            role="logistics"
            roleLabel="Logistics"
            roleEmoji="🛵"
            brandName="BSAB Logistics"
            brandEmoji="🚚"
            primaryColor="#b45309"
            secondaryColor="#78350f"
            navigation={navigation}
        >
            {children}
        </DashboardLayout>
    );
}
