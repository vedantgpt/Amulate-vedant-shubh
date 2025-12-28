import Header from '@/components/layout/Header';

export default function HugoPage() {
    const samplePrompts = [
        'What parts are running low on stock?',
        'Which suppliers have the best reliability?',
        'Show me pending orders for S2 V2 models',
        'Analyze inventory health for next week',
    ];

    return (
        <>
            <Header title="Hugo AI Copilot" />
            <div className="p-8 max-w-[1200px] w-full mx-auto space-y-6 h-[calc(100vh-4rem)] flex flex-col">
                {/* AI Badge */}
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-xl">
                        <span className="material-symbols-outlined text-3xl text-indigo-600 dark:text-indigo-400">smart_toy</span>
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            Hugo AI
                            <span className="px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-medium rounded">
                                Phase 2 Preview
                            </span>
                        </h2>
                        <p className="text-sm text-slate-500">Your intelligent procurement assistant</p>
                    </div>
                </div>

                {/* Chat Area */}
                <div className="flex-1 bg-white dark:bg-[#262626] rounded border border-gray-200 dark:border-[#404040] shadow-sm flex flex-col overflow-hidden">
                    {/* Messages */}
                    <div className="flex-1 p-6 overflow-y-auto space-y-4">
                        {/* Welcome Message */}
                        <div className="flex gap-3">
                            <div className="size-8 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                                <span className="material-symbols-outlined text-indigo-600 dark:text-indigo-400 text-[18px]">smart_toy</span>
                            </div>
                            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4 max-w-2xl">
                                <p className="text-slate-900 dark:text-white">
                                    Hello! I&apos;m Hugo, your AI-powered procurement assistant. I can help you analyze inventory,
                                    track orders, evaluate suppliers, and provide intelligent recommendations.
                                </p>
                                <p className="text-slate-600 dark:text-slate-400 mt-2 text-sm">
                                    Try asking me about stock levels, supplier performance, or pending orders.
                                </p>
                            </div>
                        </div>

                        {/* Sample Insights */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                            <div className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border border-red-100 dark:border-red-900/30 rounded-lg p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="material-symbols-outlined text-red-500 text-[18px]">warning</span>
                                    <span className="font-medium text-red-700 dark:text-red-400 text-sm">Stock Alert</span>
                                </div>
                                <p className="text-sm text-slate-700 dark:text-slate-300">
                                    <strong>3 parts</strong> are at critical stock levels. P305 (Li-Po Battery) has only 24 units remaining.
                                </p>
                            </div>
                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-100 dark:border-blue-900/30 rounded-lg p-4">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="material-symbols-outlined text-blue-500 text-[18px]">local_shipping</span>
                                    <span className="font-medium text-blue-700 dark:text-blue-400 text-sm">Pending Orders</span>
                                </div>
                                <p className="text-sm text-slate-700 dark:text-slate-300">
                                    <strong>10 orders</strong> in progress with expected delivery by next week. 1 may be delayed.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Input Area */}
                    <div className="p-4 border-t border-gray-200 dark:border-[#404040]">
                        {/* Quick Prompts */}
                        <div className="flex gap-2 mb-3 overflow-x-auto pb-2">
                            {samplePrompts.map((prompt, idx) => (
                                <button
                                    key={idx}
                                    className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-full text-xs whitespace-nowrap hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                                >
                                    {prompt}
                                </button>
                            ))}
                        </div>
                        {/* Input */}
                        <div className="flex gap-3">
                            <input
                                type="text"
                                placeholder="Ask Hugo anything about your operations..."
                                className="flex-1 px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-gray-200 dark:border-[#404040] rounded-lg text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                            />
                            <button className="px-4 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2">
                                <span className="material-symbols-outlined text-[20px]">send</span>
                                Send
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
