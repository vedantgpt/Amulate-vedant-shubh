'use client';

interface HeaderProps {
    title: string;
}

export default function Header({ title }: HeaderProps) {
    const today = new Date().toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
    });

    return (
        <header className="h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-800/50 flex items-center justify-between px-6 sticky top-0 z-10">
            <div className="flex items-center gap-4">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white">{title}</h2>
                <div className="hidden sm:flex items-center gap-2 px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full">
                    <span className="material-symbols-outlined text-slate-400 text-sm">calendar_today</span>
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{today}</span>
                </div>
            </div>
            <div className="flex items-center gap-2">
                {/* Search */}
                <div className="relative hidden md:block">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 text-lg">
                        search
                    </span>
                    <input
                        className="w-64 pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-0 rounded-xl text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:ring-2 focus:ring-cyan-500/20 focus:bg-white dark:focus:bg-slate-700 transition-all"
                        placeholder="Search anything..."
                        type="text"
                    />
                    <kbd className="absolute right-3 top-1/2 -translate-y-1/2 px-1.5 py-0.5 text-[10px] font-medium text-slate-400 bg-white dark:bg-slate-700 rounded border border-slate-200 dark:border-slate-600">
                        ⌘K
                    </kbd>
                </div>

                {/* Actions */}
                <button className="p-2 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-white transition-all">
                    <span className="material-symbols-outlined text-xl">help</span>
                </button>
                <button className="relative p-2 rounded-xl text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 dark:hover:text-white transition-all">
                    <span className="material-symbols-outlined text-xl">notifications</span>
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white dark:ring-slate-900"></span>
                </button>
            </div>
        </header>
    );
}
