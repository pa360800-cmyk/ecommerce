import { Head } from "@inertiajs/react";
import { useState } from "react";
import { Link, router } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { ArrowLeft, Save, Trash2, Upload, X } from "lucide-react";

export default function ProductEdit({ auth, product }) {
    const user = auth.user;
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        name: product?.name || "",
        category: product?.category || "",
        description: product?.description || "",
        price: product?.price || "",
        stock: product?.stock || "",
        unit: product?.unit || "kg",
        harvest_date: product?.harvest_date || "",
        farm_location: product?.farm_location || "",
        is_organic: product?.is_organic || false,
        is_approved: product?.is_approved || false,
        image: null,
    });

    const [imagePreview, setImagePreview] = useState(
        product?.image_url ? `/storage/${product.image_url}` : null,
    );

    const categories = [
        { id: "rice", name: "Rice" },
        { id: "corn", name: "Corn" },
        { id: "vegetables", name: "Vegetables" },
        { id: "fruits", name: "Fruits" },
        { id: "root_crops", name: "Root Crops" },
        { id: "fertilizers", name: "Fertilizers" },
        { id: "seeds", name: "Seeds" },
        { id: "pesticides", name: "Pesticides" },
        { id: "farming_tools", name: "Farming Tools" },
        { id: "dairy", name: "Dairy Products" },
        { id: "other", name: "Other" },
    ];

    const units = [
        { id: "kg", name: "Kilogram (kg)" },
        { id: "g", name: "Gram (g)" },
        { id: "lb", name: "Pound (lb)" },
        { id: "oz", name: "Ounce (oz)" },
        { id: "ton", name: "Ton" },
        { id: "unit", name: "Unit (pcs)" },
        { id: "bag", name: "Bag" },
        { id: "pack", name: "Pack" },
    ];

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData((prev) => ({ ...prev, image: file }));
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const removeImage = () => {
        setFormData((prev) => ({ ...prev, image: null }));
        setImagePreview(null);
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
        submitData.append("stock", formData.stock);
        submitData.append("unit", formData.unit);
        submitData.append("harvest_date", formData.harvest_date || "");
        submitData.append("farm_location", formData.farm_location || "");
        submitData.append("is_organic", formData.is_organic ? "1" : "0");

        // Add admin approval status if user is admin
        if (user.role === "admin") {
            submitData.append("is_approved", formData.is_approved ? "1" : "0");
        }

        if (formData.image) {
            submitData.append("image", formData.image);
        }

        // Use Inertia router to submit the form with PUT method
        router.put(`/products/${product.id}`, submitData, {
            forceFormData: true,
            onSuccess: () => {
                setIsSubmitting(false);
                alert("Product updated successfully!");
                window.location.href = "/products";
            },
            onError: (errors) => {
                setIsSubmitting(false);
                console.error("Error updating product:", errors);
                alert(
                    errors.message ||
                        "Failed to update product. Please check your inputs.",
                );
            },
        });
    };

    const handleDelete = () => {
        if (confirm("Are you sure you want to delete this product?")) {
            router.delete(`/products/${product.id}`, {
                onSuccess: () => {
                    window.location.href = "/products";
                },
                onError: (errors) => {
                    alert(errors.message || "Error deleting product");
                },
            });
        }
    };

    const handleApprovalChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            is_approved: e.target.checked,
        }));
    };

    return (
        <AuthenticatedLayout
            user={user}
            header={
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                        Edit Product
                    </h2>
                </div>
            }
        >
            <Head title="Edit Product" />

            <div className="py-12">
                <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                        <Link
                            href="/products"
                            className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-6"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Back to Products
                        </Link>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Product Name */}
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
                                    placeholder="Enter product name"
                                />
                            </div>

                            {/* Category */}
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
                                    <option value="">Select a category</option>
                                    {categories.map((cat) => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows={4}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                    placeholder="Describe your product"
                                />
                            </div>

                            {/* Price and Stock */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Price *
                                    </label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                                            $
                                        </span>
                                        <input
                                            type="number"
                                            name="price"
                                            value={formData.price}
                                            onChange={handleChange}
                                            required
                                            min="0"
                                            step="0.01"
                                            className="w-full pl-8 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                            placeholder="0.00"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Stock *
                                    </label>
                                    <input
                                        type="number"
                                        name="stock"
                                        value={formData.stock}
                                        onChange={handleChange}
                                        required
                                        min="0"
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                        placeholder="0"
                                    />
                                </div>
                            </div>

                            {/* Unit and Farm Location */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                            <option
                                                key={unit.id}
                                                value={unit.id}
                                            >
                                                {unit.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Farm Location
                                    </label>
                                    <input
                                        type="text"
                                        name="farm_location"
                                        value={formData.farm_location}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                        placeholder="Enter location"
                                    />
                                </div>
                            </div>

                            {/* Harvest Date */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Harvest Date
                                </label>
                                <input
                                    type="date"
                                    name="harvest_date"
                                    value={formData.harvest_date}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                            </div>

                            {/* Product Image */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Product Image
                                </label>
                                {imagePreview ? (
                                    <div className="relative inline-block">
                                        <div className="w-48 h-48 bg-gray-100 rounded-lg overflow-hidden">
                                            <img
                                                src={imagePreview}
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
                                ) : (
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
                                )}
                            </div>

                            {/* Is Organic */}
                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    name="is_organic"
                                    id="is_organic"
                                    checked={formData.is_organic}
                                    onChange={handleChange}
                                    className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
                                />
                                <label
                                    htmlFor="is_organic"
                                    className="text-sm font-medium text-gray-700"
                                >
                                    Organic Product
                                </label>
                            </div>

                            {/* Admin Approval */}
                            {user.role === "admin" && (
                                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                                    <input
                                        type="checkbox"
                                        name="is_approved"
                                        id="is_approved"
                                        checked={formData.is_approved || false}
                                        onChange={handleApprovalChange}
                                        className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
                                    />
                                    <label
                                        htmlFor="is_approved"
                                        className="text-sm font-medium text-gray-700"
                                    >
                                        Approve this product (visible to buyers)
                                    </label>
                                </div>
                            )}

                            {/* Submit Buttons */}
                            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                                <button
                                    type="button"
                                    onClick={handleDelete}
                                    className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                >
                                    <Trash2 className="w-5 h-5" />
                                    Delete
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                                >
                                    <Save className="w-5 h-5" />
                                    {isSubmitting
                                        ? "Saving..."
                                        : "Save Changes"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
