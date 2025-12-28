import Header from '@/components/layout/Header';

export default function ImportsPage() {
    const recentImports = [
        { id: 'IMP001', fileName: 'S1_V2_specs.pdf', type: 'pdf', status: 'processed', confidence: 0.94, extracted: '1 product, 14 BOM items', time: '2 hours ago' },
        { id: 'IMP002', fileName: 'supplier_delay_email.eml', type: 'email', status: 'processed', confidence: 0.91, extracted: 'Delay event for O5007', time: '5 hours ago' },
        { id: 'IMP003', fileName: 'inventory_q4.xlsx', type: 'excel', status: 'review', confidence: 0.72, extracted: '39 stock updates', time: '1 day ago' },
        { id: 'IMP004', fileName: 'packing_slip_4092.jpg', type: 'image', status: 'review', confidence: 0.68, extracted: 'Shipment details', time: '2 days ago' },
    ];

    const statusStyles: Record<string, { bg: string; text: string; label: string }> = {
        processed: { bg: 'bg-green-100 dark:bg-green-900/20', text: 'text-green-700 dark:text-green-400', label: 'Processed' },
        review: { bg: 'bg-amber-100 dark:bg-amber-900/20', text: 'text-amber-700 dark:text-amber-400', label: 'Needs Review' },
        processing: { bg: 'bg-blue-100 dark:bg-blue-900/20', text: 'text-blue-700 dark:text-blue-400', label: 'Processing' },
        failed: { bg: 'bg-red-100 dark:bg-red-900/20', text: 'text-red-700 dark:text-red-400', label: 'Failed' },
    };

    const typeIcons: Record<string, string> = {
        pdf: 'picture_as_pdf',
        email: 'email',
        excel: 'table_chart',
        image: 'image',
        csv: 'table',
    };

    return (
        <>
            <Header title="Imports & Documents" />
            <div className="p-8 max-w-[1600px] w-full mx-auto space-y-6">
                {/* Upload Area */}
                <div className="bg-white dark:bg-[#262626] rounded border-2 border-dashed border-gray-300 dark:border-[#404040] p-12 text-center hover:border-[#595959] transition-colors cursor-pointer">
                    <div className="flex flex-col items-center gap-4">
                        <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-full">
                            <span className="material-symbols-outlined text-4xl text-slate-400">cloud_upload</span>
                        </div>
                        <div>
                            <p className="text-lg font-semibold text-slate-900 dark:text-white">Drop files here or click to browse</p>
                            <p className="text-sm text-slate-500 mt-1">Supported: PDF, Images, Excel, CSV, Email, JSON</p>
                        </div>
                        <button className="mt-4 px-6 py-2 bg-[#595959] text-white rounded font-medium text-sm hover:bg-slate-700 transition-colors">
                            Select Files
                        </button>
                    </div>
                </div>

                {/* Recent Imports */}
                <div className="bg-white dark:bg-[#262626] rounded border border-gray-200 dark:border-[#404040] shadow-sm">
                    <div className="px-5 py-4 border-b border-gray-200 dark:border-[#404040]">
                        <h3 className="text-sm font-bold uppercase tracking-wide text-slate-800 dark:text-slate-200">Recent Imports</h3>
                    </div>
                    <div className="divide-y divide-gray-200 dark:divide-[#404040]">
                        {recentImports.map((item) => (
                            <div key={item.id} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="p-2 bg-slate-100 dark:bg-slate-800 rounded">
                                        <span className="material-symbols-outlined text-slate-500">{typeIcons[item.type]}</span>
                                    </div>
                                    <div>
                                        <p className="font-medium text-slate-900 dark:text-white">{item.fileName}</p>
                                        <p className="text-xs text-slate-500 mt-0.5">Extracted: {item.extracted}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-6">
                                    <div className="text-right">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs text-slate-500">Confidence:</span>
                                            <div className="w-16 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full ${item.confidence >= 0.8 ? 'bg-green-500' : 'bg-amber-500'}`}
                                                    style={{ width: `${item.confidence * 100}%` }}
                                                />
                                            </div>
                                            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">{Math.round(item.confidence * 100)}%</span>
                                        </div>
                                        <p className="text-xs text-slate-400 mt-1">{item.time}</p>
                                    </div>
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${statusStyles[item.status].bg} ${statusStyles[item.status].text}`}>
                                        {statusStyles[item.status].label}
                                    </span>
                                    <div className="flex gap-1">
                                        <button className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors">
                                            <span className="material-symbols-outlined text-[18px]">visibility</span>
                                        </button>
                                        {item.status === 'review' && (
                                            <button className="p-1.5 text-slate-400 hover:text-[#595959] hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors">
                                                <span className="material-symbols-outlined text-[18px]">edit</span>
                                            </button>
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
