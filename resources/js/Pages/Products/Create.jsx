import { Head } from "@inertiajs/react";
import { useState } from "react";
import { router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {
    Plus,
    Upload,
    X,
    DollarSign,
    Package,
    MapPin,
    Calendar,
    CheckCircle,
} from "lucide-react";

export default function CreateProduct({ auth }) {
    const [formData, setFormData] = useState({
        name: "",
        category: "",
        description: "",
        price: "",
        unit: "kg",
        stock: "",
        harvest_date: "",
        farm_location: "",
        is_organic: false,
        image: null,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const categories = [
        { id: "rice", name: "Rice", icon: "🌾" },
        { id: "corn", name: "Corn", icon: "🌽" },
        { id: "vegetables", name: "Vegetables", icon: "🥬" },
        { id: "fruits", name: "Fruits", icon: "🍎" },
        { id: "root_crops", name: "Root Crops", icon: "🥔" },
        { id: "dairy", name: "Dairy Products", icon: "🥛" },
        { id: "fertilizers", name: "Fertilizers", icon: "🌿" },
        { id: "seeds", name: "Seeds", icon: "🌱" },
        { id: "pesticides", name: "Pesticides", icon: "🐛" },
        { id: "farming_tools", name: "Farming Tools", icon: "🔧" },
        { id: "other", name: "Other", icon: "📦" },
    ];

    const units = ["kg", "lb", "piece", "bag", "box", "liter", "packet"];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData((prev) => ({ ...prev, image: file }));
        }
    };

    const removeImage = () => {
        setFormData((prev) => ({ ...prev, image: null }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Create form data for file upload
        const submitData = new FormData();
        submitData.append("name", formData.name);
        submitData.append("category", formData.category);
        submitData.append("description", formData.description || "");
        submitData.append("price", formData.price);
        submitData.append("unit", formData.unit);
        submitData.append("stock", formData.stock);
        submitData.append("harvest_date", formData.harvest_date || "");
        submitData.append("farm_location", formData.farm_location || "");
        submitData.append("is_organic", formData.is_organic ? "1" : "0");

        if (formData.image) {
            submitData.append("image", formData.image);
        }

        // Use Inertia to post the form data to the backend
        router.post(route("products.store"), submitData, {
            forceFormData: true,
            onSuccess: () => {
                setIsSubmitting(false);
                setShowSuccess(true);
                setTimeout(() => {
                    setShowSuccess(false);
                    // Reset form
                    setFormData({
                        name: "",
                        category: "",
                        description: "",
                        price: "",
                        unit: "kg",
                        stock: "",
                        harvest_date: "",
                        farm_location: "",
                        is_organic: false,
                        image: null,
                    });
                }, 2000);
            },
            onError: (errors) => {
                setIsSubmitting(false);
                console.error("Error submitting product:", errors);
                alert("Failed to create product. Please check your inputs.");
            },
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Add New Product
                </h2>
            }
        >
            <Head title="Add Product" />

            <div className="py-12">
                <div className="max-w-4xl mx-auto sm:px-6 lg:px-8">
                    {/* Success Message */}
                    {showSuccess && (
                        <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded-xl flex items-center gap-3">
                            <CheckCircle className="w-6 h-6" />
                            <span className="font-semibold">
                                Product added successfully! It's now pending
                                admin approval.
                            </span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Basic Information */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                Basic Information
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Product Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                        placeholder="e.g., Organic Rice"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Category *
                                    </label>
                                    <select
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                    >
                                        <option value="">
                                            Select a category
                                        </option>
                                        {categories.map((cat) => (
                                            <option key={cat.id} value={cat.id}>
                                                {cat.icon} {cat.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Description
                                    </label>
                                    <textarea
                                        name="description"
                                        value={formData.description}
                                        onChange={handleChange}
                                        rows={4}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                        placeholder="Describe your product - quality, farming method, etc."
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Pricing & Stock */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                Pricing & Stock
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Price per Unit *
                                    </label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <input
                                            type="number"
                                            name="price"
                                            value={formData.price}
                                            onChange={handleChange}
                                            required
                                            step="0.01"
                                            min="0"
                                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                            placeholder="0.00"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Unit *
                                    </label>
                                    <select
                                        name="unit"
                                        value={formData.unit}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                    >
                                        {units.map((unit) => (
                                            <option key={unit} value={unit}>
                                                {unit}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Stock Quantity *
                                    </label>
                                    <div className="relative">
                                        <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <input
                                            type="number"
                                            name="stock"
                                            value={formData.stock}
                                            onChange={handleChange}
                                            required
                                            min="0"
                                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                            placeholder="0"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Farm Details */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                Farm Details
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Farm Location *
                                    </label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <input
                                            type="text"
                                            name="farm_location"
                                            value={formData.farm_location}
                                            onChange={handleChange}
                                            required
                                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                            placeholder="e.g., Central Province, City"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Harvest Date
                                    </label>
                                    <div className="relative">
                                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                        <input
                                            type="date"
                                            name="harvest_date"
                                            value={formData.harvest_date}
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Product Image */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                Product Image
                            </h3>

                            {!formData.image ? (
                                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-green-500 transition-colors">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                        id="image-upload"
                                    />
                                    <label
                                        htmlFor="image-upload"
                                        className="cursor-pointer"
                                    >
                                        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                        <p className="text-gray-600 font-medium">
                                            Click to upload product image
                                        </p>
                                        <p className="text-gray-400 text-sm mt-1">
                                            PNG, JPG up to 5MB
                                        </p>
                                    </label>
                                </div>
                            ) : (
                                <div className="relative inline-block">
                                    <div className="w-48 h-48 bg-gray-100 rounded-lg overflow-hidden">
                                        <img
                                            src={URL.createObjectURL(
                                                formData.image,
                                            )}
                                            alt="Product preview"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={removeImage}
                                        className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Organic Product Checkbox */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    name="is_organic"
                                    id="is_organic"
                                    checked={formData.is_organic}
                                    onChange={(e) =>
                                        setFormData((prev) => ({
                                            ...prev,
                                            is_organic: e.target.checked,
                                        }))
                                    }
                                    className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
                                />
                                <label
                                    htmlFor="is_organic"
                                    className="text-sm font-medium text-gray-700"
                                >
                                    🌿 Organic Product - This product is
                                    certified organic
                                </label>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex items-center justify-end gap-4">
                            <button
                                type="button"
                                className="px-6 py-3 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-8 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        <span>Submitting...</span>
                                    </>
                                ) : (
                                    <>
                                        <Plus className="w-5 h-5" />
                                        <span>Add Product</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
