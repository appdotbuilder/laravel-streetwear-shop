import React from 'react';
import { Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import AppLayout from '@/components/app-layout';

interface CartItem {
    id: number;
    quantity: number;
    price: number;
    total: number;
    product: {
        id: number;
        name: string;
        slug: string;
        main_image: string | null;
        stock: number;
    };
    variant: {
        id: number;
        color: string | null;
        size: string | null;
        stock: number;
    } | null;
}

interface Props {
    cartItems: CartItem[];
    subtotal: number;
    [key: string]: unknown;
}

export default function CartIndex({ cartItems, subtotal }: Props) {
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const updateQuantity = (cartItemId: number, newQuantity: number) => {
        if (newQuantity < 1) return;

        router.patch(route('cart.update', cartItemId), {
            quantity: newQuantity,
        }, {
            preserveScroll: true,
        });
    };

    const removeItem = (cartItemId: number) => {
        if (confirm('Are you sure you want to remove this item from your cart?')) {
            router.delete(route('cart.destroy', cartItemId), {
                preserveScroll: true,
            });
        }
    };

    const shippingCost = subtotal >= 500000 ? 0 : 25000; // Free shipping over 500k
    const total = subtotal + shippingCost;

    if (cartItems.length === 0) {
        return (
            <AppLayout>
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <div className="text-center">
                        <div className="text-6xl mb-4">🛒</div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
                        <p className="text-gray-600 mb-6">Looks like you haven't added anything to your cart yet.</p>
                        <Link href="/products">
                            <Button className="bg-orange-600 hover:bg-orange-700">
                                Continue Shopping
                            </Button>
                        </Link>
                    </div>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout>
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
                        <p className="text-gray-600 mt-2">
                            {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Cart Items */}
                        <div className="lg:col-span-2 space-y-4">
                            {cartItems.map((item) => {
                                const maxQuantity = Math.min(
                                    item.variant ? item.variant.stock : item.product.stock,
                                    10
                                );

                                return (
                                    <div key={item.id} className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
                                        <div className="flex items-start space-x-4">
                                            {/* Product Image */}
                                            <div className="flex-shrink-0 w-20 h-20 bg-gray-50 rounded-lg overflow-hidden">
                                                {item.product.main_image ? (
                                                    <img
                                                        src={`/storage/${item.product.main_image}`}
                                                        alt={item.product.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                                                        <span className="text-2xl">👕</span>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Product Details */}
                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-lg font-semibold text-gray-900">
                                                    <Link 
                                                        href={`/products/${item.product.slug}`}
                                                        className="hover:text-orange-600"
                                                    >
                                                        {item.product.name}
                                                    </Link>
                                                </h3>
                                                
                                                {/* Variant Info */}
                                                {item.variant && (
                                                    <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
                                                        {item.variant.color && (
                                                            <span>Color: {item.variant.color}</span>
                                                        )}
                                                        {item.variant.size && (
                                                            <span>Size: {item.variant.size}</span>
                                                        )}
                                                    </div>
                                                )}

                                                <div className="flex items-center justify-between mt-4">
                                                    {/* Quantity Controls */}
                                                    <div className="flex items-center space-x-2">
                                                        <button
                                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                            disabled={item.quantity <= 1}
                                                            className="p-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
                                                        >
                                                            −
                                                        </button>
                                                        <span className="w-12 text-center font-medium">
                                                            {item.quantity}
                                                        </span>
                                                        <button
                                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                            disabled={item.quantity >= maxQuantity}
                                                            className="p-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50"
                                                        >
                                                            +
                                                        </button>
                                                    </div>

                                                    {/* Price */}
                                                    <div className="text-right">
                                                        <div className="text-lg font-bold text-gray-900">
                                                            {formatPrice(item.total)}
                                                        </div>
                                                        <div className="text-sm text-gray-600">
                                                            {formatPrice(item.price)} each
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* Stock Warning */}
                                                {maxQuantity < item.quantity && (
                                                    <div className="mt-2 text-sm text-amber-600">
                                                        ⚠️ Only {maxQuantity} left in stock
                                                    </div>
                                                )}
                                            </div>

                                            {/* Remove Button */}
                                            <button
                                                onClick={() => removeItem(item.id)}
                                                className="text-red-600 hover:text-red-800 p-2"
                                                title="Remove item"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 sticky top-6">
                                <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
                                
                                <div className="space-y-3 mb-6">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Subtotal</span>
                                        <span>{formatPrice(subtotal)}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Shipping</span>
                                        <span>
                                            {shippingCost === 0 ? (
                                                <span className="text-green-600">Free</span>
                                            ) : (
                                                formatPrice(shippingCost)
                                            )}
                                        </span>
                                    </div>
                                    {subtotal < 500000 && (
                                        <div className="text-sm text-gray-500 bg-blue-50 p-3 rounded-lg">
                                            💡 Add {formatPrice(500000 - subtotal)} more for free shipping!
                                        </div>
                                    )}
                                    <div className="border-t pt-3">
                                        <div className="flex justify-between text-lg font-bold text-gray-900">
                                            <span>Total</span>
                                            <span>{formatPrice(total)}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <Link href="/checkout">
                                        <Button className="w-full bg-orange-600 hover:bg-orange-700 text-lg py-3">
                                            Proceed to Checkout 🛒
                                        </Button>
                                    </Link>
                                    
                                    <Link href="/products">
                                        <Button variant="outline" className="w-full">
                                            Continue Shopping
                                        </Button>
                                    </Link>
                                </div>

                                {/* Security Badge */}
                                <div className="mt-6 pt-6 border-t text-center">
                                    <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                                        <span>🔒</span>
                                        <span>Secure checkout guaranteed</span>
                                    </div>
                                    <div className="mt-2 text-xs text-gray-500">
                                        SSL encrypted • Multiple payment methods
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}