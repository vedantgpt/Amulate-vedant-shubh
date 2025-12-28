'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
    { name: 'Dashboard', href: '/', icon: 'dashboard' },
    { name: 'Procurement', href: '/procurement', icon: 'shopping_cart' },
    { name: 'Inventory', href: '/inventory', icon: 'inventory_2', badge: 3 },
    { name: 'Materials', href: '/materials', icon: 'category' },
    { name: 'Sales', href: '/sales', icon: 'point_of_sale' },
    { name: 'Suppliers', href: '/suppliers', icon: 'local_shipping' },
];

const intelligenceItems = [
    { name: 'AI Agent (Hugo)', href: '/hugo', icon: 'smart_toy', special: true },
    { name: 'Dispatch', href: '/dispatch', icon: 'tune' },
    { name: 'Events', href: '/events', icon: 'notifications' },
    { name: 'Imports', href: '/imports', icon: 'upload_file' },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 h-screen bg-white dark:bg-[#262626] border-r border-gray-200 dark:border-[#404040] flex flex-col flex-shrink-0 z-20">
            {/* Logo */}
            <div className="p-6 flex items-center gap-3">
                <div className="bg-[#595959] aspect-square rounded size-8 flex items-center justify-center text-white">
                    <span className="material-symbols-outlined text-[20px]">electric_scooter</span>
                </div>
                <div className="flex flex-col">
                    <h1 className="text-sm font-bold tracking-tight uppercase text-slate-900 dark:text-white">Voltway ERP</h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Ops Command</p>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 flex flex-col gap-1 overflow-y-auto">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded transition-colors group ${isActive
                                    ? 'bg-[#595959]/10 text-[#595959] dark:text-white font-medium'
                                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
                                }`}
                        >
                            <span className={`material-symbols-outlined ${isActive ? "filled" : ""}`} style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}>
                                {item.icon}
                            </span>
                            <span className="text-sm">{item.name}</span>
                            {item.badge && (
                                <span className="ml-auto bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 text-[10px] font-bold px-1.5 py-0.5 rounded">
                                    {item.badge}
                                </span>
                            )}
                        </Link>
                    );
                })}

                {/* Intelligence Section */}
                <div className="pt-4 pb-2">
                    <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
                        Intelligence
                    </p>
                </div>
                {intelligenceItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded transition-colors group ${isActive
                                    ? 'bg-[#595959]/10 text-[#595959] dark:text-white font-medium'
                                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white'
                                } ${item.special ? 'hover:text-indigo-600 dark:hover:text-indigo-400' : ''}`}
                        >
                            <span className={`material-symbols-outlined ${item.special ? 'text-indigo-500 dark:text-indigo-400' : ''}`}>
                                {item.icon}
                            </span>
                            <span className="text-sm">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200 dark:border-[#404040] mt-auto">
                <Link
                    href="/settings"
                    className="flex items-center gap-3 px-3 py-2.5 rounded text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 hover:text-slate-900 dark:hover:text-white transition-colors group mb-2"
                >
                    <span className="material-symbols-outlined">settings</span>
                    <span className="text-sm">Settings</span>
                </Link>
                <div className="flex items-center gap-3 px-3 pt-2">
                    <div className="size-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-xs font-medium">
                        AC
                    </div>
                    <div className="flex flex-col">
                        <p className="text-sm font-medium text-slate-900 dark:text-white">Alex Chen</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">VP Operations</p>
                    </div>
                </div>
            </div>
        </aside>
    );
}
