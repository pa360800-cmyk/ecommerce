<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\BuyerController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\FarmerController;
use App\Http\Controllers\LogisticController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\UserController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

// Welcome page
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
        'auth' => [
            'user' => auth()->user(),
        ],
    ]);
})->name('welcome');

// Auth routes
require __DIR__ . '/auth.php';

// Dashboard redirect based on user role
Route::get('/dashboard', function () {
    $user = auth()->user();
    
    if (!$user) {
        return redirect()->route('login');
    }
    
    switch ($user->role) {
        case 'admin':
        case 'super_admin':
            return redirect()->route('admin.dashboard');
        case 'buyer':
            return redirect()->route('buyer.dashboard');
        case 'farmer':
            return redirect()->route('farmer.dashboard');
        case 'logistics':
        case 'rider':
            return redirect()->route('logistic.dashboard');
        default:
            return redirect()->route('welcome');
    }
})->middleware(['auth', 'verified'])->name('dashboard');

// Cart API routes (for AJAX calls)
Route::prefix('api/cart')->group(function () {
    Route::get('/', [CartController::class, 'index'])->middleware('auth');
    Route::post('/add', [CartController::class, 'addToCart'])->middleware('auth');
    Route::put('/{cartItem}', [CartController::class, 'updateCartItem'])->middleware('auth');
    Route::delete('/{cartItem}', [CartController::class, 'removeCartItem'])->middleware('auth');
    Route::delete('/', [CartController::class, 'clearCart'])->middleware('auth');
    Route::get('/count', [CartController::class, 'getCartCount'])->middleware('auth');
    Route::get('/summary', [CartController::class, 'getCartSummary'])->middleware('auth');
    Route::post('/checkout', [CartController::class, 'checkout'])->middleware('auth');
});

// Cart page route
Route::get('/cart', [CartController::class, 'index'])
    ->middleware(['auth', 'verified'])
    ->name('cart.index');

// Order routes
Route::prefix('orders')->group(function () {
    Route::get('/', [OrderController::class, 'index'])->middleware('auth')->name('orders.index');
    Route::get('/{order}', [OrderController::class, 'show'])->middleware('auth')->name('orders.show');
    Route::put('/{order}/status', [OrderController::class, 'updateStatus'])->middleware('auth')->name('orders.updateStatus');
    Route::put('/{order}/payment', [OrderController::class, 'updatePaymentStatus'])->middleware('auth')->name('orders.updatePayment');
    Route::put('/{order}/tracking', [OrderController::class, 'updateTracking'])->middleware('auth')->name('orders.updateTracking');
});

// Product routes
Route::prefix('products')->group(function () {
    Route::get('/', [ProductController::class, 'index'])->middleware('auth')->name('products.index');
    Route::get('/create', [ProductController::class, 'create'])->middleware('auth')->name('products.create');
    Route::post('/', [ProductController::class, 'store'])->middleware('auth')->name('products.store');
    Route::get('/{product}/edit', [ProductController::class, 'edit'])->middleware('auth')->name('products.edit');
    Route::put('/{product}', [ProductController::class, 'update'])->middleware('auth')->name('products.update');
    Route::delete('/{product}', [ProductController::class, 'destroy'])->middleware('auth')->name('products.destroy');
    Route::put('/{product}/approve', [ProductController::class, 'approve'])->middleware('auth')->name('products.approve');
    Route::put('/{product}/reject', [ProductController::class, 'reject'])->middleware('auth')->name('products.reject');
});

// Buyer Routes
Route::prefix('buyer')->middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [BuyerController::class, 'dashboard'])->name('buyer.dashboard');
    Route::get('/products', [BuyerController::class, 'products'])->name('buyer.products');
    Route::get('/orders', [BuyerController::class, 'orders'])->name('buyer.orders');
    Route::get('/wishlist', [BuyerController::class, 'wishlist'])->name('buyer.wishlist');
    Route::post('/wishlist/add', [BuyerController::class, 'addToWishlist'])->name('buyer.wishlist.add');
    Route::delete('/wishlist/{wishlist}', [BuyerController::class, 'removeFromWishlist'])->name('buyer.wishlist.remove');
    Route::get('/addresses', [BuyerController::class, 'addresses'])->name('buyer.addresses');
    Route::get('/payment-methods', [BuyerController::class, 'paymentMethods'])->name('buyer.paymentMethods');
    Route::get('/notifications', [BuyerController::class, 'notifications'])->name('buyer.notifications');
    Route::post('/notifications/mark-read', [BuyerController::class, 'markNotificationAsRead'])->name('buyer.notifications.markRead');
    Route::post('/notifications/mark-all-read', [BuyerController::class, 'markAllNotificationsAsRead'])->name('buyer.notifications.markAllRead');
    Route::delete('/notifications/{id}', [BuyerController::class, 'deleteNotification'])->name('buyer.notifications.delete');
    Route::get('/settings', [BuyerController::class, 'settings'])->name('buyer.settings');
    Route::get('/ratings', [BuyerController::class, 'ratings'])->name('buyer.ratings');
    Route::post('/products/{product}/rate', [BuyerController::class, 'rateProduct'])->name('buyer.products.rate');
    Route::get('/products/{product}/reviews', [BuyerController::class, 'getProductReviews'])->name('buyer.products.reviews');
    Route::get('/recommended', [BuyerController::class, 'getRecommendedProducts'])->name('buyer.recommended');
    Route::get('/cart', [BuyerController::class, 'cart'])->name('buyer.cart');
});

