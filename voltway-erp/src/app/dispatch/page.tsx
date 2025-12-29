'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import Modal, { ConfirmDialog } from '@/components/ui/Modal';
import { useDispatchParameters, useStockLevels, addDocument, updateDocument, deleteDocument } from '@/lib/useFirestore';

interface DispatchParameter {
    id?: string;
    part_id: string;
    min_stock_level: number;
    reorder_quantity: number;
    reorder_interval_days: number;
}

const emptyDispatch: DispatchParameter = {
    part_id: '',
    min_stock_level: 50,
    reorder_quantity: 100,
    reorder_interval_days: 14,
};

export default function DispatchPage() {
    const { data: dispatchParameters, loading, error } = useDispatchParameters();
    const { data: stockLevels } = useStockLevels();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [currentDispatch, setCurrentDispatch] = useState<DispatchParameter>(emptyDispatch);
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);

    // Combine with stock data
    const data = dispatchParameters.map((dp: any) => {
        const stock = stockLevels.find((s: any) => s.part_id === dp.part_id);
        const currentStock = stock?.quantity_available || 0;
        const needsReorder = currentStock <= dp.min_stock_level;

        return {
            ...dp,
            part_name: stock?.part_name || 'Unknown',
            current_stock: currentStock,
            needs_reorder: needsReorder,
        };
    });

    const needsReorderCount = data.filter((d: any) => d.needs_reorder).length;
    const avgInterval = data.length > 0
        ? Math.round(data.reduce((sum: number, d: any) => sum + d.reorder_interval_days, 0) / data.length)
        : 0;

    const openAddModal = () => {
        setCurrentDispatch(emptyDispatch);
        setIsEditing(false);
        setIsModalOpen(true);
    };

    const openEditModal = (dispatch: DispatchParameter) => {
        setCurrentDispatch(dispatch);
        setIsEditing(true);
        setIsModalOpen(true);
    };

    const openDeleteDialog = (dispatch: DispatchParameter) => {
        setCurrentDispatch(dispatch);
        setIsDeleteOpen(true);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const dispatchData = {
                part_id: currentDispatch.part_id,
                min_stock_level: Number(currentDispatch.min_stock_level),
                reorder_quantity: Number(currentDispatch.reorder_quantity),
                reorder_interval_days: Number(currentDispatch.reorder_interval_days),
            };

            if (isEditing && currentDispatch.id) {
                await updateDocument('dispatch_parameters', currentDispatch.id, dispatchData);
            } else {
                await addDocument('dispatch_parameters', dispatchData);
            }
            setIsModalOpen(false);
        } catch (err) {
            console.error('Error saving dispatch:', err);
            alert('Error saving dispatch parameters');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (currentDispatch.id) {
            try {
                await deleteDocument('dispatch_parameters', currentDispatch.id);
            } catch (err) {
                console.error('Error deleting dispatch:', err);
            }
        }
    };

    if (loading) {
        return (
            <>
                <Header title="Dispatch Parameters" />
                <div className="p-8 flex items-center justify-center">
                    <div className="text-slate-500">Loading dispatch parameters...</div>
                </div>
            </>
        );
    }

    if (error) {
        return (
            <>
                <Header title="Dispatch Parameters" />
                <div className="p-8">
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded p-4 text-red-700 dark:text-red-400">
                        Error loading data. <a href="/admin" className="underline">Go to Admin to seed database</a>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Header title="Dispatch Parameters" />
            <div className="p-8 max-w-[1600px] w-full mx-auto space-y-6">
                {/* Summary */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white dark:bg-[#262626] rounded border border-gray-200 dark:border-[#404040] p-5">
                        <p className="text-sm text-slate-500 dark:text-slate-400">Total SKUs Configured</p>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{data.length}</p>
                    </div>
                    <div className="bg-white dark:bg-[#262626] rounded border border-l-4 border-l-amber-500 border-y-gray-200 border-r-gray-200 dark:border-y-[#404040] dark:border-r-[#404040] p-5">
                        <p className="text-sm text-slate-500 dark:text-slate-400">Need Reorder</p>
                        <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">{needsReorderCount}</p>
                    </div>
                    <div className="bg-white dark:bg-[#262626] rounded border border-gray-200 dark:border-[#404040] p-5">
                        <p className="text-sm text-slate-500 dark:text-slate-400">Avg Reorder Interval</p>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{avgInterval} days</p>
                    </div>
                    <div className="bg-white dark:bg-[#262626] rounded border border-gray-200 dark:border-[#404040] p-5">
                        <p className="text-sm text-slate-500 dark:text-slate-400">Healthy SKUs</p>
                        <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">{data.length - needsReorderCount}</p>
                    </div>
                </div>

                {/* Header with Add Button */}
                <div className="flex justify-end">
                    <button
                        onClick={openAddModal}
                        className="flex items-center gap-2 px-4 py-2 bg-[#595959] text-white rounded font-medium text-sm hover:bg-slate-700 transition-colors"
                    >
                        <span className="material-symbols-outlined text-[18px]">add</span>
                        Add Dispatch Rule
                    </button>
                </div>

                {/* Table */}
                <div className="bg-white dark:bg-[#262626] rounded border border-gray-200 dark:border-[#404040] shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 border-b border-gray-200 dark:border-[#404040]">
                                <tr>
                                    <th className="px-5 py-3 font-medium text-xs uppercase tracking-wider">Part ID</th>
                                    <th className="px-5 py-3 font-medium text-xs uppercase tracking-wider">Part Name</th>
                                    <th className="px-5 py-3 font-medium text-xs uppercase tracking-wider">Current Stock</th>
                                    <th className="px-5 py-3 font-medium text-xs uppercase tracking-wider">Min Stock</th>
                                    <th className="px-5 py-3 font-medium text-xs uppercase tracking-wider">Reorder Qty</th>
                                    <th className="px-5 py-3 font-medium text-xs uppercase tracking-wider">Interval</th>
                                    <th className="px-5 py-3 font-medium text-xs uppercase tracking-wider">Status</th>
                                    <th className="px-5 py-3 font-medium text-xs uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-[#404040]">
                                {data.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="px-5 py-8 text-center text-slate-500">
                                            No dispatch parameters found. <a href="/admin" className="text-indigo-600 underline">Seed the database</a>
                                        </td>
                                    </tr>
                                ) : (
                                    data.map((item: any) => (
                                        <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                            <td className="px-5 py-4 font-mono text-slate-900 dark:text-white font-medium">{item.part_id}</td>
                                            <td className="px-5 py-4 text-slate-900 dark:text-white max-w-xs truncate">{item.part_name}</td>
                                            <td className="px-5 py-4 font-semibold text-slate-900 dark:text-white">{item.current_stock}</td>
                                            <td className="px-5 py-4 text-slate-600 dark:text-slate-400">{item.min_stock_level}</td>
                                            <td className="px-5 py-4 text-slate-600 dark:text-slate-400">{item.reorder_quantity}</td>
                                            <td className="px-5 py-4 text-slate-600 dark:text-slate-400">{item.reorder_interval_days} days</td>
                                            <td className="px-5 py-4">
                                                {item.needs_reorder ? (
                                                    <span className="px-2 py-1 rounded text-xs font-bold bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                                                        Reorder Needed
                                                    </span>
                                                ) : (
                                                    <span className="px-2 py-1 rounded text-xs font-bold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                                        OK
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => openEditModal(item)}
                                                        className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
                                                    >
                                                        <span className="material-symbols-outlined text-[18px]">edit</span>
                                                    </button>
                                                    <button
                                                        onClick={() => openDeleteDialog(item)}
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
                title={isEditing ? 'Edit Dispatch Rule' : 'Add Dispatch Rule'}
                maxWidth="max-w-md"
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Part ID</label>
                        <input
                            type="text"
                            value={currentDispatch.part_id}
                            onChange={(e) => setCurrentDispatch(prev => ({ ...prev, part_id: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-200 dark:border-[#404040] rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                            placeholder="P305"
                            disabled={isEditing}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Minimum Stock Level</label>
                        <input
                            type="number"
                            value={currentDispatch.min_stock_level}
                            onChange={(e) => setCurrentDispatch(prev => ({ ...prev, min_stock_level: parseInt(e.target.value) || 0 }))}
                            className="w-full px-3 py-2 border border-gray-200 dark:border-[#404040] rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Reorder Quantity</label>
                        <input
                            type="number"
                            value={currentDispatch.reorder_quantity}
                            onChange={(e) => setCurrentDispatch(prev => ({ ...prev, reorder_quantity: parseInt(e.target.value) || 0 }))}
                            className="w-full px-3 py-2 border border-gray-200 dark:border-[#404040] rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Reorder Interval (days)</label>
                        <input
                            type="number"
                            value={currentDispatch.reorder_interval_days}
                            onChange={(e) => setCurrentDispatch(prev => ({ ...prev, reorder_interval_days: parseInt(e.target.value) || 0 }))}
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
                            disabled={saving || !currentDispatch.part_id}
                            className="px-4 py-2 text-sm font-medium text-white bg-[#595959] hover:bg-slate-700 rounded transition-colors disabled:opacity-50"
                        >
                            {saving ? 'Saving...' : (isEditing ? 'Save Changes' : 'Add Rule')}
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Delete Confirmation */}
            <ConfirmDialog
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onConfirm={handleDelete}
                title="Delete Dispatch Rule"
                message={`Are you sure you want to delete the dispatch rule for "${currentDispatch.part_id}"?`}
                confirmText="Delete"
                confirmVariant="danger"
            />
        </>
    );
}
