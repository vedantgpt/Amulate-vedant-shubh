import Header from '@/components/layout/Header';

export default function EventsPage() {
    const events = [
        { id: 'EVT001', type: 'delay', severity: 'critical', title: 'Supplier Delay - SupB', description: 'Order O5034 delayed by 5 days due to logistics issues', affected: ['O5034', 'P320'], time: '2 hours ago', action_required: true },
        { id: 'EVT002', type: 'quality_alert', severity: 'warning', title: 'Quality Issue - P312', description: 'Batch quality inspection failed. 15 units blocked.', affected: ['P312'], time: '5 hours ago', action_required: true },
        { id: 'EVT003', type: 'price_change', severity: 'info', title: 'Price Update - SupA', description: 'New pricing for P307 effective next month. 8% increase.', affected: ['P307'], time: '1 day ago', action_required: false },
        { id: 'EVT004', type: 'shipment', severity: 'info', title: 'Shipment Received - O5003', description: 'Order O5003 received at WH3. 294 units checked in.', affected: ['O5003', 'P329'], time: '2 days ago', action_required: false },
        { id: 'EVT005', type: 'discontinuation', severity: 'warning', title: 'Part Discontinuation - P300', description: 'P300 being phased out. Successor: P304', affected: ['P300', 'P304'], time: '3 days ago', action_required: true },
    ];

    const severityStyles: Record<string, { bg: string; text: string; icon: string }> = {
        critical: { bg: 'bg-red-100 dark:bg-red-900/20', text: 'text-red-700 dark:text-red-400', icon: 'error' },
        warning: { bg: 'bg-amber-100 dark:bg-amber-900/20', text: 'text-amber-700 dark:text-amber-400', icon: 'warning' },
        info: { bg: 'bg-blue-100 dark:bg-blue-900/20', text: 'text-blue-700 dark:text-blue-400', icon: 'info' },
    };

    return (
        <>
            <Header title="Events & Alerts" />
            <div className="p-8 max-w-[1600px] w-full mx-auto space-y-6">
                {/* Summary */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white dark:bg-[#262626] rounded border border-l-4 border-l-red-500 border-y-gray-200 border-r-gray-200 dark:border-y-[#404040] dark:border-r-[#404040] p-5">
                        <p className="text-sm text-slate-500 dark:text-slate-400">Critical</p>
                        <p className="text-2xl font-bold text-red-600 dark:text-red-400 mt-1">1</p>
                    </div>
                    <div className="bg-white dark:bg-[#262626] rounded border border-l-4 border-l-amber-500 border-y-gray-200 border-r-gray-200 dark:border-y-[#404040] dark:border-r-[#404040] p-5">
                        <p className="text-sm text-slate-500 dark:text-slate-400">Warnings</p>
                        <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">2</p>
                    </div>
                    <div className="bg-white dark:bg-[#262626] rounded border border-gray-200 dark:border-[#404040] p-5">
                        <p className="text-sm text-slate-500 dark:text-slate-400">Informational</p>
                        <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">2</p>
                    </div>
                    <div className="bg-white dark:bg-[#262626] rounded border border-gray-200 dark:border-[#404040] p-5">
                        <p className="text-sm text-slate-500 dark:text-slate-400">Action Required</p>
                        <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">3</p>
                    </div>
                </div>

                {/* Events List */}
                <div className="bg-white dark:bg-[#262626] rounded border border-gray-200 dark:border-[#404040] shadow-sm">
                    <div className="divide-y divide-gray-200 dark:divide-[#404040]">
                        {events.map((event) => (
                            <div key={event.id} className="p-5 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                <div className="flex gap-4">
                                    <div className={`p-2 rounded-lg ${severityStyles[event.severity].bg}`}>
                                        <span className={`material-symbols-outlined ${severityStyles[event.severity].text}`}>
                                            {severityStyles[event.severity].icon}
                                        </span>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="font-semibold text-slate-900 dark:text-white">{event.title}</h4>
                                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{event.description}</p>
                                            </div>
                                            <span className="text-xs text-slate-400">{event.time}</span>
                                        </div>
                                        <div className="flex items-center gap-4 mt-3">
                                            <div className="flex gap-1">
                                                {event.affected.map((item) => (
                                                    <span key={item} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-xs font-mono">
                                                        {item}
                                                    </span>
                                                ))}
                                            </div>
                                            {event.action_required && (
                                                <span className="px-2 py-0.5 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded text-xs font-medium">
                                                    Action Required
                                                </span>
                                            )}
                                        </div>
                                        {event.action_required && (
                                            <div className="mt-3 flex gap-2">
                                                <button className="px-3 py-1.5 bg-[#595959] text-white text-xs font-medium rounded hover:bg-slate-700 transition-colors">
                                                    Take Action
                                                </button>
                                                <button className="px-3 py-1.5 text-slate-600 dark:text-slate-400 text-xs font-medium rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                                                    Dismiss
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
