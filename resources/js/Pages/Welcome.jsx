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

export default function Welcome({ auth, laravelVersion, phpVersion }) {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleImageError = () => {
        document
            .getElementById("screenshot-container")
            ?.classList.add("!hidden");
        document.getElementById("docs-card")?.classList.add("!row-span-1");
        document
            .getElementById("docs-card-content")
            ?.classList.add("!flex-row");
        document.getElementById("background")?.classList.add("!hidden");
    };

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
                "Connect directly with local farmers and agricultural producers for the freshest products",
        },
        {
            icon: <Shield className="w-10 h-10" />,
            title: "Quality Assured",
            description:
                "Every product is verified and certified to meet the highest agricultural standards",
        },
        {
            icon: <TrendingUp className="w-10 h-10" />,
            title: "Fair Pricing",
            description:
                "Transparent pricing that ensures fair compensation for farmers and value for buyers",
        },
        {
            icon: <Package className="w-10 h-10" />,
            title: "Fresh Delivery",
            description:
                "Cold chain logistics ensure farm-fresh products reach your doorstep in perfect condition",
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

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@400;600;700&family=DM+Sans:wght@400;500;700&display=swap');
                
                * {
                    margin: 0;
                    padding: 0;
                    box-sizing: border-box;
                }
                
                body {
                    font-family: 'DM Sans', sans-serif;
                    overflow-x: hidden;
                }

                    body::-webkit-scrollbar{
                    display:none;
                    }
                
                .heading-font {
                    font-family: 'Crimson Pro', serif;
                }
                   
                
                @keyframes fadeInUp {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                
                @keyframes slideInLeft {
                    from {
                        opacity: 0;
                        transform: translateX(-50px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
                
                @keyframes float {
                    0%, 100% { transform: translateY(0px) rotate(0deg); }
                    50% { transform: translateY(-20px) rotate(5deg); }
                }
                
                @keyframes grain {
                    0%, 100% { transform: translate(0, 0); }
                    10% { transform: translate(-5%, -5%); }
                    20% { transform: translate(-10%, 5%); }
                    30% { transform: translate(5%, -10%); }
                    40% { transform: translate(-5%, 15%); }
                    50% { transform: translate(-10%, 5%); }
                    60% { transform: translate(15%, 0); }
                    70% { transform: translate(0, 10%); }
                    80% { transform: translate(-15%, 0); }
                    90% { transform: translate(10%, 5%); }
                }
                
                .animate-fadeInUp {
                    animation: fadeInUp 0.8s ease-out forwards;
                }
                
                .animate-fadeIn {
                    animation: fadeIn 1s ease-out forwards;
                }
                
                .animate-float {
                    animation: float 6s ease-in-out infinite;
                }
                
                .grain-overlay {
                    position: fixed;
                    top: -50%;
                    left: -50%;
                    right: -50%;
                    bottom: -50%;
                    width: 200%;
                    height: 200%;
                    background: url('data:image/svg+xml;utf8,<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg"><filter id="noiseFilter"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(%23noiseFilter)" opacity="0.05"/></svg>');
                    animation: grain 8s steps(10) infinite;
                    pointer-events: none;
                    z-index: 1000;
                }
                
                .hero-gradient {
                    background: linear-gradient(135deg, #2d5016 0%, #4a7c59 50%, #6b8e23 100%);
                }
                
                .leaf-pattern {
                    background-image: url('data:image/svg+xml;utf8,<svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"><path d="M30 10 Q 35 20, 30 30 Q 25 20, 30 10" fill="rgba(255,255,255,0.03)" /></svg>');
                    background-repeat: repeat;
                }
                
                .card-hover {
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                }
                
                .card-hover:hover {
                    transform: translateY(-8px);
                    box-shadow: 0 20px 40px rgba(45, 80, 22, 0.15);
                }
                
                .category-card {
                    transition: all 0.3s ease;
                    cursor: pointer;
                }
                
                .category-card:hover {
                    transform: scale(1.05);
                }
                
                .organic-blob {
                    border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
                }
                
                .delay-100 { animation-delay: 0.1s; }
                .delay-200 { animation-delay: 0.2s; }
                .delay-300 { animation-delay: 0.3s; }
                .delay-400 { animation-delay: 0.4s; }
                .delay-500 { animation-delay: 0.5s; }
                .delay-600 { animation-delay: 0.6s; }
            `}</style>

            <div className="min-h-screen bg-[#faf8f3]">
                {/* Grain Overlay */}
                <div className="grain-overlay"></div>

                {/* Header */}
                <header
                    className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? "bg-white shadow-lg" : "bg-transparent"}`}
                >
                    <nav className="container mx-auto px-6 py-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 bg-[#2d5016] rounded-full flex items-center justify-center organic-blob">
                                    <Sprout className="w-7 h-7 text-white" />
                                </div>
                                <div>
                                    <h1
                                        className={`text-2xl font-bold heading-font ${scrolled ? "text-[#2d5016]" : "text-white"}`}
                                        style={{ color: "#2d5016" }}
                                    >
                                        BSAB
                                    </h1>
                                    <p
                                        className={`text-xs ${scrolled ? "text-gray-600" : "text-green/90"}`}
                                        style={{ color: "#2d5016" }}
                                    >
                                        Agricultural Marketplace
                                    </p>
                                </div>
                            </div>

                            <div className="hidden md:flex items-center space-x-8">
                                <a
                                    href="#farmers"
                                    className={`font-medium hover:text-[#7ddb52] transition-colors ${scrolled ? "text-gray-700" : "text-white"}`}
                                    style={{ color: "#2d5016" }}
                                >
                                    Home
                                </a>
                                <a
                                    href="#products"
                                    className={`font-medium hover:text-[#7ddb52] transition-colors ${scrolled ? "text-gray-700" : "text-white"}`}
                                    style={{ color: "#2d5016" }}
                                >
                                    Products
                                </a>

                                <a
                                    href="#about"
                                    className={`font-medium hover:text-[#7ddb52] transition-colors ${scrolled ? "text-gray-700" : "text-white"}`}
                                    style={{ color: "#2d5016" }}
                                >
                                    About
                                </a>
                                <a
                                    href="#contact"
                                    className={`font-medium hover:text-[#7ddb52] transition-colors ${scrolled ? "text-gray-700" : "text-white"}`}
                                    style={{ color: "#2d5016" }}
                                >
                                    Contact
                                </a>
                                {auth.user ? (
                                    <Link
                                        href={route("dashboard")}
                                        className="bg-[#2d5016] text-white px-6 py-2.5 rounded-full hover:bg-[#7ddb52] transition-all flex items-center space-x-2 shadow-lg"
                                    >
                                        Dashboard
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={route("login")}
                                            className="bg-[#2d5016] text-white px-6 py-2.5 rounded-full hover:bg-[#3d6622] transition-all flex items-center space-x-2 shadow-lg"
                                        >
                                            <span>Log in</span>
                                        </Link>
                                    </>
                                )}
                            </div>

                            <button
                                className="md:hidden"
                                onClick={() =>
                                    setMobileMenuOpen(!mobileMenuOpen)
                                }
                            >
                                {mobileMenuOpen ? (
                                    <X
                                        className={
                                            scrolled
                                                ? "text-gray-700"
                                                : "text-black"
                                        }
                                    />
                                ) : (
                                    <Menu
                                        className={
                                            scrolled
                                                ? "text-gray-700"
                                                : "text-black"
                                        }
                                    />
                                )}
                            </button>
                        </div>
                    </nav>
                </header>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="fixed inset-0 z-40 bg-white pt-20 px-6 md:hidden animate-fadeIn">
                        <div className="flex flex-col space-y-6">
                            <a
                                href="#products"
                                className="text-xl font-medium text-gray-700 hover:text-[#6b8e23]"
                            >
                                Products
                            </a>
                            <a
                                href="#farmers"
                                className="text-xl font-medium text-gray-700 hover:text-[#6b8e23]"
                            >
                                Farmers
                            </a>
                            <a
                                href="#about"
                                className="text-xl font-medium text-gray-700 hover:text-[#6b8e23]"
                            >
                                About
                            </a>
                            <a
                                href="#contact"
                                className="text-xl font-medium text-gray-700 hover:text-[#6b8e23]"
                            >
                                Contact
                            </a>
                            {auth.user ? (
                                <Link
                                    href={route("dashboard")}
                                    className="bg-[#2d5016] text-white px-6 py-3 rounded-full hover:bg-[#3d6622] transition-all flex items-center justify-center space-x-2"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route("login")}
                                        className="text-xl font-medium text-gray-700 hover:text-[#6b8e23]"
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        href={route("register")}
                                        className="bg-[#2d5016] text-white px-6 py-3 rounded-full hover:bg-[#3d6622] transition-all flex items-center justify-center space-x-2"
                                    >
                                        Register
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                )}

                {/* Hero Section */}
                <section className="hero-gradient leaf-pattern pt-32 pb-20 relative overflow-hidden">
                    {/* Decorative Elements */}
                    <div className="absolute top-20 right-10 w-32 h-32 bg-white/10 rounded-full blur-3xl animate-float"></div>
                    <div
                        className="absolute bottom-10 left-10 w-40 h-40 bg-white/10 rounded-full blur-3xl animate-float"
                        style={{ animationDelay: "2s" }}
                    ></div>

                    <div className="container mx-auto px-6 relative z-10">
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div className="text-white space-y-6">
                                <div className="inline-block bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full animate-fadeInUp">
                                    <span
                                        className="text-sm font-medium"
                                        style={{ color: "#2d5016" }}
                                    >
                                        🌱 Farm Fresh & Organic
                                    </span>
                                </div>

                                <h1
                                    className="text-5xl md:text-7xl font-bold heading-font leading-tight animate-fadeInUp delay-100"
                                    style={{ color: "#2d5016" }}
                                >
                                    Connecting Farms to Your Table
                                </h1>

                                <p
                                    className="text-xl text-white/90 leading-relaxed animate-fadeInUp delay-200"
                                    style={{ color: "#2d5016" }}
                                >
                                    Discover premium agricultural products
                                    directly from verified farmers. Fresh,
                                    sustainable, and delivered with care to
                                    support local agriculture.
                                </p>

                                <div className="flex flex-col sm:flex-row gap-4 pt-4 animate-fadeInUp delay-300">
                                    {auth.user ? (
                                        <Link
                                            href={route("dashboard")}
                                            className="bg-white text-[#2d5016] px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-all flex items-center justify-center space-x-2 shadow-xl"
                                        >
                                            <span>Go to Dashboard</span>
                                            <ArrowRight className="w-5 h-5" />
                                        </Link>
                                    ) : (
                                        <>
                                            <Link
                                                href={route("register")}
                                                className="bg-white text-[#2d5016] px-8 py-4 rounded-full font-semibold hover:bg-gray-100 transition-all flex items-center justify-center space-x-2 shadow-xl"
                                            >
                                                <span>Start Shopping</span>
                                                <ArrowRight className="w-5 h-5" />
                                            </Link>
                                            <Link
                                                href={route("register")}
                                                className="bg-transparent border-2 border-black/100 text-black/100 px-8 py-4 rounded-full font-semibold hover:bg-white/10 transition-all"
                                            >
                                                Join as Farmer
                                            </Link>
                                        </>
                                    )}
                                </div>

                                <div className="flex items-center space-x-8 pt-6 animate-fadeInUp delay-400">
                                    {stats.slice(0, 2).map((stat, index) => (
                                        <div key={index}>
                                            <p className="text-3xl font-bold heading-font">
                                                {stat.number}
                                            </p>
                                            <p className="text-white/80 text-sm">
                                                {stat.label}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="relative animate-fadeIn delay-300">
                                <div className="relative z-10">
                                    <img
                                        src="https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&q=80"
                                        alt="Fresh Vegetables"
                                        className="rounded-3xl shadow-2xl object-cover w-full h-[500px]"
                                        style={{
                                            borderRadius:
                                                "30% 70% 70% 30% / 30% 30% 70% 70%",
                                        }}
                                    />
                                </div>
                                <div className="absolute -bottom-6 -right-6 w-3/4 h-3/4 bg-[#4a7c59]/30 rounded-3xl blur-2xl"></div>
                                <div className="absolute -top-6 -left-6 w-3/4 h-3/4 bg-[#6b8e23]/30 rounded-3xl blur-2xl"></div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Categories Section */}
                <section id="products" className="py-16 bg-white">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-12 animate-fadeInUp">
                            <h2 className="text-4xl md:text-5xl font-bold heading-font text-[#2d5016] mb-4">
                                Browse by Category
                            </h2>
                            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                                Explore our wide range of farm-fresh products
                                sourced directly from trusted agricultural
                                partners
                            </p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {categories.map((category, index) => (
                                <div
                                    key={index}
                                    className={`category-card bg-gradient-to-br from-white to-gray-50 p-8 rounded-3xl shadow-lg text-center border-2 border-gray-100 animate-fadeInUp delay-${(index + 1) * 100}`}
                                    style={{
                                        backgroundColor: `${category.color}08`,
                                    }}
                                >
                                    <div className="text-6xl mb-4">
                                        {category.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-800 heading-font">
                                        {category.name}
                                    </h3>
                                    <button className="mt-4 text-[#2d5016] font-medium flex items-center justify-center mx-auto space-x-1 hover:space-x-2 transition-all">
                                        <span>Explore</span>
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section id="about" className="py-20 bg-[#faf8f3]">
                    <div className="container mx-auto px-6">
                        <div className="text-center mb-16 animate-fadeInUp">
                            <h2 className="text-4xl md:text-5xl font-bold heading-font text-[#2d5016] mb-4">
                                Why Choose BSAB?
                            </h2>
                            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                                We're revolutionizing agricultural commerce with
                                transparency, quality, and sustainability
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {features.map((feature, index) => (
                                <div
                                    key={index}
                                    className={`card-hover bg-white p-8 rounded-2xl shadow-md border border-gray-100 animate-fadeInUp delay-${(index + 1) * 100}`}
                                >
                                    <div className="w-16 h-16 bg-[#2d5016]/10 rounded-2xl flex items-center justify-center mb-6 text-[#2d5016]">
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-800 mb-3 heading-font">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed">
                                        {feature.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Stats Section */}
                <section className="py-16 bg-[#2d5016] text-white">
                    <div className="container mx-auto px-6">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            {stats.map((stat, index) => (
                                <div
                                    key={index}
                                    className={`text-center animate-fadeInUp delay-${(index + 1) * 100}`}
                                >
                                    <p className="text-5xl font-bold heading-font mb-2">
                                        {stat.number}
                                    </p>
                                    <p className="text-white/80 text-lg">
                                        {stat.label}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section
                    id="contact"
                    className="py-20 bg-gradient-to-r from-[#4a7c59] to-[#6b8e23] text-white relative overflow-hidden"
                >
                    <div className="absolute inset-0 leaf-pattern opacity-20"></div>
                    <div className="container mx-auto px-6 relative z-10">
                        <div className="max-w-3xl mx-auto text-center animate-fadeInUp">
                            <h2 className="text-4xl md:text-5xl font-bold heading-font mb-6">
                                Ready to Support Local Agriculture?
                            </h2>
                            <p className="text-xl text-white/90 mb-8 leading-relaxed">
                                Join thousands of customers who trust BSAB for
                                their fresh, quality agricultural products
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                {auth.user ? (
                                    <Link
                                        href={route("dashboard")}
                                        className="bg-white text-[#2d5016] px-10 py-4 rounded-full font-bold hover:bg-gray-100 transition-all shadow-xl flex items-center justify-center space-x-2"
                                    >
                                        <span>Go to Dashboard</span>
                                        <ArrowRight className="w-5 h-5" />
                                    </Link>
                                ) : (
                                    <>
                                        <Link
                                            href={route("register")}
                                            className="bg-white text-[#2d5016] px-10 py-4 rounded-full font-bold hover:bg-gray-100 transition-all shadow-xl flex items-center justify-center space-x-2"
                                        >
                                            <span>Create Account</span>
                                            <ArrowRight className="w-5 h-5" />
                                        </Link>
                                        <button className="bg-transparent border-2 border-white text-white px-10 py-4 rounded-full font-bold hover:bg-white/10 transition-all">
                                            Learn More
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="bg-[#1a2f0f] text-white py-12">
                    <div className="container mx-auto px-6">
                        <div className="grid md:grid-cols-4 gap-8 mb-8">
                            <div>
                                <div className="flex items-center space-x-3 mb-4">
                                    <div className="w-10 h-10 bg-[#4a7c59] rounded-full flex items-center justify-center organic-blob">
                                        <Sprout className="w-6 h-6 text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold heading-font">
                                        BSAB
                                    </h3>
                                </div>
                                <p className="text-white/70 text-sm">
                                    Connecting farmers and consumers for a
                                    sustainable agricultural future.
                                </p>
                            </div>

                            <div>
                                <h4 className="font-bold mb-4 heading-font">
                                    Products
                                </h4>
                                <ul className="space-y-2 text-white/70 text-sm">
                                    <li>
                                        <a
                                            href="#"
                                            className="hover:text-white transition-colors"
                                        >
                                            Fresh Vegetables
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#"
                                            className="hover:text-white transition-colors"
                                        >
                                            Organic Fruits
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#"
                                            className="hover:text-white transition-colors"
                                        >
                                            Grains & Seeds
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#"
                                            className="hover:text-white transition-colors"
                                        >
                                            Dairy Products
                                        </a>
                                    </li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="font-bold mb-4 heading-font">
                                    Company
                                </h4>
                                <ul className="space-y-2 text-white/70 text-sm">
                                    <li>
                                        <a
                                            href="#"
                                            className="hover:text-white transition-colors"
                                        >
                                            About Us
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#farmers"
                                            className="hover:text-white transition-colors"
                                        >
                                            Our Farmers
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#"
                                            className="hover:text-white transition-colors"
                                        >
                                            Sustainability
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#contact"
                                            className="hover:text-white transition-colors"
                                        >
                                            Contact
                                        </a>
                                    </li>
                                </ul>
                            </div>

                            <div>
                                <h4 className="font-bold mb-4 heading-font">
                                    Support
                                </h4>
                                <ul className="space-y-2 text-white/70 text-sm">
                                    <li>
                                        <a
                                            href="#"
                                            className="hover:text-white transition-colors"
                                        >
                                            Help Center
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#"
                                            className="hover:text-white transition-colors"
                                        >
                                            Shipping Info
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#"
                                            className="hover:text-white transition-colors"
                                        >
                                            Terms of Service
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            href="#"
                                            className="hover:text-white transition-colors"
                                        >
                                            Privacy Policy
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="border-t border-white/10 pt-8 text-center text-white/60 text-sm">
                            <p>
                                &copy; 2026 BSAB Agricultural Marketplace. All
                                rights reserved.
                            </p>
                            <p className="mt-2 text-xs">
                                Laravel v{laravelVersion} | PHP v{phpVersion}
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}
