'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Modal, { ConfirmDialog } from '@/components/ui/Modal';
import { useMaterials, addDocument, updateDocument, deleteDocument } from '@/lib/useFirestore';

interface Material {
    id?: string;
    part_id: string;
    part_name: string;
    part_type: 'assembly' | 'service' | 'component';
    used_in_models: string[];
    weight: number;
    blocked_parts: string;
    successor_parts: string;
    comment: string;
}

const emptyMaterial: Material = {
    part_id: '',
    part_name: '',
    part_type: 'assembly',
    used_in_models: [],
    weight: 0,
    blocked_parts: '',
    successor_parts: '',
    comment: '',
};

export default function MaterialsPage() {
    const { data: materials, loading, error } = useMaterials();
    const [searchTerm, setSearchTerm] = useState('');
    const [typeFilter, setTypeFilter] = useState('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [currentMaterial, setCurrentMaterial] = useState<Material>(emptyMaterial);
    const [isEditing, setIsEditing] = useState(false);
    const [saving, setSaving] = useState(false);

    // Filter materials
    const filteredMaterials = materials.filter((m: any) => {
        const matchesSearch = m.part_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            m.part_name?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesType = typeFilter === 'all' || m.part_type === typeFilter;
        return matchesSearch && matchesType;
    });

    const openAddModal = () => {
        setCurrentMaterial(emptyMaterial);
        setIsEditing(false);
        setIsModalOpen(true);
    };

    const openEditModal = (material: Material) => {
        setCurrentMaterial(material);
        setIsEditing(true);
        setIsModalOpen(true);
    };

    const openDeleteDialog = (material: Material) => {
        setCurrentMaterial(material);
        setIsDeleteOpen(true);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const materialData = {
                part_id: currentMaterial.part_id,
                part_name: currentMaterial.part_name,
                part_type: currentMaterial.part_type,
                used_in_models: currentMaterial.used_in_models,
                weight: Number(currentMaterial.weight),
                blocked_parts: currentMaterial.blocked_parts,
                successor_parts: currentMaterial.successor_parts,
                comment: currentMaterial.comment,
            };

            if (isEditing && currentMaterial.id) {
                await updateDocument('materials', currentMaterial.id, materialData);
            } else {
                await addDocument('materials', materialData);
            }
            setIsModalOpen(false);
        } catch (err) {
            console.error('Error saving material:', err);
            alert('Error saving material');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (currentMaterial.id) {
            try {
                await deleteDocument('materials', currentMaterial.id);
            } catch (err) {
                console.error('Error deleting material:', err);
                alert('Error deleting material');
            }
        }
    };

    const handleModelsChange = (value: string) => {
        const models = value.split(',').map(m => m.trim()).filter(m => m);
        setCurrentMaterial(prev => ({ ...prev, used_in_models: models }));
    };

    if (loading) {
        return (
            <>
                <Header title="Material Master" />
                <div className="p-8 flex items-center justify-center">
                    <div className="text-slate-500">Loading materials...</div>
                </div>
            </>
        );
    }

    if (error) {
        return (
            <>
                <Header title="Material Master" />
                <div className="p-8">
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded p-4 text-red-700 dark:text-red-400">
                        Error loading materials. Make sure Firebase is configured and Firestore rules allow access.
                        <br /><br />
                        <a href="/admin" className="underline">Go to Admin to seed database</a>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Header title="Material Master" />
            <div className="p-8 max-w-[1600px] w-full mx-auto space-y-6">
                {/* Header Actions */}
                <div className="flex justify-between items-center flex-wrap gap-4">
                    <div className="flex items-center gap-4 flex-wrap">
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 material-symbols-outlined text-[20px]">search</span>
                            <input
                                className="pl-10 pr-4 py-2 bg-white dark:bg-[#262626] border border-gray-200 dark:border-[#404040] rounded text-sm w-80 focus:ring-2 focus:ring-[#595959]/20 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none"
                                placeholder="Search parts by ID, name..."
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <select
                            className="px-3 py-2 bg-white dark:bg-[#262626] border border-gray-200 dark:border-[#404040] rounded text-sm text-slate-900 dark:text-white"
                            value={typeFilter}
                            onChange={(e) => setTypeFilter(e.target.value)}
                        >
                            <option value="all">All Types</option>
                            <option value="assembly">Assembly</option>
                            <option value="service">Service</option>
                            <option value="component">Component</option>
                        </select>
                    </div>
                    <button
                        onClick={openAddModal}
                        className="flex items-center gap-2 px-4 py-2 bg-[#595959] text-white rounded font-medium text-sm hover:bg-slate-700 transition-colors"
                    >
                        <span className="material-symbols-outlined text-[18px]">add</span>
                        Add Part
                    </button>
                </div>

                {/* Materials Table */}
                <div className="bg-white dark:bg-[#262626] rounded border border-gray-200 dark:border-[#404040] shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 border-b border-gray-200 dark:border-[#404040]">
                                <tr>
                                    <th className="px-5 py-3 font-medium text-xs uppercase tracking-wider">Part ID</th>
                                    <th className="px-5 py-3 font-medium text-xs uppercase tracking-wider">Part Name</th>
                                    <th className="px-5 py-3 font-medium text-xs uppercase tracking-wider">Type</th>
                                    <th className="px-5 py-3 font-medium text-xs uppercase tracking-wider">Used In Models</th>
                                    <th className="px-5 py-3 font-medium text-xs uppercase tracking-wider">Weight (kg)</th>
                                    <th className="px-5 py-3 font-medium text-xs uppercase tracking-wider">Status</th>
                                    <th className="px-5 py-3 font-medium text-xs uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-[#404040]">
                                {filteredMaterials.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-5 py-8 text-center text-slate-500">
                                            No materials found. <a href="/admin" className="text-indigo-600 underline">Seed the database</a> to add sample data.
                                        </td>
                                    </tr>
                                ) : (
                                    filteredMaterials.map((material: any) => {
                                        const isBlocked = material.blocked_parts === 'Blocked';
                                        const hasSuccessor = material.successor_parts !== '';

                                        return (
                                            <tr key={material.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                                <td className="px-5 py-4 font-mono text-slate-900 dark:text-white font-medium">{material.part_id}</td>
                                                <td className="px-5 py-4">
                                                    <div className="flex flex-col">
                                                        <span className="text-slate-900 dark:text-white">{material.part_name}</span>
                                                        {material.comment && (
                                                            <span className="text-xs text-slate-500">{material.comment}</span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-5 py-4">
                                                    <span className={`px-2 py-1 rounded text-xs font-medium ${material.part_type === 'assembly'
                                                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                                            : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
                                                        }`}>
                                                        {material.part_type?.charAt(0).toUpperCase() + material.part_type?.slice(1)}
                                                    </span>
                                                </td>
                                                <td className="px-5 py-4 text-slate-600 dark:text-slate-400">
                                                    <div className="flex flex-wrap gap-1">
                                                        {material.used_in_models?.slice(0, 3).map((model: string, idx: number) => (
                                                            <span key={idx} className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-xs">
                                                                {model}
                                                            </span>
                                                        ))}
                                                        {(material.used_in_models?.length || 0) > 3 && (
                                                            <span className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-xs">
                                                                +{material.used_in_models.length - 3}
                                                            </span>
                                                        )}
                                                    </div>
                                                </td>
                                                <td className="px-5 py-4 text-slate-600 dark:text-slate-400">{material.weight?.toFixed(2)}</td>
                                                <td className="px-5 py-4">
                                                    {isBlocked ? (
                                                        <span className="px-2 py-1 rounded text-xs font-bold bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
                                                            Blocked
                                                        </span>
                                                    ) : hasSuccessor ? (
                                                        <span className="px-2 py-1 rounded text-xs font-bold bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                                                            Obsolete → {material.successor_parts}
                                                        </span>
                                                    ) : (
                                                        <span className="px-2 py-1 rounded text-xs font-bold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                                            Active
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-5 py-4">
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => openEditModal(material)}
                                                            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
                                                        >
                                                            <span className="material-symbols-outlined text-[18px]">edit</span>
                                                        </button>
                                                        <button
                                                            onClick={() => openDeleteDialog(material)}
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
                    {/* Footer */}
                    <div className="px-5 py-4 border-t border-gray-200 dark:border-[#404040] flex justify-between items-center">
                        <p className="text-sm text-slate-500">Showing {filteredMaterials.length} of {materials.length} parts</p>
                    </div>
                </div>
            </div>

            {/* Add/Edit Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={isEditing ? 'Edit Material' : 'Add New Material'}
                maxWidth="max-w-xl"
            >
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Part ID</label>
                            <input
                                type="text"
                                value={currentMaterial.part_id}
                                onChange={(e) => setCurrentMaterial(prev => ({ ...prev, part_id: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-200 dark:border-[#404040] rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                                placeholder="P300"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Type</label>
                            <select
                                value={currentMaterial.part_type}
                                onChange={(e) => setCurrentMaterial(prev => ({ ...prev, part_type: e.target.value as any }))}
                                className="w-full px-3 py-2 border border-gray-200 dark:border-[#404040] rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                            >
                                <option value="assembly">Assembly</option>
                                <option value="service">Service</option>
                                <option value="component">Component</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Part Name</label>
                        <input
                            type="text"
                            value={currentMaterial.part_name}
                            onChange={(e) => setCurrentMaterial(prev => ({ ...prev, part_name: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-200 dark:border-[#404040] rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                            placeholder="S1 V2 750W Brushless Motor"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Weight (kg)</label>
                            <input
                                type="number"
                                step="0.01"
                                value={currentMaterial.weight}
                                onChange={(e) => setCurrentMaterial(prev => ({ ...prev, weight: parseFloat(e.target.value) || 0 }))}
                                className="w-full px-3 py-2 border border-gray-200 dark:border-[#404040] rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Used In Models</label>
                            <input
                                type="text"
                                value={currentMaterial.used_in_models?.join(', ')}
                                onChange={(e) => handleModelsChange(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-200 dark:border-[#404040] rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                                placeholder="S1_V2, S2_V2"
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Blocked Status</label>
                            <select
                                value={currentMaterial.blocked_parts}
                                onChange={(e) => setCurrentMaterial(prev => ({ ...prev, blocked_parts: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-200 dark:border-[#404040] rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                            >
                                <option value="">Active</option>
                                <option value="Blocked">Blocked</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Successor Part</label>
                            <input
                                type="text"
                                value={currentMaterial.successor_parts}
                                onChange={(e) => setCurrentMaterial(prev => ({ ...prev, successor_parts: e.target.value }))}
                                className="w-full px-3 py-2 border border-gray-200 dark:border-[#404040] rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                                placeholder="P304"
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Comment</label>
                        <textarea
                            value={currentMaterial.comment}
                            onChange={(e) => setCurrentMaterial(prev => ({ ...prev, comment: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-200 dark:border-[#404040] rounded bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                            rows={2}
                            placeholder="Optional notes about this part"
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
                            disabled={saving || !currentMaterial.part_id || !currentMaterial.part_name}
                            className="px-4 py-2 text-sm font-medium text-white bg-[#595959] hover:bg-slate-700 rounded transition-colors disabled:opacity-50"
                        >
                            {saving ? 'Saving...' : (isEditing ? 'Save Changes' : 'Add Material')}
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Delete Confirmation */}
            <ConfirmDialog
                isOpen={isDeleteOpen}
                onClose={() => setIsDeleteOpen(false)}
                onConfirm={handleDelete}
                title="Delete Material"
                message={`Are you sure you want to delete "${currentMaterial.part_name}"? This action cannot be undone.`}
                confirmText="Delete"
                confirmVariant="danger"
            />
        </>
    );
}
