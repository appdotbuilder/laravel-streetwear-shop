<?php

namespace App\Services;

use App\Models\CartItem;
use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;

class CartService
{
    /**
     * Add a product to cart.
     */
    public function addToCart(int $productId, int $quantity = 1, ?int $variantId = null): bool
    {
        $product = Product::findOrFail($productId);
        $variant = $variantId ? ProductVariant::findOrFail($variantId) : null;

        // Check stock
        $availableStock = $variant ? $variant->stock : $product->stock;
        if ($availableStock < $quantity) {
            return false;
        }

        // Get price
        $price = $variant ? $variant->getEffectivePrice() : $product->price;

        // Find existing cart item or create new one
        $cartItem = CartItem::where([
            'user_id' => Auth::id(),
            'session_id' => Auth::guest() ? Session::getId() : null,
            'product_id' => $product->id,
            'product_variant_id' => $variant?->id,
        ])->first();

        if ($cartItem) {
            $cartItem->update([
                'quantity' => $cartItem->quantity + $quantity,
                'price' => $price,
            ]);
        } else {
            CartItem::create([
                'user_id' => Auth::id(),
                'session_id' => Auth::guest() ? Session::getId() : null,
                'product_id' => $product->id,
                'product_variant_id' => $variant?->id,
                'quantity' => $quantity,
                'price' => $price,
            ]);
        }

        return true;
    }

    /**
     * Get cart items for current user/session.
     */
    public function getCartItems()
    {
        $query = CartItem::with(['product', 'variant']);

        if (Auth::check()) {
            $query->where('user_id', Auth::id());
        } else {
            $query->where('session_id', Session::getId());
        }

        return $query->get();
    }

    /**
     * Get cart total.
     */
    public function getCartTotal(): float
    {
        return $this->getCartItems()->sum('total');
    }

    /**
     * Get cart count (number of items).
     */
    public function getCartCount(): int
    {
        return $this->getCartItems()->sum('quantity');
    }

    /**
     * Update cart item quantity.
     */
    public function updateQuantity(CartItem $cartItem, int $quantity): bool
    {
        // Check stock
        $availableStock = $cartItem->variant ? $cartItem->variant->stock : $cartItem->product->stock;
        if ($availableStock < $quantity) {
            return false;
        }

        $cartItem->update(['quantity' => $quantity]);
        return true;
    }

    /**
     * Remove cart item.
     */
    public function removeItem(CartItem $cartItem): void
    {
        $cartItem->delete();
    }

    /**
     * Clear cart for current user/session.
     */
    public function clearCart(): void
    {
        $query = CartItem::query();

        if (Auth::check()) {
            $query->where('user_id', Auth::id());
        } else {
            $query->where('session_id', Session::getId());
        }

        $query->delete();
    }

    /**
     * Merge guest cart with user cart after login.
     */
    public function mergeGuestCart(string $sessionId, int $userId): void
    {
        $guestCartItems = CartItem::where('session_id', $sessionId)->get();

        foreach ($guestCartItems as $guestItem) {
            $existingItem = CartItem::where('user_id', $userId)
                ->where('product_id', $guestItem->product_id)
                ->where('product_variant_id', $guestItem->product_variant_id)
                ->first();

            if ($existingItem) {
                // Merge quantities
                $existingItem->update([
                    'quantity' => $existingItem->quantity + $guestItem->quantity,
                ]);
            } else {
                // Transfer to user
                $guestItem->update([
                    'user_id' => $userId,
                    'session_id' => null,
                ]);
            }
        }

        // Remove remaining guest items
        CartItem::where('session_id', $sessionId)->delete();
    }
}