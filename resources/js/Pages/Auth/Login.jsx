import { useState } from "react";
import Checkbox from "@/Components/Checkbox";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import {
    Mail,
    Lock,
    Eye,
    EyeOff,
    Sprout,
    Leaf,
    CheckCircle,
} from "lucide-react";

export default function Login({ status, canResetPassword }) {
    const [showPassword, setShowPassword] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();

        post(route("login"), {
            onFinish: () => reset("password"),
        });
    };

    const features = [
        "Direct farm-to-table connections",
        "Premium quality assurance",
        "Fair pricing for all",
        "Fresh delivery guaranteed",
    ];

    return (
        <>
            <Head title="Log in" />

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@400;600;700&family=Philosopher:wght@400;700&family=DM+Sans:wght@400;500;600;700&display=swap');
                
                .heading-font {
                    font-family: 'Crimson Pro', serif;
                }
                
                .display-font {
                    font-family: 'Philosopher', sans-serif;
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
                <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-[#1a3d0f] via-[#2d5016] to-[#4a7c59]">
                    {/* Grain Texture */}
                    <div className="grain-overlay"></div>

                    {/* Leaf Pattern */}
                    <div className="absolute inset-0 leaf-pattern opacity-30"></div>

                    {/* Floating Decorative Elements */}
                    <div className="absolute top-20 left-20 w-32 h-32 bg-white/5 rounded-full blur-3xl animate-float"></div>
                    <div className="absolute bottom-32 right-20 w-40 h-40 bg-[#6b8e23]/20 rounded-full blur-3xl animate-floatReverse"></div>
                    <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-white/10 organic-blob animate-pulse"></div>

                    {/* Content */}
                    <div className="relative z-10 flex flex-col justify-center px-16 py-12 text-white">
                        {/* Logo */}
                        <div className="mb-12 animate-slideInLeft">
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
                        <div className="mb-12 animate-slideInLeft delay-100">
                            <h2 className="text-5xl font-bold heading-font leading-tight mb-4">
                                Welcome Back to Fresh Farming
                            </h2>
                            <p className="text-xl text-white/90 leading-relaxed">
                                Continue your journey supporting local farmers
                                and accessing premium agricultural products.
                            </p>
                        </div>

                        {/* Features List */}
                        <div className="space-y-4 mb-12">
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
                        <div className="grid grid-cols-3 gap-8 pt-8 border-t border-white/20 animate-slideInLeft delay-700">
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

                {/* Right Panel - Login Form */}
                <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-[#faf8f3]">
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
                        <div className="mb-8 animate-slideInRight">
                            <h2 className="text-4xl font-bold heading-font text-[#2d5016] mb-2">
                                Sign In
                            </h2>
                            <p className="text-gray-600">
                                Enter your credentials to access your account
                            </p>
                        </div>

                        {/* Status Message */}
                        {status && (
                            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl animate-fadeIn">
                                <p className="text-sm text-green-800 font-medium">
                                    {status}
                                </p>
                            </div>
                        )}

                        {/* Login Form */}
                        <form onSubmit={submit} className="space-y-6">
                            {/* Email Field */}
                            <div className="animate-slideInRight delay-100">
                                <InputLabel htmlFor="email" value="Email" />

                                <TextInput
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    className="mt-1 block w-full"
                                    autoComplete="username"
                                    isFocused={true}
                                    onChange={(e) =>
                                        setData("email", e.target.value)
                                    }
                                />

                                <InputError
                                    message={errors.email}
                                    className="mt-2"
                                />
                            </div>

                            {/* Password Field */}
                            <div className="animate-slideInRight delay-200">
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
                                    autoComplete="current-password"
                                    onChange={(e) =>
                                        setData("password", e.target.value)
                                    }
                                />

                                <InputError
                                    message={errors.password}
                                    className="mt-2"
                                />
                            </div>

                            {/* Remember Me & Forgot Password */}
                            <div className="animate-slideInRight delay-300">
                                <div className="block">
                                    <label className="flex items-center">
                                        <Checkbox
                                            name="remember"
                                            checked={data.remember}
                                            onChange={(e) =>
                                                setData(
                                                    "remember",
                                                    e.target.checked,
                                                )
                                            }
                                        />
                                        <span className="ms-2 text-sm text-gray-600">
                                            Remember me
                                        </span>
                                    </label>
                                </div>
                            </div>

                            {/* Submit Button & Forgot Password */}
                            <div className="flex flex-col space-y-4 animate-slideInRight delay-400">
                                <PrimaryButton
                                    className="w-full justify-center"
                                    disabled={processing}
                                >
                                    {processing ? "Logging in..." : "Log in"}
                                </PrimaryButton>

                                {canResetPassword && (
                                    <div className="text-center">
                                        <Link
                                            href={route("password.request")}
                                            className="text-sm font-semibold text-[#2d5016] hover:text-[#3d6622] transition-colors"
                                        >
                                            Forgot your password?
                                        </Link>
                                    </div>
                                )}
                            </div>

                            {/* Divider */}
                            <div className="relative animate-slideInRight delay-500">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-4 bg-[#faf8f3] text-gray-500 font-medium">
                                        New to BSAB?
                                    </span>
                                </div>
                            </div>

                            {/* Register Link */}
                            <div className="animate-slideInRight delay-600">
                                <Link
                                    href={route("register")}
                                    className="w-full border-2 border-[#2d5016] text-[#2d5016] py-3 px-6 rounded-xl font-bold text-center hover:bg-[#2d5016] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#2d5016] focus:ring-offset-2 transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center"
                                >
                                    <span>Create an Account</span>
                                </Link>
                            </div>
                        </form>

                        {/* Back to Home */}
                        <div className="mt-8 text-center animate-slideInRight delay-700">
                            <Link
                                href="/"
                                className="text-sm text-gray-600 hover:text-[#2d5016] font-medium transition-colors inline-flex items-center space-x-1"
                            >
                                <span>← Back to Home</span>
                            </Link>
                        </div>

                        {/* Footer Note */}
                        <p className="mt-8 text-xs text-center text-gray-500 animate-slideInRight delay-800">
                            By signing in, you agree to our Terms of Service and
                            Privacy Policy
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
