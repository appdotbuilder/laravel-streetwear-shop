<?php

namespace Database\Factories;

use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ProductVariant>
 */
class ProductVariantFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $colors = ['Black', 'White', 'Red', 'Blue', 'Green', 'Yellow', 'Purple', 'Orange', 'Pink', 'Gray'];
        $sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
        
        return [
            'product_id' => Product::factory(),
            'sku' => 'VAR-' . strtoupper(fake()->bothify('???###')),
            'color' => fake()->randomElement($colors),
            'size' => fake()->randomElement($sizes),
            'price_override' => fake()->boolean(30) ? fake()->randomFloat(2, 50, 600) : null,
            'stock' => fake()->numberBetween(0, 50),
            'is_active' => fake()->boolean(85),
        ];
    }

    /**
     * Indicate that the variant is out of stock.
     */
    public function outOfStock(): static
    {
        return $this->state(fn (array $attributes) => [
            'stock' => 0,
        ]);
    }

    /**
     * Indicate that the variant has a price override.
     */
    public function withPriceOverride(): static
    {
        return $this->state(fn (array $attributes) => [
            'price_override' => fake()->randomFloat(2, 50, 600),
        ]);
    }
}