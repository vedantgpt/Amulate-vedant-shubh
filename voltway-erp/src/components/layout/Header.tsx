'use client';

interface HeaderProps {
    title: string;
}

export default function Header({ title }: HeaderProps) {
    const today = new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });

    return (
        <header className="h-16 bg-white dark:bg-[#262626] border-b border-gray-200 dark:border-[#404040] flex items-center justify-between px-8 sticky top-0 z-10">
            <div className="flex items-center gap-4">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">{title}</h2>
                <div className="h-4 w-px bg-slate-200 dark:bg-slate-700"></div>
                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <span className="material-symbols-outlined text-[16px]">calendar_today</span>
                    <span>{today}</span>
                </div>
            </div>
            <div className="flex items-center gap-4">
                {/* Search */}
                <div className="relative group">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 material-symbols-outlined text-[20px]">
                        search
                    </span>
                    <input
                        className="pl-10 pr-4 py-2 bg-slate-100 dark:bg-slate-800 border-none rounded text-sm w-64 focus:ring-2 focus:ring-[#595959]/20 text-slate-900 dark:text-white placeholder-slate-500 focus:outline-none"
                        placeholder="Search orders, SKUs..."
                        type="text"
                    />
                </div>
                {/* Notifications */}
                <button className="relative p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors">
                    <span className="material-symbols-outlined">notifications</span>
                    <span className="absolute top-1.5 right-1.5 size-2 bg-red-500 rounded-full border-2 border-white dark:border-[#262626]"></span>
                </button>
                {/* Help */}
                <button className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors">
                    <span className="material-symbols-outlined">help</span>
                </button>
            </div>
        </header>
    );
}
