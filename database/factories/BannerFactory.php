<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Banner>
 */
class BannerFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'title' => fake()->words(3, true),
            'description' => fake()->sentence(),
            'image' => 'banners/placeholder.jpg',
            'link' => fake()->boolean(80) ? fake()->url() : null,
            'button_text' => fake()->boolean(70) ? fake()->words(2, true) : null,
            'sort_order' => fake()->numberBetween(0, 10),
            'is_active' => fake()->boolean(85),
            'starts_at' => fake()->boolean(30) ? fake()->dateTimeBetween('-7 days', 'now') : null,
            'expires_at' => fake()->boolean(40) ? fake()->dateTimeBetween('now', '+30 days') : null,
        ];
    }

    /**
     * Indicate that the banner is inactive.
     */
    public function inactive(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
        ]);
    }

    /**
     * Indicate that the banner has expired.
     */
    public function expired(): static
    {
        return $this->state(fn (array $attributes) => [
            'starts_at' => fake()->dateTimeBetween('-30 days', '-7 days'),
            'expires_at' => fake()->dateTimeBetween('-7 days', '-1 day'),
        ]);
    }
}