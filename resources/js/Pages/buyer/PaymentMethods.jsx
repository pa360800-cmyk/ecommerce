import { Head } from "@inertiajs/react";
import BuyerSidebar from "./sidebar";
import BuyerHeader from "./header";

export default function PaymentMethods({ auth, paymentMethods }) {
    const user = auth?.user;

    // Get icon for payment method type
    const getPaymentIcon = (type) => {
        switch (type) {
            case "card":
                return (
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                        />
                    </svg>
                );
            case "bank_transfer":
                return (
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                        />
                    </svg>
                );
            case "gcash":
                return (
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                        />
                    </svg>
                );
            case "paypal":
                return (
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                        />
                    </svg>
                );
            default:
                return (
                    <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                        />
                    </svg>
                );
        }
    };

    // Get display name for payment method type
    const getTypeName = (type) => {
        switch (type) {
            case "card":
                return "Credit/Debit Card";
            case "bank_transfer":
                return "Bank Transfer";
            case "gcash":
                return "GCash";
            case "paypal":
                return "PayPal";
            default:
                return type;
        }
    };

    // Get display details based on type
    const getDisplayDetails = (method) => {
        switch (method.type) {
            case "card":
                return `${method.card_brand} •••• ${method.card_last_four}`;
            case "bank_transfer":
                return `${method.bank_name} - ${method.account_number}`;
            case "gcash":
                return method.phone || method.email;
            case "paypal":
                return method.email;
            default:
                return method.email || method.account_number;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <BuyerSidebar />
            <div className="flex-1 flex flex-col">
                <BuyerHeader user={user} />
                <main className="flex-1 p-8 overflow-y-auto">
                    <Head title="Payment Methods - Buyer" />
                    <div className="mb-8">
                        <h1 className="text-2xl font-semibold text-gray-900">
                            Payment Methods
                        </h1>
                        <p className="text-sm text-gray-600 mt-1">
                            Manage your payment methods
                        </p>
                    </div>

                    {/* Payment Methods Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="bg-white border border-gray-200 p-4 rounded-lg">
                            <p className="text-sm font-medium text-gray-600">
                                Total Payment Methods
                            </p>
                            <p className="text-2xl font-semibold text-gray-900 mt-1">
                                {paymentMethods?.length || 0}
                            </p>
                        </div>
                        <div className="bg-white border border-gray-200 p-4 rounded-lg">
                            <p className="text-sm font-medium text-gray-600">
                                Default Method
                            </p>
                            <p className="text-2xl font-semibold text-gray-900 mt-1">
                                {paymentMethods?.filter((m) => m.is_default)
                                    ?.length || 0}
                            </p>
                        </div>
                        <div className="bg-white border border-gray-200 p-4 rounded-lg">
                            <p className="text-sm font-medium text-gray-600">
                                Verified Methods
                            </p>
                            <p className="text-2xl font-semibold text-gray-900 mt-1">
                                {paymentMethods?.filter((m) => m.is_verified)
                                    ?.length || 0}
                            </p>
                        </div>
                    </div>

                    {/* Payment Methods List */}
                    {paymentMethods && paymentMethods.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {paymentMethods.map((method) => (
                                <div
                                    key={method.id}
                                    className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-gray-100 rounded-lg text-gray-600">
                                                {getPaymentIcon(method.type)}
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900">
                                                    {getTypeName(method.type)}
                                                </h3>
                                                <p className="text-sm text-gray-500">
                                                    {getDisplayDetails(method)}
                                                </p>
                                            </div>
                                        </div>
                                        <button className="text-gray-400 hover:text-gray-600">
                                            <svg
                                                className="w-5 h-5"
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
                                                />
                                            </svg>
                                        </button>
                                    </div>

                                    <div className="flex items-center gap-2 mb-4">
                                        {method.is_default && (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                Default
                                            </span>
                                        )}
                                        {method.is_verified && (
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                Verified
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex gap-2">
                                        <button className="flex-1 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
                                            Edit
                                        </button>
                                        {!method.is_default && (
                                            <button className="px-4 py-2 bg-gray-100 text-gray-600 text-sm rounded-lg hover:bg-gray-200 transition-colors">
                                                Set as Default
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
                            <svg
                                className="mx-auto h-12 w-12 text-gray-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1}
                                    d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                                />
                            </svg>
                            <h3 className="mt-2 text-sm font-medium text-gray-900">
                                No payment methods yet
                            </h3>
                            <p className="mt-1 text-sm text-gray-500">
                                Add your first payment method to get started.
                            </p>
                            <button className="mt-4 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
                                Add Payment Method
                            </button>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
