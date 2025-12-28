import Header from '@/components/layout/Header';
import { materialOrders, getMaterial } from '@/lib/data';

export default function ProcurementPage() {
    const orderedCount = materialOrders.filter(o => o.status === 'ordered').length;
    const deliveredCount = materialOrders.filter(o => o.status === 'delivered').length;

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
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 material-symbols-outlined text-[20px]">search</span>
                            <input
                                className="pl-10 pr-4 py-2 bg-white dark:bg-[#262626] border border-gray-200 dark:border-[#404040] rounded text-sm w-80 focus:ring-2 focus:ring-[#595959]/20 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none"
                                placeholder="Search orders..."
                                type="text"
                            />
                        </div>
                        <select className="px-3 py-2 bg-white dark:bg-[#262626] border border-gray-200 dark:border-[#404040] rounded text-sm text-slate-900 dark:text-white">
                            <option>All Status</option>
                            <option>Ordered</option>
                            <option>Delivered</option>
                        </select>
                        <select className="px-3 py-2 bg-white dark:bg-[#262626] border border-gray-200 dark:border-[#404040] rounded text-sm text-slate-900 dark:text-white">
                            <option>All Suppliers</option>
                            <option>SupA</option>
                            <option>SupB</option>
                            <option>SupC</option>
                        </select>
                    </div>
                    <button className="flex items-center gap-2 px-4 py-2 bg-[#595959] text-white rounded font-medium text-sm hover:bg-slate-700 transition-colors">
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
                                {materialOrders.map((order) => {
                                    const material = getMaterial(order.part_id);
                                    const isLate = order.status === 'delivered' && order.actual_delivered_at &&
                                        new Date(order.actual_delivered_at) > new Date(order.expected_delivery_date);

                                    return (
                                        <tr key={order.order_id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                            <td className="px-5 py-4 font-mono text-slate-900 dark:text-white font-medium">{order.order_id}</td>
                                            <td className="px-5 py-4">
                                                <div className="flex flex-col">
                                                    <span className="text-slate-900 dark:text-white">{order.part_id}</span>
                                                    <span className="text-xs text-slate-500">{material?.part_name.slice(0, 30)}...</span>
                                                </div>
                                            </td>
                                            <td className="px-5 py-4 font-semibold text-slate-900 dark:text-white">{order.quantity_ordered}</td>
                                            <td className="px-5 py-4">
                                                <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded text-xs font-medium">
                                                    {order.supplier_id}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4 text-slate-600 dark:text-slate-400">{order.order_date}</td>
                                            <td className="px-5 py-4 text-slate-600 dark:text-slate-400">
                                                <div className="flex flex-col">
                                                    <span>{order.expected_delivery_date}</span>
                                                    {order.actual_delivered_at && (
                                                        <span className={`text-xs ${isLate ? 'text-red-500' : 'text-green-500'}`}>
                                                            Actual: {order.actual_delivered_at}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-5 py-4">
                                                <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium ${order.status === 'ordered'
                                                        ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300'
                                                        : 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300'
                                                    }`}>
                                                    <span className={`size-1.5 rounded-full ${order.status === 'ordered' ? 'bg-blue-500' : 'bg-green-500'}`}></span>
                                                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                                </span>
                                            </td>
                                            <td className="px-5 py-4">
                                                <div className="flex items-center gap-2">
                                                    <button className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors">
                                                        <span className="material-symbols-outlined text-[18px]">visibility</span>
                                                    </button>
                                                    {order.status === 'ordered' && (
                                                        <button className="p-1.5 text-slate-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded transition-colors">
                                                            <span className="material-symbols-outlined text-[18px]">check_circle</span>
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}
