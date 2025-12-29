'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import Modal, { ConfirmDialog } from '@/components/ui/Modal';
import { useSalesOrders, addDocument, updateDocument, deleteDocument } from '@/lib/useFirestore';

interface SalesOrder {
    id?: string;
    sales_order_id: string;
    model: 'S1' | 'S2' | 'S3';
    version: 'V1' | 'V2';
    quantity: number;
    order_type: 'webshop' | 'fleet_framework' | 'fleet_spot';
    requested_date: string;
    created_at: string;
    accepted_request_date: string;
}

const emptyOrder: SalesOrder = {
    sales_order_id: '',
    model: 'S1',
    version: 'V2',
    quantity: 1,
    order_type: 'webshop',
    requested_date: '',
    created_at: new Date().toISOString().split('T')[0],
    accepted_request_date: new Date().toISOString().split('T')[0],
};

export default function SalesPage() {
    const { data: salesOrders, loading, error } = useSalesOrders();
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState('all');
    const [modelFilter, setModelFilter] = useState('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [currentOrder, setCurrentOrder] = useState<SalesOrder>(emptyOrder);
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);

    const ordersByType = {
        webshop: salesOrders.filter((o: any) => o.order_type === 'webshop').length,
        fleet_framework: salesOrders.filter((o: any) => o.order_type === 'fleet_framework').length,
        fleet_spot: salesOrders.filter((o: any) => o.order_type === 'fleet_spot').length,
    };

    const totalQuantity = salesOrders.reduce((sum: number, o: any) => sum + (o.quantity || 0), 0);

    // Filter orders
    const filteredOrders = salesOrders.filter((order: any) => {
        const matchesSearch = order.sales_order_id?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = typeFilter === 'all' || order.order_type === typeFilter;
        const matchesModel = modelFilter === 'all' || order.model === modelFilter;
        return matchesSearch && matchesType && matchesModel;
    });

    const typeStyles: Record<string, { bg: string; text: string }> = {
        webshop: { bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-700 dark:text-slate-300' },
        fleet_framework: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-400' },
        fleet_spot: { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-400' },
    };

    const openAddModal = () => {
        const newOrderId = `S${7000 + salesOrders.length}`;
        setCurrentOrder({ ...emptyOrder, sales_order_id: newOrderId });
        setIsEditing(false);
        setIsModalOpen(true);
    };

    const openEditModal = (order: SalesOrder) => {
        setCurrentOrder(order);
        setIsEditing(true);
        setIsModalOpen(true);
    };

    const openDeleteDialog = (order: SalesOrder) => {
        setCurrentOrder(order);
        setIsDeleteOpen(true);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const orderData = {
                sales_order_id: currentOrder.sales_order_id,
                model: currentOrder.model,
                version: currentOrder.version,
                quantity: Number(currentOrder.quantity),
                order_type: currentOrder.order_type,
                requested_date: currentOrder.requested_date,
                created_at: currentOrder.created_at,
                accepted_request_date: currentOrder.accepted_request_date,
            };

            if (isEditing && currentOrder.id) {
                await updateDocument('sales_orders', currentOrder.id, orderData);
            } else {
                await addDocument('sales_orders', orderData);
            }
            setIsModalOpen(false);
        } catch (err) {
            console.error('Error saving order:', err);
            alert('Error saving order');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (currentOrder.id) {
            try {
                await deleteDocument('sales_orders', currentOrder.id);
            } catch (err) {
                console.error('Error deleting order:', err);
            }
        }
    };

    if (loading) {
        return (
            <>
                <Header title="Sales Orders" />
                <div className="p-8 flex items-center justify-center">
                    <div className="text-slate-500">Loading sales orders...</div>
                </div>
            </>
        );
    }

    if (error) {
        return (
            <>
                <Header title="Sales Orders" />
                <div className="p-8">
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded p-4 text-red-700 dark:text-red-400">
                        Error loading orders. <a href="/admin" className="underline">Go to Admin to seed database</a>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Header title="Sales Orders" />
            <div className="p-8 max-w-[1600px] w-full mx-auto space-y-6">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div className="bg-white dark:bg-[#262626] rounded border border-gray-200 dark:border-[#404040] p-5">
                        <p className="text-sm text-slate-500 dark:text-slate-400">Total Orders</p>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{salesOrders.length}</p>
                    </div>
                    <div className="bg-white dark:bg-[#262626] rounded border border-gray-200 dark:border-[#404040] p-5">
                        <p className="text-sm text-slate-500 dark:text-slate-400">Total Units</p>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{totalQuantity.toLocaleString()}</p>
                    </div>
                    <div className="bg-white dark:bg-[#262626] rounded border border-gray-200 dark:border-[#404040] p-5">
                        <p className="text-sm text-slate-500 dark:text-slate-400">Webshop</p>
                        <p className="text-2xl font-bold text-slate-600 dark:text-slate-300 mt-1">{ordersByType.webshop}</p>
                    </div>
                    <div className="bg-white dark:bg-[#262626] rounded border border-l-4 border-l-blue-500 border-y-gray-200 border-r-gray-200 dark:border-y-[#404040] dark:border-r-[#404040] p-5">
                        <p className="text-sm text-slate-500 dark:text-slate-400">Fleet Framework</p>
                        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">{ordersByType.fleet_framework}</p>
                    </div>
                    <div className="bg-white dark:bg-[#262626] rounded border border-l-4 border-l-amber-500 border-y-gray-200 border-r-gray-200 dark:border-y-[#404040] dark:border-r-[#404040] p-5">
                        <p className="text-sm text-slate-500 dark:text-slate-400">Fleet Spot</p>
                        <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">{ordersByType.fleet_spot}</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex justify-between items-center flex-wrap gap-4">
                    <div className="flex items-center gap-4 flex-wrap">
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 material-symbols-outlined text-[20px]">search</span>
                            <input
                                className="pl-10 pr-4 py-2 bg-white dark:bg-[#262626] border border-gray-200 dark:border-[#404040] rounded text-sm w-80 focus:ring-2 focus:ring-[#595959]/20 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none"
                                placeholder="Search sales orders..."
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <select
                            className="px-3 py-2 bg-white dark:bg-[#262626] border border-gray-200 dark:border-[#404040] rounded text-sm text-slate-900 dark:text-white"
                            value={modelFilter}
                            onChange={(e) => setModelFilter(e.target.value)}
                        >
                            <option value="all">All Models</option>
                            <option value="S1">S1</option>
                            <option value="S2">S2</option>
                            <option value="S3">S3</option>
                        </select>
                        <select
                            className="px-3 py-2 bg-white dark:bg-[#262626] border border-gray-200 dark:border-[#404040] rounded text-sm text-slate-900 dark:text-white"
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value)}
                        >
                            <option value="all">All Types</option>
                            <option value="webshop">Webshop</option>
                            <option value="fleet_framework">Fleet Framework</option>
                            <option value="fleet_spot">Fleet Spot</option>
                        </select>
                    </div>
                    <button
                        onClick={openAddModal}
                        className="flex items-center gap-2 px-4 py-2 bg-[#595959] text-white rounded font-medium text-sm hover:bg-slate-700 transition-colors"
                    >
                        <span className="material-symbols-outlined text-[18px]">add</span>
                        Add Sales Order
                    </button>
                </div>

                {/* Sales Orders Table */}
                <div className="bg-white dark:bg-[#262626] rounded border border-gray-200 dark:border-[#404040] shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 border-b border-gray-200 dark:border-[#404040]">
                                <tr>
                                    <th className="px-5 py-3 font-medium text-xs uppercase tracking-wider">Order ID</th>
                                    <th className="px-5 py-3 font-medium text-xs uppercase tracking-wider">Model</th>
                                    <th className="px-5 py-3 font-medium text-xs uppercase tracking-wider">Version</th>
                                    <th className="px-5 py-3 font-medium text-xs uppercase tracking-wider">Quantity</th>
                                    <th className="px-5 py-3 font-medium text-xs uppercase tracking-wider">Order Type</th>
                                    <th className="px-5 py-3 font-medium text-xs uppercase tracking-wider">Requested Date</th>
                                    <th className="px-5 py-3 font-medium text-xs uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-[#404040]">
                                {filteredOrders.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-5 py-8 text-center text-slate-500">
                                            No sales orders found. <a href="/admin" className="text-indigo-600 underline">Seed the database</a>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredOrders.map((order: any) => (
                                        <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                            <td className="px-5 py-4 font-mono text-slate-900 dark:text-white font-medium">{order.sales_order_id}</td>
                                            <td className="px-5 py-4">
                                                <span className="px-2 py-1 bg-[#595959]/10 dark:bg-[#595959]/20 text-[#595959] dark:text-slate-300 rounded text-sm font-semibold">
                                                    {order.model}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4">
                                                <span className={`px-2 py-1 rounded text-xs font-medium ${order.version === 'V2'
                                                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                        : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                                                    }`}>
                                                    {order.version}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4 font-bold text-slate-900 dark:text-white">{order.quantity}</td>
                                            <td className="px-5 py-4">
                                                <span className={`px-2 py-1 rounded text-xs font-medium ${typeStyles[order.order_type]?.bg} ${typeStyles[order.order_type]?.text}`}>
                                                    {order.order_type === 'webshop' ? 'Webshop' :
                                                        order.order_type === 'fleet_framework' ? 'Fleet Framework' : 'Fleet Spot'}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4 text-slate-600 dark:text-slate-400">{order.requested_date}</td>
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => openEditModal(order)}
                                                        className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
                                                    >
                                                        <span className="material-symbols-outlined text-[18px]">edit</span>
                                                    </button>
                                                    <button
                                                        onClick={() => openDeleteDialog(order)}
                                                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                                                    >
                                                        <span className="material-symbols-outlined text-[18px]">delete</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Add/Edit Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={isEditing ? 'Edit Sales Order' : 'Add Sales Order'}
                maxWidth="max-w-lg"
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Order ID</label>
                        <input
                            type="text"
                            value={currentOrder.sales_order_id}
                            onChange={(e) => setCurrentOrder(prev => ({ ...prev, sales_order_id: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-200 dark:border-[#404040] rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                            placeholder="S7000"
                            disabled={isEditing}
                        />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Model</label>
                            <select
                                value={currentOrder.model}
                                onChange={(e) => setCurrentOrder(prev => ({ ...prev, model: e.target.value as any }))}
                                className="w-full px-3 py-2 border border-gray-200 dark:border-[#404040] rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                            >
                                <option value="S1">S1</option>
                                <option value="S2">S2</option>
                                <option value="S3">S3</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Version</label>
                            <select
                                value={currentOrder.version}
                                onChange={(e) => setCurrentOrder(prev => ({ ...prev, version: e.target.value as any }))}
                                className="w-full px-3 py-2 border border-gray-200 dark:border-[#404040] rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                            >
                                <option value="V1">V1</option>
                                <option value="V2">V2</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Quantity</label>
                            <input
                                type="number"
                                min="1"
                                value={currentOrder.quantity}
                                onChange={(e) => setCurrentOrder(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
                                className="w-full px-3 py-2 border border-gray-200 dark:border-[#404040] rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Order Type</label>
                        <select
                            value={currentOrder.order_type}
                            onChange={(e) => setCurrentOrder(prev => ({ ...prev, order_type: e.target.value as any }))}
                            className="w-full px-3 py-2 border border-gray-200 dark:border-[#404040] rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                        >
                            <option value="webshop">Webshop</option>
                            <option value="fleet_framework">Fleet Framework</option>
                            <option value="fleet_spot">Fleet Spot</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Requested Date</label>
                        <input
                            type="date"
                            value={currentOrder.requested_date}
                            onChange={(e) => setCurrentOrder(prev => ({ ...prev, requested_date: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-200 dark:border-[#404040] rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                        />
                    </div>
                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-[#404040]">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={saving || !currentOrder.sales_order_id}
                            className="px-4 py-2 text-sm font-medium text-white bg-[#595959] hover:bg-slate-700 rounded transition-colors disabled:opacity-50"
                        >
                            {saving ? 'Saving...' : (isEditing ? 'Save Changes' : 'Create Order')}
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Delete Confirmation */}
            <ConfirmDialog
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onConfirm={handleDelete}
                title="Delete Sales Order"
                message={`Are you sure you want to delete order "${currentOrder.sales_order_id}"?`}
                confirmText="Delete"
                confirmVariant="danger"
            />
        </>
    );
}
