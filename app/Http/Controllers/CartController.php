<?php

namespace App\Http\Controllers;

use App\Models\CartItem;
use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CartController extends Controller
{
    /**
     * Display the shopping cart.
     */
    public function index()
    {
        $cartItems = $this->getCartItems();
        $subtotal = $cartItems->sum('total');

        return Inertia::render('cart/index', [
            'cartItems' => $cartItems,
            'subtotal' => $subtotal,
        ]);
    }

    /**
     * Add a product to the cart.
     */
    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'variant_id' => 'nullable|exists:product_variants,id',
            'quantity' => 'required|integer|min:1',
        ]);

        $product = Product::findOrFail($request->product_id);
        $variant = $request->variant_id ? ProductVariant::findOrFail($request->variant_id) : null;

        // Check stock
        $availableStock = $variant ? $variant->stock : $product->stock;
        if ($availableStock < $request->quantity) {
            return back()->withErrors(['quantity' => 'Insufficient stock available.']);
        }

        // Get price
        $price = $variant ? $variant->getEffectivePrice() : $product->price;

        // Find existing cart item or create new one
        $cartItem = CartItem::where([
            'user_id' => auth()->id(),
            'session_id' => auth()->guest() ? session()->getId() : null,
            'product_id' => $product->id,
            'product_variant_id' => $variant?->id,
        ])->first();

        if ($cartItem) {
            $cartItem->update([
                'quantity' => $cartItem->quantity + $request->quantity,
                'price' => $price,
            ]);
        } else {
            CartItem::create([
                'user_id' => auth()->id(),
                'session_id' => auth()->guest() ? session()->getId() : null,
                'product_id' => $product->id,
                'product_variant_id' => $variant?->id,
                'quantity' => $request->quantity,
                'price' => $price,
            ]);
        }

        return redirect()->route('cart.index')
            ->with('success', 'Product added to cart successfully.');
    }

    /**
     * Update a cart item quantity.
     */
    public function update(Request $request, CartItem $cartItem)
    {
        $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);

        // Verify ownership
        if (!$this->ownsCartItem($cartItem)) {
            abort(403);
        }

        // Check stock
        $availableStock = $cartItem->variant ? $cartItem->variant->stock : $cartItem->product->stock;
        if ($availableStock < $request->quantity) {
            return back()->withErrors(['quantity' => 'Insufficient stock available.']);
        }

        $cartItem->update([
            'quantity' => $request->quantity,
        ]);

        return redirect()->route('cart.index')
            ->with('success', 'Cart updated successfully.');
    }

    /**
     * Remove a cart item.
     */
    public function destroy(CartItem $cartItem)
    {
        // Verify ownership
        if (!$this->ownsCartItem($cartItem)) {
            abort(403);
        }

        $cartItem->delete();

        return redirect()->route('cart.index')
            ->with('success', 'Item removed from cart.');
    }

    /**
     * Get cart items for current user/session.
     */
    protected function getCartItems()
    {
        $query = CartItem::with(['product', 'variant']);

        if (auth()->check()) {
            $query->where('user_id', auth()->id());
        } else {
            $query->where('session_id', session()->getId());
        }

        return $query->get();
    }

    /**
     * Check if the current user owns the cart item.
     */
    protected function ownsCartItem(CartItem $cartItem): bool
    {
        if (auth()->check()) {
            return $cartItem->user_id === auth()->id();
        }

        return $cartItem->session_id === session()->getId();
    }
}