import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import AppLayout from '@/components/app-layout';

interface ProductVariant {
    id: number;
    sku: string;
    color: string | null;
    size: string | null;
    price_override: number | null;
    stock: number;
    is_active: boolean;
}

interface Product {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    short_description: string | null;
    sku: string;
    price: number;
    compare_price: number | null;
    stock: number;
    main_image: string | null;
    images: string[] | null;
    variants: ProductVariant[];
    categories: Array<{
        id: number;
        name: string;
        slug: string;
    }>;
}

interface Props {
    product: Product;
    relatedProducts: Product[];
    [key: string]: unknown;
}

export default function ProductShow({ product, relatedProducts }: Props) {
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [selectedColor, setSelectedColor] = useState<string>('');
    const [selectedSize, setSelectedSize] = useState<string>('');
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(false);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const images = product.images || (product.main_image ? [product.main_image] : []);
    const availableColors = [...new Set(product.variants.filter(v => v.is_active && v.color).map(v => v.color))];
    const availableSizes = [...new Set(product.variants.filter(v => v.is_active && v.size).map(v => v.size))];

    // Find selected variant
    const selectedVariant = product.variants.find(v => 
        v.is_active && 
        (!selectedColor || v.color === selectedColor) &&
        (!selectedSize || v.size === selectedSize)
    );

    // Get effective price and stock
    const effectivePrice = selectedVariant?.price_override || product.price;
    const effectiveStock = selectedVariant ? selectedVariant.stock : product.stock;

    const handleAddToCart = () => {
        setLoading(true);
        
        const data: {
            product_id: number;
            quantity: number;
            variant_id?: number;
        } = {
            product_id: product.id,
            quantity,
        };

        if (selectedVariant) {
            data.variant_id = selectedVariant.id;
        }

        router.post(route('cart.store'), data, {
            onSuccess: () => {
                // Success handled by redirect
            },
            onError: () => {
                setLoading(false);
            },
            onFinish: () => {
                setLoading(false);
            },
        });
    };

    const isOutOfStock = effectiveStock === 0;
    const maxQuantity = Math.min(effectiveStock, 10);

    return (
        <AppLayout>
            <div className="min-h-screen bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Breadcrumb */}
                    <nav className="mb-8">
                        <div className="flex items-center space-x-2 text-sm text-gray-500">
                            <Link href="/" className="hover:text-orange-600">Home</Link>
                            <span>/</span>
                            <Link href="/products" className="hover:text-orange-600">Products</Link>
                            {product.categories[0] && (
                                <>
                                    <span>/</span>
                                    <Link 
                                        href={`/products?category=${product.categories[0].slug}`}
                                        className="hover:text-orange-600"
                                    >
                                        {product.categories[0].name}
                                    </Link>
                                </>
                            )}
                            <span>/</span>
                            <span className="text-gray-900">{product.name}</span>
                        </div>
                    </nav>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Product Images */}
                        <div className="space-y-4">
                            {/* Main Image */}
                            <div className="aspect-square bg-gray-50 rounded-lg overflow-hidden">
                                {images.length > 0 ? (
                                    <img
                                        src={`/storage/${images[selectedImageIndex]}`}
                                        alt={product.name}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                                        <span className="text-8xl">👕</span>
                                    </div>
                                )}
                            </div>

                            {/* Image Thumbnails */}
                            {images.length > 1 && (
                                <div className="grid grid-cols-4 gap-4">
                                    {images.map((image, index) => (
                                        <button
                                            key={index}
                                            onClick={() => setSelectedImageIndex(index)}
                                            className={`aspect-square bg-gray-50 rounded-lg overflow-hidden border-2 ${
                                                selectedImageIndex === index 
                                                    ? 'border-orange-600' 
                                                    : 'border-transparent hover:border-gray-300'
                                            }`}
                                        >
                                            <img
                                                src={`/storage/${image}`}
                                                alt={`${product.name} ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Product Details */}
                        <div className="space-y-6">
                            {/* Title and Category */}
                            <div>
                                {product.categories[0] && (
                                    <span className="text-sm font-medium text-orange-600 uppercase tracking-wide">
                                        {product.categories[0].name}
                                    </span>
                                )}
                                <h1 className="text-3xl font-bold text-gray-900 mt-2">{product.name}</h1>
                            </div>

                            {/* Price */}
                            <div className="space-y-2">
                                <div className="flex items-center gap-4">
                                    <span className="text-3xl font-bold text-gray-900">
                                        {formatPrice(effectivePrice)}
                                    </span>
                                    {product.compare_price && product.compare_price > effectivePrice && (
                                        <>
                                            <span className="text-xl text-gray-500 line-through">
                                                {formatPrice(product.compare_price)}
                                            </span>
                                            <span className="bg-red-100 text-red-800 text-sm font-medium px-3 py-1 rounded-full">
                                                Save {Math.round(((product.compare_price - effectivePrice) / product.compare_price) * 100)}%
                                            </span>
                                        </>
                                    )}
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <span className={`font-medium ${isOutOfStock ? 'text-red-600' : 'text-green-600'}`}>
                                        {isOutOfStock ? '❌ Out of Stock' : `✅ ${effectiveStock} in stock`}
                                    </span>
                                    <span className="text-gray-400">•</span>
                                    <span className="text-gray-600">SKU: {selectedVariant?.sku || product.sku}</span>
                                </div>
                            </div>

                            {/* Description */}
                            {product.short_description && (
                                <div>
                                    <p className="text-lg text-gray-700">{product.short_description}</p>
                                </div>
                            )}

                            {/* Color Selection */}
                            {availableColors.length > 0 && (
                                <div>
                                    <h3 className="text-sm font-medium text-gray-900 mb-3">Color</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {availableColors.map((color) => (
                                            <button
                                                key={color}
                                                onClick={() => setSelectedColor(color === selectedColor ? '' : color || '')}
                                                className={`px-4 py-2 text-sm font-medium rounded-md border ${
                                                    selectedColor === color
                                                        ? 'border-orange-600 bg-orange-50 text-orange-700'
                                                        : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                                                }`}
                                            >
                                                {color}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Size Selection */}
                            {availableSizes.length > 0 && (
                                <div>
                                    <h3 className="text-sm font-medium text-gray-900 mb-3">Size</h3>
                                    <div className="flex flex-wrap gap-2">
                                        {availableSizes.map((size) => (
                                            <button
                                                key={size}
                                                onClick={() => setSelectedSize(size === selectedSize ? '' : size || '')}
                                                className={`px-4 py-2 text-sm font-medium rounded-md border ${
                                                    selectedSize === size
                                                        ? 'border-orange-600 bg-orange-50 text-orange-700'
                                                        : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                                                }`}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Quantity and Add to Cart */}
                            <div className="space-y-4">
                                {!isOutOfStock && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Quantity
                                        </label>
                                        <div className="flex items-center space-x-3">
                                            <button
                                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                                className="p-2 border border-gray-300 rounded-md hover:bg-gray-50"
                                                disabled={quantity <= 1}
                                            >
                                                −
                                            </button>
                                            <input
                                                type="number"
                                                value={quantity}
                                                onChange={(e) => setQuantity(Math.max(1, Math.min(maxQuantity, parseInt(e.target.value) || 1)))}
                                                className="w-20 px-3 py-2 text-center border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                                min="1"
                                                max={maxQuantity}
                                            />
                                            <button
                                                onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))}
                                                className="p-2 border border-gray-300 rounded-md hover:bg-gray-50"
                                                disabled={quantity >= maxQuantity}
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                )}

                                <div className="flex space-x-4">
                                    <Button
                                        onClick={handleAddToCart}
                                        disabled={isOutOfStock || loading}
                                        className="flex-1 bg-orange-600 hover:bg-orange-700 text-lg py-3"
                                        size="lg"
                                    >
                                        {loading ? 'Adding...' : isOutOfStock ? 'Out of Stock' : `Add to Cart • ${formatPrice(effectivePrice * quantity)}`}
                                    </Button>
                                </div>
                            </div>

                            {/* Product Details */}
                            {product.description && (
                                <div className="border-t pt-6">
                                    <h3 className="text-lg font-medium text-gray-900 mb-4">Product Details</h3>
                                    <div className="prose prose-sm text-gray-600">
                                        <p>{product.description}</p>
                                    </div>
                                </div>
                            )}

                            {/* Features */}
                            <div className="border-t pt-6">
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                                    <div className="flex items-center space-x-2">
                                        <span className="text-green-600">🚚</span>
                                        <span className="text-gray-600">Free shipping over 500k</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <span className="text-blue-600">↩️</span>
                                        <span className="text-gray-600">30-day returns</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <span className="text-purple-600">🔒</span>
                                        <span className="text-gray-600">Secure checkout</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Related Products */}
                    {relatedProducts.length > 0 && (
                        <div className="mt-16">
                            <h2 className="text-2xl font-bold text-gray-900 mb-8">You Might Also Like</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {relatedProducts.map((relatedProduct) => (
                                    <Link
                                        key={relatedProduct.id}
                                        href={`/products/${relatedProduct.slug}`}
                                        className="group bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-[1.02]"
                                    >
                                        <div className="aspect-square bg-gray-50 overflow-hidden">
                                            {relatedProduct.main_image ? (
                                                <img
                                                    src={`/storage/${relatedProduct.main_image}`}
                                                    alt={relatedProduct.name}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                                                    <span className="text-4xl">👕</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-4">
                                            <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">{relatedProduct.name}</h3>
                                            <div className="flex items-center gap-2">
                                                <span className="font-bold text-gray-900">
                                                    {formatPrice(relatedProduct.price)}
                                                </span>
                                                {relatedProduct.compare_price && relatedProduct.compare_price > relatedProduct.price && (
                                                    <span className="text-sm text-gray-500 line-through">
                                                        {formatPrice(relatedProduct.compare_price)}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </AppLayout>
    );
}