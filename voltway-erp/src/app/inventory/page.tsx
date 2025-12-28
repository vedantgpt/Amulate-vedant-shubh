import Header from '@/components/layout/Header';
import { stockLevels, dispatchParameters, getStockStatus } from '@/lib/data';

export default function InventoryPage() {
    // Calculate stock health for each item
    const inventoryData = stockLevels.map(stock => {
        const dispatch = dispatchParameters.find(d => d.part_id === stock.part_id);
        const status = getStockStatus(stock.part_id);
        const minStock = dispatch?.min_stock_level || 0;
        const reorderQty = dispatch?.reorder_quantity || 0;

        return {
            ...stock,
            min_stock: minStock,
            reorder_quantity: reorderQty,
            status,
            percentage: minStock > 0 ? Math.min(100, Math.round((stock.quantity_available / minStock) * 100)) : 100
        };
    });

    const statusCounts = {
        healthy: inventoryData.filter(i => i.status === 'healthy').length,
        low: inventoryData.filter(i => i.status === 'low').length,
        critical: inventoryData.filter(i => i.status === 'critical').length,
    };

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
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 material-symbols-outlined text-[20px]">search</span>
                        <input
                            className="pl-10 pr-4 py-2 bg-white dark:bg-[#262626] border border-gray-200 dark:border-[#404040] rounded text-sm w-80 focus:ring-2 focus:ring-[#595959]/20 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none"
                            placeholder="Search inventory..."
                            type="text"
                        />
                    </div>
                    <select className="px-3 py-2 bg-white dark:bg-[#262626] border border-gray-200 dark:border-[#404040] rounded text-sm text-slate-900 dark:text-white">
                        <option>All Locations</option>
                        <option>WH1</option>
                        <option>WH2</option>
                        <option>WH3</option>
                    </select>
                    <select className="px-3 py-2 bg-white dark:bg-[#262626] border border-gray-200 dark:border-[#404040] rounded text-sm text-slate-900 dark:text-white">
                        <option>All Status</option>
                        <option>Healthy</option>
                        <option>Low</option>
                        <option>Critical</option>
                    </select>
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
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-[#404040]">
                                {inventoryData.map((item) => (
                                    <tr key={item.part_id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
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
