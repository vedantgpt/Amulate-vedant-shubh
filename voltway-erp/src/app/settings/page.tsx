import Header from '@/components/layout/Header';

export default function SettingsPage() {
    return (
        <>
            <Header title="Settings" />
            <div className="p-8 max-w-[1200px] w-full mx-auto space-y-6">
                {/* General Settings */}
                <div className="bg-white dark:bg-[#262626] rounded border border-gray-200 dark:border-[#404040] shadow-sm">
                    <div className="px-5 py-4 border-b border-gray-200 dark:border-[#404040]">
                        <h3 className="text-sm font-bold uppercase tracking-wide text-slate-800 dark:text-slate-200">General Settings</h3>
                    </div>
                    <div className="p-5 space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-slate-900 dark:text-white">Dark Mode</p>
                                <p className="text-sm text-slate-500">Enable dark theme for the interface</p>
                            </div>
                            <button className="w-12 h-6 bg-slate-200 dark:bg-[#595959] rounded-full relative transition-colors">
                                <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform dark:translate-x-6"></span>
                            </button>
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-slate-900 dark:text-white">Email Notifications</p>
                                <p className="text-sm text-slate-500">Receive alerts for critical events</p>
                            </div>
                            <button className="w-12 h-6 bg-[#595959] rounded-full relative">
                                <span className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Data Integrations */}
                <div className="bg-white dark:bg-[#262626] rounded border border-gray-200 dark:border-[#404040] shadow-sm">
                    <div className="px-5 py-4 border-b border-gray-200 dark:border-[#404040]">
                        <h3 className="text-sm font-bold uppercase tracking-wide text-slate-800 dark:text-slate-200">Data Integrations</h3>
                    </div>
                    <div className="p-5 space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="size-10 bg-green-100 dark:bg-green-900/30 rounded flex items-center justify-center">
                                    <span className="material-symbols-outlined text-green-600">check_circle</span>
                                </div>
                                <div>
                                    <p className="font-medium text-slate-900 dark:text-white">Firebase</p>
                                    <p className="text-sm text-slate-500">Connected • Last sync: 2 mins ago</p>
                                </div>
                            </div>
                            <button className="px-3 py-1.5 text-sm text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors">
                                Configure
                            </button>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="size-10 bg-slate-100 dark:bg-slate-800 rounded flex items-center justify-center">
                                    <span className="material-symbols-outlined text-slate-400">cloud_off</span>
                                </div>
                                <div>
                                    <p className="font-medium text-slate-900 dark:text-white">Slack Notifications</p>
                                    <p className="text-sm text-slate-500">Not connected</p>
                                </div>
                            </div>
                            <button className="px-3 py-1.5 text-sm bg-[#595959] text-white rounded hover:bg-slate-700 transition-colors">
                                Connect
                            </button>
                        </div>
                    </div>
                </div>

                {/* About */}
                <div className="bg-white dark:bg-[#262626] rounded border border-gray-200 dark:border-[#404040] shadow-sm p-5">
                    <div className="flex items-center gap-3">
                        <div className="bg-[#595959] aspect-square rounded size-10 flex items-center justify-center text-white">
                            <span className="material-symbols-outlined">electric_scooter</span>
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900 dark:text-white">Voltway ERP</h3>
                            <p className="text-sm text-slate-500">Version 1.0.0 • AI-Native ERP</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
