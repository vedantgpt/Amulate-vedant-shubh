import Header from '@/components/layout/Header';
import { stockLevels, dispatchParameters, materialOrders, salesOrders, getStockStatus } from '@/lib/data';

// KPI Card Component
function KpiCard({
  title,
  value,
  change,
  changeType,
  subtitle,
  icon,
  alert
}: {
  title: string;
  value: string;
  change?: string;
  changeType?: 'up' | 'down';
  subtitle: string;
  icon: string;
  alert?: boolean;
}) {
  return (
    <div className={`bg-white dark:bg-[#262626] rounded border ${alert ? 'border-l-4 border-l-red-500 border-y-gray-200 border-r-gray-200 dark:border-y-[#404040] dark:border-r-[#404040]' : 'border-gray-200 dark:border-[#404040]'} p-5 shadow-sm relative overflow-hidden group`}>
      <div className="flex justify-between items-start mb-2">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
        <span className={`material-symbols-outlined ${alert ? 'text-red-500' : 'text-slate-300 dark:text-slate-600 group-hover:text-[#595959]'} transition-colors`}>
          {icon}
        </span>
      </div>
      <div className="flex items-end gap-2">
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{value}</h3>
        {change && (
          <span className={`text-xs ${changeType === 'up' ? 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20' : 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20'} font-medium mb-1 flex items-center px-1.5 py-0.5 rounded`}>
            <span className="material-symbols-outlined text-[14px]">
              {changeType === 'up' ? 'arrow_upward' : 'arrow_downward'}
            </span>
            {change}
          </span>
        )}
        {alert && (
          <span className="text-xs text-red-600 dark:text-red-400 font-medium mb-1 flex items-center bg-red-50 dark:bg-red-900/20 px-1.5 py-0.5 rounded">
            Critical
          </span>
        )}
      </div>
      <p className="text-xs text-slate-400 mt-2">{subtitle}</p>
    </div>
  );
}

