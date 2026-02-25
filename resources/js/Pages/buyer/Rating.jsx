import { Head } from "@inertiajs/react";
import { useState } from "react";
import BuyerSidebar from "./sidebar";
import BuyerHeader from "./header";

export default function Rating({
    auth,
    reviews,
    stats,
    filters,
    ordersToRate,
}) {
    const user = auth?.user;
    const [searchQuery, setSearchQuery] = useState(filters?.search || "");
    const [ratingFilter, setRatingFilter] = useState(filters?.rating || "");

    const formatDate = (dateString) => {
        if (!dateString) return "-";
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        window.location.href = `/buyer/ratings?search=${searchQuery}&rating=${ratingFilter}`;
    };

    const handleRatingFilter = (rating) => {
        setRatingFilter(rating);
        window.location.href = `/buyer/ratings?search=${searchQuery}&rating=${rating}`;
    };

    const StarRating = ({ rating, size = "w-5 h-5" }) => {
        return (
            <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                        key={star}
                        className={`${size} ${
                            star <= rating
                                ? "text-yellow-400 fill-current"
                                : "text-gray-300"
                        }`}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                    >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                ))}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-gray-50 flex">
            <BuyerSidebar />
            <div className="flex-1 flex flex-col">
                <BuyerHeader user={user} />
                <main className="flex-1 p-8 overflow-y-auto">
                    <Head title="My Ratings - Buyer" />
                    <div className="mb-8">
                        <h1 className="text-2xl font-semibold text-gray-900">
                            My Ratings & Reviews
                        </h1>
                        <p className="text-sm text-gray-600 mt-1">
                            View and manage your product ratings
                        </p>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
                        <div className="bg-white border border-gray-200 p-4 rounded-lg">
                            <p className="text-sm font-medium text-gray-600">
                                Total Reviews
                            </p>
                            <p className="text-2xl font-semibold text-gray-900 mt-1">
                                {stats?.total || 0}
                            </p>
                        </div>
                        <div className="bg-white border border-gray-200 p-4 rounded-lg">
                            <p className="text-sm font-medium text-gray-600">
                                Average Rating
                            </p>
                            <div className="flex items-center mt-1">
                                <p className="text-2xl font-semibold text-gray-900">
                                    {stats?.avgRating || 0}
                                </p>
                                <svg
                                    className="w-5 h-5 text-yellow-400 ml-1"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                >
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                            </div>
                        </div>
                        <div className="bg-white border border-gray-200 p-4 rounded-lg">
                            <p className="text-sm font-medium text-gray-600">
                                5 Stars
                            </p>
                            <p className="text-2xl font-semibold text-gray-900 mt-1">
                                {stats?.fiveStars || 0}
                            </p>
                        </div>
                        <div className="bg-white border border-gray-200 p-4 rounded-lg">
                            <p className="text-sm font-medium text-gray-600">
                                4 Stars
                            </p>
                            <p className="text-2xl font-semibold text-gray-900 mt-1">
                                {stats?.fourStars || 0}
                            </p>
                        </div>
                        <div className="bg-white border border-gray-200 p-4 rounded-lg">
                            <p className="text-sm font-medium text-gray-600">
                                3 Stars
                            </p>
                            <p className="text-2xl font-semibold text-gray-900 mt-1">
                                {stats?.threeStars || 0}
                            </p>
                        </div>
                    </div>

                    {/* Orders to Rate Section */}
                    {ordersToRate && ordersToRate.length > 0 && (
                        <div className="mb-8">
                            <h2 className="text-lg font-semibold text-gray-900 mb-4">
                                Rate Your Purchases
                            </h2>
                            <p className="text-sm text-gray-600 mb-4">
                                You have products from delivered/completed
                                orders that haven't been rated yet.
                            </p>
                            <div className="space-y-4">
                                {ordersToRate.map((order) => (
                                    <div
                                        key={order.id}
                                        className="bg-white border border-gray-200 rounded-lg p-4"
                                    >
                                        <div className="flex items-center justify-between mb-3">
                                            <div>
                                                <span className="text-sm font-medium text-gray-900">
                                                    Order #{order.id}
                                                </span>
                                                <span className="ml-2 text-xs text-gray-500">
                                                    {formatDate(
                                                        order.created_at,
                                                    )}
                                                </span>
                                            </div>
                                            <span
                                                className={`px-2 py-1 text-xs font-medium rounded-full ${
                                                    order.order_status ===
                                                    "delivered"
                                                        ? "bg-green-100 text-green-800"
                                                        : "bg-emerald-100 text-emerald-800"
                                                }`}
                                            >
                                                {order.order_status ===
                                                "delivered"
                                                    ? "Delivered"
                                                    : "Completed"}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                            {order.unrated_items &&
                                                order.unrated_items.map(
                                                    (item) => (
                                                        <div
                                                            key={item.id}
                                                            className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                                                        >
                                                            <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                                                                {item.product
                                                                    ?.image_url ? (
                                                                    <img
                                                                        src={
                                                                            item
                                                                                .product
                                                                                .image_url
                                                                        }
                                                                        alt={
                                                                            item
                                                                                .product
                                                                                ?.name ||
                                                                            "Product"
                                                                        }
                                                                        className="w-full h-full object-cover rounded-lg"
                                                                    />
                                                                ) : (
                                                                    <svg
                                                                        className="w-6 h-6 text-gray-400"
                                                                        fill="none"
                                                                        stroke="currentColor"
                                                                        viewBox="0 0 24 24"
                                                                    >
                                                                        <path
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                            strokeWidth={
                                                                                1
                                                                            }
                                                                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                                        />
                                                                    </svg>
                                                                )}
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-sm font-medium text-gray-900 truncate">
                                                                    {item
                                                                        .product
                                                                        ?.name ||
                                                                        "Unknown Product"}
                                                                </p>
                                                                <p className="text-xs text-gray-500">
                                                                    Qty:{" "}
                                                                    {
                                                                        item.quantity
                                                                    }{" "}
                                                                    × $
                                                                    {item.price}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    ),
                                                )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Filters */}
                    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
                        <form onSubmit={handleSearch} className="flex gap-4">
                            <div className="flex-1">
                                <input
                                    type="text"
                                    placeholder="Search by product name..."
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <button
                                type="submit"
                                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Search
                            </button>
                        </form>
                        <div className="flex gap-2 mt-4">
                            <button
                                onClick={() => handleRatingFilter("")}
                                className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                                    ratingFilter === ""
                                        ? "bg-blue-600 text-white"
                                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                }`}
                            >
                                All
                            </button>
                            {[5, 4, 3, 2, 1].map((rating) => (
                                <button
                                    key={rating}
                                    onClick={() => handleRatingFilter(rating)}
                                    className={`px-4 py-2 text-sm rounded-lg transition-colors flex items-center gap-1 ${
                                        String(ratingFilter) === String(rating)
                                            ? "bg-blue-600 text-white"
                                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                    }`}
                                >
                                    {rating}
                                    <svg
                                        className="w-4 h-4 text-yellow-400"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Reviews List */}
                    {reviews && reviews.data && reviews.data.length > 0 ? (
                        <div className="space-y-4">
                            {reviews.data.map((review) => (
                                <div
                                    key={review.id}
                                    className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-start gap-4">
                                            {/* Product Image */}
                                            <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                {review.product?.image_url ? (
                                                    <img
                                                        src={
                                                            review.product
                                                                .image_url
                                                        }
                                                        alt={
                                                            review.product
                                                                ?.name ||
                                                            "Product"
                                                        }
                                                        className="w-full h-full object-cover rounded-lg"
                                                    />
                                                ) : (
                                                    <svg
                                                        className="w-10 h-10 text-gray-400"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={1}
                                                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                        />
                                                    </svg>
                                                )}
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900">
                                                    {review.product?.name ||
                                                        "Unknown Product"}
                                                </h3>
                                                <p className="text-sm text-gray-500 mt-1">
                                                    Seller:{" "}
                                                    {review.product?.seller
                                                        ?.name ||
                                                        "Unknown Seller"}
                                                </p>
                                                <div className="flex items-center mt-2">
                                                    <StarRating
                                                        rating={review.rating}
                                                    />
                                                    <span className="ml-2 text-sm text-gray-600">
                                                        {review.rating}/5
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm text-gray-500">
                                                {formatDate(review.created_at)}
                                            </p>
                                        </div>
                                    </div>
                                    {review.review && (
                                        <div className="mt-4 pt-4 border-t border-gray-100">
                                            <p className="text-sm font-medium text-gray-700 mb-1">
                                                Your Review:
                                            </p>
                                            <p className="text-gray-600">
                                                {review.review}
                                            </p>
                                        </div>
                                    )}
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
                                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                                />
                            </svg>
                            <h3 className="mt-2 text-sm font-medium text-gray-900">
                                No ratings yet
                            </h3>
                            <p className="mt-1 text-sm text-gray-500">
                                You haven't rated any products yet. Rate
                                products after your purchase to help others.
                            </p>
                        </div>
                    )}

                    {/* Pagination */}
                    {reviews && reviews.links && reviews.links.length > 3 && (
                        <div className="mt-6 flex justify-center">
                            <div className="flex gap-2">
                                {reviews.links.map((link, index) => (
                                    <button
                                        key={index}
                                        onClick={() => {
                                            if (link.url) {
                                                window.location.href = link.url;
                                            }
                                        }}
                                        disabled={!link.url}
                                        className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                                            link.active
                                                ? "bg-blue-600 text-white"
                                                : link.url
                                                  ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
                                        }`}
                                        dangerouslySetInnerHTML={{
                                            __html: link.label,
                                        }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
