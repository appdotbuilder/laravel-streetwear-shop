<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $name = fake()->words(random_int(2, 4), true);
        $price = fake()->randomFloat(2, 50, 500);
        $hasDiscount = fake()->boolean(30);
        
        return [
            'name' => ucwords($name),
            'slug' => Str::slug($name),
            'description' => fake()->paragraphs(3, true),
            'short_description' => fake()->sentence(),
            'sku' => 'SKU-' . strtoupper(fake()->bothify('???###')),
            'price' => $price,
            'compare_price' => $hasDiscount ? $price + fake()->randomFloat(2, 10, 100) : null,
            'stock' => fake()->numberBetween(0, 100),
            'track_stock' => fake()->boolean(90),
            'status' => fake()->randomElement(['active', 'inactive', 'draft']),
            'is_featured' => fake()->boolean(20),
            'meta_title' => ucwords($name),
            'meta_description' => fake()->sentence(),
            'images' => null,
            'weight' => fake()->randomFloat(2, 0.1, 5),
            'views' => fake()->numberBetween(0, 1000),
            'sales_count' => fake()->numberBetween(0, 50),
        ];
    }

    /**
     * Indicate that the product is featured.
     */
    public function featured(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_featured' => true,
            'status' => 'active',
        ]);
    }

    /**
     * Indicate that the product has a discount.
     */
    public function discounted(): static
    {
        return $this->state(fn (array $attributes) => [
            'compare_price' => $attributes['price'] + fake()->randomFloat(2, 20, 200),
        ]);
    }

    /**
     * Indicate that the product is out of stock.
     */
    public function outOfStock(): static
    {
        return $this->state(fn (array $attributes) => [
            'stock' => 0,
        ]);
    }

    /**
     * Indicate that the product is active.
     */
    public function active(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'active',
        ]);
    }
}