// Production Capacity Component
function ProductionCapacity() {
  const models = [
    { name: 'Voltway S1 V2', variant: 'Premium Range', current: 85, target: 100, status: 'on_track' },
    { name: 'Voltway S2 V2', variant: 'Long Range', current: 42, target: 60, status: 'behind' },
    { name: 'Voltway S3 V2', variant: 'Urban Range', current: 55, target: 60, status: 'on_track' },
  ];

  return (
    <section className="bg-white dark:bg-[#262626] rounded border border-gray-200 dark:border-[#404040] shadow-sm">
      <div className="px-5 py-4 border-b border-gray-200 dark:border-[#404040] flex justify-between items-center">
        <h3 className="text-sm font-bold uppercase tracking-wide text-slate-800 dark:text-slate-200">Production Capacity (Today)</h3>
        <button className="text-xs text-[#595959] hover:underline">View Detailed Schedule</button>
      </div>
      <div className="p-5 flex flex-col gap-6">
        {models.map((model) => (
          <div key={model.name} className="flex flex-col gap-2">
            <div className="flex justify-between items-end">
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-slate-900 dark:text-white">{model.name}</span>
                <span className="text-xs text-slate-500">{model.variant}</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-slate-900 dark:text-white">{model.current}</span>
                <span className="text-sm text-slate-500"> / {model.target} Units</span>
              </div>
            </div>
            <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${model.status === 'on_track' ? 'bg-[#595959]' : 'bg-amber-500'}`}
                style={{ width: `${(model.current / model.target) * 100}%` }}
              />
            </div>
            <div className="flex justify-between items-center">
              <span className={`text-xs font-medium flex items-center gap-1 ${model.status === 'on_track' ? 'text-green-600 dark:text-green-400' : 'text-amber-600 dark:text-amber-400'}`}>
                <span className="material-symbols-outlined text-[14px]">
                  {model.status === 'on_track' ? 'check_circle' : 'schedule'}
                </span>
                {model.status === 'on_track' ? 'On Track' : 'Behind Schedule (-1h)'}
              </span>
              <span className="text-xs text-slate-400">{Math.round((model.current / model.target) * 100)}% Capacity</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// Logistics Table Component
function LogisticsTable() {
  const shipments = [
    { id: '#SHP-4092', supplier: 'Panasonic', contents: 'Battery Cells (20k)', eta: 'Tomorrow, 09:00', status: 'in_transit' },
    { id: '#SHP-3321', supplier: 'Bosch', contents: 'ABS Controllers', eta: 'Dec 30, 14:00', status: 'delayed', delay_reason: 'Customs' },
    { id: '#SHP-4100', supplier: 'Magura', contents: 'Brake Calipers', eta: 'Dec 31, 08:30', status: 'scheduled' },
  ];

  const statusStyles: Record<string, { bg: string; text: string; dot: string }> = {
    in_transit: { bg: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-700 dark:text-blue-300', dot: 'bg-blue-500' },
    delayed: { bg: 'bg-amber-50 dark:bg-amber-900/20', text: 'text-amber-700 dark:text-amber-300', dot: 'bg-amber-500' },
    scheduled: { bg: 'bg-slate-100 dark:bg-slate-800', text: 'text-slate-700 dark:text-slate-300', dot: 'bg-slate-400' },
  };

  return (
    <section className="bg-white dark:bg-[#262626] rounded border border-gray-200 dark:border-[#404040] shadow-sm flex-1">
      <div className="px-5 py-4 border-b border-gray-200 dark:border-[#404040] flex justify-between items-center">
        <h3 className="text-sm font-bold uppercase tracking-wide text-slate-800 dark:text-slate-200">Incoming Logistics (Next 7 Days)</h3>
        <div className="flex gap-2">
          <button className="size-6 flex items-center justify-center rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
            <span className="material-symbols-outlined text-[16px]">chevron_left</span>
          </button>
          <button className="size-6 flex items-center justify-center rounded bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
            <span className="material-symbols-outlined text-[16px]">chevron_right</span>
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 border-b border-gray-200 dark:border-[#404040]">
            <tr>
              <th className="px-5 py-3 font-medium text-xs uppercase tracking-wider">Shipment ID</th>
              <th className="px-5 py-3 font-medium text-xs uppercase tracking-wider">Supplier</th>
              <th className="px-5 py-3 font-medium text-xs uppercase tracking-wider">Contents</th>
              <th className="px-5 py-3 font-medium text-xs uppercase tracking-wider">ETA</th>
              <th className="px-5 py-3 font-medium text-xs uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-[#404040]">
            {shipments.map((shipment) => (
              <tr key={shipment.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                <td className="px-5 py-3 font-mono text-slate-700 dark:text-slate-300">{shipment.id}</td>
                <td className="px-5 py-3 text-slate-900 dark:text-white font-medium">{shipment.supplier}</td>
                <td className="px-5 py-3 text-slate-600 dark:text-slate-400">{shipment.contents}</td>
                <td className="px-5 py-3 text-slate-600 dark:text-slate-400">{shipment.eta}</td>
                <td className="px-5 py-3">
                  <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs font-medium ${statusStyles[shipment.status].bg} ${statusStyles[shipment.status].text}`}>
                    <span className={`size-1.5 rounded-full ${statusStyles[shipment.status].dot}`}></span>
                    {shipment.status === 'in_transit' ? 'In Transit' : shipment.status === 'delayed' ? `Delayed (${shipment.delay_reason})` : 'Scheduled'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

// Critical Alerts Component
function CriticalAlerts() {
  // Calculate low stock items
  const lowStockItems = stockLevels.filter(stock => {
    const dispatch = dispatchParameters.find(d => d.part_id === stock.part_id);
    return dispatch && stock.quantity_available <= dispatch.min_stock_level;
  }).slice(0, 3);

  return (
    <section className="bg-white dark:bg-[#262626] rounded border border-gray-200 dark:border-[#404040] shadow-sm">
      <div className="px-5 py-4 border-b border-gray-200 dark:border-[#404040] flex justify-between items-center bg-red-50 dark:bg-red-900/10">
        <h3 className="text-sm font-bold uppercase tracking-wide text-red-700 dark:text-red-400 flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px]">gpp_maybe</span>
          Critical Alerts
        </h3>
        <span className="bg-red-200 text-red-800 dark:bg-red-900 dark:text-red-200 text-xs font-bold px-2 py-0.5 rounded-full">
          {lowStockItems.length}
        </span>
      </div>
      <div className="divide-y divide-gray-200 dark:divide-[#404040]">
        {lowStockItems.map((item) => {
          const dispatch = dispatchParameters.find(d => d.part_id === item.part_id);
          const daysUntilStockout = dispatch ? Math.floor(item.quantity_available / (dispatch.reorder_quantity / dispatch.reorder_interval_days)) : 0;

          return (
            <div key={item.part_id} className="p-4 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors">
              <div className="flex gap-3">
                <div className="text-indigo-600 dark:text-indigo-400 mt-0.5">
                  <span className="material-symbols-outlined text-[20px]">smart_toy</span>
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-sm font-medium text-slate-900 dark:text-white">{item.part_name.split(' ').slice(0, 3).join(' ')} Supply Low</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Predicted stockout in <span className="font-bold text-red-600 dark:text-red-400">{Math.max(1, daysUntilStockout)} days</span> based on current build rate.
                  </p>
                  <div className="mt-2">
                    <button className="text-xs font-medium bg-[#595959] text-white px-3 py-1.5 rounded hover:bg-slate-700 transition-colors">
                      Contact Supplier
                    </button>
                    <button className="text-xs font-medium text-[#595959] dark:text-slate-300 px-3 py-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ml-1">
                      Ignore
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// Inventory Health Component
function InventoryHealth() {
  const healthItems = [
    { name: 'Battery Packs', quantity: '4,200 units', status: 'healthy', icon: 'battery_charging_full' },
    { name: 'Tires (10")', quantity: '850 units', status: 'low', icon: 'tire_repair' },
    { name: 'Motor Controllers', quantity: '120 units', status: 'critical', icon: 'memory' },
  ];

  const statusStyles: Record<string, { bg: string; text: string }> = {
    healthy: { bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-400' },
    low: { bg: 'bg-amber-100 dark:bg-amber-900/30', text: 'text-amber-700 dark:text-amber-400' },
    critical: { bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-400' },
  };

  return (
    <section className="bg-white dark:bg-[#262626] rounded border border-gray-200 dark:border-[#404040] shadow-sm">
      <div className="px-5 py-4 border-b border-gray-200 dark:border-[#404040] flex justify-between items-center">
        <h3 className="text-sm font-bold uppercase tracking-wide text-slate-800 dark:text-slate-200">Inventory Health</h3>
        <button className="text-slate-400 hover:text-[#595959] dark:hover:text-white">
          <span className="material-symbols-outlined text-[18px]">more_horiz</span>
        </button>
      </div>
      <div className="p-4 space-y-4">
        {healthItems.map((item) => (
          <div key={item.name} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="size-8 rounded bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                <span className="material-symbols-outlined text-[18px] text-slate-500">{item.icon}</span>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-900 dark:text-white">{item.name}</p>
                <p className="text-xs text-slate-500">{item.quantity}</p>
              </div>
            </div>
            <span className={`px-2 py-1 rounded text-xs font-bold ${statusStyles[item.status].bg} ${statusStyles[item.status].text}`}>
              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

// System Status Component
function SystemStatus() {
  return (
    <section className="bg-white dark:bg-[#262626] rounded border border-gray-200 dark:border-[#404040] shadow-sm p-4">
      <h4 className="text-xs font-bold uppercase text-slate-500 dark:text-slate-400 mb-3">System Status</h4>
      <div className="space-y-3">
        <div className="flex justify-between items-center text-sm">
          <span className="text-slate-600 dark:text-slate-400 flex items-center gap-2">
            <span className="size-2 rounded-full bg-green-500"></span>
            ERP Sync
          </span>
          <span className="text-slate-900 dark:text-white font-mono text-xs">2 mins ago</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-slate-600 dark:text-slate-400 flex items-center gap-2">
            <span className="size-2 rounded-full bg-green-500"></span>
            Supplier API
          </span>
          <span className="text-green-600 dark:text-green-400 text-xs font-medium">Connected</span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-slate-600 dark:text-slate-400 flex items-center gap-2">
            <span className="size-2 rounded-full bg-amber-500"></span>
            Logistics Feed
          </span>
          <span className="text-amber-600 dark:text-amber-400 text-xs font-medium">Degraded</span>
        </div>
      </div>
    </section>
  );
}

export default function Dashboard() {
  // Calculate KPIs
  const orderedCount = materialOrders.filter(o => o.status === 'ordered').length;
  const lowStockCount = stockLevels.filter(stock => {
    const dispatch = dispatchParameters.find(d => d.part_id === stock.part_id);
    return dispatch && stock.quantity_available <= dispatch.min_stock_level;
  }).length;

  return (
    <>
      <Header title="Executive Operations Dashboard" />
      <div className="p-8 max-w-[1600px] w-full mx-auto space-y-6">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard
            title="Daily Build Rate"
            value="142"
            change="5%"
            changeType="up"
            subtitle="Target: 135 units"
            icon="precision_manufacturing"
          />
          <KpiCard
            title="Active Stockouts"
            value={lowStockCount.toString()}
            subtitle="Requires immediate attention"
            icon="warning"
            alert={true}
          />
          <KpiCard
            title="On-Time Delivery"
            value="94.5%"
            change="2.1%"
            changeType="down"
            subtitle="Last 30 days avg"
            icon="local_shipping"
          />
          <KpiCard
            title="Cash Flow Projection"
            value="+$1.2M"
            change="8%"
            changeType="up"
            subtitle="Next 7 days forecast"
            icon="payments"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column (2/3 width) */}
          <div className="lg:col-span-2 space-y-6">
            <ProductionCapacity />
            <LogisticsTable />
          </div>

          {/* Right Column (1/3 width) */}
          <div className="space-y-6">
            <CriticalAlerts />
            <InventoryHealth />
            <SystemStatus />
          </div>
        </div>
      </div>
    </>
  );
}
