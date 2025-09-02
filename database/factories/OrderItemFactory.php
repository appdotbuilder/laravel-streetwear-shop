<?php

namespace Database\Factories;

use App\Models\Order;
use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\OrderItem>
 */
class OrderItemFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $product = Product::factory()->create();
        $quantity = fake()->numberBetween(1, 3);
        $price = fake()->randomFloat(2, 50, 500);
        
        return [
            'order_id' => Order::factory(),
            'product_id' => $product->id,
            'product_variant_id' => null,
            'product_name' => $product->name,
            'product_sku' => $product->sku,
            'variant_color' => null,
            'variant_size' => null,
            'quantity' => $quantity,
            'price' => $price,
            'total' => $quantity * $price,
        ];
    }

    /**
     * Indicate that the order item has a variant.
     */
    public function withVariant(): static
    {
        return $this->state(function (array $attributes) {
            $variant = ProductVariant::factory()->create([
                'product_id' => $attributes['product_id'],
            ]);
            
            return [
                'product_variant_id' => $variant->id,
                'variant_color' => $variant->color,
                'variant_size' => $variant->size,
            ];
        });
    }
}