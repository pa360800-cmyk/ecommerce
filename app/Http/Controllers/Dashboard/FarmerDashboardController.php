<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Product;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class FarmerDashboardController extends Controller
{
    /**
     * Display the farmer dashboard.
     */
    public function index()
    {
        $user = Auth::user();
        
        $products = Product::where('seller_id', $user->id)->get();
        $orders = Order::whereHas('orderItems.product', function ($query) use ($user) {
            $query->where('seller_id', $user->id);
        })->with(['orderItems.product', 'buyer'])->latest()->take(10)->get();
        
        $totalProducts = $products->count();
        $totalOrders = $orders->count();
        $totalRevenue = $orders->where('payment_status', 'paid')
            ->whereIn('order_status', ['delivered', 'completed'])
            ->sum('total_amount');
        $pendingApproval = Product::where('seller_id', $user->id)
            ->where('is_approved', false)
            ->count();
        
        return Inertia::render('farmer/dashboard', [
            'auth' => ['user' => $user],
            'stats' => [
                'totalProducts' => $totalProducts,
                'totalOrders' => $totalOrders,
                'totalRevenue' => $totalRevenue,
                'pendingApproval' => $pendingApproval,
            ],
            'products' => $products,
            'orders' => $orders,
        ]);
    }
}
