'use client';

import { useEffect, useState } from 'react';

export default function ThemeToggle() {
    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        // Get initial theme from document class
        const current = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
        setTheme(current);
    }, []);

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(newTheme);
        localStorage.setItem('voltway-theme', newTheme);
    };

    // Prevent hydration mismatch
    if (!mounted) {
        return (
            <button
                className="p-2 rounded-xl bg-slate-100 text-slate-500 transition-all"
                aria-label="Toggle theme"
            >
                <span className="material-symbols-outlined text-xl opacity-0">dark_mode</span>
            </button>
        );
    }

    return (
        <button
            onClick={toggleTheme}
            className="relative p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-700 dark:hover:text-white transition-all duration-300"
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            aria-label="Toggle theme"
        >
            {/* Sun icon for dark mode */}
            <span
                className={`material-symbols-outlined text-xl transition-all duration-300 absolute top-2 left-2 ${theme === 'dark'
                        ? 'opacity-100 rotate-0 scale-100 text-amber-400'
                        : 'opacity-0 -rotate-90 scale-0'
                    }`}
            >
                light_mode
            </span>

            {/* Moon icon for light mode */}
            <span
                className={`material-symbols-outlined text-xl transition-all duration-300 ${theme === 'light'
                        ? 'opacity-100 rotate-0 scale-100 text-indigo-500'
                        : 'opacity-0 rotate-90 scale-0'
                    }`}
            >
                dark_mode
            </span>
        </button>
    );
}
