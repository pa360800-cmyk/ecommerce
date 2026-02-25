import { Head, Link } from "@inertiajs/react";
import FarmerSidebar from "./sidebar";
import FarmerHeader from "./header";
import { Plus, Edit, Trash2, Package, Eye } from "lucide-react";

export default function Products({ auth, products = [] }) {
    const user = auth?.user;

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(amount || 0);
    };

    // Format date
    const formatDate = (date) => {
        if (!date) return "-";
        return new Date(date).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    // Get approval status color
    const getApprovalStatusColor = (isApproved) => {
        return isApproved
            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
            : "bg-amber-50 text-amber-700 border border-amber-200";
    };

    // Get approval status label
    const getApprovalStatusLabel = (isApproved) => {
        return isApproved ? "Approved" : "Pending";
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <FarmerSidebar />
            <div className="flex-1 flex flex-col">
                <FarmerHeader user={user} />
                <main className="flex-1 p-8 overflow-y-auto">
                    <Head title="My Products - Farmer" />
                    <div className="mb-8 flex justify-between items-center">
                        <div>
                            <h1 className="text-2xl font-semibold text-gray-900">
                                My Products
                            </h1>
                            <p className="text-sm text-gray-600 mt-1">
                                Manage your products
                            </p>
                        </div>
                        <Link
                            href="/farmer/products/create"
                            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
                        >
                            <Plus className="w-5 h-5" />
                            <span className="font-medium">Add Product</span>
                        </Link>
                    </div>

                    {products && products.length > 0 ? (
                        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Product
                                            </th>
                                            <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Category
                                            </th>
                                            <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Price
                                            </th>
                                            <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Stock
                                            </th>
                                            <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Harvest Date
                                            </th>
                                            <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {products.map((product) => (
                                            <tr
                                                key={product.id}
                                                className="hover:bg-gray-50"
                                            >
                                                <td className="py-4 px-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                            {product.image_url ? (
                                                                <img
                                                                    src={
                                                                        product.image_url
                                                                    }
                                                                    alt={
                                                                        product.name
                                                                    }
                                                                    className="w-12 h-12 rounded-lg object-cover"
                                                                />
                                                            ) : (
                                                                <Package className="w-6 h-6 text-emerald-600" />
                                                            )}
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium text-gray-900">
                                                                {product.name}
                                                            </p>
                                                            <p className="text-xs text-gray-500">
                                                                {product.is_organic
                                                                    ? "Organic"
                                                                    : "Conventional"}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6 text-sm text-gray-600">
                                                    {product.category
                                                        ? product.category
                                                              .charAt(0)
                                                              .toUpperCase() +
                                                          product.category.slice(
                                                              1,
                                                          )
                                                        : "-"}
                                                </td>
                                                <td className="py-4 px-6 text-sm font-medium text-gray-900">
                                                    {formatCurrency(
                                                        product.price,
                                                    )}{" "}
                                                    <span className="text-gray-500 font-normal">
                                                        / {product.unit}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-6 text-sm text-gray-600">
                                                    {product.stock}{" "}
                                                    <span className="text-gray-500">
                                                        {product.unit}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <span
                                                        className={`px-2.5 py-1 rounded-md text-xs font-medium ${getApprovalStatusColor(
                                                            product.is_approved,
                                                        )}`}
                                                    >
                                                        {getApprovalStatusLabel(
                                                            product.is_approved,
                                                        )}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-6 text-sm text-gray-600">
                                                    {formatDate(
                                                        product.harvest_date,
                                                    )}
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className="flex items-center gap-2">
                                                        <Link
                                                            href={`/farmer/products/${product.id}`}
                                                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                                                            title="View"
                                                        >
                                                            <Eye className="w-4 h-4" />
                                                        </Link>
                                                        <Link
                                                            href={`/farmer/products/${product.id}/edit`}
                                                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                                                            title="Edit"
                                                        >
                                                            <Edit className="w-4 h-4" />
                                                        </Link>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white border border-gray-200 rounded-lg p-12">
                            <div className="text-center">
                                <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">
                                    No Products Yet
                                </h3>
                                <p className="text-sm text-gray-500 mb-6">
                                    You haven't added any products to your
                                    inventory yet.
                                </p>
                                <Link
                                    href="/farmer/products/create"
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white text-sm font-medium rounded-lg hover:bg-emerald-700 transition-colors"
                                >
                                    <Plus className="w-4 h-4" />
                                    Add Your First Product
                                </Link>
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
