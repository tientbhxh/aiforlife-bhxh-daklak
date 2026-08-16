import React, { useEffect, useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Moon, Sun, ShieldCheck } from 'lucide-react';

const Layout = () => {
  // Theme logic for dark/light mode toggle
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B1120] relative flex flex-col text-slate-900 dark:text-slate-200 font-sans transition-colors duration-300 overflow-x-hidden">
      
      {/* Background Radial Glow */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-cyan-200/40 dark:bg-cyan-900/20 rounded-full blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-200/40 dark:bg-blue-900/20 rounded-full blur-[150px] pointer-events-none"></div>

      {/* HEADER */}
      <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/80 dark:bg-[#0B1120]/80 border-b border-slate-200 dark:border-slate-700/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group relative">
            <div className="w-10 h-10 rounded-full bg-white dark:bg-[#131b2f] border border-slate-200 dark:border-cyan-500/30 flex items-center justify-center transition-all duration-300 overflow-hidden relative group-hover:border-cyan-400">
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/50 dark:via-white/20 to-transparent group-hover:animate-shimmer"></div>
              <img src="/aiforlife-bhxh-daklak/logo-bhxh.png" alt="Logo" className="w-8 h-8 object-contain z-10" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-cyan-400 dark:to-blue-500 hidden sm:block">BHXH Đắk Lắk</h1>
              <p className="text-xs text-blue-600/80 dark:text-cyan-500/80 uppercase tracking-widest font-semibold">AI SaaS System</p>
            </div>
          </Link>

          <div className="flex items-center gap-6">
            <nav className="hidden md:flex items-center gap-6">
              <Link to="/" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-cyan-400 transition-colors duration-300">Trang chủ</Link>
              <Link to="/settings" className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-cyan-400 transition-colors duration-300">Cài đặt API</Link>
            </nav>
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full border border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-cyan-500 hover:text-blue-600 dark:hover:text-cyan-400 text-slate-500 dark:text-slate-400 transition-all duration-300 bg-white dark:bg-slate-900"
            >
              {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="flex-1 w-full max-w-screen-2xl mx-auto p-4 sm:p-6 lg:p-8">
        <div className="animate-fade-in h-full">
          <Outlet />
        </div>
      </main>

      {/* FOOTER */}
      <footer className="w-full border-t border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-950/90 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center justify-center gap-2">
          <div className="flex items-center gap-2 text-blue-600 dark:text-cyan-500">
            <ShieldCheck size={20} />
            <span className="text-sm font-medium uppercase tracking-wider">Hệ thống Bảo mật cấp cao</span>
          </div>
          <p className="text-slate-500 text-xs">
            Sản phẩm dự thi AI For Life 2026 - Phát triển cho BHXH Đắk Lắk
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
