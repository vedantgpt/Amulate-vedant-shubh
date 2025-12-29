'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import Modal, { ConfirmDialog } from '@/components/ui/Modal';
import { useStockLevels, useDispatchParameters, addDocument, updateDocument, deleteDocument } from '@/lib/useFirestore';

interface StockLevel {
    id?: string;
    part_id: string;
    part_name: string;
    location: 'WH1' | 'WH2' | 'WH3';
    quantity_available: number;
}

const emptyStock: StockLevel = {
    part_id: '',
    part_name: '',
    location: 'WH1',
    quantity_available: 0,
};

export default function InventoryPage() {
    const { data: stockLevels, loading, error } = useStockLevels();
    const { data: dispatchParameters } = useDispatchParameters();
    const [searchTerm, setSearchTerm] = useState('');
    const [locationFilter, setLocationFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [currentStock, setCurrentStock] = useState<StockLevel>(emptyStock);
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);

    // Calculate stock status
    const getStockStatus = (partId: string, quantity: number) => {
        const dispatch = dispatchParameters.find((d: any) => d.part_id === partId);
        if (!dispatch) return 'healthy';
        if (quantity <= dispatch.min_stock_level * 0.5) return 'critical';
        if (quantity <= dispatch.min_stock_level) return 'low';
        return 'healthy';
    };

    // Process inventory data
    const inventoryData = stockLevels.map((stock: any) => {
        const dispatch = dispatchParameters.find((d: any) => d.part_id === stock.part_id);
        const status = getStockStatus(stock.part_id, stock.quantity_available);
        const minStock = dispatch?.min_stock_level || 0;
        const percentage = minStock > 0 ? Math.min(100, Math.round((stock.quantity_available / minStock) * 100)) : 100;

        return { ...stock, min_stock: minStock, status, percentage };
    });

    // Filter data
    const filteredData = inventoryData.filter((item: any) => {
        const matchesSearch = item.part_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.part_name?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesLocation = locationFilter === 'all' || item.location === locationFilter;
        const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
        return matchesSearch && matchesLocation && matchesStatus;
    });

    const statusCounts = {
        healthy: inventoryData.filter((i: any) => i.status === 'healthy').length,
        low: inventoryData.filter((i: any) => i.status === 'low').length,
        critical: inventoryData.filter((i: any) => i.status === 'critical').length,
    };

    const openAddModal = () => {
        setCurrentStock(emptyStock);
        setIsEditing(false);
        setIsModalOpen(true);
    };

    const openEditModal = (stock: StockLevel) => {
        setCurrentStock(stock);
        setIsEditing(true);
        setIsModalOpen(true);
    };

    const openDeleteDialog = (stock: StockLevel) => {
        setCurrentStock(stock);
        setIsDeleteOpen(true);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const stockData = {
                part_id: currentStock.part_id,
                part_name: currentStock.part_name,
                location: currentStock.location,
                quantity_available: Number(currentStock.quantity_available),
            };

            if (isEditing && currentStock.id) {
                await updateDocument('stock_levels', currentStock.id, stockData);
            } else {
                await addDocument('stock_levels', stockData);
            }
            setIsModalOpen(false);
        } catch (err) {
            console.error('Error saving stock:', err);
            alert('Error saving stock level');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (currentStock.id) {
            try {
                await deleteDocument('stock_levels', currentStock.id);
            } catch (err) {
                console.error('Error deleting stock:', err);
                alert('Error deleting stock level');
            }
        }
    };

    if (loading) {
        return (
            <>
                <Header title="Inventory Management" />
                <div className="p-8 flex items-center justify-center">
                    <div className="text-slate-500">Loading inventory...</div>
                </div>
            </>
        );
    }

    if (error) {
        return (
            <>
                <Header title="Inventory Management" />
                <div className="p-8">
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded p-4 text-red-700 dark:text-red-400">
                        Error loading inventory. <a href="/admin" className="underline">Go to Admin to seed database</a>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Header title="Inventory Management" />
            <div className="p-8 max-w-[1600px] w-full mx-auto space-y-6">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white dark:bg-[#262626] rounded border border-gray-200 dark:border-[#404040] p-5">
                        <p className="text-sm text-slate-500 dark:text-slate-400">Total SKUs</p>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{inventoryData.length}</p>
                    </div>
                    <div className="bg-white dark:bg-[#262626] rounded border border-gray-200 dark:border-[#404040] p-5">
                        <p className="text-sm text-slate-500 dark:text-slate-400">Healthy Stock</p>
                        <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">{statusCounts.healthy}</p>
                    </div>
                    <div className="bg-white dark:bg-[#262626] rounded border border-gray-200 dark:border-[#404040] p-5">
                        <p className="text-sm text-slate-500 dark:text-slate-400">Low Stock</p>
                        <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">{statusCounts.low}</p>
                    </div>
                    <div className="bg-white dark:bg-[#262626] rounded border border-l-4 border-l-red-500 border-y-gray-200 border-r-gray-200 dark:border-y-[#404040] dark:border-r-[#404040] p-5">
                        <p className="text-sm text-slate-500 dark:text-slate-400">Critical Stock</p>
                        <p className="text-2xl font-bold text-red-600 dark:text-red-400 mt-1">{statusCounts.critical}</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex justify-between items-center flex-wrap gap-4">
                    <div className="flex items-center gap-4 flex-wrap">
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 material-symbols-outlined text-[20px]">search</span>
                            <input
                                className="pl-10 pr-4 py-2 bg-white dark:bg-[#262626] border border-gray-200 dark:border-[#404040] rounded text-sm w-80 focus:ring-2 focus:ring-[#595959]/20 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none"
                                placeholder="Search inventory..."
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <select
                            className="px-3 py-2 bg-white dark:bg-[#262626] border border-gray-200 dark:border-[#404040] rounded text-sm text-slate-900 dark:text-white"
                            value={locationFilter}
                            onChange={(e) => setLocationFilter(e.target.value)}
                        >
                            <option value="all">All Locations</option>
                            <option value="WH1">WH1</option>
                            <option value="WH2">WH2</option>
                            <option value="WH3">WH3</option>
                        </select>
                        <select
                            className="px-3 py-2 bg-white dark:bg-[#262626] border border-gray-200 dark:border-[#404040] rounded text-sm text-slate-900 dark:text-white"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="all">All Status</option>
                            <option value="healthy">Healthy</option>
                            <option value="low">Low</option>
                            <option value="critical">Critical</option>
                        </select>
                    </div>
                    <button
                        onClick={openAddModal}
                        className="flex items-center gap-2 px-4 py-2 bg-[#595959] text-white rounded font-medium text-sm hover:bg-slate-700 transition-colors"
                    >
                        <span className="material-symbols-outlined text-[18px]">add</span>
                        Add Stock Entry
                    </button>
                </div>

                {/* Inventory Table */}
                <div className="bg-white dark:bg-[#262626] rounded border border-gray-200 dark:border-[#404040] shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 border-b border-gray-200 dark:border-[#404040]">
                                <tr>
                                    <th className="px-5 py-3 font-medium text-xs uppercase tracking-wider">Part ID</th>
                                    <th className="px-5 py-3 font-medium text-xs uppercase tracking-wider">Part Name</th>
                                    <th className="px-5 py-3 font-medium text-xs uppercase tracking-wider">Location</th>
                                    <th className="px-5 py-3 font-medium text-xs uppercase tracking-wider">Available</th>
                                    <th className="px-5 py-3 font-medium text-xs uppercase tracking-wider">Min Stock</th>
                                    <th className="px-5 py-3 font-medium text-xs uppercase tracking-wider">Stock Level</th>
                                    <th className="px-5 py-3 font-medium text-xs uppercase tracking-wider">Status</th>
                                    <th className="px-5 py-3 font-medium text-xs uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-[#404040]">
                                {filteredData.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="px-5 py-8 text-center text-slate-500">
                                            No inventory found. <a href="/admin" className="text-indigo-600 underline">Seed the database</a> to add sample data.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredData.map((item: any) => (
                                        <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                            <td className="px-5 py-4 font-mono text-slate-900 dark:text-white font-medium">{item.part_id}</td>
                                            <td className="px-5 py-4 text-slate-900 dark:text-white">{item.part_name}</td>
                                            <td className="px-5 py-4">
                                                <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-xs font-medium text-slate-700 dark:text-slate-300">
                                                    {item.location}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4 font-semibold text-slate-900 dark:text-white">{item.quantity_available}</td>
                                            <td className="px-5 py-4 text-slate-500">{item.min_stock}</td>
                                            <td className="px-5 py-4 w-48">
                                                <div className="flex items-center gap-3">
                                                    <div className="flex-1 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                        <div
                                                            className={`h-full rounded-full ${item.status === 'critical' ? 'bg-red-500' :
                                                                    item.status === 'low' ? 'bg-amber-500' : 'bg-green-500'
                                                                }`}
                                                            style={{ width: `${Math.min(100, item.percentage)}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-xs text-slate-500 w-10">{item.percentage}%</span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4">
                                                <span className={`px-2 py-1 rounded text-xs font-bold ${item.status === 'critical' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                                                        item.status === 'low' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                                                            'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                                    }`}>
                                                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                                                </span>
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
                title={isEditing ? 'Edit Stock Level' : 'Add Stock Entry'}
                maxWidth="max-w-md"
            >
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Part ID</label>
                        <input
                            type="text"
                            value={currentStock.part_id}
                            onChange={(e) => setCurrentStock(prev => ({ ...prev, part_id: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-200 dark:border-[#404040] rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                            placeholder="P300"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Part Name</label>
                        <input
                            type="text"
                            value={currentStock.part_name}
                            onChange={(e) => setCurrentStock(prev => ({ ...prev, part_name: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-200 dark:border-[#404040] rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                            placeholder="S1 V2 750W Brushless Motor"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Location</label>
                            <select
                                value={currentStock.location}
                                onChange={(e) => setCurrentStock(prev => ({ ...prev, location: e.target.value as any }))}
                                className="w-full px-3 py-2 border border-gray-200 dark:border-[#404040] rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                            >
                                <option value="WH1">WH1</option>
                                <option value="WH2">WH2</option>
                                <option value="WH3">WH3</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Quantity</label>
                            <input
                                type="number"
                                value={currentStock.quantity_available}
                                onChange={(e) => setCurrentStock(prev => ({ ...prev, quantity_available: parseInt(e.target.value) || 0 }))}
                                className="w-full px-3 py-2 border border-gray-200 dark:border-[#404040] rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                            />
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
                            disabled={saving || !currentStock.part_id}
                            className="px-4 py-2 text-sm font-medium text-white bg-[#595959] hover:bg-slate-700 rounded transition-colors disabled:opacity-50"
                        >
                            {saving ? 'Saving...' : (isEditing ? 'Save Changes' : 'Add Stock')}
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Delete Confirmation */}
            <ConfirmDialog
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onConfirm={handleDelete}
                title="Delete Stock Entry"
                message={`Are you sure you want to delete stock for "${currentStock.part_name}"?`}
                confirmText="Delete"
                confirmVariant="danger"
            />
        </>
    );
}
