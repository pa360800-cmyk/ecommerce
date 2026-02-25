<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Product;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Notification;
use Illuminate\Support\Facades\Auth;

class FarmerController extends Controller
{
    /**
     * Display the farmer dashboard.
     */
    public function dashboard()
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

    /**
     * Display the products page.
     */
    public function products()
    {
        $user = Auth::user();
        
        // Fetch products for the logged-in farmer
        $products = Product::where('seller_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->get();
        
        return Inertia::render('farmer/Products', [
            'auth' => ['user' => $user],
            'products' => $products,
        ]);
    }

    /**
     * Display the create product page.
     */
    public function createProduct()
    {
        $user = Auth::user();
        
        return Inertia::render('farmer/ProductsCreate', [
            'auth' => ['user' => $user],
            'categories' => Product::getCategoryOptions(),
            'units' => [
                'kg' => 'Kilogram (kg)',
                'g' => 'Gram (g)',
                'lb' => 'Pound (lb)',
                'oz' => 'Ounce (oz)',
                'ton' => 'Ton',
                'piece' => 'Piece',
                'bunch' => 'Bunch',
                'dozen' => 'Dozen',
                'liter' => 'Liter (L)',
                'ml' => 'Milliliter (ml)',
                'pack' => 'Pack',
                'box' => 'Box',
            ],
        ]);
    }

    /**
     * Display the orders page.
     */
    public function orders(Request $request)
    {
        $user = Auth::user();
        
        $query = Order::with(['buyer', 'orderItems.product'])
            ->whereHas('orderItems.product', function ($q) use ($user) {
                $q->where('seller_id', $user->id);
            });
        
        // Filter by status
        if ($request->has('status') && $request->status !== 'all' && $request->status !== '') {
            $query->where('order_status', $request->status);
        }
        
        // Filter by search
        if ($request->has('search') && $request->search) {
            $query->where(function ($q) use ($request) {
                $q->where('id', 'like', '%' . $request->search . '%')
                  ->orWhereHas('buyer', function ($bq) use ($request) {
                      $bq->where('name', 'like', '%' . $request->search . '%')
                         ->orWhere('email', 'like', '%' . $request->search . '%');
                  });
            });
        }
        
        $orders = $query->latest()->paginate(10);
        
        // Get stats for the farmer
        $stats = [
            'totalOrders' => Order::whereHas('orderItems.product', function ($q) use ($user) {
                $q->where('seller_id', $user->id);
            })->count(),
            'pendingOrders' => Order::whereHas('orderItems.product', function ($q) use ($user) {
                $q->where('seller_id', $user->id);
            })->where('order_status', 'pending')->count(),
            'processingOrders' => Order::whereHas('orderItems.product', function ($q) use ($user) {
                $q->where('seller_id', $user->id);
            })->whereIn('order_status', ['confirmed', 'preparing'])->count(),
            'completedOrders' => Order::whereHas('orderItems.product', function ($q) use ($user) {
                $q->where('seller_id', $user->id);
            })->whereIn('order_status', ['delivered', 'completed'])->count(),
            'totalRevenue' => Order::whereHas('orderItems.product', function ($q) use ($user) {
                $q->where('seller_id', $user->id);
            })->where('payment_status', 'paid')
              ->whereIn('order_status', ['delivered', 'completed'])
              ->sum('total_amount'),
        ];
        
        return Inertia::render('farmer/Orders', [
            'auth' => ['user' => $user],
            'orders' => $orders,
            'stats' => $stats,
            'filters' => $request->only(['search', 'status']),
        ]);
    }

    /**
     * Display the analytics page.
     */
    public function analytics()
    {
        $user = Auth::user();
        
        // Get all orders for the farmer's products
        $ordersQuery = Order::whereHas('orderItems.product', function ($query) use ($user) {
            $query->where('seller_id', $user->id);
        })->with(['orderItems.product', 'buyer']);
        
        // Get stats
        $stats = [
            'totalProducts' => Product::where('seller_id', $user->id)->count(),
            'totalOrders' => (clone $ordersQuery)->count(),
            'pendingOrders' => (clone $ordersQuery)->where('order_status', 'pending')->count(),
            'processingOrders' => (clone $ordersQuery)->whereIn('order_status', ['confirmed', 'preparing'])->count(),
            'completedOrders' => (clone $ordersQuery)->whereIn('order_status', ['delivered', 'completed'])->count(),
            'totalRevenue' => (clone $ordersQuery)->where('payment_status', 'paid')
                ->whereIn('order_status', ['delivered', 'completed'])
                ->sum('total_amount'),
            'pendingApproval' => Product::where('seller_id', $user->id)
                ->where('is_approved', false)
                ->count(),
        ];
        
        // Get recent orders
        $recentOrders = (clone $ordersQuery)->latest()->take(10)->get();
        
        // Get top products by sales
        $topProducts = Product::where('seller_id', $user->id)
            ->withCount(['orderItems' => function ($query) use ($user) {
                $query->whereHas('order', function ($q) {
                    $q->whereIn('order_status', ['delivered', 'completed', 'shipped']);
                });
            }])
            ->orderBy('order_items_count', 'desc')
            ->take(5)
            ->get()
            ->map(function ($product) {
                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'price' => $product->price,
                    'sales' => $product->order_items_count ?? 0,
                    'image' => $product->image,
                ];
            });
        
        // Get revenue data for the last 30 days
        $revenueData = [];
        for ($i = 29; $i >= 0; $i--) {
            $date = now()->subDays($i)->format('Y-m-d');
            $dayRevenue = Order::whereHas('orderItems.product', function ($query) use ($user) {
                $query->where('seller_id', $user->id);
            })
                ->whereDate('created_at', $date)
                ->where('payment_status', 'paid')
                ->whereIn('order_status', ['delivered', 'completed'])
                ->sum('total_amount');
            
            $revenueData[] = [
                'day' => now()->subDays($i)->format('M d'),
                'date' => $date,
                'value' => (float) $dayRevenue,
            ];
        }
        
        // Get orders data by status
        $ordersData = [
            'pending' => (clone $ordersQuery)->where('order_status', 'pending')->count(),
            'confirmed' => (clone $ordersQuery)->where('order_status', 'confirmed')->count(),
            'preparing' => (clone $ordersQuery)->where('order_status', 'preparing')->count(),
            'shipped' => (clone $ordersQuery)->where('order_status', 'shipped')->count(),
            'delivered' => (clone $ordersQuery)->where('order_status', 'delivered')->count(),
            'completed' => (clone $ordersQuery)->where('order_status', 'completed')->count(),
            'cancelled' => (clone $ordersQuery)->where('order_status', 'cancelled')->count(),
        ];
        
        // Get product data
        $productData = [
            'total' => Product::where('seller_id', $user->id)->count(),
            'active' => Product::where('seller_id', $user->id)->where('is_active', true)->count(),
            'pending' => Product::where('seller_id', $user->id)->where('is_approved', false)->count(),
            'rejected' => Product::where('seller_id', $user->id)->where('is_approved', false)->whereNotNull('rejection_reason')->count(),
        ];
        
        return Inertia::render('farmer/Analytics', [
            'auth' => ['user' => $user],
            'stats' => $stats,
            'recentOrders' => $recentOrders,
            'topProducts' => $topProducts,
            'revenueData' => $revenueData,
            'ordersData' => $ordersData,
            'productData' => $productData,
        ]);
    }

