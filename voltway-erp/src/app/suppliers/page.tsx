import Header from '@/components/layout/Header';
import { suppliers } from '@/lib/data';

export default function SuppliersPage() {
    // Group suppliers by supplier_id
    const supplierGroups = suppliers.reduce((acc, s) => {
        if (!acc[s.supplier_id]) {
            acc[s.supplier_id] = [];
        }
        acc[s.supplier_id].push(s);
        return acc;
    }, {} as Record<string, typeof suppliers>);

    // Calculate averages for each supplier
    const supplierStats = Object.entries(supplierGroups).map(([id, items]) => ({
        id,
        partsCount: items.length,
        avgReliability: items.reduce((sum, i) => sum + i.reliability_rating, 0) / items.length,
        avgLeadTime: Math.round(items.reduce((sum, i) => sum + i.lead_time_days, 0) / items.length),
        avgPrice: items.reduce((sum, i) => sum + i.price_per_unit, 0) / items.length,
    }));

    return (
        <>
            <Header title="Suppliers" />
            <div className="p-8 max-w-[1600px] w-full mx-auto space-y-6">
                {/* Supplier Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {supplierStats.map((supplier) => (
                        <div key={supplier.id} className="bg-white dark:bg-[#262626] rounded border border-gray-200 dark:border-[#404040] shadow-sm overflow-hidden">
                            <div className="p-5 border-b border-gray-200 dark:border-[#404040]">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">{supplier.id}</h3>
                                        <p className="text-sm text-slate-500">{supplier.partsCount} parts supplied</p>
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
                            <div className="px-5 py-3 bg-slate-50 dark:bg-slate-800/50 border-t border-gray-200 dark:border-[#404040]">
                                <button className="text-sm text-[#595959] dark:text-slate-300 hover:underline font-medium">
                                    View All Parts →
                                </button>
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
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-[#404040]">
                                {suppliers.map((supplier, idx) => (
                                    <tr key={`${supplier.supplier_id}-${supplier.part_id}-${idx}`} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                        <td className="px-5 py-4">
                                            <span className="px-2 py-1 bg-[#595959]/10 dark:bg-[#595959]/20 text-[#595959] dark:text-slate-300 rounded text-sm font-semibold">
                                                {supplier.supplier_id}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 font-mono text-slate-900 dark:text-white">{supplier.part_id}</td>
                                        <td className="px-5 py-4 font-semibold text-slate-900 dark:text-white">${supplier.price_per_unit.toFixed(2)}</td>
                                        <td className="px-5 py-4 text-slate-600 dark:text-slate-400">{supplier.lead_time_days} days</td>
                                        <td className="px-5 py-4 text-slate-600 dark:text-slate-400">{supplier.min_order_qty}</td>
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-16 h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                    <div
                                                        className={`h-full rounded-full ${supplier.reliability_rating >= 0.85 ? 'bg-green-500' :
                                                                supplier.reliability_rating >= 0.7 ? 'bg-amber-500' : 'bg-red-500'
                                                            }`}
                                                        style={{ width: `${supplier.reliability_rating * 100}%` }}
                                                    />
                                                </div>
                                                <span className="text-xs text-slate-500">{(supplier.reliability_rating * 100).toFixed(0)}%</span>
                                            </div>
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
