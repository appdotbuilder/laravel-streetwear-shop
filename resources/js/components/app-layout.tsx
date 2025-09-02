import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';

interface AppLayoutProps {
    children: React.ReactNode;
}

interface SharedData {
    auth?: {
        user?: {
            id: number;
            name: string;
            email: string;
        } | null;
    };
    flash?: {
        success?: string;
        error?: string;
    };
    [key: string]: unknown;
}

export default function AppLayout({ children }: AppLayoutProps) {
    const { auth, flash } = usePage<SharedData>().props;
    const user = auth?.user;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center space-x-4">
                            <Link href="/" className="flex items-center space-x-2">
                                <h1 className="text-2xl font-bold text-gray-900">STREETWEAR</h1>
                                <span className="text-orange-600 text-sm font-medium">🔥</span>
                            </Link>
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
                            <Link href="/cart" className="text-gray-700 hover:text-orange-600 text-lg">
                                🛒
                            </Link>
                            
                            {user ? (
                                <div className="flex items-center space-x-4">
                                    <span className="text-gray-700">Hi, {user.name}</span>
                                    <Link href="/account">
                                        <Button variant="outline" size="sm">Account</Button>
                                    </Link>
                                    <Link href="/logout" method="post" as="button">
                                        <Button variant="ghost" size="sm">Logout</Button>
                                    </Link>
                                </div>
                            ) : (
                                <div className="flex items-center space-x-2">
                                    <Link href="/login">
                                        <Button variant="outline" size="sm">Login</Button>
                                    </Link>
                                    <Link href="/register">
                                        <Button size="sm" className="bg-orange-600 hover:bg-orange-700">Register</Button>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Flash Messages */}
            {(flash?.success || flash?.error) && (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
                    {flash.success && (
                        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-md mb-4">
                            ✅ {flash.success}
                        </div>
                    )}
                    {flash.error && (
                        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md mb-4">
                            ❌ {flash.error}
                        </div>
                    )}
                </div>
            )}

            {/* Main Content */}
            <main>{children}</main>

            {/* Footer */}
            <footer className="bg-gray-900 text-white mt-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div>
                            <h3 className="text-lg font-bold mb-4">STREETWEAR</h3>
                            <p className="text-gray-300 mb-4">
                                Your destination for authentic streetwear and urban fashion.
                            </p>
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold uppercase tracking-wide mb-4">Shop</h4>
                            <ul className="space-y-2">
                                <li><Link href="/products" className="text-gray-300 hover:text-white">All Products</Link></li>
                                <li><Link href="/products?featured=true" className="text-gray-300 hover:text-white">Featured</Link></li>
                                <li><Link href="/products?sort=latest" className="text-gray-300 hover:text-white">New Arrivals</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold uppercase tracking-wide mb-4">Support</h4>
                            <ul className="space-y-2">
                                <li><Link href="/about" className="text-gray-300 hover:text-white">About Us</Link></li>
                                <li><Link href="/faq" className="text-gray-300 hover:text-white">FAQ</Link></li>
                                <li><Link href="/contact" className="text-gray-300 hover:text-white">Contact</Link></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-sm font-semibold uppercase tracking-wide mb-4">Account</h4>
                            <ul className="space-y-2">
                                {user ? (
                                    <>
                                        <li><Link href="/account" className="text-gray-300 hover:text-white">My Account</Link></li>
                                        <li><Link href="/account/orders" className="text-gray-300 hover:text-white">Orders</Link></li>
                                    </>
                                ) : (
                                    <>
                                        <li><Link href="/login" className="text-gray-300 hover:text-white">Login</Link></li>
                                        <li><Link href="/register" className="text-gray-300 hover:text-white">Register</Link></li>
                                    </>
                                )}
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
                        <p>© 2024 Streetwear Store. Built for the culture. 🔥</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}