// Farmer Routes
Route::prefix('farmer')->middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [FarmerController::class, 'dashboard'])->name('farmer.dashboard');
    Route::get('/products', [FarmerController::class, 'products'])->name('farmer.products');
    Route::get('/products/create', [FarmerController::class, 'createProduct'])->name('farmer.products.create');
    Route::get('/orders', [FarmerController::class, 'orders'])->name('farmer.orders');
    Route::get('/analytics', [FarmerController::class, 'analytics'])->name('farmer.analytics');
    Route::get('/inventory', [FarmerController::class, 'inventory'])->name('farmer.inventory');
    Route::get('/earnings', [FarmerController::class, 'earnings'])->name('farmer.earnings');
    Route::get('/notifications', [FarmerController::class, 'notifications'])->name('farmer.notifications');
    Route::post('/notifications/mark-read', [FarmerController::class, 'markNotificationAsRead'])->name('farmer.notifications.markRead');
    Route::post('/notifications/mark-all-read', [FarmerController::class, 'markAllNotificationsAsRead'])->name('farmer.notifications.markAllRead');
    Route::delete('/notifications/{id}', [FarmerController::class, 'deleteNotification'])->name('farmer.notifications.delete');
    Route::get('/settings', [FarmerController::class, 'settings'])->name('farmer.settings');
    Route::get('/profile', [FarmerController::class, 'profile'])->name('farmer.profile');
    Route::get('/profile/edit', [FarmerController::class, 'editProfile'])->name('farmer.profile.edit');
    Route::put('/profile', [FarmerController::class, 'updateProfile'])->name('farmer.profile.update');
});

// Logistic/Rider Routes
Route::prefix('logistic')->middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [LogisticController::class, 'dashboard'])->name('logistic.dashboard');
    Route::get('/pending', [LogisticController::class, 'pending'])->name('logistic.pending');
    Route::get('/active', [LogisticController::class, 'active'])->name('logistic.active');
    Route::get('/delivered', [LogisticController::class, 'delivered'])->name('logistic.delivered');
    Route::get('/orders', [LogisticController::class, 'orders'])->name('logistic.orders');
    Route::get('/routes', [LogisticController::class, 'routes'])->name('logistic.routes');
    Route::get('/navigation', [LogisticController::class, 'navigation'])->name('logistic.navigation');
    Route::get('/notifications', [LogisticController::class, 'notifications'])->name('logistic.notifications');
    Route::post('/notifications/{id}/mark-read', [LogisticController::class, 'markNotificationAsRead'])->name('logistic.notifications.markRead');
    Route::post('/notifications/mark-all-read', [LogisticController::class, 'markAllNotificationsAsRead'])->name('logistic.notifications.markAllRead');
    Route::delete('/notifications/{id}', [LogisticController::class, 'deleteNotification'])->name('logistic.notifications.delete');
    Route::get('/settings', [LogisticController::class, 'settings'])->name('logistic.settings');
    Route::get('/profile', [LogisticController::class, 'profile'])->name('logistic.profile');
    Route::put('/profile', [LogisticController::class, 'updateProfile'])->name('logistic.profile.update');
});

// Admin Routes
Route::prefix('admin')->middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', [AdminController::class, 'dashboard'])->name('admin.dashboard');
    Route::get('/users', [AdminController::class, 'users'])->name('admin.users');
    Route::get('/products', [AdminController::class, 'products'])->name('admin.products');
    Route::get('/orders', [AdminController::class, 'orders'])->name('admin.orders');
    Route::get('/reports', [AdminController::class, 'reports'])->name('admin.reports');
    Route::get('/documents', [AdminController::class, 'documents'])->name('admin.documents');
    Route::post('/documents/seller/{id}/approve', [AdminController::class, 'approveSellerDocument'])->name('admin.documents.seller.approve');
    Route::post('/documents/seller/{id}/reject', [AdminController::class, 'rejectSellerDocument'])->name('admin.documents.seller.reject');
    Route::post('/documents/rider/{id}/approve', [AdminController::class, 'approveRiderDocument'])->name('admin.documents.rider.approve');
    Route::post('/documents/rider/{id}/reject', [AdminController::class, 'rejectRiderDocument'])->name('admin.documents.rider.reject');
    Route::get('/notifications', [AdminController::class, 'notifications'])->name('admin.notifications');
    Route::post('/notifications/{id}/mark-read', [AdminController::class, 'markNotificationAsRead'])->name('admin.notifications.markRead');
    Route::post('/notifications/mark-all-read', [AdminController::class, 'markAllNotificationsAsRead'])->name('admin.notifications.markAllRead');
    Route::delete('/notifications/{id}', [AdminController::class, 'deleteNotification'])->name('admin.notifications.delete');
    Route::get('/settings', [AdminController::class, 'settings'])->name('admin.settings');
    Route::put('/settings', [AdminController::class, 'updateSettings'])->name('admin.settings.update');
    Route::get('/roles', [AdminController::class, 'roles'])->name('admin.roles');
    Route::get('/profile', [AdminController::class, 'profile'])->name('admin.profile');
});

// Profile routes (common for all authenticated users)
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

// Additional buyer routes for add-to-cart from products page
Route::post('/cart/add', [CartController::class, 'addToCart'])
    ->middleware(['auth', 'verified'])
    ->name('cart.add');


