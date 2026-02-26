import { Head, Link } from "@inertiajs/react";
import {
    Sprout,
    ShoppingCart,
    Users,
    Shield,
    TrendingUp,
    Package,
    ChevronRight,
    ArrowRight,
    Menu,
    X,
} from "lucide-react";
import { useState, useEffect } from "react";

export default function Welcome({
    auth = {},
    laravelVersion = "",
    phpVersion = "",
}) {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const categories = [
        { name: "Fresh Vegetables", icon: "🥬", color: "#2d5016" },
        { name: "Organic Fruits", icon: "🍎", color: "#c1440e" },
        { name: "Grains & Seeds", icon: "🌾", color: "#8b6914" },
        { name: "Dairy Products", icon: "🥛", color: "#4a7c59" },
    ];

    const features = [
        {
            icon: <Users className="w-10 h-10" />,
            title: "Direct from Farmers",
            description:
                "Connect directly with local farmers for the freshest products",
        },
        {
            icon: <Shield className="w-10 h-10" />,
            title: "Quality Assured",
            description:
                "Every product is verified to meet agricultural standards",
        },
        {
            icon: <TrendingUp className="w-10 h-10" />,
            title: "Fair Pricing",
            description:
                "Transparent pricing ensuring fair compensation for farmers",
        },
        {
            icon: <Package className="w-10 h-10" />,
            title: "Fresh Delivery",
            description:
                "Cold chain logistics for perfect condition delivery",
        },
    ];

    const stats = [
        { number: "15K+", label: "Active Farmers" },
        { number: "50K+", label: "Products Listed" },
        { number: "100K+", label: "Happy Customers" },
        { number: "500+", label: "Partner Cities" },
    ];

    return (
        <>
            <Head title="Welcome - BSAB Agricultural Marketplace" />

            <div className="min-h-screen bg-[#faf8f3]">

                {/* HEADER */}
                <header className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? "bg-white shadow-lg" : "bg-transparent"}`}>
                    <nav className="container mx-auto px-6 py-4 flex justify-between items-center">

                        <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-[#2d5016] rounded-full flex items-center justify-center">
                                <Sprout className="w-7 h-7 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-[#2d5016]">
                                    BSAB
                                </h1>
                                <p className="text-xs text-[#2d5016]">
                                    Agricultural Marketplace
                                </p>
                            </div>
                        </div>

                        <div className="hidden md:flex items-center space-x-6">
                            {auth?.user ? (
                                <Link
                                    href="/dashboard"
                                    className="bg-[#2d5016] text-white px-6 py-2.5 rounded-full hover:bg-[#3d6622]"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href="/login"
                                        className="text-[#2d5016] font-medium"
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        href="/register"
                                        className="bg-[#2d5016] text-white px-6 py-2.5 rounded-full"
                                    >
                                        Register
                                    </Link>
                                </>
                            )}
                        </div>

                        <button
                            className="md:hidden"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? <X /> : <Menu />}
                        </button>
                    </nav>
                </header>

                {/* MOBILE MENU */}
                {mobileMenuOpen && (
                    <div className="fixed inset-0 bg-white z-40 pt-20 px-6 md:hidden">
                        <div className="flex flex-col space-y-6">
                            {auth?.user ? (
                                <Link href="/dashboard">Dashboard</Link>
                            ) : (
                                <>
                                    <Link href="/login">Log in</Link>
                                    <Link href="/register">Register</Link>
                                </>
                            )}
                        </div>
                    </div>
                )}

                {/* HERO */}
                <section className="pt-32 pb-20 bg-[#2d5016] text-white">
                    <div className="container mx-auto px-6 text-center">
                        <h1 className="text-5xl font-bold mb-6">
                            Connecting Farms to Your Table
                        </h1>
                        <p className="text-lg mb-8 max-w-2xl mx-auto">
                            Fresh, sustainable agricultural products directly
                            from verified farmers.
                        </p>

                        {auth?.user ? (
                            <Link
                                href="/dashboard"
                                className="bg-white text-[#2d5016] px-8 py-3 rounded-full font-semibold inline-flex items-center gap-2"
                            >
                                Go to Dashboard <ArrowRight size={18} />
                            </Link>
                        ) : (
                            <Link
                                href="/register"
                                className="bg-white text-[#2d5016] px-8 py-3 rounded-full font-semibold inline-flex items-center gap-2"
                            >
                                Start Shopping <ArrowRight size={18} />
                            </Link>
                        )}
                    </div>
                </section>

                {/* CATEGORIES */}
                <section className="py-16 bg-white">
                    <div className="container mx-auto px-6 grid md:grid-cols-4 gap-6">
                        {categories.map((category, index) => (
                            <div
                                key={index}
                                className="p-8 rounded-2xl shadow text-center"
                                style={{ backgroundColor: `${category.color}10` }}
                            >
                                <div className="text-5xl mb-4">
                                    {category.icon}
                                </div>
                                <h3 className="font-bold">
                                    {category.name}
                                </h3>
                            </div>
                        ))}
                    </div>
                </section>

                {/* FEATURES */}
                <section className="py-16 bg-[#faf8f3]">
                    <div className="container mx-auto px-6 grid md:grid-cols-4 gap-6">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="bg-white p-6 rounded-xl shadow"
                            >
                                <div className="text-[#2d5016] mb-4">
                                    {feature.icon}
                                </div>
                                <h3 className="font-bold mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-sm text-gray-600">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* STATS */}
                <section className="py-16 bg-[#2d5016] text-white">
                    <div className="container mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                        {stats.map((stat, index) => (
                            <div key={index}>
                                <p className="text-4xl font-bold">
                                    {stat.number}
                                </p>
                                <p>{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* FOOTER */}
                <footer className="bg-[#1a2f0f] text-white py-8 text-center">
                    <p>
                        © 2026 BSAB Agricultural Marketplace
                    </p>
                    <p className="text-sm mt-2">
                        Laravel v{laravelVersion} | PHP v{phpVersion}
                    </p>
                </footer>
            </div>
        </>
    );
}
