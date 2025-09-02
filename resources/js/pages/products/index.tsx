import React, { useState } from 'react';
import { Link, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import AppLayout from '@/components/app-layout';

interface Product {
    id: number;
    name: string;
    slug: string;
    price: number;
    compare_price: number | null;
    main_image: string | null;
    stock: number;
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
}

interface Props {
    products: {
        data: Product[];
        links: Array<{
            url?: string;
            label: string;
            active: boolean;
        }>;
        meta: {
            from?: number;
            to?: number;
            total: number;
        };
    };
    categories: Category[];
    filters: {
        search?: string;
        category?: string;
        min_price?: number;
        max_price?: number;
        in_stock?: boolean;
        sort_by?: string;
    };
    [key: string]: unknown;
}

export default function ProductsIndex({ products, categories, filters }: Props) {
    const [searchTerm, setSearchTerm] = useState(filters.search || '');
    const [selectedCategory, setSelectedCategory] = useState(filters.category || '');
    const [minPrice, setMinPrice] = useState(filters.min_price || '');
    const [maxPrice, setMaxPrice] = useState(filters.max_price || '');
    const [inStock, setInStock] = useState(filters.in_stock || false);
    const [sortBy, setSortBy] = useState(filters.sort_by || 'latest');

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const handleSearch = () => {
        const params = new URLSearchParams();
        
        if (searchTerm) params.set('search', searchTerm);
        if (selectedCategory) params.set('category', selectedCategory);
        if (minPrice) params.set('min_price', minPrice.toString());
        if (maxPrice) params.set('max_price', maxPrice.toString());
        if (inStock) params.set('in_stock', 'true');
        if (sortBy !== 'latest') params.set('sort_by', sortBy);

        router.get('/products', Object.fromEntries(params), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const clearFilters = () => {
        setSearchTerm('');
        setSelectedCategory('');
        setMinPrice('');
        setMaxPrice('');
        setInStock(false);
        setSortBy('latest');
        router.get('/products');
    };

    return (
        <AppLayout>
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">Products</h1>
                        <p className="text-gray-600">
                            Discover our complete collection of streetwear essentials
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        {/* Filters Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={clearFilters}
                                        className="text-orange-600 hover:text-orange-700"
                                    >
                                        Clear All
                                    </Button>
                                </div>

                                {/* Search */}
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Search
                                    </label>
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder="Search products..."
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                    />
                                </div>

                                {/* Category */}
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Category
                                    </label>
                                    <select
                                        value={selectedCategory}
                                        onChange={(e) => setSelectedCategory(e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    >
                                        <option value="">All Categories</option>
                                        {categories.map((category) => (
                                            <option key={category.id} value={category.slug}>
                                                {category.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Price Range */}
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Price Range
                                    </label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <input
                                            type="number"
                                            value={minPrice}
                                            onChange={(e) => setMinPrice(e.target.value)}
                                            placeholder="Min"
                                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        />
                                        <input
                                            type="number"
                                            value={maxPrice}
                                            onChange={(e) => setMaxPrice(e.target.value)}
                                            placeholder="Max"
                                            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                        />
                                    </div>
                                </div>

                                {/* In Stock */}
                                <div className="mb-6">
                                    <label className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={inStock}
                                            onChange={(e) => setInStock(e.target.checked)}
                                            className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                                        />
                                        <span className="ml-2 text-sm text-gray-700">In stock only</span>
                                    </label>
                                </div>

                                <Button onClick={handleSearch} className="w-full bg-orange-600 hover:bg-orange-700">
                                    Apply Filters
                                </Button>
                            </div>
                        </div>

                        {/* Products Grid */}
                        <div className="lg:col-span-3">
                            {/* Sort and Results Count */}
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                                <p className="text-gray-600 mb-2 sm:mb-0">
                                    Showing {products.meta.from || 0} to {products.meta.to || 0} of {products.meta.total} products
                                </p>
                                <div className="flex items-center space-x-2">
                                    <label className="text-sm text-gray-700">Sort by:</label>
                                    <select
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                                    >
                                        <option value="latest">Latest</option>
                                        <option value="price_asc">Price: Low to High</option>
                                        <option value="price_desc">Price: High to Low</option>
                                        <option value="best_selling">Best Selling</option>
                                    </select>
                                    <Button
                                        size="sm"
                                        onClick={handleSearch}
                                        className="bg-orange-600 hover:bg-orange-700"
                                    >
                                        Sort
                                    </Button>
                                </div>
                            </div>

                            {/* Products Grid */}
                            {products.data.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {products.data.map((product) => (
                                        <div key={product.id} className="group relative bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 hover:scale-[1.02]">
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
                                                {product.stock === 0 && (
                                                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                                        <span className="text-white font-semibold">Out of Stock</span>
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
                                                <div className="flex items-center gap-2 mb-2">
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
                                                <div className="flex items-center justify-between text-sm text-gray-600">
                                                    <span>{product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}</span>
                                                </div>
                                            </div>
                                            <Link
                                                href={`/products/${product.slug}`}
                                                className="absolute inset-0"
                                                aria-label={`View ${product.name}`}
                                            />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <div className="text-6xl mb-4">🔍</div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No products found</h3>
                                    <p className="text-gray-600 mb-4">Try adjusting your filters or search terms</p>
                                    <Button onClick={clearFilters} variant="outline">
                                        Clear Filters
                                    </Button>
                                </div>
                            )}

                            {/* Pagination */}
                            {products.links && products.links.length > 3 && (
                                <div className="flex justify-center mt-8">
                                    <nav className="flex space-x-1">
                                        {products.links.map((link, index) => (
                                            <Link
                                                key={index}
                                                href={link.url || '#'}
                                                className={`px-3 py-2 text-sm font-medium rounded-md ${
                                                    link.active
                                                        ? 'bg-orange-600 text-white'
                                                        : 'text-gray-700 hover:text-orange-600 hover:bg-orange-50'
                                                } ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                dangerouslySetInnerHTML={{ __html: link.label }}
                                            />
                                        ))}
                                    </nav>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}