import React from 'react';
import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import AppLayout from '@/components/app-layout';

interface Stats {
    total_sales: number;
    total_orders: number;
    total_products: number;
    total_customers: number;
}

interface Product {
    id: number;
    name: string;
    sales_count: number;
    price: number;
    categories: Array<{
        name: string;
    }>;
}

interface Order {
    id: number;
    order_number: string;
    status: string;
    total: number;
    created_at: string;
    user: {
        name: string;
    };
}

interface Props {
    stats: Stats;
    ordersByStatus: Record<string, number>;
    bestSellingProducts: Product[];
    recentOrders: Order[];
    [key: string]: unknown;
}

export default function AdminDashboard({ stats, ordersByStatus, bestSellingProducts, recentOrders }: Props) {
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'paid': return 'bg-blue-100 text-blue-800';
            case 'processing': return 'bg-purple-100 text-purple-800';
            case 'shipped': return 'bg-green-100 text-green-800';
            case 'completed': return 'bg-green-100 text-green-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <AppLayout>
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                        <p className="text-gray-600 mt-2">Welcome to your e-commerce control center</p>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center">
                                <div className="p-3 rounded-full bg-green-100">
                                    <span className="text-2xl">💰</span>
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-sm font-medium text-gray-500">Sales (30 days)</h3>
                                    <p className="text-2xl font-bold text-gray-900">{formatPrice(stats.total_sales)}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center">
                                <div className="p-3 rounded-full bg-blue-100">
                                    <span className="text-2xl">📦</span>
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-sm font-medium text-gray-500">Orders (30 days)</h3>
                                    <p className="text-2xl font-bold text-gray-900">{stats.total_orders}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center">
                                <div className="p-3 rounded-full bg-purple-100">
                                    <span className="text-2xl">🛍️</span>
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-sm font-medium text-gray-500">Total Products</h3>
                                    <p className="text-2xl font-bold text-gray-900">{stats.total_products}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center">
                                <div className="p-3 rounded-full bg-orange-100">
                                    <span className="text-2xl">👥</span>
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-sm font-medium text-gray-500">New Customers</h3>
                                    <p className="text-2xl font-bold text-gray-900">{stats.total_customers}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
                        <div className="flex flex-wrap gap-4">
                            <Link href="/admin/products/create">
                                <Button className="bg-orange-600 hover:bg-orange-700">
                                    ➕ Add Product
                                </Button>
                            </Link>
                            <Link href="/admin/categories/create">
                                <Button variant="outline">
                                    🏷️ Add Category
                                </Button>
                            </Link>
                            <Link href="/admin/orders">
                                <Button variant="outline">
                                    📦 View Orders
                                </Button>
                            </Link>
                            <Link href="/admin/products">
                                <Button variant="outline">
                                    🛍️ Manage Products
                                </Button>
                            </Link>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Orders by Status */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Orders by Status</h2>
                            <div className="space-y-3">
                                {Object.entries(ordersByStatus).map(([status, count]) => (
                                    <div key={status} className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(status)}`}>
                                                {status.charAt(0).toUpperCase() + status.slice(1)}
                                            </span>
                                        </div>
                                        <span className="font-semibold text-gray-900">{count}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Best Selling Products */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-semibold text-gray-900">Best Selling Products</h2>
                                <Link href="/admin/products">
                                    <Button variant="ghost" size="sm">View All →</Button>
                                </Link>
                            </div>
                            <div className="space-y-4">
                                {bestSellingProducts.map((product) => (
                                    <div key={product.id} className="flex items-center justify-between">
                                        <div>
                                            <h3 className="font-medium text-gray-900">{product.name}</h3>
                                            <p className="text-sm text-gray-600">
                                                {product.categories[0]?.name} • {formatPrice(product.price)}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-sm font-medium text-gray-900">
                                                {product.sales_count} sold
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Recent Orders */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-8">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold text-gray-900">Recent Orders</h2>
                            <Link href="/admin/orders">
                                <Button variant="ghost" size="sm">View All →</Button>
                            </Link>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Order
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Customer
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Status
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Total
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Date
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {recentOrders.map((order) => (
                                        <tr key={order.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <Link 
                                                    href={`/admin/orders/${order.id}`}
                                                    className="text-orange-600 hover:text-orange-900 font-medium"
                                                >
                                                    {order.order_number}
                                                </Link>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {order.user.name}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(order.status)}`}>
                                                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {formatPrice(order.total)}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {formatDate(order.created_at)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}