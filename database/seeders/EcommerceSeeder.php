<?php

namespace Database\Seeders;

use App\Models\Banner;
use App\Models\Category;
use App\Models\Coupon;
use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class EcommerceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create Categories
        $categories = [
            ['name' => 'T-Shirts', 'description' => 'Premium streetwear t-shirts'],
            ['name' => 'Hoodies', 'description' => 'Comfortable hoodies and sweatshirts'],
            ['name' => 'Jackets', 'description' => 'Stylish outerwear and jackets'],
            ['name' => 'Pants', 'description' => 'Trendy pants and joggers'],
            ['name' => 'Accessories', 'description' => 'Caps, bags and more'],
            ['name' => 'Sneakers', 'description' => 'Fresh kicks and footwear'],
        ];

        foreach ($categories as $categoryData) {
            Category::create([
                'name' => $categoryData['name'],
                'slug' => Str::slug($categoryData['name']),
                'description' => $categoryData['description'],
                'sort_order' => 0,
                'is_active' => true,
            ]);
        }

        // Create Products with realistic streetwear names and pricing
        $productData = [
            [
                'name' => 'Urban Legends Oversized Tee',
                'price' => 150000,
                'compare_price' => 200000,
                'category' => 'T-Shirts',
                'is_featured' => true,
            ],
            [
                'name' => 'Street King Logo Hoodie',
                'price' => 350000,
                'compare_price' => null,
                'category' => 'Hoodies',
                'is_featured' => true,
            ],
            [
                'name' => 'Neon Dreams Graphic Tee',
                'price' => 120000,
                'compare_price' => 180000,
                'category' => 'T-Shirts',
                'is_featured' => false,
            ],
            [
                'name' => 'Rebel Youth Bomber Jacket',
                'price' => 450000,
                'compare_price' => null,
                'category' => 'Jackets',
                'is_featured' => true,
            ],
            [
                'name' => 'Minimal Classic Hoodie',
                'price' => 280000,
                'compare_price' => 320000,
                'category' => 'Hoodies',
                'is_featured' => false,
            ],
            [
                'name' => 'Cargo Tech Joggers',
                'price' => 220000,
                'compare_price' => null,
                'category' => 'Pants',
                'is_featured' => false,
            ],
            [
                'name' => 'Vintage Washed Denim',
                'price' => 380000,
                'compare_price' => 450000,
                'category' => 'Pants',
                'is_featured' => true,
            ],
            [
                'name' => 'Cyber Street Windbreaker',
                'price' => 320000,
                'compare_price' => null,
                'category' => 'Jackets',
                'is_featured' => false,
            ],
            [
                'name' => 'Underground Cap',
                'price' => 85000,
                'compare_price' => 120000,
                'category' => 'Accessories',
                'is_featured' => false,
            ],
            [
                'name' => 'Future Kicks High-Top',
                'price' => 650000,
                'compare_price' => null,
                'category' => 'Sneakers',
                'is_featured' => true,
            ],
        ];

        $categories = Category::all()->keyBy('name');

        foreach ($productData as $data) {
            $product = Product::create([
                'name' => $data['name'],
                'slug' => Str::slug($data['name']),
                'description' => fake()->paragraphs(3, true),
                'short_description' => fake()->sentence(12),
                'sku' => 'SW-' . strtoupper(fake()->bothify('???###')),
                'price' => $data['price'],
                'compare_price' => $data['compare_price'],
                'stock' => fake()->numberBetween(5, 50),
                'status' => 'active',
                'is_featured' => $data['is_featured'],
                'meta_title' => $data['name'],
                'meta_description' => fake()->sentence(),
                'weight' => fake()->randomFloat(2, 0.2, 2),
                'views' => fake()->numberBetween(10, 500),
                'sales_count' => fake()->numberBetween(0, 25),
            ]);

            // Attach to category
            if (isset($categories[$data['category']])) {
                $product->categories()->attach($categories[$data['category']]->id);
            }

            // Create variants for clothing items
            if (in_array($data['category'], ['T-Shirts', 'Hoodies', 'Jackets', 'Pants'])) {
                $colors = ['Black', 'White', 'Gray', 'Navy'];
                $sizes = ['S', 'M', 'L', 'XL'];

                foreach ($colors as $color) {
                    foreach ($sizes as $size) {
                        ProductVariant::create([
                            'product_id' => $product->id,
                            'sku' => $product->sku . '-' . strtoupper(substr($color, 0, 1)) . $size,
                            'color' => $color,
                            'size' => $size,
                            'stock' => fake()->numberBetween(0, 10),
                            'is_active' => true,
                        ]);
                    }
                }
            }
        }

        // Create Banners
        Banner::create([
            'title' => 'New Collection Drop',
            'description' => 'Fresh streetwear styles just landed. Shop the latest trends.',
            'image' => 'banners/hero-1.jpg',
            'link' => '/products?sort=latest',
            'button_text' => 'Shop Now',
            'sort_order' => 1,
            'is_active' => true,
        ]);

        Banner::create([
            'title' => 'Up to 50% Off Sale',
            'description' => 'Limited time offer on selected items. Don\'t miss out!',
            'image' => 'banners/hero-2.jpg',
            'link' => '/products?on_sale=true',
            'button_text' => 'Shop Sale',
            'sort_order' => 2,
            'is_active' => true,
        ]);

        // Create Coupons
        Coupon::create([
            'code' => 'WELCOME10',
            'name' => 'Welcome Discount',
            'description' => '10% off for new customers',
            'type' => 'percentage',
            'value' => 10,
            'minimum_spend' => 100000,
            'usage_limit' => 100,
            'starts_at' => now(),
            'expires_at' => now()->addMonth(),
            'is_active' => true,
        ]);

        Coupon::create([
            'code' => 'SAVE50K',
            'name' => 'Fixed Discount',
            'description' => 'Save 50,000 IDR on orders over 500k',
            'type' => 'fixed_amount',
            'value' => 50000,
            'minimum_spend' => 500000,
            'usage_limit' => 50,
            'starts_at' => now(),
            'expires_at' => now()->addWeeks(2),
            'is_active' => true,
        ]);
    }
}