import { Head } from "@inertiajs/react";
import BuyerSidebar from "./sidebar";
import BuyerHeader from "./header";

export default function Addresses({ auth, addresses }) {
    const user = auth?.user;

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <BuyerSidebar />
            <div className="flex-1 flex flex-col">
                <BuyerHeader user={user} />
                <main className="flex-1 p-8 overflow-y-auto">
                    <Head title="Addresses - Buyer" />
                    <div className="mb-8">
                        <h1 className="text-2xl font-semibold text-gray-900">
                            My Addresses
                        </h1>
                        <p className="text-sm text-gray-600 mt-1">
                            Manage your delivery addresses
                        </p>
                    </div>

                    {/* Address Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        <div className="bg-white border border-gray-200 p-4 rounded-lg">
                            <p className="text-sm font-medium text-gray-600">
                                Total Addresses
                            </p>
                            <p className="text-2xl font-semibold text-gray-900 mt-1">
                                {addresses?.length || 0}
                            </p>
                        </div>
                        <div className="bg-white border border-gray-200 p-4 rounded-lg">
                            <p className="text-sm font-medium text-gray-600">
                                Default Address
                            </p>
                            <p className="text-2xl font-semibold text-gray-900 mt-1">
                                {addresses?.filter((a) => a.is_default)
                                    ?.length || 0}
                            </p>
                        </div>
                    </div>

                    {/* Addresses List */}
                    {addresses && addresses.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {addresses.map((address) => (
                                <div
                                    key={address.id}
                                    className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                {address.name}
                                            </h3>
                                            {address.is_default && (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-1">
                                                    Default
                                                </span>
                                            )}
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

                                    <div className="space-y-2">
                                        <p className="text-sm text-gray-600">
                                            {address.address}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            {address.city}
                                            {address.state
                                                ? `, ${address.state}`
                                                : ""}{" "}
                                            {address.zip_code}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            {address.country}
                                        </p>
                                        {address.phone && (
                                            <p className="text-sm text-gray-600 mt-2">
                                                <span className="font-medium">
                                                    Phone:
                                                </span>{" "}
                                                {address.phone}
                                            </p>
                                        )}
                                    </div>

                                    <div className="mt-4 flex gap-2">
                                        <button className="flex-1 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
                                            Edit
                                        </button>
                                        {!address.is_default && (
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
                                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                />
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1}
                                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                            </svg>
                            <h3 className="mt-2 text-sm font-medium text-gray-900">
                                No addresses yet
                            </h3>
                            <p className="mt-1 text-sm text-gray-500">
                                Add your first delivery address to get started.
                            </p>
                            <button className="mt-4 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors">
                                Add Address
                            </button>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
