import Header from '@/components/layout/Header';
import { dispatchParameters, stockLevels } from '@/lib/data';

export default function DispatchPage() {
    const data = dispatchParameters.map(dp => {
        const stock = stockLevels.find(s => s.part_id === dp.part_id);
        const needsReorder = stock && stock.quantity_available <= dp.min_stock_level;

        return {
            ...dp,
            part_name: stock?.part_name || 'Unknown',
            current_stock: stock?.quantity_available || 0,
            needs_reorder: needsReorder,
        };
    });

    return (
        <>
            <Header title="Dispatch Parameters" />
            <div className="p-8 max-w-[1600px] w-full mx-auto space-y-6">
                {/* Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white dark:bg-[#262626] rounded border border-gray-200 dark:border-[#404040] p-5">
                        <p className="text-sm text-slate-500 dark:text-slate-400">Total SKUs Configured</p>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{data.length}</p>
                    </div>
                    <div className="bg-white dark:bg-[#262626] rounded border border-l-4 border-l-amber-500 border-y-gray-200 border-r-gray-200 dark:border-y-[#404040] dark:border-r-[#404040] p-5">
                        <p className="text-sm text-slate-500 dark:text-slate-400">Need Reorder</p>
                        <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">{data.filter(d => d.needs_reorder).length}</p>
                    </div>
                    <div className="bg-white dark:bg-[#262626] rounded border border-gray-200 dark:border-[#404040] p-5">
                        <p className="text-sm text-slate-500 dark:text-slate-400">Avg Reorder Interval</p>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">
                            {Math.round(data.reduce((sum, d) => sum + d.reorder_interval_days, 0) / data.length)} days
                        </p>
                    </div>
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
                                    <th className="px-5 py-3 font-medium text-xs uppercase tracking-wider">Min Stock Level</th>
                                    <th className="px-5 py-3 font-medium text-xs uppercase tracking-wider">Reorder Qty</th>
                                    <th className="px-5 py-3 font-medium text-xs uppercase tracking-wider">Interval (Days)</th>
                                    <th className="px-5 py-3 font-medium text-xs uppercase tracking-wider">Status</th>
                                    <th className="px-5 py-3 font-medium text-xs uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-[#404040]">
                                {data.map((item) => (
                                    <tr key={item.part_id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                        <td className="px-5 py-4 font-mono text-slate-900 dark:text-white font-medium">{item.part_id}</td>
                                        <td className="px-5 py-4 text-slate-900 dark:text-white">{item.part_name.slice(0, 35)}...</td>
                                        <td className="px-5 py-4 font-semibold text-slate-900 dark:text-white">{item.current_stock}</td>
                                        <td className="px-5 py-4 text-slate-600 dark:text-slate-400">{item.min_stock_level}</td>
                                        <td className="px-5 py-4 text-slate-600 dark:text-slate-400">{item.reorder_quantity}</td>
                                        <td className="px-5 py-4 text-slate-600 dark:text-slate-400">{item.reorder_interval_days}</td>
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
                                            <button className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors">
                                                <span className="material-symbols-outlined text-[18px]">edit</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}
