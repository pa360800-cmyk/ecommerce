<?php

namespace App\Http\Controllers\Dashboard;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Order;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class LogisticsDashboardController extends Controller
{
    /**
     * Display the logistics dashboard.
     */
    public function index()
    {
        $user = Auth::user();
        
        $pendingDeliveries = Order::whereIn('order_status', ['confirmed', 'preparing', 'shipped'])
            ->with(['buyer', 'orderItems.product'])
            ->get();
        
        $pendingCount = $pendingDeliveries->where('order_status', 'pending')->count();
        $inTransitCount = $pendingDeliveries->whereIn('order_status', ['preparing', 'shipped'])->count();
        $deliveredToday = Order::where('order_status', 'delivered')
            ->whereDate('updated_at', today())
            ->count();
        $totalDelivered = Order::where('order_status', 'delivered')->count();
        
        return Inertia::render('Dashboard/Logistics', [
            'auth' => ['user' => $user],
            'stats' => [
                'pendingDeliveries' => $pendingCount,
                'inTransit' => $inTransitCount,
                'deliveredToday' => $deliveredToday,
                'totalDelivered' => $totalDelivered,
            ],
            'orders' => $pendingDeliveries,
        ]);
    }
}