    /**
     * Display the inventory page.
     */
    public function inventory()
    {
        $user = Auth::user();
        
        // Fetch all products for the logged-in farmer
        $products = Product::where('seller_id', $user->id)
            ->orderBy('created_at', 'desc')
            ->get();
        
        // Calculate inventory statistics
        $totalProducts = $products->count();
        $totalStock = $products->sum('stock');
        $lowStockCount = $products->filter(function($product) {
            return $product->stock > 0 && $product->stock <= 10;
        })->count();
        $outOfStockCount = $products->filter(function($product) {
            return $product->stock == 0;
        })->count();
        
        return Inertia::render('farmer/Inventory', [
            'auth' => ['user' => $user],
            'products' => $products,
            'stats' => [
                'totalProducts' => $totalProducts,
                'totalStock' => $totalStock,
                'lowStockCount' => $lowStockCount,
                'outOfStockCount' => $outOfStockCount,
            ],
        ]);
    }

    /**
     * Display the earnings page.
     */
    public function earnings()
    {
        $user = Auth::user();
        
        // Get all order items for this farmer's products
        $orderItemsQuery = OrderItem::whereHas('product', function ($query) use ($user) {
            $query->where('seller_id', $user->id);
        })->with(['order.buyer', 'product']);
        
        // Get completed orders (paid and delivered/completed)
        $completedOrdersQuery = clone $orderItemsQuery;
        $completedOrdersQuery = $completedOrdersQuery->whereHas('order', function ($query) {
            $query->where('payment_status', 'paid')
                  ->whereIn('order_status', ['delivered', 'completed']);
        });
        
        // Calculate total earnings
        $totalEarnings = $completedOrdersQuery->get()->sum(function ($item) {
            return $item->quantity * $item->price;
        });
        
        // Get pending earnings (paid but not yet delivered/completed)
        $pendingOrdersQuery = clone $orderItemsQuery;
        $pendingOrdersQuery = $pendingOrdersQuery->whereHas('order', function ($query) {
            $query->where('payment_status', 'paid')
                  ->whereIn('order_status', ['pending', 'confirmed', 'preparing', 'shipped']);
        });
        
        $pendingEarnings = $pendingOrdersQuery->get()->sum(function ($item) {
            return $item->quantity * $item->price;
        });
        
        // Get monthly earnings for the last 12 months
        $monthlyEarnings = [];
        for ($i = 11; $i >= 0; $i--) {
            $month = now()->subMonths($i);
            $monthStart = $month->copy()->startOfMonth();
            $monthEnd = $month->copy()->endOfMonth();
            
            $monthlyTotal = OrderItem::whereHas('product', function ($query) use ($user) {
                $query->where('seller_id', $user->id);
            })
            ->whereHas('order', function ($query) use ($monthStart, $monthEnd) {
                $query->where('payment_status', 'paid')
                      ->whereIn('order_status', ['delivered', 'completed'])
                      ->whereBetween('created_at', [$monthStart, $monthEnd]);
            })
            ->get()
            ->sum(function ($item) {
                return $item->quantity * $item->price;
            });
            
            $monthlyEarnings[] = [
                'month' => $month->format('M Y'),
                'monthShort' => $month->format('M'),
                'value' => (float) $monthlyTotal,
            ];
        }
        
        // Get recent transactions (orders with their earnings)
        $orderIds = OrderItem::whereHas('product', function ($query) use ($user) {
            $query->where('seller_id', $user->id);
        })
        ->whereHas('order', function ($query) {
            $query->where('payment_status', 'paid');
        })
        ->pluck('order_id')
        ->unique()
        ->values();
        
        $recentTransactions = Order::with(['buyer', 'orderItems.product'])
            ->whereIn('id', $orderIds)
            ->where('payment_status', 'paid')
            ->latest()
            ->take(20)
            ->get()
            ->map(function ($order) use ($user) {
                // Calculate the seller's portion from this order
                $sellerAmount = $order->orderItems
                    ->filter(function ($item) use ($user) {
                        return $item->product && $item->product->seller_id == $user->id;
                    })
                    ->sum(function ($item) {
                        return $item->quantity * $item->price;
                    });
                
                return [
                    'id' => $order->id,
                    'buyer' => $order->buyer,
                    'total_amount' => $order->total_amount,
                    'seller_amount' => $sellerAmount,
                    'payment_status' => $order->payment_status,
                    'order_status' => $order->order_status,
                    'created_at' => $order->created_at,
                ];
            });
        
        // Calculate stats
        $stats = [
            'totalEarnings' => $totalEarnings,
            'pendingEarnings' => $pendingEarnings,
            'completedOrders' => $recentTransactions->whereIn('order_status', ['delivered', 'completed'])->count(),
            'pendingOrders' => $recentTransactions->whereIn('order_status', ['pending', 'confirmed', 'preparing', 'shipped'])->count(),
        ];
        
        return Inertia::render('farmer/Earnings', [
            'auth' => ['user' => $user],
            'stats' => $stats,
            'monthlyEarnings' => $monthlyEarnings,
            'recentTransactions' => $recentTransactions,
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
        
        return Inertia::render('farmer/Notifications', [
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
        return Inertia::render('farmer/Settings');
    }

    /**
     * Display the farmer profile page.
     */
    public function profile()
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        
        // Load the related data
        $user->load(['sellerProfile', 'sellerDocuments', 'sellerBankAccount']);
        
        return Inertia::render('farmer/profile', [
            'auth' => ['user' => $user],
            'sellerProfile' => $user->sellerProfile,
            'sellerDocuments' => $user->sellerDocuments,
            'sellerBankAccount' => $user->sellerBankAccount,
        ]);
    }

    /**
     * Display the edit farmer profile page.
     */
    public function editProfile()
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        
        // Load the related data
        $user->load(['sellerProfile', 'sellerDocuments', 'sellerBankAccount']);
        
        return Inertia::render('farmer/profile-edit', [
            'auth' => ['user' => $user],
            'sellerProfile' => $user->sellerProfile,
            'sellerDocuments' => $user->sellerDocuments,
            'sellerBankAccount' => $user->sellerBankAccount,
        ]);
    }

    /**
     * Update the farmer profile.
     */
    public function updateProfile(Request $request)
    {
        /** @var \App\Models\User $user */
        $user = Auth::user();
        
        // Validate the request
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:users,email,' . $user->id],
            'phone' => ['nullable', 'string', 'max:20'],
            'address' => ['nullable', 'string', 'max:500'],
            'farm_location' => ['nullable', 'string', 'max:255'],
            'farm_description' => ['nullable', 'string', 'max:1000'],
            'profile_image' => ['nullable', 'image', 'mimes:jpeg,png,jpg,gif,webp', 'max:2048'],
            // Seller profile fields
            'store_name' => ['nullable', 'string', 'max:255'],
            'business_type' => ['nullable', 'string', 'max:100'],
            'business_address' => ['nullable', 'string', 'max:500'],
            'tax_id' => ['nullable', 'string', 'max:50'],
        ]);
        
        // Handle image upload
        if ($request->hasFile('profile_image')) {
            $image = $request->file('profile_image');
            $imageName = time() . '_' . $image->getClientOriginalName();
            $imagePath = $image->storeAs('profile_images', $imageName, 'public');
            // Store only the path relative to storage, frontend will handle /storage prefix
            $validated['profile_image'] = $imagePath;
        }
        
        // Update user fields
        $user->fill([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? null,
            'address' => $validated['address'] ?? null,
            'farm_location' => $validated['farm_location'] ?? null,
            'farm_description' => $validated['farm_description'] ?? null,
        ]);
        
        // Update profile image if uploaded
        if (isset($validated['profile_image'])) {
            $user->profile_image = $validated['profile_image'];
        }
        
        // Check if email changed
        if ($user->isDirty('email')) {
            $user->email_verified_at = null;
        }
        
        $user->save();
        
        // Update or create seller profile
        $sellerProfileData = [
            'store_name' => $validated['store_name'] ?? null,
            'business_type' => $validated['business_type'] ?? null,
            'business_address' => $validated['business_address'] ?? null,
            'tax_id' => $validated['tax_id'] ?? null,
        ];
        
        // Only update status if it's not already set or if it's pending
        if ($user->sellerProfile) {
            $user->sellerProfile->update($sellerProfileData);
        } else {
            $user->sellerProfile()->create($sellerProfileData);
        }
        
        return redirect()->route('farmer.profile')->with('success', 'Profile updated successfully!');
    }
}
