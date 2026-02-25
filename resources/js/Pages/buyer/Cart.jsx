import { Head } from "@inertiajs/react";
import { useState } from "react";
import { Link, usePage } from "@inertiajs/react";
import BuyerSidebar from "./sidebar";
import BuyerHeader from "./header";
import {
    ShoppingCart,
    Plus,
    Minus,
    Trash2,
    ArrowRight,
    CreditCard,
    Truck,
    MapPin,
    CheckCircle,
    ArrowLeft,
} from "lucide-react";

export default function CartIndex({
    auth,
    cartItems,
    subtotal,
    shipping,
    total,
}) {
    const { props } = usePage();
    // Get CSRF token from meta tag - this is more reliable
    const csrfToken =
        props.csrf_token ||
        props.csrfToken ||
        document.querySelector('meta[name="csrf-token"]')?.content;
    // Get user from auth prop - Inertia passes auth as a prop
    const user = auth?.user ?? props.auth?.user;
    const [showCheckout, setShowCheckout] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [checkoutData, setCheckoutData] = useState({
        shipping_address: "",
        shipping_city: "",
        shipping_phone: "",
        payment_method: "cod",
        notes: "",
    });

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
        }).format(amount || 0);
    };

    // Update quantity
    const updateQuantity = (cartItemId, delta) => {
        fetch(`/cart/${cartItemId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-TOKEN": document.querySelector(
                    'meta[name="csrf-token"]',
                ).content,
            },
            body: JSON.stringify({
                quantity: Math.max(
                    1,
                    (cartItems?.find((item) => item.id === cartItemId)
                        ?.quantity || 0) + delta,
                ),
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    window.location.reload();
                } else {
                    alert(data.message || "Error updating quantity");
                }
            })
            .catch((error) => {
                alert("Error updating quantity");
            });
    };

    // Remove item
    const removeItem = (cartItemId) => {
        fetch(`/cart/${cartItemId}`, {
            method: "DELETE",
            headers: {
                "X-CSRF-TOKEN": document.querySelector(
                    'meta[name="csrf-token"]',
                ).content,
            },
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    window.location.reload();
                } else {
                    alert(data.message || "Error removing item");
                }
            })
            .catch((error) => {
                alert("Error removing item");
            });
    };

    const handleCheckoutChange = (e) => {
        const { name, value } = e.target;
        setCheckoutData((prev) => ({ ...prev, [name]: value }));
    };

    const handleCheckout = (e) => {
        e.preventDefault();
        setIsProcessing(true);

        fetch(`/cart/checkout`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-CSRF-TOKEN": document.querySelector(
                    'meta[name="csrf-token"]',
                ).content,
            },
            body: JSON.stringify(checkoutData),
        })
            .then((response) => response.json())
            .then((data) => {
                if (data.success) {
                    alert("Order placed successfully!");
                    window.location.href = data.redirect || "/orders";
                } else {
                    alert(data.message || "Error placing order");
                    setIsProcessing(false);
                }
            })
            .catch((error) => {
                alert("Error placing order");
                setIsProcessing(false);
            });
    };

    const calculatedSubtotal =
        cartItems?.reduce((sum, item) => {
            return sum + (item.product?.price || 0) * item.quantity;
        }, 0) || 0;

    const calculatedShipping = calculatedSubtotal > 100 ? 0 : 15;
    const calculatedTotal = calculatedSubtotal + calculatedShipping;

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <BuyerSidebar />
            <div className="flex-1 flex flex-col">
                <BuyerHeader user={user} />
                <main className="flex-1 p-8 overflow-y-auto">
                    <Head title="Shopping Cart - Buyer" />

                    <div className="mb-8">
                        <h1 className="text-2xl font-semibold text-gray-900">
                            Shopping Cart
                        </h1>
                        <p className="text-sm text-gray-600 mt-1">
                            Manage your cart items
                        </p>
                    </div>

                    <div className="max-w-7xl mx-auto">
                        {!showCheckout ? (
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                {/* Cart Items */}
                                <div className="lg:col-span-2 space-y-4">
                                    {!cartItems || cartItems.length === 0 ? (
                                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                                            <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                            <h3 className="text-xl font-semibold text-gray-600 mb-2">
                                                Your cart is empty
                                            </h3>
                                            <p className="text-gray-500 mb-6">
                                                Browse products and add items to
                                                your cart
                                            </p>
                                            <Link
                                                href="/products"
                                                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
                                            >
                                                Browse Products
                                            </Link>
                                        </div>
                                    ) : (
                                        cartItems.map((item) => (
                                            <div
                                                key={item.id}
                                                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
                                            >
                                                <div className="flex gap-4">
                                                    {/* Product Image */}
                                                    <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-green-200 rounded-lg flex items-center justify-center flex-shrink-0">
                                                        <span className="text-3xl">
                                                            🌾
                                                        </span>
                                                    </div>

                                                    {/* Product Info */}
                                                    <div className="flex-1">
                                                        <div className="flex items-start justify-between">
                                                            <div>
                                                                <h3 className="font-semibold text-gray-800 text-lg">
                                                                    {item
                                                                        .product
                                                                        ?.name ||
                                                                        "Product"}
                                                                </h3>
                                                                <p className="text-gray-500 text-sm">
                                                                    {item
                                                                        .product
                                                                        ?.seller
                                                                        ?.name ||
                                                                        "Farm"}
                                                                </p>
                                                                <p className="text-gray-500 text-sm">
                                                                    {formatCurrency(
                                                                        item
                                                                            .product
                                                                            ?.price,
                                                                    )}
                                                                    /
                                                                    {
                                                                        item
                                                                            .product
                                                                            ?.unit
                                                                    }
                                                                </p>
                                                            </div>
                                                            <button
                                                                onClick={() =>
                                                                    removeItem(
                                                                        item.id,
                                                                    )
                                                                }
                                                                className="text-gray-400 hover:text-red-500 transition-colors"
                                                            >
                                                                <Trash2 className="w-5 h-5" />
                                                            </button>
                                                        </div>

                                                        <div className="flex items-center justify-between mt-4">
                                                            <div className="flex items-center gap-4">
                                                                <span className="text-gray-600">
                                                                    {formatCurrency(
                                                                        item
                                                                            .product
                                                                            ?.price,
                                                                    )}
                                                                    /
                                                                    {
                                                                        item
                                                                            .product
                                                                            ?.unit
                                                                    }
                                                                </span>
                                                                <div className="flex items-center gap-2">
                                                                    <button
                                                                        onClick={() =>
                                                                            updateQuantity(
                                                                                item.id,
                                                                                -1,
                                                                            )
                                                                        }
                                                                        className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200"
                                                                    >
                                                                        <Minus className="w-4 h-4" />
                                                                    </button>
                                                                    <span className="w-12 text-center font-medium">
                                                                        {
                                                                            item.quantity
                                                                        }
                                                                    </span>
                                                                    <button
                                                                        onClick={() =>
                                                                            updateQuantity(
                                                                                item.id,
                                                                                1,
                                                                            )
                                                                        }
                                                                        className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200"
                                                                    >
                                                                        <Plus className="w-4 h-4" />
                                                                    </button>
                                                                </div>
                                                            </div>
                                                            <div className="text-right">
                                                                <span className="text-xl font-bold text-gray-800">
                                                                    {formatCurrency(
                                                                        (item
                                                                            .product
                                                                            ?.price ||
                                                                            0) *
                                                                            item.quantity,
                                                                    )}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>

                                {/* Order Summary */}
                                {cartItems && cartItems.length > 0 && (
                                    <div className="lg:col-span-1">
                                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-6">
                                            <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                                Order Summary
                                            </h3>

                                            <div className="space-y-3 mb-6">
                                                <div className="flex justify-between text-gray-600">
                                                    <span>Subtotal</span>
                                                    <span>
                                                        {formatCurrency(
                                                            calculatedSubtotal,
                                                        )}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between text-gray-600">
                                                    <span>Shipping</span>
                                                    <span>
                                                        {calculatedShipping ===
                                                        0 ? (
                                                            <span className="text-green-600">
                                                                Free
                                                            </span>
                                                        ) : (
                                                            formatCurrency(
                                                                calculatedShipping,
                                                            )
                                                        )}
                                                    </span>
                                                </div>
                                                {calculatedSubtotal < 100 && (
                                                    <p className="text-sm text-gray-500">
                                                        Add{" "}
                                                        {formatCurrency(
                                                            100 -
                                                                calculatedSubtotal,
                                                        )}{" "}
                                                        more for free shipping!
                                                    </p>
                                                )}
                                                <div className="border-t pt-3 flex justify-between">
                                                    <span className="font-semibold text-gray-800">
                                                        Total
                                                    </span>
                                                    <span className="text-xl font-bold text-green-600">
                                                        {formatCurrency(
                                                            calculatedTotal,
                                                        )}
                                                    </span>
                                                </div>
                                            </div>

                                            <button
                                                onClick={() =>
                                                    setShowCheckout(true)
                                                }
                                                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
                                            >
                                                <span>Proceed to Checkout</span>
                                                <ArrowRight className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            /* Checkout Form */
                            <div className="max-w-2xl mx-auto">
                                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                                    <button
                                        onClick={() => setShowCheckout(false)}
                                        className="inline-flex items-center text-gray-600 hover:text-gray-800 mb-6"
                                    >
                                        <ArrowLeft className="w-4 h-4 mr-2" />
                                        Back to Cart
                                    </button>

                                    <h3 className="text-lg font-semibold text-gray-800 mb-6">
                                        Checkout
                                    </h3>

                                    <form
                                        onSubmit={handleCheckout}
                                        className="space-y-6"
                                    >
                                        {/* Shipping Address */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Shipping Address *
                                            </label>
                                            <div className="relative">
                                                <MapPin className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
                                                <textarea
                                                    name="shipping_address"
                                                    value={
                                                        checkoutData.shipping_address
                                                    }
                                                    onChange={
                                                        handleCheckoutChange
                                                    }
                                                    required
                                                    rows={3}
                                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                                    placeholder="Enter your full shipping address"
                                                />
                                            </div>
                                        </div>

                                        {/* Shipping City */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                City *
                                            </label>
                                            <input
                                                type="text"
                                                name="shipping_city"
                                                value={
                                                    checkoutData.shipping_city
                                                }
                                                onChange={handleCheckoutChange}
                                                required
                                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                                placeholder="Enter your city"
                                            />
                                        </div>

                                        {/* Shipping Phone */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Phone Number *
                                            </label>
                                            <input
                                                type="tel"
                                                name="shipping_phone"
                                                value={
                                                    checkoutData.shipping_phone
                                                }
                                                onChange={handleCheckoutChange}
                                                required
                                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                                placeholder="Enter your phone number"
                                            />
                                        </div>

                                        {/* Payment Method */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Payment Method *
                                            </label>
                                            <div className="space-y-3">
                                                <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                                                    <input
                                                        type="radio"
                                                        name="payment_method"
                                                        value="cod"
                                                        checked={
                                                            checkoutData.payment_method ===
                                                            "cod"
                                                        }
                                                        onChange={
                                                            handleCheckoutChange
                                                        }
                                                        className="w-4 h-4 text-green-600"
                                                    />
                                                    <div className="flex-1">
                                                        <span className="font-medium text-gray-800">
                                                            Cash on Delivery
                                                        </span>
                                                        <p className="text-sm text-gray-500">
                                                            Pay when you receive
                                                            your order
                                                        </p>
                                                    </div>
                                                    <Truck className="w-5 h-5 text-gray-400" />
                                                </label>

                                                <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                                                    <input
                                                        type="radio"
                                                        name="payment_method"
                                                        value="bank_transfer"
                                                        checked={
                                                            checkoutData.payment_method ===
                                                            "bank_transfer"
                                                        }
                                                        onChange={
                                                            handleCheckoutChange
                                                        }
                                                        className="w-4 h-4 text-green-600"
                                                    />
                                                    <div className="flex-1">
                                                        <span className="font-medium text-gray-800">
                                                            Bank Transfer
                                                        </span>
                                                        <p className="text-sm text-gray-500">
                                                            Transfer to our bank
                                                            account
                                                        </p>
                                                    </div>
                                                    <CreditCard className="w-5 h-5 text-gray-400" />
                                                </label>

                                                <label className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                                                    <input
                                                        type="radio"
                                                        name="payment_method"
                                                        value="gcash"
                                                        checked={
                                                            checkoutData.payment_method ===
                                                            "gcash"
                                                        }
                                                        onChange={
                                                            handleCheckoutChange
                                                        }
                                                        className="w-4 h-4 text-green-600"
                                                    />
                                                    <div className="flex-1">
                                                        <span className="font-medium text-gray-800">
                                                            GCash
                                                        </span>
                                                        <p className="text-sm text-gray-500">
                                                            Pay using GCash
                                                        </p>
                                                    </div>
                                                    <span className="text-xl">
                                                        📱
                                                    </span>
                                                </label>
                                            </div>
                                        </div>

                                        {/* Order Notes */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Order Notes (Optional)
                                            </label>
                                            <textarea
                                                name="notes"
                                                value={checkoutData.notes}
                                                onChange={handleCheckoutChange}
                                                rows={3}
                                                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                                                placeholder="Any special instructions for your order"
                                            />
                                        </div>

                                        {/* Order Summary */}
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <h4 className="font-semibold text-gray-800 mb-3">
                                                Order Summary
                                            </h4>
                                            <div className="space-y-2 text-sm">
                                                {cartItems?.map((item) => (
                                                    <div
                                                        key={item.id}
                                                        className="flex justify-between"
                                                    >
                                                        <span className="text-gray-600">
                                                            {item.product?.name}{" "}
                                                            x {item.quantity}
                                                        </span>
                                                        <span>
                                                            {formatCurrency(
                                                                (item.product
                                                                    ?.price ||
                                                                    0) *
                                                                    item.quantity,
                                                            )}
                                                        </span>
                                                    </div>
                                                ))}
                                                <div className="border-t pt-2 flex justify-between font-semibold">
                                                    <span>Total</span>
                                                    <span className="text-green-600">
                                                        {formatCurrency(
                                                            calculatedTotal,
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex gap-4">
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    setShowCheckout(false)
                                                }
                                                className="flex-1 px-6 py-3 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                            >
                                                Back to Cart
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={isProcessing}
                                                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                                            >
                                                <CheckCircle className="w-5 h-5" />
                                                <span>
                                                    {isProcessing
                                                        ? "Processing..."
                                                        : "Place Order"}
                                                </span>
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}
