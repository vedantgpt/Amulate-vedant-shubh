'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import Modal, { ConfirmDialog } from '@/components/ui/Modal';
import { useSuppliers, addDocument, updateDocument, deleteDocument } from '@/lib/useFirestore';

interface Supplier {
    id?: string;
    supplier_id: string;
    supplier_name?: string;
    part_id: string;
    price_per_unit: number;
    lead_time_days: number;
    min_order_qty: number;
    reliability_rating: number;
    email?: string;
    phone?: string;
}

const emptySupplier: Supplier = {
    supplier_id: '',
    supplier_name: '',
    part_id: '',
    price_per_unit: 0,
    lead_time_days: 7,
    min_order_qty: 1,
    reliability_rating: 0.85,
    email: '',
    phone: '',
};

export default function SuppliersPage() {
    const { data: suppliers, loading, error } = useSuppliers();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [currentSupplier, setCurrentSupplier] = useState<Supplier>(emptySupplier);
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);

    // Group suppliers by supplier_id
    const supplierGroups = suppliers.reduce((acc: any, s: any) => {
        if (!acc[s.supplier_id]) {
            acc[s.supplier_id] = [];
        }
        acc[s.supplier_id].push(s);
        return acc;
    }, {});

    // Calculate averages for each supplier
    const supplierStats = Object.entries(supplierGroups).map(([id, items]: [string, any]) => ({
        id,
        name: items[0]?.supplier_name || id,
        partsCount: items.length,
        avgReliability: items.reduce((sum: number, i: any) => sum + (i.reliability_rating || 0), 0) / items.length,
        avgLeadTime: Math.round(items.reduce((sum: number, i: any) => sum + (i.lead_time_days || 0), 0) / items.length),
        avgPrice: items.reduce((sum: number, i: any) => sum + (i.price_per_unit || 0), 0) / items.length,
    }));

    const openAddModal = () => {
        setCurrentSupplier(emptySupplier);
        setIsEditing(false);
        setIsModalOpen(true);
    };

    const openEditModal = (supplier: Supplier) => {
        setCurrentSupplier(supplier);
        setIsEditing(true);
        setIsModalOpen(true);
    };

    const openDeleteDialog = (supplier: Supplier) => {
        setCurrentSupplier(supplier);
        setIsDeleteOpen(true);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const supplierData = {
                supplier_id: currentSupplier.supplier_id,
                supplier_name: currentSupplier.supplier_name,
                part_id: currentSupplier.part_id,
                price_per_unit: Number(currentSupplier.price_per_unit),
                lead_time_days: Number(currentSupplier.lead_time_days),
                min_order_qty: Number(currentSupplier.min_order_qty),
                reliability_rating: Number(currentSupplier.reliability_rating),
                email: currentSupplier.email || '',
                phone: currentSupplier.phone || '',
            };

            if (isEditing && currentSupplier.id) {
                await updateDocument('suppliers', currentSupplier.id, supplierData);
            } else {
                await addDocument('suppliers', supplierData);
            }
            setIsModalOpen(false);
        } catch (err) {
            console.error('Error saving supplier:', err);
            alert('Error saving supplier');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (currentSupplier.id) {
            try {
                await deleteDocument('suppliers', currentSupplier.id);
            } catch (err) {
                console.error('Error deleting supplier:', err);
            }
        }
    };

    if (loading) {
        return (
            <>
                <Header title="Suppliers" />
                <div className="p-8 flex items-center justify-center">
                    <div className="text-slate-500">Loading suppliers...</div>
                </div>
            </>
        );
    }

    if (error) {
        return (
            <>
                <Header title="Suppliers" />
                <div className="p-8">
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded p-4 text-red-700 dark:text-red-400">
                        Error loading suppliers. <a href="/admin" className="underline">Go to Admin to seed database</a>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Header title="Suppliers" />
            <div className="p-8 max-w-[1600px] w-full mx-auto space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <p className="text-sm text-slate-500">{supplierStats.length} suppliers, {suppliers.length} supplier-part relationships</p>
                    </div>
                    <button
                        onClick={openAddModal}
                        className="flex items-center gap-2 px-4 py-2 bg-[#595959] text-white rounded font-medium text-sm hover:bg-slate-700 transition-colors"
                    >
                        <span className="material-symbols-outlined text-[18px]">add</span>
                        Add Supplier-Part
                    </button>
                </div>

                {/* Supplier Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {supplierStats.map((supplier) => (
                        <div key={supplier.id} className="bg-white dark:bg-[#262626] rounded border border-gray-200 dark:border-[#404040] shadow-sm overflow-hidden">
                            <div className="p-5 border-b border-gray-200 dark:border-[#404040]">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">{supplier.id}</h3>
                                        <p className="text-sm text-slate-500">{supplier.name}</p>
                                        <p className="text-xs text-slate-400 mt-1">{supplier.partsCount} parts supplied</p>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <span className="material-symbols-outlined text-amber-400">star</span>
                                        <span className="font-bold text-slate-900 dark:text-white">{(supplier.avgReliability * 100).toFixed(0)}%</span>
                                    </div>
                                </div>
                            </div>
                            <div className="p-5 space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-slate-500">Reliability Rating</span>
                                    <div className="flex items-center gap-2">
                                        <div className="w-24 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full ${supplier.avgReliability >= 0.85 ? 'bg-green-500' :
                                                    supplier.avgReliability >= 0.7 ? 'bg-amber-500' : 'bg-red-500'
                                                    }`}
                                                style={{ width: `${supplier.avgReliability * 100}%` }}
                                            />
                                        </div>
                                        <span className={`text-sm font-medium ${supplier.avgReliability >= 0.85 ? 'text-green-600 dark:text-green-400' :
                                            supplier.avgReliability >= 0.7 ? 'text-amber-600 dark:text-amber-400' : 'text-red-600 dark:text-red-400'
                                            }`}>
                                            {supplier.avgReliability >= 0.85 ? 'Excellent' : supplier.avgReliability >= 0.7 ? 'Good' : 'Fair'}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-slate-500">Avg Lead Time</span>
                                    <span className="text-sm font-medium text-slate-900 dark:text-white">{supplier.avgLeadTime} days</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-slate-500">Avg Price/Unit</span>
                                    <span className="text-sm font-medium text-slate-900 dark:text-white">${supplier.avgPrice.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Supplier-Parts Table */}
                <div className="bg-white dark:bg-[#262626] rounded border border-gray-200 dark:border-[#404040] shadow-sm overflow-hidden">
                    <div className="px-5 py-4 border-b border-gray-200 dark:border-[#404040]">
                        <h3 className="text-sm font-bold uppercase tracking-wide text-slate-800 dark:text-slate-200">Supplier-Part Relationships</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 border-b border-gray-200 dark:border-[#404040]">
                                <tr>
                                    <th className="px-5 py-3 font-medium text-xs uppercase tracking-wider">Supplier</th>
                                    <th className="px-5 py-3 font-medium text-xs uppercase tracking-wider">Part ID</th>
                                    <th className="px-5 py-3 font-medium text-xs uppercase tracking-wider">Price/Unit</th>
                                    <th className="px-5 py-3 font-medium text-xs uppercase tracking-wider">Lead Time</th>
                                    <th className="px-5 py-3 font-medium text-xs uppercase tracking-wider">Min Order Qty</th>
                                    <th className="px-5 py-3 font-medium text-xs uppercase tracking-wider">Reliability</th>
                                    <th className="px-5 py-3 font-medium text-xs uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-[#404040]">
                                {suppliers.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-5 py-8 text-center text-slate-500">
                                            No suppliers found. <a href="/admin" className="text-indigo-600 underline">Seed the database</a>
                                        </td>
                                    </tr>
                                ) : (
                                    suppliers.map((supplier: any) => (
                                        <tr key={supplier.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                            <td className="px-5 py-4">
                                                <span className="px-2 py-1 bg-[#595959]/10 dark:bg-[#595959]/20 text-[#595959] dark:text-slate-300 rounded text-sm font-semibold">
                                                    {supplier.supplier_id}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4 font-mono text-slate-900 dark:text-white">{supplier.part_id}</td>
                                            <td className="px-5 py-4 font-semibold text-slate-900 dark:text-white">${supplier.price_per_unit?.toFixed(2)}</td>
                                            <td className="px-5 py-4 text-slate-600 dark:text-slate-400">{supplier.lead_time_days} days</td>
                                            <td className="px-5 py-4 text-slate-600 dark:text-slate-400">{supplier.min_order_qty}</td>
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-16 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                        <div
                                                            className={`h-full rounded-full ${supplier.reliability_rating >= 0.85 ? 'bg-green-500' :
                                                                supplier.reliability_rating >= 0.7 ? 'bg-amber-500' : 'bg-red-500'
                                                                }`}
                                                            style={{ width: `${(supplier.reliability_rating || 0) * 100}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-xs text-slate-500">{((supplier.reliability_rating || 0) * 100).toFixed(0)}%</span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => openEditModal(supplier)}
                                                        className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
                                                    >
                                                        <span className="material-symbols-outlined text-[18px]">edit</span>
                                                    </button>
                                                    <button
                                                        onClick={() => openDeleteDialog(supplier)}
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
                title={isEditing ? 'Edit Supplier-Part' : 'Add Supplier-Part'}
                maxWidth="max-w-lg"
            >
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Supplier ID</label>
                            <select
                                value={currentSupplier.supplier_id}
                                onChange={(e) => setCurrentSupplier(prev => ({ ...prev, supplier_id: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-200 dark:border-[#404040] rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                            >
                                <option value="">Select Supplier</option>
                                <option value="SupA">SupA</option>
                                <option value="SupB">SupB</option>
                                <option value="SupC">SupC</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Part ID</label>
                            <input
                                type="text"
                                value={currentSupplier.part_id}
                                onChange={(e) => setCurrentSupplier(prev => ({ ...prev, part_id: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-200 dark:border-[#404040] rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                                placeholder="P305"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Price per Unit ($)</label>
                            <input
                                type="number"
                                step="0.01"
                                value={currentSupplier.price_per_unit}
                                onChange={(e) => setCurrentSupplier(prev => ({ ...prev, price_per_unit: parseFloat(e.target.value) || 0 }))}
                                className="w-full px-3 py-2 border border-gray-200 dark:border-[#404040] rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Lead Time (days)</label>
                            <input
                                type="number"
                                value={currentSupplier.lead_time_days}
                                onChange={(e) => setCurrentSupplier(prev => ({ ...prev, lead_time_days: parseInt(e.target.value) || 0 }))}
                                className="w-full px-3 py-2 border border-gray-200 dark:border-[#404040] rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Min Order Qty</label>
                            <input
                                type="number"
                                value={currentSupplier.min_order_qty}
                                onChange={(e) => setCurrentSupplier(prev => ({ ...prev, min_order_qty: parseInt(e.target.value) || 0 }))}
                                className="w-full px-3 py-2 border border-gray-200 dark:border-[#404040] rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Reliability (0-1)</label>
                            <input
                                type="number"
                                step="0.01"
                                min="0"
                                max="1"
                                value={currentSupplier.reliability_rating}
                                onChange={(e) => setCurrentSupplier(prev => ({ ...prev, reliability_rating: parseFloat(e.target.value) || 0 }))}
                                className="w-full px-3 py-2 border border-gray-200 dark:border-[#404040] rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                            />
                        </div>
                    </div>
                    <div className="pt-3 border-t border-gray-200 dark:border-[#404040]">
                        <p className="text-xs font-medium text-slate-500 mb-3 flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px]">contact_mail</span>
                            Contact Information (for Hugo AI emails)
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email</label>
                                <input
                                    type="email"
                                    value={currentSupplier.email}
                                    onChange={(e) => setCurrentSupplier(prev => ({ ...prev, email: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-200 dark:border-[#404040] rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                                    placeholder="supplier@example.com"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Phone</label>
                                <input
                                    type="tel"
                                    value={currentSupplier.phone}
                                    onChange={(e) => setCurrentSupplier(prev => ({ ...prev, phone: e.target.value }))}
                                    className="w-full px-3 py-2 border border-gray-200 dark:border-[#404040] rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                                    placeholder="+91 12345 67890"
                                />
                            </div>
                        </div>
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
                            disabled={saving || !currentSupplier.supplier_id || !currentSupplier.part_id}
                            className="px-4 py-2 text-sm font-medium text-white bg-[#595959] hover:bg-slate-700 rounded transition-colors disabled:opacity-50"
                        >
                            {saving ? 'Saving...' : (isEditing ? 'Save Changes' : 'Add Supplier-Part')}
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Delete Confirmation */}
            <ConfirmDialog
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onConfirm={handleDelete}
                title="Delete Supplier-Part"
                message={`Are you sure you want to delete the relationship between ${currentSupplier.supplier_id} and ${currentSupplier.part_id}?`}
                confirmText="Delete"
                confirmVariant="danger"
            />
        </>
    );
}
