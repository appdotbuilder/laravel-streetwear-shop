import React from 'react';
import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';

interface Banner {
    id: number;
    title: string;
    description: string | null;
    image: string;
    link: string | null;
    button_text: string | null;
}

interface Product {
    id: number;
    name: string;
    slug: string;
    price: number;
    compare_price: number | null;
    main_image: string | null;
    categories: Array<{
        id: number;
        name: string;
        slug: string;
    }>;
}

interface Category {
    id: number;
    name: string;
    slug: string;
    image: string | null;
}

interface Props {
    banners: Banner[];
    featuredProducts: Product[];
    newArrivals: Product[];
    bestSellers: Product[];
    categories: Category[];
    [key: string]: unknown;
}

export default function Welcome({ banners, featuredProducts, newArrivals, bestSellers, categories }: Props) {
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const ProductCard = ({ product }: { product: Product }) => (
        <div className="group relative bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
            <div className="aspect-square bg-gray-50 overflow-hidden">
                {product.main_image ? (
                    <img
                        src={`/storage/${product.main_image}`}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                        <span className="text-6xl">👕</span>
                    </div>
                )}
            </div>
            <div className="p-4">
                <div className="mb-2">
                    {product.categories[0] && (
                        <span className="text-xs font-medium text-orange-600 uppercase tracking-wide">
                            {product.categories[0].name}
                        </span>
                    )}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{product.name}</h3>
                <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-gray-900">
                        {formatPrice(product.price)}
                    </span>
                    {product.compare_price && product.compare_price > product.price && (
                        <>
                            <span className="text-sm text-gray-500 line-through">
                                {formatPrice(product.compare_price)}
                            </span>
                            <span className="text-xs font-medium bg-red-100 text-red-800 px-2 py-1 rounded">
                                -{Math.round(((product.compare_price - product.price) / product.compare_price) * 100)}%
                            </span>
                        </>
                    )}
                </div>
            </div>
            <Link
                href={`/products/${product.slug}`}
                className="absolute inset-0"
                aria-label={`View ${product.name}`}
            />
        </div>
    );

    return (
        <div className="min-h-screen bg-white">
            {/* Header */}
            <header className="bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-4">
                            <h1 className="text-2xl font-bold text-gray-900">STREETWEAR</h1>
                            <span className="text-orange-600 text-sm font-medium">🔥 STORE</span>
                        </div>
                        <nav className="hidden md:flex items-center space-x-8">
                            <Link href="/products" className="text-gray-700 hover:text-orange-600 font-medium">
                                Products
                            </Link>
                            <Link href="/categories" className="text-gray-700 hover:text-orange-600 font-medium">
                                Categories
                            </Link>
                            <Link href="/about" className="text-gray-700 hover:text-orange-600 font-medium">
                                About
                            </Link>
                        </nav>
                        <div className="flex items-center space-x-4">
                            <Link href="/cart" className="text-gray-700 hover:text-orange-600">
                                <span className="sr-only">Cart</span>
                                🛒
                            </Link>
                            <Link href="/login">
                                <Button variant="outline" size="sm">Login</Button>
                            </Link>
                            <Link href="/register">
                                <Button size="sm" className="bg-orange-600 hover:bg-orange-700">Register</Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Banner */}
            <section className="relative">
                {banners.length > 0 ? (
                    <div className="bg-gradient-to-r from-gray-900 to-gray-700 text-white">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                            <div className="text-center">
                                <h2 className="text-4xl md:text-6xl font-bold mb-6">
                                    {banners[0].title}
                                </h2>
                                {banners[0].description && (
                                    <p className="text-xl md:text-2xl mb-8 text-gray-300 max-w-2xl mx-auto">
                                        {banners[0].description}
                                    </p>
                                )}
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <Link href="/products">
                                        <Button size="lg" className="bg-orange-600 hover:bg-orange-700 text-lg px-8">
                                            Shop Now 🛍️
                                        </Button>
                                    </Link>
                                    <Link href="/categories">
                                        <Button variant="outline" size="lg" className="text-white border-white hover:bg-white hover:text-gray-900 text-lg px-8">
                                            Browse Categories
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-gradient-to-r from-orange-600 to-orange-700 text-white">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                            <div className="text-center">
                                <h2 className="text-4xl md:text-6xl font-bold mb-6">
                                    🔥 Modern Streetwear
                                </h2>
                                <p className="text-xl md:text-2xl mb-8 text-orange-100 max-w-2xl mx-auto">
                                    Discover the latest in urban fashion. Bold designs, premium quality, delivered to your door.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <Link href="/products">
                                        <Button size="lg" className="bg-white text-orange-600 hover:bg-gray-100 text-lg px-8">
                                            Shop Collection 🛍️
                                        </Button>
                                    </Link>
                                    <Link href="/register">
                                        <Button variant="outline" size="lg" className="text-white border-white hover:bg-white hover:text-orange-600 text-lg px-8">
                                            Join Now
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </section>

            {/* Categories */}
            {categories.length > 0 && (
                <section className="py-16 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">Shop by Category</h2>
                            <p className="text-gray-600 max-w-2xl mx-auto">
                                Find exactly what you're looking for in our curated collections
                            </p>
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {categories.slice(0, 8).map((category) => (
                                <Link
                                    key={category.id}
                                    href={`/products?category=${category.slug}`}
                                    className="group text-center p-6 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 hover:scale-[1.02]"
                                >
                                    <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-orange-100 to-orange-200 rounded-full flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                                        👔
                                    </div>
                                    <h3 className="font-semibold text-gray-900 group-hover:text-orange-600">
                                        {category.name}
                                    </h3>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Featured Products */}
            {featuredProducts.length > 0 && (
                <section className="py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">⭐ Featured Products</h2>
                            <p className="text-gray-600 max-w-2xl mx-auto">
                                Handpicked favorites that define modern streetwear culture
                            </p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            {featuredProducts.slice(0, 4).map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                        <div className="text-center">
                            <Link href="/products?featured=true">
                                <Button variant="outline" size="lg" className="border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white">
                                    View All Featured →
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>
            )}

            {/* New Arrivals */}
            {newArrivals.length > 0 && (
                <section className="py-16 bg-gray-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">🆕 New Arrivals</h2>
                            <p className="text-gray-600 max-w-2xl mx-auto">
                                Fresh drops and the latest trends in streetwear fashion
                            </p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            {newArrivals.slice(0, 4).map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                        <div className="text-center">
                            <Link href="/products?sort=latest">
                                <Button variant="outline" size="lg" className="border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white">
                                    See All New →
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>
            )}

            {/* Best Sellers */}
            {bestSellers.length > 0 && (
                <section className="py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold text-gray-900 mb-4">🏆 Best Sellers</h2>
                            <p className="text-gray-600 max-w-2xl mx-auto">
                                Customer favorites that keep selling out
                            </p>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            {bestSellers.slice(0, 4).map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                        <div className="text-center">
                            <Link href="/products?sort=best_selling">
                                <Button variant="outline" size="lg" className="border-orange-600 text-orange-600 hover:bg-orange-600 hover:text-white">
                                    Shop Bestsellers →
                                </Button>
                            </Link>
                        </div>
                    </div>
                </section>
            )}

            {/* Features */}
            <section className="py-16 bg-gray-900 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="text-4xl mb-4">🚚</div>
                            <h3 className="text-xl font-semibold mb-2">Free Shipping</h3>
                            <p className="text-gray-300">Free delivery on orders over Rp 500,000</p>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl mb-4">🔒</div>
                            <h3 className="text-xl font-semibold mb-2">Secure Payment</h3>
                            <p className="text-gray-300">Multiple payment options including COD</p>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl mb-4">↩️</div>
                            <h3 className="text-xl font-semibold mb-2">Easy Returns</h3>
                            <p className="text-gray-300">30-day return policy for your peace of mind</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-white border-t border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900 mb-4">STREETWEAR</h3>
                            <p className="text-gray-600 mb-4">
                                Your destination for authentic streetwear and urban fashion.
                            </p>
                            <div className="flex space-x-4 text-2xl">
                                <span>📧</span>
                                <span>📱</span>
                                <span>📍</span>
                            </div>
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">Shop</h4>
                            <ul className="space-y-2">
                                <li><Link href="/products" className="text-gray-600 hover:text-orange-600">All Products</Link></li>
                                <li><Link href="/products?featured=true" className="text-gray-600 hover:text-orange-600">Featured</Link></li>
                                <li><Link href="/products?sort=latest" className="text-gray-600 hover:text-orange-600">New Arrivals</Link></li>
                                <li><Link href="/products?sort=best_selling" className="text-gray-600 hover:text-orange-600">Best Sellers</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">Support</h4>
                            <ul className="space-y-2">
                                <li><Link href="/about" className="text-gray-600 hover:text-orange-600">About Us</Link></li>
                                <li><Link href="/faq" className="text-gray-600 hover:text-orange-600">FAQ</Link></li>
                                <li><Link href="/policies/refund" className="text-gray-600 hover:text-orange-600">Return Policy</Link></li>
                                <li><Link href="/contact" className="text-gray-600 hover:text-orange-600">Contact</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">Account</h4>
                            <ul className="space-y-2">
                                <li><Link href="/login" className="text-gray-600 hover:text-orange-600">Login</Link></li>
                                <li><Link href="/register" className="text-gray-600 hover:text-orange-600">Register</Link></li>
                                <li><Link href="/account" className="text-gray-600 hover:text-orange-600">My Account</Link></li>
                                <li><Link href="/account/orders" className="text-gray-600 hover:text-orange-600">Order History</Link></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-gray-200 mt-8 pt-8 text-center">
                        <p className="text-gray-600">
                            © 2024 Streetwear Store. Built with ❤️ for the culture.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}