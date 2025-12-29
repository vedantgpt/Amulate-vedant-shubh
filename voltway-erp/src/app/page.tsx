'use client';

import Header from '@/components/layout/Header';
import { useMaterials, useStockLevels, useDispatchParameters, useMaterialOrders, useSalesOrders } from '@/lib/useFirestore';
import Link from 'next/link';

export default function Dashboard() {
  const { data: materials, loading: loadingMaterials } = useMaterials();
  const { data: stockLevels, loading: loadingStock } = useStockLevels();
  const { data: dispatchParameters, loading: loadingDispatch } = useDispatchParameters();
  const { data: materialOrders, loading: loadingOrders } = useMaterialOrders();
  const { data: salesOrders, loading: loadingSales } = useSalesOrders();

  const loading = loadingMaterials || loadingStock || loadingDispatch || loadingOrders || loadingSales;

  // Calculate KPIs
  const getStockStatus = (partId: string) => {
    const stock = stockLevels.find((s: any) => s.part_id === partId);
    const dispatch = dispatchParameters.find((d: any) => d.part_id === partId);
    if (!stock || !dispatch) return 'healthy';
    if (stock.quantity_available <= dispatch.min_stock_level * 0.5) return 'critical';
    if (stock.quantity_available <= dispatch.min_stock_level) return 'low';
    return 'healthy';
  };

  const criticalItems = stockLevels.filter((s: any) => getStockStatus(s.part_id) === 'critical');
  const lowItems = stockLevels.filter((s: any) => getStockStatus(s.part_id) === 'low');
  const activeStockouts = criticalItems.length + lowItems.length;

  const inProgressOrders = materialOrders.filter((o: any) => o.status === 'ordered').length;
  const deliveredOrders = materialOrders.filter((o: any) => o.status === 'delivered').length;
  const onTimeRate = materialOrders.length > 0 ? Math.round((deliveredOrders / Math.max(materialOrders.length, 1)) * 100) : 95;

  const totalSalesQty = salesOrders.reduce((sum: number, o: any) => sum + (o.quantity || 0), 0);

  // Model production data
  const modelProduction = [
    { model: 'Voltway S1 V2', target: 150, current: 127, color: 'bg-green-500' },
    { model: 'Voltway S2 V2', target: 100, current: 89, color: 'bg-blue-500' },
    { model: 'Voltway S3 V2', target: 80, current: 72, color: 'bg-amber-500' },
  ];

  // Shipments sample data
  const shipments = [
    { id: 'SH-4092', supplier: 'Alpha Electronics', parts: 'P304, P305', eta: 'Today', status: 'In Transit' },
    { id: 'SH-4093', supplier: 'Beta Motors', parts: 'P329, P330', eta: 'Tomorrow', status: 'Customs' },
    { id: 'SH-4094', supplier: 'Gamma Parts', parts: 'P307', eta: 'Dec 31', status: 'Shipped' },
  ];

  if (loading) {
    return (
      <>
        <Header title="Executive Operations Dashboard" />
        <div className="p-8 flex items-center justify-center min-h-[400px]">
          <div className="text-slate-500">Loading dashboard data...</div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header title="Executive Operations Dashboard" />
      <div className="p-8 max-w-[1600px] w-full mx-auto space-y-6">
        {/* KPI Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Daily Build Rate */}
          <div className="bg-white dark:bg-[#262626] rounded border border-gray-200 dark:border-[#404040] p-5">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Daily Build Rate</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">142</p>
              </div>
              <span className="material-symbols-outlined text-[#595959] p-2 bg-slate-100 dark:bg-slate-800 rounded">precision_manufacturing</span>
            </div>
            <div className="flex items-center gap-1 mt-2">
              <span className="material-symbols-outlined text-green-500 text-[16px]">trending_up</span>
              <span className="text-green-600 dark:text-green-400 text-sm font-medium">+5%</span>
              <span className="text-xs text-slate-400 ml-1">vs yesterday</span>
            </div>
          </div>

          {/* Active Stockouts */}
          <div className="bg-white dark:bg-[#262626] rounded border border-l-4 border-l-red-500 border-y-gray-200 border-r-gray-200 dark:border-y-[#404040] dark:border-r-[#404040] p-5">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Active Stockouts</p>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400 mt-1">{activeStockouts}</p>
              </div>
              <span className="material-symbols-outlined text-red-500 p-2 bg-red-50 dark:bg-red-900/20 rounded">warning</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">{criticalItems.length} critical, {lowItems.length} low</p>
          </div>

          {/* On-Time Delivery */}
          <div className="bg-white dark:bg-[#262626] rounded border border-gray-200 dark:border-[#404040] p-5">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">On-Time Delivery</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">94.5%</p>
              </div>
              <span className="material-symbols-outlined text-[#595959] p-2 bg-slate-100 dark:bg-slate-800 rounded">local_shipping</span>
            </div>
            <div className="flex items-center gap-1 mt-2">
              <span className="material-symbols-outlined text-amber-500 text-[16px]">trending_down</span>
              <span className="text-amber-600 dark:text-amber-400 text-sm font-medium">-2.1%</span>
            </div>
          </div>

          {/* Sales Orders */}
          <div className="bg-white dark:bg-[#262626] rounded border border-gray-200 dark:border-[#404040] p-5">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Total Sales Units</p>
                <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{totalSalesQty.toLocaleString()}</p>
              </div>
              <span className="material-symbols-outlined text-green-600 p-2 bg-green-50 dark:bg-green-900/20 rounded">point_of_sale</span>
            </div>
            <p className="text-xs text-slate-500 mt-2">{salesOrders.length} orders</p>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - 2/3 width */}
          <div className="lg:col-span-2 space-y-6">
            {/* Production Capacity */}
            <div className="bg-white dark:bg-[#262626] rounded border border-gray-200 dark:border-[#404040] shadow-sm">
              <div className="px-5 py-4 border-b border-gray-200 dark:border-[#404040] flex justify-between items-center">
                <h3 className="text-sm font-bold uppercase tracking-wide text-slate-800 dark:text-slate-200">Production Capacity</h3>
                <span className="text-xs text-slate-400">Today&apos;s Progress</span>
              </div>
              <div className="p-5 space-y-4">
                {modelProduction.map((mp) => (
                  <div key={mp.model}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-slate-900 dark:text-white">{mp.model}</span>
                      <span className="text-slate-500">{mp.current}/{mp.target} units</span>
                    </div>
                    <div className="h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${mp.color}`}
                        style={{ width: `${(mp.current / mp.target) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Incoming Logistics */}
            <div className="bg-white dark:bg-[#262626] rounded border border-gray-200 dark:border-[#404040] shadow-sm">
              <div className="px-5 py-4 border-b border-gray-200 dark:border-[#404040] flex justify-between items-center">
                <h3 className="text-sm font-bold uppercase tracking-wide text-slate-800 dark:text-slate-200">Incoming Logistics</h3>
                <Link href="/procurement" className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline">View All</Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400">
                    <tr>
                      <th className="px-5 py-2 text-left font-medium text-xs uppercase">Shipment</th>
                      <th className="px-5 py-2 text-left font-medium text-xs uppercase">Supplier</th>
                      <th className="px-5 py-2 text-left font-medium text-xs uppercase">Parts</th>
                      <th className="px-5 py-2 text-left font-medium text-xs uppercase">ETA</th>
                      <th className="px-5 py-2 text-left font-medium text-xs uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-[#404040]">
                    {shipments.map((s) => (
                      <tr key={s.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30">
                        <td className="px-5 py-3 font-mono text-slate-900 dark:text-white">{s.id}</td>
                        <td className="px-5 py-3 text-slate-600 dark:text-slate-400">{s.supplier}</td>
                        <td className="px-5 py-3 text-slate-600 dark:text-slate-400">{s.parts}</td>
                        <td className="px-5 py-3 font-medium text-slate-900 dark:text-white">{s.eta}</td>
                        <td className="px-5 py-3">
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${s.status === 'In Transit' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                              s.status === 'Customs' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                                'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
                            }`}>
                            {s.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right Column - 1/3 width */}
          <div className="space-y-6">
            {/* Critical Alerts */}
            <div className="bg-white dark:bg-[#262626] rounded border border-gray-200 dark:border-[#404040] shadow-sm">
              <div className="px-5 py-4 border-b border-gray-200 dark:border-[#404040] flex justify-between items-center">
                <h3 className="text-sm font-bold uppercase tracking-wide text-slate-800 dark:text-slate-200">Critical Alerts</h3>
                <span className="px-2 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded text-xs font-bold">
                  {criticalItems.length + lowItems.length}
                </span>
              </div>
              <div className="p-4 space-y-3 max-h-80 overflow-y-auto">
                {[...criticalItems, ...lowItems].slice(0, 5).map((item: any) => (
                  <div key={item.part_id} className="bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded p-3">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-red-500 text-[18px]">warning</span>
                      <span className="font-medium text-red-800 dark:text-red-300 text-sm">Low Stock: {item.part_id}</span>
                    </div>
                    <p className="text-xs text-red-600 dark:text-red-400 mt-1 ml-6">
                      {item.part_name?.slice(0, 35)}... - Only {item.quantity_available} left
                    </p>
                    <div className="flex gap-2 mt-2 ml-6">
                      <Link href="/procurement" className="text-xs text-red-700 dark:text-red-400 hover:underline">Order Now</Link>
                    </div>
                  </div>
                ))}
                {criticalItems.length + lowItems.length === 0 && (
                  <p className="text-center text-slate-500 py-4">No critical alerts</p>
                )}
              </div>
            </div>

            {/* System Status */}
            <div className="bg-white dark:bg-[#262626] rounded border border-gray-200 dark:border-[#404040] shadow-sm p-5">
              <h3 className="text-sm font-bold uppercase tracking-wide text-slate-800 dark:text-slate-200 mb-4">System Status</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="size-2 bg-green-500 rounded-full"></span>
                    <span className="text-sm text-slate-600 dark:text-slate-400">Firebase Sync</span>
                  </div>
                  <span className="text-xs text-green-600 dark:text-green-400">Connected</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="size-2 bg-green-500 rounded-full"></span>
                    <span className="text-sm text-slate-600 dark:text-slate-400">Firestore</span>
                  </div>
                  <span className="text-xs text-green-600 dark:text-green-400">Online</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="size-2 bg-green-500 rounded-full"></span>
                    <span className="text-sm text-slate-600 dark:text-slate-400">Real-time Updates</span>
                  </div>
                  <span className="text-xs text-green-600 dark:text-green-400">Active</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="bg-white dark:bg-[#262626] rounded border border-gray-200 dark:border-[#404040] shadow-sm p-5">
              <h3 className="text-sm font-bold uppercase tracking-wide text-slate-800 dark:text-slate-200 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 gap-2">
                <Link href="/admin" className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-800 rounded hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                  <span className="material-symbols-outlined text-[#595959]">database</span>
                  <span className="text-sm text-slate-700 dark:text-slate-300">Seed DB</span>
                </Link>
                <Link href="/procurement" className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-800 rounded hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                  <span className="material-symbols-outlined text-[#595959]">add_shopping_cart</span>
                  <span className="text-sm text-slate-700 dark:text-slate-300">New Order</span>
                </Link>
                <Link href="/inventory" className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-800 rounded hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                  <span className="material-symbols-outlined text-[#595959]">inventory_2</span>
                  <span className="text-sm text-slate-700 dark:text-slate-300">Inventory</span>
                </Link>
                <Link href="/hugo" className="flex items-center gap-2 p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-colors">
                  <span className="material-symbols-outlined text-indigo-600">smart_toy</span>
                  <span className="text-sm text-indigo-700 dark:text-indigo-400">Hugo AI</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
