<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Carbon\Carbon;
use Inertia\Inertia;

class AdminController extends Controller
{
    /**
     * Display the admin dashboard.
     */
    public function index()
    {
        // Get 30-day statistics
        $thirtyDaysAgo = Carbon::now()->subDays(30);
        
        $stats = [
            'total_sales' => Order::where('created_at', '>=', $thirtyDaysAgo)
                ->where('status', '!=', 'cancelled')
                ->sum('total'),
            'total_orders' => Order::where('created_at', '>=', $thirtyDaysAgo)->count(),
            'total_products' => Product::active()->count(),
            'total_customers' => User::where('created_at', '>=', $thirtyDaysAgo)->count(),
        ];

        // Orders by status
        $ordersByStatus = Order::selectRaw('status, COUNT(*) as count')
            ->groupBy('status')
            ->pluck('count', 'status')
            ->toArray();

        // Best selling products
        $bestSellingProducts = Product::with('categories')
            ->orderBy('sales_count', 'desc')
            ->take(5)
            ->get();

        // Recent orders
        $recentOrders = Order::with('user')
            ->latest()
            ->take(10)
            ->get();

        return Inertia::render('admin/dashboard', [
            'stats' => $stats,
            'ordersByStatus' => $ordersByStatus,
            'bestSellingProducts' => $bestSellingProducts,
            'recentOrders' => $recentOrders,
        ]);
    }
}