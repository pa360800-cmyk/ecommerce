<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Product;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class BuyerDashboardController extends Controller
{
    /**
     * Display the buyer dashboard.
     */
    public function index()
    {
        $user = Auth::user();
        
        $orders = Order::where('buyer_id', $user->id)
            ->with(['orderItems.product', 'orderItems.product.seller'])
            ->latest()
            ->take(10)
            ->get();
        
        $cartItems = DB::table('cart_items')
            ->where('buyer_id', $user->id)
            ->get();
        
        $totalOrders = $orders->count();
        $totalSpent = $orders->where('payment_status', 'paid')
            ->whereIn('order_status', ['delivered', 'completed'])
            ->sum('total_amount');
        
        // Get featured products (approved products from farmers)
        $featuredProducts = Product::where('is_approved', true)
            ->with('seller')
            ->latest()
            ->take(6)
            ->get();
        
        return Inertia::render('Dashboard/Buyer', [
            'auth' => ['user' => $user],
            'stats' => [
                'totalOrders' => $totalOrders,
                'cartItems' => $cartItems->count(),
                'totalSpent' => $totalSpent,
                'reviews' => 0, // Placeholder for reviews
            ],
            'orders' => $orders,
            'featuredProducts' => $featuredProducts,
            'cartItems' => $cartItems,
        ]);
    }
}
