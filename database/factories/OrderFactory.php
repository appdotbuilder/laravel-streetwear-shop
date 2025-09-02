<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Order>
 */
class OrderFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $subtotal = fake()->randomFloat(2, 100, 1000);
        $shippingCost = fake()->randomFloat(2, 0, 50);
        $discountAmount = fake()->randomFloat(2, 0, 100);
        
        return [
            'order_number' => 'ORD-' . date('Ymd') . '-' . random_int(1000, 9999),
            'user_id' => User::factory(),
            'status' => fake()->randomElement(['pending', 'paid', 'processing', 'shipped', 'completed']),
            'subtotal' => $subtotal,
            'discount_amount' => $discountAmount,
            'shipping_cost' => $shippingCost,
            'tax_amount' => 0,
            'total' => $subtotal + $shippingCost - $discountAmount,
            'currency' => 'IDR',
            'payment_method' => fake()->randomElement(['cod', 'bank_transfer', 'credit_card']),
            'payment_status' => fake()->randomElement(['pending', 'paid', 'failed']),
            'shipping_method' => fake()->randomElement(['standard', 'express', 'overnight']),
            'tracking_number' => fake()->boolean(50) ? fake()->bothify('TRK###########') : null,
            'shipping_address' => [
                'name' => fake()->name(),
                'phone' => fake()->phoneNumber(),
                'address' => fake()->streetAddress(),
                'city' => fake()->city(),
                'postal_code' => fake()->postcode(),
            ],
            'billing_address' => null,
            'notes' => fake()->boolean(30) ? fake()->sentence() : null,
        ];
    }

    /**
     * Indicate that the order is completed.
     */
    public function completed(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'completed',
            'payment_status' => 'paid',
            'shipped_at' => fake()->dateTimeBetween('-30 days', '-7 days'),
            'completed_at' => fake()->dateTimeBetween('-7 days', 'now'),
        ]);
    }

    /**
     * Indicate that the order is pending.
     */
    public function pending(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'pending',
            'payment_status' => 'pending',
            'shipped_at' => null,
            'completed_at' => null,
        ]);
    }
}