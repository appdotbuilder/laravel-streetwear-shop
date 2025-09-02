<?php

namespace App\Http\Controllers;

use App\Models\Banner;
use App\Models\Category;
use App\Models\Product;
use Inertia\Inertia;

class HomeController extends Controller
{
    /**
     * Display the home page.
     */
    public function index()
    {
        $banners = Banner::visible()->take(5)->get();
        
        $featuredProducts = Product::active()
            ->featured()
            ->with('categories')
            ->latest()
            ->take(8)
            ->get();
        
        $newArrivals = Product::active()
            ->with('categories')
            ->latest()
            ->take(8)
            ->get();
        
        $bestSellers = Product::active()
            ->with('categories')
            ->orderBy('sales_count', 'desc')
            ->take(8)
            ->get();
        
        $categories = Category::active()
            ->whereNull('parent_id')
            ->orderBy('sort_order')
            ->get();

        return Inertia::render('welcome', [
            'banners' => $banners,
            'featuredProducts' => $featuredProducts,
            'newArrivals' => $newArrivals,
            'bestSellers' => $bestSellers,
            'categories' => $categories,
        ]);
    }
}