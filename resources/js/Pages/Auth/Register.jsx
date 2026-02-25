import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Head, Link, useForm } from "@inertiajs/react";
import { useState } from "react";
import {
    Sprout,
    ShoppingCart,
    Shield,
    Truck,
    Leaf,
    CheckCircle,
    Mail,
    Lock,
} from "lucide-react";

export default function Register() {
    const [selectedRole, setSelectedRole] = useState("buyer");

    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
        role: "buyer",
        phone: "",
        address: "",
        farm_location: "",
        farm_description: "",
    });

    const roles = [
        {
            value: "buyer",
            label: "Buyer",
            icon: ShoppingCart,
            description: "Shop for fresh products",
            color: "bg-blue-500",
        },
        {
            value: "farmer",
            label: "Farmer",
            icon: Sprout,
            description: "Sell your products",
            color: "bg-green-500",
        },
        {
            value: "admin",
            label: "Admin",
            icon: Shield,
            description: "Manage the platform",
            color: "bg-purple-500",
        },
        {
            value: "logistics",
            label: "Logistics",
            icon: Truck,
            description: "Handle delivery",
            color: "bg-orange-500",
        },
    ];

    const features = [
        "Direct farm-to-table connections",
        "Premium quality assurance",
        "Fair pricing for all",
        "Fresh delivery guaranteed",
    ];

    const handleRoleChange = (role) => {
        setSelectedRole(role);
        setData("role", role);
    };

    const submit = (e) => {
        e.preventDefault();

        post(route("register"), {
            onFinish: () => reset("password", "password_confirmation"),
        });
    };

    return (
        <>
            <Head title="Register" />

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@400;600;700&family=Philosopher:wght@400;700&family=DM+Sans:wght@400;500;600;700&display=swap');
                
                .heading-font {
                    font-family: 'Crimson Pro', serif;
                }
                
                .display-font {
                    font-family: 'Philosopher', sans-serif;
                }
                 div::-webkit-scrollbar{
                 display:none;
                 }
                
                @keyframes slideInLeft {
                    from {
                        opacity: 0;
                        transform: translateX(-60px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
                
                @keyframes slideInRight {
                    from {
                        opacity: 0;
                        transform: translateX(60px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
                
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                @keyframes float {
                    0%, 100% { transform: translateY(0) rotate(0deg); }
                    50% { transform: translateY(-30px) rotate(3deg); }
                }
                
                @keyframes floatReverse {
                    0%, 100% { transform: translateY(0) rotate(0deg); }
                    50% { transform: translateY(-20px) rotate(-3deg); }
                }
                
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
                
                @keyframes grain {
                    0%, 100% { transform: translate(0, 0); }
                    10% { transform: translate(-5%, -10%); }
                    20% { transform: translate(-15%, 5%); }
                    30% { transform: translate(7%, -25%); }
                    40% { transform: translate(-5%, 25%); }
                    50% { transform: translate(-15%, 10%); }
                    60% { transform: translate(15%, 0); }
                    70% { transform: translate(0, 15%); }
                    80% { transform: translate(-15%, 10%); }
                    90% { transform: translate(15%, 5%); }
                }
                
                .animate-slideInLeft {
                    animation: slideInLeft 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
                
                .animate-slideInRight {
                    animation: slideInRight 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
                
                .animate-fadeIn {
                    animation: fadeIn 0.6s ease-out forwards;
                }
                
                .animate-float {
                    animation: float 8s ease-in-out infinite;
                }
                
                .animate-floatReverse {
                    animation: floatReverse 10s ease-in-out infinite;
                }
                
                .animate-pulse {
                    animation: pulse 3s ease-in-out infinite;
                }
                
                .grain-overlay {
                    position: absolute;
                    inset: 0;
                    background-image: url('data:image/svg+xml;utf8,<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg"><filter id="noiseFilter"><feTurbulence type="fractalNoise" baseFrequency="3.5" numOctaves="4" stitchTiles="stitch"/></filter><rect width="100%" height="100%" filter="url(%23noiseFilter)" opacity="0.08"/></svg>');
                    animation: grain 8s steps(10) infinite;
                    pointer-events: none;
                    opacity: 0.6;
                }
                
                .organic-blob {
                    border-radius: 63% 37% 54% 46% / 55% 48% 52% 45%;
                }
                
                .leaf-pattern {
                    background-image: url('data:image/svg+xml;utf8,<svg width="80" height="80" viewBox="0 0 80 80" xmlns="http://www.w3.org/2000/svg"><path d="M40 15 Q 48 28, 40 40 Q 32 28, 40 15" fill="rgba(255,255,255,0.04)" /><path d="M20 50 Q 26 60, 20 70 Q 14 60, 20 50" fill="rgba(255,255,255,0.03)" /><path d="M60 35 Q 66 45, 60 55 Q 54 45, 60 35" fill="rgba(255,255,255,0.03)" /></svg>');
                    background-repeat: repeat;
                }
                
                .delay-100 { animation-delay: 0.1s; }
                .delay-200 { animation-delay: 0.2s; }
                .delay-300 { animation-delay: 0.3s; }
                .delay-400 { animation-delay: 0.4s; }
                .delay-500 { animation-delay: 0.5s; }
                .delay-600 { animation-delay: 0.6s; }
                .delay-700 { animation-delay: 0.7s; }
                .delay-800 { animation-delay: 0.8s; }
            `}</style>

            <div className="min-h-screen flex">
                {/* Left Panel - Agricultural Visual */}
                <div className="hidden lg:flex lg:w-1/2 sticky top-0 h-screen bg-gradient-to-br from-[#1a3d0f] via-[#2d5016] to-[#4a7c59] overflow-y-auto">
                    {/* Grain Texture */}
                    <div className="grain-overlay"></div>

                    {/* Leaf Pattern */}
                    <div className="absolute inset-0 leaf-pattern opacity-30"></div>

                    {/* Floating Decorative Elements */}
                    <div className="absolute top-20 left-20 w-32 h-32 bg-white/5 rounded-full blur-3xl animate-float"></div>
                    <div className="absolute bottom-32 right-20 w-40 h-40 bg-[#6b8e23]/20 rounded-full blur-3xl animate-floatReverse"></div>
                    <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-white/10 organic-blob animate-pulse"></div>

                    {/* Content */}
                    <div className="relative z-10 flex flex-col justify-center px-10 py-6 text-white">
                        {/* Logo */}
                        <div className="mb-6 animate-slideInLeft">
                            <div className="flex items-center space-x-4 mb-6">
                                <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center organic-blob">
                                    <Sprout className="w-9 h-9 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-4xl font-bold display-font">
                                        BSAB
                                    </h1>
                                    <p className="text-white/80 text-sm">
                                        Agricultural Marketplace
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Main Heading */}
                        <div className="mb-6 animate-slideInLeft delay-100">
                            <h2 className="text-5xl font-bold heading-font leading-tight mb-4">
                                Join Our Agricultural Community
                            </h2>
                            <p className="text-xl text-white/90 leading-relaxed">
                                Create an account to start your journey in
                                supporting local farmers and accessing premium
                                agricultural products.
                            </p>
                        </div>

                        {/* Features List */}
                        <div className="space-y-3 mb-6">
                            {features.map((feature, index) => (
                                <div
                                    key={index}
                                    className={`flex items-center space-x-3 animate-slideInLeft delay-${(index + 3) * 100}`}
                                >
                                    <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
                                        <CheckCircle className="w-5 h-5 text-[#a8d08d]" />
                                    </div>
                                    <span className="text-white/90 font-medium">
                                        {feature}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/20 animate-slideInLeft delay-700">
                            <div>
                                <p className="text-3xl font-bold heading-font mb-1">
                                    15K+
                                </p>
                                <p className="text-white/70 text-sm">
                                    Active Farmers
                                </p>
                            </div>
                            <div>
                                <p className="text-3xl font-bold heading-font mb-1">
                                    50K+
                                </p>
                                <p className="text-white/70 text-sm">
                                    Products
                                </p>
                            </div>
                            <div>
                                <p className="text-3xl font-bold heading-font mb-1">
                                    100K+
                                </p>
                                <p className="text-white/70 text-sm">
                                    Customers
                                </p>
                            </div>
                        </div>

                        {/* Decorative Leaf Icons */}
                        <div className="absolute bottom-8 right-8 opacity-10">
                            <Leaf className="w-32 h-32 transform rotate-45" />
                        </div>
                        <div className="absolute top-1/4 right-16 opacity-10">
                            <Leaf className="w-24 h-24 transform -rotate-12" />
                        </div>
                    </div>
                </div>

                {/* Right Panel - Registration Form */}
                <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-[#faf8f3] overflow-y-auto">
                    <div className="w-full max-w-md">
                        {/* Mobile Logo */}
                        <div className="lg:hidden mb-8 text-center animate-fadeIn">
                            <div className="flex items-center justify-center space-x-3 mb-4">
                                <div className="w-12 h-12 bg-[#2d5016] rounded-full flex items-center justify-center organic-blob">
                                    <Sprout className="w-7 h-7 text-white" />
                                </div>
                                <h1 className="text-3xl font-bold display-font text-[#2d5016]">
                                    BSAB
                                </h1>
                            </div>
                        </div>

                        {/* Form Header */}
                        <div className="mb-6 animate-slideInRight">
                            <h2 className="text-4xl font-bold heading-font text-[#2d5016] mb-2">
                                Create Account
                            </h2>
                            <p className="text-gray-600">
                                Join our agricultural marketplace today
                            </p>
                        </div>

                        {/* Registration Form */}
                        <form onSubmit={submit} className="space-y-5">
                            {/* Role Selection */}
                            <div className="animate-slideInRight delay-100">
                                <InputLabel
                                    value="I want to register as"
                                    className="text-base font-semibold mb-3"
                                />

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                    {roles.map((role) => (
                                        <button
                                            key={role.value}
                                            type="button"
                                            onClick={() =>
                                                handleRoleChange(role.value)
                                            }
                                            className={`p-3 rounded-lg border-2 transition-all text-center ${
                                                selectedRole === role.value
                                                    ? "border-[#2d5016] bg-[#2d5016]/5"
                                                    : "border-gray-200 hover:border-[#2d5016]/50"
                                            }`}
                                        >
                                            <role.icon
                                                className={`w-6 h-6 mx-auto mb-1.5 ${role.color} text-white p-1 rounded-full`}
                                            />
                                            <span className="block text-sm font-medium text-gray-800">
                                                {role.label}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                                <InputError
                                    message={errors.role}
                                    className="mt-2"
                                />
                            </div>

                            {/* Name Field */}
                            <div className="animate-slideInRight delay-100">
                                <InputLabel htmlFor="name" value="Full Name" />

                                <TextInput
                                    id="name"
                                    name="name"
                                    value={data.name}
                                    className="mt-1 block w-full"
                                    autoComplete="name"
                                    isFocused={true}
                                    onChange={(e) =>
                                        setData("name", e.target.value)
                                    }
                                    required
                                />

                                <InputError
                                    message={errors.name}
                                    className="mt-2"
                                />
                            </div>

                            {/* Email Field */}
                            <div className="animate-slideInRight delay-200">
                                <InputLabel
                                    htmlFor="email"
                                    value="Email Address"
                                />

                                <TextInput
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="mt-1 block w-full"
                                    autoComplete="username"
                                    onChange={(e) =>
                                        setData("email", e.target.value)
                                    }
                                    required
                                />

                                <InputError
                                    message={errors.email}
                                    className="mt-2"
                                />
                            </div>

                            {/* Password Field */}
                            <div className="animate-slideInRight delay-300">
                                <InputLabel
                                    htmlFor="password"
                                    value="Password"
                                />

                                <TextInput
                                    id="password"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    className="mt-1 block w-full"
                                    autoComplete="new-password"
                                    onChange={(e) =>
                                        setData("password", e.target.value)
                                    }
                                    required
                                />

                                <InputError
                                    message={errors.password}
                                    className="mt-2"
                                />
                            </div>

                            {/* Confirm Password Field */}
                            <div className="animate-slideInRight delay-400">
                                <InputLabel
                                    htmlFor="password_confirmation"
                                    value="Confirm Password"
                                />

                                <TextInput
                                    id="password_confirmation"
                                    type="password"
                                    name="password_confirmation"
                                    value={data.password_confirmation}
                                    className="mt-1 block w-full"
                                    autoComplete="new-password"
                                    onChange={(e) =>
                                        setData(
                                            "password_confirmation",
                                            e.target.value,
                                        )
                                    }
                                    required
                                />

                                <InputError
                                    message={errors.password_confirmation}
                                    className="mt-2"
                                />
                            </div>

                            {/* Phone Field */}
                            <div className="animate-slideInRight delay-500">
                                <InputLabel
                                    htmlFor="phone"
                                    value="Phone Number"
                                />

                                <TextInput
                                    id="phone"
                                    type="tel"
                                    name="phone"
                                    value={data.phone}
                                    className="mt-1 block w-full"
                                    onChange={(e) =>
                                        setData("phone", e.target.value)
                                    }
                                    placeholder="+63 912 345 6789"
                                />

                                <InputError
                                    message={errors.phone}
                                    className="mt-2"
                                />
                            </div>

                            {/* Address Field */}
                            <div className="animate-slideInRight delay-600">
                                <InputLabel htmlFor="address" value="Address" />

                                <textarea
                                    id="address"
                                    name="address"
                                    value={data.address}
                                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-[#2d5016] focus:ring-[#2d5016]"
                                    rows="2"
                                    onChange={(e) =>
                                        setData("address", e.target.value)
                                    }
                                    placeholder="Your complete address"
                                />

                                <InputError
                                    message={errors.address}
                                    className="mt-2"
                                />
                            </div>

                            {/* Farmer-specific fields */}
                            {selectedRole === "farmer" && (
                                <div className="animate-slideInRight delay-700 p-4 bg-[#2d5016]/5 rounded-lg border border-[#2d5016]/20">
                                    <h3 className="font-semibold text-[#2d5016] mb-3">
                                        Farm Information
                                    </h3>

                                    <div className="mb-3">
                                        <InputLabel
                                            htmlFor="farm_location"
                                            value="Farm Location"
                                        />

                                        <TextInput
                                            id="farm_location"
                                            name="farm_location"
                                            value={data.farm_location}
                                            className="mt-1 block w-full"
                                            onChange={(e) =>
                                                setData(
                                                    "farm_location",
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="e.g., Bulacan, Philippines"
                                        />

                                        <InputError
                                            message={errors.farm_location}
                                            className="mt-2"
                                        />
                                    </div>

                                    <div>
                                        <InputLabel
                                            htmlFor="farm_description"
                                            value="Farm Description"
                                        />

                                        <textarea
                                            id="farm_description"
                                            name="farm_description"
                                            value={data.farm_description}
                                            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-[#2d5016] focus:ring-[#2d5016]"
                                            rows="3"
                                            onChange={(e) =>
                                                setData(
                                                    "farm_description",
                                                    e.target.value,
                                                )
                                            }
                                            placeholder="Tell us about your farm..."
                                        />

                                        <InputError
                                            message={errors.farm_description}
                                            className="mt-2"
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Submit Button */}
                            <div className="animate-slideInRight delay-800">
                                <PrimaryButton
                                    className="w-full justify-center"
                                    disabled={processing}
                                >
                                    {processing
                                        ? "Creating Account..."
                                        : `Create Account as ${
                                              roles.find(
                                                  (r) =>
                                                      r.value === selectedRole,
                                              )?.label
                                          }`}
                                </PrimaryButton>
                            </div>

                            {/* Divider */}
                            <div className="relative animate-slideInRight delay-800">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-4 bg-[#faf8f3] text-gray-500 font-medium">
                                        Already have an account?
                                    </span>
                                </div>
                            </div>

                            {/* Login Link */}
                            <div className="animate-slideInRight delay-800">
                                <Link
                                    href={route("login")}
                                    className="w-full border-2 border-[#2d5016] text-[#2d5016] py-3 px-6 rounded-xl font-bold text-center hover:bg-[#2d5016] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#2d5016] focus:ring-offset-2 transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center"
                                >
                                    <span>Sign In to Your Account</span>
                                </Link>
                            </div>
                        </form>

                        {/* Back to Home */}
                        <div className="mt-6 text-center animate-slideInRight delay-800">
                            <Link
                                href="/"
                                className="text-sm text-gray-600 hover:text-[#2d5016] font-medium transition-colors inline-flex items-center space-x-1"
                            >
                                <span>← Back to Home</span>
                            </Link>
                        </div>

                        {/* Footer Note */}
                        <p className="mt-6 text-xs text-center text-gray-500 animate-slideInRight delay-800">
                            By creating an account, you agree to our Terms of
                            Service and Privacy Policy
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
