<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Coupon>
 */
class CouponFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $type = fake()->randomElement(['percentage', 'fixed_amount']);
        $value = $type === 'percentage' 
            ? fake()->numberBetween(5, 50) 
            : fake()->numberBetween(10000, 100000); // IDR amounts
            
        return [
            'code' => strtoupper(fake()->bothify('???###')),
            'name' => fake()->words(3, true),
            'description' => fake()->sentence(),
            'type' => $type,
            'value' => $value,
            'minimum_spend' => fake()->boolean(70) ? fake()->numberBetween(50000, 500000) : null,
            'usage_limit' => fake()->boolean(60) ? fake()->numberBetween(10, 1000) : null,
            'used_count' => 0,
            'starts_at' => fake()->dateTimeBetween('-30 days', 'now'),
            'expires_at' => fake()->dateTimeBetween('now', '+90 days'),
            'is_active' => fake()->boolean(80),
        ];
    }

    /**
     * Indicate that the coupon is expired.
     */
    public function expired(): static
    {
        return $this->state(fn (array $attributes) => [
            'starts_at' => fake()->dateTimeBetween('-60 days', '-30 days'),
            'expires_at' => fake()->dateTimeBetween('-30 days', '-1 day'),
        ]);
    }

    /**
     * Indicate that the coupon is for percentage discount.
     */
    public function percentage(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'percentage',
            'value' => fake()->numberBetween(5, 50),
        ]);
    }

    /**
     * Indicate that the coupon is for fixed amount discount.
     */
    public function fixedAmount(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'fixed_amount',
            'value' => fake()->numberBetween(10000, 100000),
        ]);
    }
}