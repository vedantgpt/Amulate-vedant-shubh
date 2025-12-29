'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import Modal, { ConfirmDialog } from '@/components/ui/Modal';
import { useMaterialOrders, useMaterials, addDocument, updateDocument, deleteDocument } from '@/lib/useFirestore';

interface MaterialOrder {
    id?: string;
    order_id: string;
    part_id: string;
    quantity_ordered: number;
    order_date: string;
    expected_delivery_date: string;
    supplier_id: string;
    status: 'ordered' | 'delivered';
    actual_delivered_at?: string;
}

const emptyOrder: MaterialOrder = {
    order_id: '',
    part_id: '',
    quantity_ordered: 0,
    order_date: new Date().toISOString().split('T')[0],
    expected_delivery_date: '',
    supplier_id: '',
    status: 'ordered',
};

export default function ProcurementPage() {
    const { data: materialOrders, loading, error } = useMaterialOrders();
    const { data: materials } = useMaterials();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [currentOrder, setCurrentOrder] = useState<MaterialOrder>(emptyOrder);
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);

    const orderedCount = materialOrders.filter((o: any) => o.status === 'ordered').length;
    const deliveredCount = materialOrders.filter((o: any) => o.status === 'delivered').length;

    // Filter orders
    const filteredOrders = materialOrders.filter((order: any) => {
        const matchesSearch = order.order_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.part_id?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const getMaterial = (partId: string) => materials.find((m: any) => m.part_id === partId);

    const openAddModal = () => {
        const newOrderId = `O${5100 + materialOrders.length}`;
        setCurrentOrder({ ...emptyOrder, order_id: newOrderId });
        setIsEditing(false);
        setIsModalOpen(true);
    };

    const openEditModal = (order: MaterialOrder) => {
        setCurrentOrder(order);
        setIsEditing(true);
        setIsModalOpen(true);
    };

    const openDeleteDialog = (order: MaterialOrder) => {
        setCurrentOrder(order);
        setIsDeleteOpen(true);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const orderData = {
                order_id: currentOrder.order_id,
                part_id: currentOrder.part_id,
                quantity_ordered: Number(currentOrder.quantity_ordered),
                order_date: currentOrder.order_date,
                expected_delivery_date: currentOrder.expected_delivery_date,
                supplier_id: currentOrder.supplier_id,
                status: currentOrder.status,
                ...(currentOrder.actual_delivered_at && { actual_delivered_at: currentOrder.actual_delivered_at }),
            };

            if (isEditing && currentOrder.id) {
                await updateDocument('material_orders', currentOrder.id, orderData);
            } else {
                await addDocument('material_orders', orderData);
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
                await deleteDocument('material_orders', currentOrder.id);
            } catch (err) {
                console.error('Error deleting order:', err);
            }
        }
    };

    const markAsDelivered = async (order: any) => {
        try {
            await updateDocument('material_orders', order.id, {
                status: 'delivered',
                actual_delivered_at: new Date().toISOString().split('T')[0],
            });
        } catch (err) {
            console.error('Error marking as delivered:', err);
        }
    };

    if (loading) {
        return (
            <>
                <Header title="Procurement (Purchase Orders)" />
                <div className="p-8 flex items-center justify-center">
                    <div className="text-slate-500">Loading orders...</div>
                </div>
            </>
        );
    }

    if (error) {
        return (
            <>
                <Header title="Procurement (Purchase Orders)" />
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
            <Header title="Procurement (Purchase Orders)" />
            <div className="p-8 max-w-[1600px] w-full mx-auto space-y-6">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white dark:bg-[#262626] rounded border border-gray-200 dark:border-[#404040] p-5">
                        <p className="text-sm text-slate-500 dark:text-slate-400">Total Orders</p>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{materialOrders.length}</p>
                    </div>
                    <div className="bg-white dark:bg-[#262626] rounded border border-l-4 border-l-blue-500 border-y-gray-200 border-r-gray-200 dark:border-y-[#404040] dark:border-r-[#404040] p-5">
                        <p className="text-sm text-slate-500 dark:text-slate-400">In Progress</p>
                        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">{orderedCount}</p>
                    </div>
                    <div className="bg-white dark:bg-[#262626] rounded border border-gray-200 dark:border-[#404040] p-5">
                        <p className="text-sm text-slate-500 dark:text-slate-400">Delivered</p>
                        <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">{deliveredCount}</p>
                    </div>
                    <div className="bg-white dark:bg-[#262626] rounded border border-gray-200 dark:border-[#404040] p-5">
                        <p className="text-sm text-slate-500 dark:text-slate-400">On-Time Rate</p>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">94.5%</p>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-between items-center flex-wrap gap-4">
                    <div className="flex items-center gap-4 flex-wrap">
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 material-symbols-outlined text-[20px]">search</span>
                            <input
                                className="pl-10 pr-4 py-2 bg-white dark:bg-[#262626] border border-gray-200 dark:border-[#404040] rounded text-sm w-80 focus:ring-2 focus:ring-[#595959]/20 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none"
                                placeholder="Search orders..."
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <select
                            className="px-3 py-2 bg-white dark:bg-[#262626] border border-gray-200 dark:border-[#404040] rounded text-sm text-slate-900 dark:text-white"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="all">All Status</option>
                            <option value="ordered">Ordered</option>
                            <option value="delivered">Delivered</option>
                        </select>
                    </div>
                    <button
                        onClick={openAddModal}
                        className="flex items-center gap-2 px-4 py-2 bg-[#595959] text-white rounded font-medium text-sm hover:bg-slate-700 transition-colors"
                    >
                        <span className="material-symbols-outlined text-[18px]">add</span>
                        Create Order
                    </button>
                </div>

                {/* Orders Table */}
                <div className="bg-white dark:bg-[#262626] rounded border border-gray-200 dark:border-[#404040] shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 border-b border-gray-200 dark:border-[#404040]">
                                <tr>
                                    <th className="px-5 py-3 font-medium text-xs uppercase tracking-wider">Order ID</th>
                                    <th className="px-5 py-3 font-medium text-xs uppercase tracking-wider">Part</th>
                                    <th className="px-5 py-3 font-medium text-xs uppercase tracking-wider">Quantity</th>
                                    <th className="px-5 py-3 font-medium text-xs uppercase tracking-wider">Supplier</th>
                                    <th className="px-5 py-3 font-medium text-xs uppercase tracking-wider">Order Date</th>
                                    <th className="px-5 py-3 font-medium text-xs uppercase tracking-wider">Expected</th>
                                    <th className="px-5 py-3 font-medium text-xs uppercase tracking-wider">Status</th>
                                    <th className="px-5 py-3 font-medium text-xs uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-[#404040]">
                                {filteredOrders.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="px-5 py-8 text-center text-slate-500">
                                            No orders found. <a href="/admin" className="text-indigo-600 underline">Seed the database</a>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredOrders.map((order: any) => {
                                        const material = getMaterial(order.part_id);

                                        return (
                                            <tr key={order.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                                <td className="px-5 py-4 font-mono text-slate-900 dark:text-white font-medium">{order.order_id}</td>
                                                <td className="px-5 py-4">
                                                    <div className="flex flex-col">
                                                        <span className="text-slate-900 dark:text-white">{order.part_id}</span>
                                                        <span className="text-xs text-slate-500">{material?.part_name?.slice(0, 30)}...</span>
                                                    </div>
                                                </td>
                                                <td className="px-5 py-4 font-semibold text-slate-900 dark:text-white">{order.quantity_ordered}</td>
                                                <td className="px-5 py-4">
                                                    <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-xs font-medium">
                                                        {order.supplier_id}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-4 text-slate-600 dark:text-slate-400">{order.order_date}</td>
                                                <td className="px-5 py-4 text-slate-600 dark:text-slate-400">{order.expected_delivery_date}</td>
                                                <td className="px-5 py-4">
                                                    <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium ${order.status === 'ordered'
                                                            ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300'
                                                            : 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300'
                                                        }`}>
                                                        <span className={`size-1.5 rounded-full ${order.status === 'ordered' ? 'bg-blue-500' : 'bg-green-500'}`}></span>
                                                        {order.status?.charAt(0).toUpperCase() + order.status?.slice(1)}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-4">
                                                    <div className="flex items-center gap-1">
                                                        <button
                                                            onClick={() => openEditModal(order)}
                                                            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
                                                        >
                                                            <span className="material-symbols-outlined text-[18px]">edit</span>
                                                        </button>
                                                        {order.status === 'ordered' && (
                                                            <button
                                                                onClick={() => markAsDelivered(order)}
                                                                className="p-1.5 text-slate-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded transition-colors"
                                                                title="Mark as Delivered"
                                                            >
                                                                <span className="material-symbols-outlined text-[18px]">check_circle</span>
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() => openDeleteDialog(order)}
                                                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                                                        >
                                                            <span className="material-symbols-outlined text-[18px]">delete</span>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })
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
                title={isEditing ? 'Edit Purchase Order' : 'Create Purchase Order'}
                maxWidth="max-w-lg"
            >
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Order ID</label>
                            <input
                                type="text"
                                value={currentOrder.order_id}
                                onChange={(e) => setCurrentOrder(prev => ({ ...prev, order_id: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-200 dark:border-[#404040] rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                                placeholder="O5100"
                                disabled={isEditing}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Part ID</label>
                            <input
                                type="text"
                                value={currentOrder.part_id}
                                onChange={(e) => setCurrentOrder(prev => ({ ...prev, part_id: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-200 dark:border-[#404040] rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                                placeholder="P305"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Quantity</label>
                            <input
                                type="number"
                                value={currentOrder.quantity_ordered}
                                onChange={(e) => setCurrentOrder(prev => ({ ...prev, quantity_ordered: parseInt(e.target.value) || 0 }))}
                                className="w-full px-3 py-2 border border-gray-200 dark:border-[#404040] rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Supplier</label>
                            <select
                                value={currentOrder.supplier_id}
                                onChange={(e) => setCurrentOrder(prev => ({ ...prev, supplier_id: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-200 dark:border-[#404040] rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                            >
                                <option value="">Select Supplier</option>
                                <option value="SupA">SupA - Alpha Electronics</option>
                                <option value="SupB">SupB - Beta Motors</option>
                                <option value="SupC">SupC - Gamma Parts</option>
                            </select>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Order Date</label>
                            <input
                                type="date"
                                value={currentOrder.order_date}
                                onChange={(e) => setCurrentOrder(prev => ({ ...prev, order_date: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-200 dark:border-[#404040] rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Expected Delivery</label>
                            <input
                                type="date"
                                value={currentOrder.expected_delivery_date}
                                onChange={(e) => setCurrentOrder(prev => ({ ...prev, expected_delivery_date: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-200 dark:border-[#404040] rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                            />
                        </div>
                    </div>
                    {isEditing && (
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Status</label>
                                <select
                                    value={currentOrder.status}
                                    onChange={(e) => setCurrentOrder(prev => ({ ...prev, status: e.target.value as any }))}
                                    className="w-full px-3 py-2 border border-gray-200 dark:border-[#404040] rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                                >
                                    <option value="ordered">Ordered</option>
                                    <option value="delivered">Delivered</option>
                                </select>
                            </div>
                            {currentOrder.status === 'delivered' && (
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Actual Delivery</label>
                                    <input
                                        type="date"
                                        value={currentOrder.actual_delivered_at || ''}
                                        onChange={(e) => setCurrentOrder(prev => ({ ...prev, actual_delivered_at: e.target.value }))}
                                        className="w-full px-3 py-2 border border-gray-200 dark:border-[#404040] rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                                    />
                                </div>
                            )}
                        </div>
                    )}
                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-[#404040]">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={saving || !currentOrder.order_id || !currentOrder.part_id}
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
                title="Delete Purchase Order"
                message={`Are you sure you want to delete order "${currentOrder.order_id}"?`}
                confirmText="Delete"
                confirmVariant="danger"
            />
        </>
    );
}
