<?php

use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

test('home page displays correctly', function () {
    $response = $this->get('/');
    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page
        ->component('welcome')
        ->has('banners')
        ->has('featuredProducts')
        ->has('newArrivals')
        ->has('bestSellers')
        ->has('categories')
    );
});

test('products page displays correctly', function () {
    // Create test data
    $category = Category::factory()->create();
    $product = Product::factory()->create();
    $product->categories()->attach($category);

    $response = $this->get('/products');
    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page
        ->component('products/index')
        ->has('products')
        ->has('categories')
        ->has('filters')
    );
});

test('product detail page displays correctly', function () {
    $category = Category::factory()->create();
    $product = Product::factory()->active()->create();
    $product->categories()->attach($category);

    $response = $this->get("/products/{$product->slug}");
    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page
        ->component('products/show')
        ->has('product')
        ->has('relatedProducts')
    );
});

test('cart page displays correctly', function () {
    $response = $this->get('/cart');
    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page
        ->component('cart/index')
        ->has('cartItems')
        ->has('subtotal')
    );
});

test('user can add product to cart', function () {
    $product = Product::factory()->active()->create();

    $response = $this->post('/cart', [
        'product_id' => $product->id,
        'quantity' => 2,
    ]);

    $response->assertRedirect('/cart');
    $this->assertDatabaseHas('cart_items', [
        'product_id' => $product->id,
        'quantity' => 2,
    ]);
});

test('admin can access dashboard', function () {
    $user = User::factory()->create();

    $response = $this->actingAs($user)->get('/admin');
    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page
        ->component('admin/dashboard')
        ->has('stats')
        ->has('ordersByStatus')
        ->has('bestSellingProducts')
        ->has('recentOrders')
    );
});