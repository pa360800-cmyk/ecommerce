<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Order;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Display the dashboard with role-based data.
     */
    public function index()
    {
        $user = Auth::user();
        
        $data = [];
        $component = 'Dashboard/Buyer'; // default
        
        switch ($user->role) {
            case 'admin':
                $data = $this->getAdminData($user);
                $component = 'admin/dashboard';
                break;
            case 'farmer':
                $data = $this->getFarmerData($user);
                $component = 'farmer/dashboard';
                break;
            case 'buyer':
                $data = $this->getBuyerData($user);
                $component = 'buyer/dashboard';
                break;
            case 'logistics':
                $data = $this->getLogisticsData($user);
                $component = 'logistic/dashboard';
                break;
            default:
                $data = $this->getBuyerData($user);
                $component = 'buyer/dashboard';
        }
        
        return Inertia::render($component, $data);
    }
    
    /**
     * Get data for farmer dashboard.
     */
    private function getFarmerData($user)
    {
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
        
        return [
            'auth' => ['user' => $user],
            'stats' => [
                'totalProducts' => $totalProducts,
                'totalOrders' => $totalOrders,
                'totalRevenue' => $totalRevenue,
                'pendingApproval' => $pendingApproval,
            ],
            'products' => $products,
            'orders' => $orders,
        ];
    }
    
    /**
     * Get data for buyer dashboard.
     */
    private function getBuyerData($user)
    {
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
        
        return [
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
        ];
    }
    
    /**
     * Get data for logistics dashboard.
     */
    private function getLogisticsData($user)
    {
        $pendingDeliveries = Order::whereIn('order_status', ['confirmed', 'preparing', 'shipped'])
            ->with(['buyer', 'orderItems.product'])
            ->get();
        
        $pendingCount = $pendingDeliveries->where('order_status', 'pending')->count();
        $inTransitCount = $pendingDeliveries->whereIn('order_status', ['preparing', 'shipped'])->count();
        $deliveredToday = Order::where('order_status', 'delivered')
            ->whereDate('updated_at', today())
            ->count();
        $totalDelivered = Order::where('order_status', 'delivered')->count();
        
        return [
            'auth' => ['user' => $user],
            'stats' => [
                'pendingDeliveries' => $pendingCount,
                'inTransit' => $inTransitCount,
                'deliveredToday' => $deliveredToday,
                'totalDelivered' => $totalDelivered,
            ],
            'orders' => $pendingDeliveries,
        ];
    }
    
    /**
     * Get data for admin dashboard.
     */
    private function getAdminData($user)
    {
        // Get all users count by role
        $usersByRole = DB::table('users')
            ->select('role', DB::raw('count(*) as count'))
            ->groupBy('role')
            ->get()
            ->pluck('count', 'role')
            ->toArray();
        
        $totalUsers = array_sum($usersByRole);
        $totalFarmers = $usersByRole['farmer'] ?? 0;
        $totalBuyers = $usersByRole['buyer'] ?? 0;
        $totalLogistics = $usersByRole['logistics'] ?? 0;
        
        // Get pending product approvals
        $pendingProducts = Product::where('is_approved', false)
            ->with('seller')
            ->latest()
            ->take(10)
            ->get();
        
        $pendingProductCount = $pendingProducts->count();
        
        // Get all products count
        $totalProducts = Product::count();
        
        // Get all orders stats
        $totalOrders = Order::count();
        $pendingOrders = Order::whereIn('order_status', ['pending', 'confirmed', 'preparing', 'shipped'])->count();
        $completedOrders = Order::whereIn('order_status', ['delivered', 'completed'])->count();
        
        // Get revenue stats
        $totalRevenue = Order::where('payment_status', 'paid')
            ->whereIn('order_status', ['delivered', 'completed'])
            ->sum('total_amount');
        
        // Get recent orders
        $recentOrders = Order::with(['buyer', 'orderItems.product'])
            ->latest()
            ->take(10)
            ->get();
        
        return [
            'auth' => ['user' => $user],
            'stats' => [
                'totalUsers' => $totalUsers,
                'totalFarmers' => $totalFarmers,
                'totalBuyers' => $totalBuyers,
                'totalLogistics' => $totalLogistics,
                'totalProducts' => $totalProducts,
                'pendingProductApprovals' => $pendingProductCount,
                'totalOrders' => $totalOrders,
                'pendingOrders' => $pendingOrders,
                'completedOrders' => $completedOrders,
                'totalRevenue' => $totalRevenue,
            ],
            'pendingProducts' => $pendingProducts,
            'recentOrders' => $recentOrders,
        ];
    }
}
