import Header from '@/components/layout/Header';
import { materials } from '@/lib/data';

export default function MaterialsPage() {
    return (
        <>
            <Header title="Material Master" />
            <div className="p-8 max-w-[1600px] w-full mx-auto space-y-6">
                {/* Header Actions */}
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 material-symbols-outlined text-[20px]">search</span>
                            <input
                                className="pl-10 pr-4 py-2 bg-white dark:bg-[#262626] border border-gray-200 dark:border-[#404040] rounded text-sm w-80 focus:ring-2 focus:ring-[#595959]/20 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none"
                                placeholder="Search parts by ID, name..."
                                type="text"
                            />
                        </div>
                        <select className="px-3 py-2 bg-white dark:bg-[#262626] border border-gray-200 dark:border-[#404040] rounded text-sm text-slate-900 dark:text-white">
                            <option>All Types</option>
                            <option>Assembly</option>
                            <option>Service</option>
                            <option>Component</option>
                        </select>
                        <select className="px-3 py-2 bg-white dark:bg-[#262626] border border-gray-200 dark:border-[#404040] rounded text-sm text-slate-900 dark:text-white">
                            <option>All Models</option>
                            <option>S1_V1</option>
                            <option>S1_V2</option>
                            <option>S2_V1</option>
                            <option>S2_V2</option>
                            <option>S3_V1</option>
                            <option>S3_V2</option>
                        </select>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-[#595959] text-white rounded font-medium text-sm hover:bg-slate-700 transition-colors">
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
                                {materials.map((material) => {
                                    const isBlocked = material.blocked_parts === 'Blocked';
                                    const hasSuccessor = material.successor_parts !== '';

                                    return (
                                        <tr key={material.part_id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
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
                                                    {material.part_type.charAt(0).toUpperCase() + material.part_type.slice(1)}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4 text-slate-600 dark:text-slate-400">
                                                <div className="flex flex-wrap gap-1">
                                                    {material.used_in_models.slice(0, 3).map((model, idx) => (
                                                        <span key={idx} className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-xs">
                                                            {model}
                                                        </span>
                                                    ))}
                                                    {material.used_in_models.length > 3 && (
                                                        <span className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-xs">
                                                            +{material.used_in_models.length - 3}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-5 py-4 text-slate-600 dark:text-slate-400">{material.weight.toFixed(2)}</td>
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
                                                    <button className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors">
                                                        <span className="material-symbols-outlined text-[18px]">edit</span>
                                                    </button>
                                                    <button className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors">
                                                        <span className="material-symbols-outlined text-[18px]">visibility</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                    {/* Pagination */}
                    <div className="px-5 py-4 border-t border-gray-200 dark:border-[#404040] flex justify-between items-center">
                        <p className="text-sm text-slate-500">Showing {materials.length} of {materials.length} parts</p>
                        <div className="flex items-center gap-2">
                            <button className="px-3 py-1.5 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors disabled:opacity-50" disabled>
                                Previous
                            </button>
                            <button className="px-3 py-1.5 text-sm bg-[#595959] text-white rounded">1</button>
                            <button className="px-3 py-1.5 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors disabled:opacity-50" disabled>
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
