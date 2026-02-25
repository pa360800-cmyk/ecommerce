<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Product;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Wishlist;
use App\Models\Address;
use App\Models\BuyerPaymentMethod;
use App\Models\CartItem;
use App\Models\Notification;
use App\Models\Review;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class BuyerController extends Controller
{
    /**
     * Display the buyer dashboard.
     */
    public function dashboard()
    {
        $user = Auth::user();
        
        // Get stats for the dashboard
        $totalOrders = Order::where('buyer_id', $user->id)->count();
        $cartItems = CartItem::where('buyer_id', $user->id)->sum('quantity');
        $totalSpent = Order::where('buyer_id', $user->id)
            ->where('payment_status', 'paid')
            ->sum('total_amount');
        $wishlistItems = Wishlist::where('buyer_id', $user->id)->count();
        
        $stats = [
            'totalOrders' => $totalOrders,
            'cartItems' => $cartItems,
            'totalSpent' => $totalSpent,
            'wishlistItems' => $wishlistItems,
        ];
        
        // Get recent orders (latest 5)
        $orders = Order::with(['orderItems.product', 'buyer'])
            ->where('buyer_id', $user->id)
            ->latest()
            ->take(5)
            ->get();
        
        // Get featured products (active and approved products from sellers)
        $featuredProducts = Product::with('seller')
            ->where('is_approved', true)
            ->where('is_active', true)
            ->latest()
            ->take(6)
            ->get();
        
        return Inertia::render('buyer/dashboard', [
            'auth' => ['user' => $user],
            'stats' => $stats,
            'orders' => $orders,
            'featuredProducts' => $featuredProducts,
        ]);
    }

    /**
     * Display the shopping cart page.
     * This is kept for backwards compatibility with any links that might use /buyer/cart
     */
    public function cart()
    {
        // Redirect to the dedicated cart route
        return to_route('cart.index');
    }

    /**
     * Display products for browsing.
     */
    public function products(Request $request)
    {
        $user = Auth::user();
        
        $query = Product::with('seller');
        
        // Filter by category
        if ($request->has('category') && $request->category !== 'all') {
            $query->where('category', $request->category);
        }
        
        // Filter by search
        if ($request->has('search') && $request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%')
                    ->orWhere('description', 'like', '%' . $request->search . '%');
            });
        }
        
        // Only show approved and active products for buyers
        $query->where('is_approved', true)
              ->where('is_active', true);
        
        $products = $query->latest()->paginate(12);
        
        // Get wishlist product IDs for the authenticated user
        $wishlistProductIds = Wishlist::where('buyer_id', $user->id)
            ->pluck('product_id')
            ->toArray();
        
        return Inertia::render('buyer/Products', [
            'auth' => ['user' => $user],
            'products' => $products,
            'filters' => $request->only(['search', 'category']),
            'wishlistProductIds' => $wishlistProductIds,
        ]);
    }

    /**
     * Display buyer orders.
     */
    public function orders(Request $request)
    {
        $user = Auth::user();
        
        $query = Order::with(['orderItems.product', 'buyer'])
            ->where('buyer_id', $user->id);
        
        // Filter by status
        if ($request->has('status') && $request->status !== 'all' && $request->status !== '') {
            $query->where('order_status', $request->status);
        }
        
        // Filter by search (search by order ID)
        if ($request->has('search') && $request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('id', 'like', '%' . intval($request->search) . '%')
                  ->orWhere('tracking_number', 'like', '%' . $request->search . '%');
            });
        }
        
        // Get paginated orders
        $orders = $query->latest()->paginate(10);
        
        // Calculate stats for this buyer using separate queries
        // Total count of all buyer orders
        $totalOrders = Order::where('buyer_id', $user->id)->count();
        
        // Pending orders - awaiting seller confirmation or processing
        $pendingOrders = Order::where('buyer_id', $user->id)
            ->whereIn('order_status', ['pending', 'confirmed', 'preparing'])
            ->count();
        
        // Completed/Delivered count
        $completedOrders = Order::where('buyer_id', $user->id)
            ->whereIn('order_status', ['delivered', 'completed'])
            ->count();
        
        // Cancelled count
        $cancelledOrders = Order::where('buyer_id', $user->id)
            ->where('order_status', 'cancelled')
            ->count();
        
        // Total spent on PAID orders only
        $totalSpent = Order::where('buyer_id', $user->id)
            ->where('payment_status', 'paid')
            ->sum('total_amount');
        
        $stats = [
            'totalOrders' => $totalOrders,
            'pendingOrders' => $pendingOrders,
            'completedOrders' => $completedOrders,
            'cancelledOrders' => $cancelledOrders,
            'totalSpent' => $totalSpent,
        ];
        
        $filters = [
            'search' => $request->search ?? '',
            'status' => $request->status ?? '',
        ];
        
        return Inertia::render('buyer/Orders', [
            'auth' => ['user' => $user],
            'orders' => $orders,
            'stats' => $stats,
            'filters' => $filters,
        ]);
    }

    /**
     * Display the wishlist page.
     */
    public function wishlist()
    {
        $user = Auth::user();
        
        // Fetch wishlist items with product data
        $wishlists = Wishlist::with(['product', 'product.seller'])
            ->where('buyer_id', $user->id)
            ->latest()
            ->get();
        
        return Inertia::render('buyer/Wishlist', [
            'auth' => ['user' => $user],
            'wishlists' => $wishlists,
        ]);
    }

    /**
     * Display the addresses page.
     */
    public function addresses()
    {
        $user = Auth::user();
        
        // Fetch addresses for the authenticated buyer
        $addresses = Address::where('buyer_id', $user->id)
            ->latest()
            ->get();
        
        return Inertia::render('buyer/Addresses', [
            'auth' => ['user' => $user],
            'addresses' => $addresses,
        ]);
    }

    /**
     * Display the payment methods page.
     */
    public function paymentMethods()
    {
        $user = Auth::user();
        
        // Fetch payment methods for the authenticated buyer
        $paymentMethods = BuyerPaymentMethod::where('buyer_id', $user->id)
            ->latest()
            ->get();
        
        return Inertia::render('buyer/PaymentMethods', [
            'auth' => ['user' => $user],
            'paymentMethods' => $paymentMethods,
        ]);
    }

    /**
     * Display the notifications page.
     */
    public function notifications(Request $request)
    {
        $user = Auth::user();
        
        $query = Notification::where('user_id', $user->id);
        
        // Filter by search
        if ($request->has('search') && $request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('title', 'like', '%' . $request->search . '%')
                  ->orWhere('message', 'like', '%' . $request->search . '%');
            });
        }
        
        // Filter by type
        if ($request->has('type') && $request->type && $request->type !== '') {
            $query->where('type', $request->type);
        }
        
        // Filter by status
        if ($request->has('status') && $request->status && $request->status !== '') {
            if ($request->status === 'read') {
                $query->where('is_read', true);
            } elseif ($request->status === 'unread') {
                $query->where('is_read', false);
            }
        }
        
        $notifications = $query->latest()->paginate(10);
        
        // Get stats
        $stats = [
            'total' => Notification::where('user_id', $user->id)->count(),
            'unread' => Notification::where('user_id', $user->id)->where('is_read', false)->count(),
            'read' => Notification::where('user_id', $user->id)->where('is_read', true)->count(),
        ];
        
        // Get unique types
        $types = Notification::where('user_id', $user->id)
            ->distinct()
            ->pluck('type')
            ->filter()
            ->values()
            ->toArray();
        
        return Inertia::render('buyer/Notifications', [
            'auth' => ['user' => $user],
            'notifications' => $notifications,
            'stats' => $stats,
            'types' => $types,
            'filters' => $request->only(['search', 'type', 'status']),
        ]);
    }

    /**
     * Mark a notification as read.
     */
    public function markNotificationAsRead(Request $request)
    {
        $request->validate([
            'id' => 'required|exists:notifications,id',
        ]);
        
        $notification = Notification::where('id', $request->id)
            ->where('user_id', Auth::id())
            ->first();
        
        if ($notification) {
            $notification->markAsRead();
        }
        
        return back();
    }

    /**
     * Mark all notifications as read.
     */
    public function markAllNotificationsAsRead()
    {
        Notification::where('user_id', Auth::id())
            ->where('is_read', false)
            ->update([
                'is_read' => true,
                'read_at' => now(),
            ]);
        
        return back();
    }

    /**
     * Delete a notification.
     */
    public function deleteNotification(Request $request)
    {
        $request->validate([
            'id' => 'required|exists:notifications,id',
        ]);
        
        $notification = Notification::where('id', $request->id)
            ->where('user_id', Auth::id())
            ->first();
        
        if ($notification) {
            $notification->delete();
        }
        
        return back();
    }


    /**
     * Display the settings page.
     */
    public function settings()
    {
        return Inertia::render('buyer/Settings');
    }

    /**
     * Display the ratings page - all reviews given by the buyer.
     */
    public function ratings(Request $request)
    {
        $user = Auth::user();
        
        $query = Review::with(['product', 'product.seller'])
            ->where('buyer_id', $user->id);
        
        // Filter by search
        if ($request->has('search') && $request->search) {
            $query->whereHas('product', function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->search . '%');
            });
        }
        
        // Filter by rating
        if ($request->has('rating') && $request->rating && $request->rating !== '') {
            $query->where('rating', $request->rating);
        }
        
        $reviews = $query->latest()->paginate(10);
        
        // Get stats
        $stats = [
            'total' => Review::where('buyer_id', $user->id)->count(),
            'avgRating' => round(Review::where('buyer_id', $user->id)->avg('rating'), 1) ?? 0,
            'fiveStars' => Review::where('buyer_id', $user->id)->where('rating', 5)->count(),
            'fourStars' => Review::where('buyer_id', $user->id)->where('rating', 4)->count(),
            'threeStars' => Review::where('buyer_id', $user->id)->where('rating', 3)->count(),
            'twoStars' => Review::where('buyer_id', $user->id)->where('rating', 2)->count(),
            'oneStar' => Review::where('buyer_id', $user->id)->where('rating', 1)->count(),
        ];
        
        $filters = [
            'search' => $request->search ?? '',
            'rating' => $request->rating ?? '',
        ];
        
        // Get orders that can be rated (delivered/completed orders with products that haven't been rated yet)
        $ratedProductIds = Review::where('buyer_id', $user->id)->pluck('product_id')->toArray();
        
        $ordersToRate = Order::with(['orderItems.product', 'orderItems.product.seller'])
            ->where('buyer_id', $user->id)
            ->whereIn('order_status', ['delivered', 'completed'])
            ->where('payment_status', 'paid')
            ->get()
            ->map(function ($order) use ($user) {
                // Filter order items to only include products that haven't been rated yet
                $unratedItems = $order->orderItems->filter(function ($item) use ($user) {
                    // Check if this specific product from this order has been rated
                    $hasReview = Review::where('buyer_id', $user->id)
                        ->where('product_id', $item->product_id)
                        ->exists();
                    return !$hasReview && $item->product;
                });
                
                $order->unrated_items = $unratedItems->values();
                $order->has_unrated_items = $order->unrated_items->count() > 0;
                
                return $order;
            })
            ->filter(function ($order) {
                return $order->has_unrated_items;
            })
            ->values();
        
        return Inertia::render('buyer/Rating', [
            'auth' => ['user' => $user],
            'reviews' => $reviews,
            'stats' => $stats,
            'filters' => $filters,
            'ordersToRate' => $ordersToRate,
        ]);
    }

    /**
     * Add a product to the wishlist.
     */
    public function addToWishlist(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
        ]);

        $user = Auth::user();

        // Check if already in wishlist
        $existing = Wishlist::where('buyer_id', $user->id)
            ->where('product_id', $request->product_id)
            ->first();

        if ($existing) {
            return response()->json(['message' => 'Product already in wishlist'], 422);
        }

        Wishlist::create([
            'buyer_id' => $user->id,
            'product_id' => $request->product_id,
        ]);

        return response()->json(['message' => 'Product added to wishlist']);
    }

    /**
     * Remove a product from the wishlist.
     */
    public function removeFromWishlist(Wishlist $wishlist)
    {
        $user = Auth::user();

        // Ensure the wishlist item belongs to the user
        if ($wishlist->buyer_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $wishlist->delete();

        return response()->json(['message' => 'Product removed from wishlist']);
    }

    /**
     * Update cart item quantity.
     * @deprecated Use CartController::updateCartItem() instead
     */
    public function updateCartItem(Request $request, CartItem $cartItem)
    {
        return response()->json(['message' => 'Use CartController::updateCartItem() instead'], 410);
    }

    /**
     * Remove item from cart.
     * @deprecated Use CartController::removeCartItem() instead
     */
    public function removeCartItem(CartItem $cartItem)
    {
        return response()->json(['message' => 'Use CartController::removeCartItem() instead'], 410);
    }

    /**
     * Add a product to the cart.
     * @deprecated Use CartController::addToCart() instead
     */
    public function addToCart(Request $request)
    {
        return response()->json(['message' => 'Use CartController::addToCart() instead'], 410);
    }

    /**
     * Process checkout.
     * @deprecated Use CartController::checkout() instead
     */
    public function checkout(Request $request)
    {
        return response()->json(['message' => 'Use CartController::checkout() instead'], 410);
    }

    /**
     * Rate a product.
     */
    public function rateProduct(Request $request, Product $product)
    {
        $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'review' => 'nullable|string|max:1000',
        ]);

        $user = Auth::user();

        // Check if user has purchased this product
        $hasPurchased = Order::where('buyer_id', $user->id)
            ->where('payment_status', 'paid')
            ->whereHas('orderItems', function ($query) use ($product) {
                $query->where('product_id', $product->id);
            })
            ->exists();

        if (!$hasPurchased) {
            return response()->json([
                'message' => 'You must purchase this product before rating it.'
            ], 403);
        }

        // Create or update the review
        $review = Review::updateOrCreate(
            [
                'product_id' => $product->id,
                'buyer_id' => $user->id,
            ],
            [
                'rating' => $request->rating,
                'review' => $request->review,
            ]
        );

        return response()->json([
            'message' => 'Rating submitted successfully!',
            'review' => $review,
        ]);
    }

    /**
     * Get product reviews.
     */
    public function getProductReviews(Product $product)
    {
        $reviews = Review::with('buyer')
            ->where('product_id', $product->id)
            ->latest()
            ->paginate(10);

        // Calculate average rating
        $averageRating = Review::where('product_id', $product->id)->avg('rating');
        $reviewCount = Review::where('product_id', $product->id)->count();

        return response()->json([
            'reviews' => $reviews,
            'average_rating' => round($averageRating, 1) ?? 0,
            'review_count' => $reviewCount,
        ]);
    }

    /**
     * Get recommended products based on ratings.
     */
    public function getRecommendedProducts()
    {
        // Get top-rated products (4 stars and above)
        $recommendedProducts = Product::with(['seller', 'reviews'])
            ->where('is_approved', true)
            ->where('is_active', true)
            ->whereHas('reviews', function ($query) {
                $query->selectRaw('AVG(rating) as avg_rating')
                    ->groupBy('product_id')
                    ->havingRaw('AVG(rating) >= 4');
            })
            ->withCount('reviews')
            ->orderByDesc('reviews_count')
            ->take(10)
            ->get();

        return response()->json([
            'recommended_products' => $recommendedProducts,
        ]);
    }
}
