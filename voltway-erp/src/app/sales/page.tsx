import Header from '@/components/layout/Header';
import { salesOrders } from '@/lib/data';

export default function SalesPage() {
    const ordersByType = {
        webshop: salesOrders.filter(o => o.order_type === 'webshop').length,
        fleet_framework: salesOrders.filter(o => o.order_type === 'fleet_framework').length,
        fleet_spot: salesOrders.filter(o => o.order_type === 'fleet_spot').length,
    };

    const totalQuantity = salesOrders.reduce((sum, o) => sum + o.quantity, 0);

    const typeStyles: Record<string, { bg: string; text: string }> = {
        webshop: { bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-700 dark:text-slate-300' },
        fleet_framework: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-400' },
        fleet_spot: { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-400' },
    };

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
                <div className="flex items-center gap-4">
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 material-symbols-outlined text-[20px]">search</span>
                        <input
                            className="pl-10 pr-4 py-2 bg-white dark:bg-[#262626] border border-gray-200 dark:border-[#404040] rounded text-sm w-80 focus:ring-2 focus:ring-[#595959]/20 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none"
                            placeholder="Search sales orders..."
                            type="text"
                        />
                    </div>
                    <select className="px-3 py-2 bg-white dark:bg-[#262626] border border-gray-200 dark:border-[#404040] rounded text-sm text-slate-900 dark:text-white">
                        <option>All Models</option>
                        <option>S1</option>
                        <option>S2</option>
                        <option>S3</option>
                    </select>
                    <select className="px-3 py-2 bg-white dark:bg-[#262626] border border-gray-200 dark:border-[#404040] rounded text-sm text-slate-900 dark:text-white">
                        <option>All Versions</option>
                        <option>V1</option>
                        <option>V2</option>
                    </select>
                    <select className="px-3 py-2 bg-white dark:bg-[#262626] border border-gray-200 dark:border-[#404040] rounded text-sm text-slate-900 dark:text-white">
                        <option>All Types</option>
                        <option>Webshop</option>
                        <option>Fleet Framework</option>
                        <option>Fleet Spot</option>
                    </select>
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
                                    <th className="px-5 py-3 font-medium text-xs uppercase tracking-wider">Created</th>
                                    <th className="px-5 py-3 font-medium text-xs uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-[#404040]">
                                {salesOrders.map((order) => (
                                    <tr key={order.sales_order_id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
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
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${typeStyles[order.order_type].bg} ${typeStyles[order.order_type].text}`}>
                                                {order.order_type === 'webshop' ? 'Webshop' :
                                                    order.order_type === 'fleet_framework' ? 'Fleet Framework' : 'Fleet Spot'}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4 text-slate-600 dark:text-slate-400">{order.requested_date}</td>
                                        <td className="px-5 py-4 text-slate-500 text-xs">{order.created_at}</td>
                                        <td className="px-5 py-4">
                                            <button className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors">
                                                <span className="material-symbols-outlined text-[18px]">visibility</span>
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
