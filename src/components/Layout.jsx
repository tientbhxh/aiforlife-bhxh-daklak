import React, { useEffect, useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Moon, Sun, ShieldCheck } from 'lucide-react';

const Layout = () => {
  // Theme logic for dark/light mode toggle
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

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
    <div className="min-h-screen bg-slate-950 dark:bg-slate-950 bg-grid-pattern relative flex flex-col text-slate-200 font-sans transition-colors duration-300">
      
      {/* HEADER */}
      <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-slate-950/80 border-b border-cyan-500/30 shadow-[0_4px_30px_rgba(34,211,238,0.15)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full bg-slate-900 border border-cyan-500/50 flex items-center justify-center group-hover:glow-border transition-all duration-300 overflow-hidden">
              <img src="/aiforlife-bhxh-daklak/logo-bhxh.png" alt="Logo" className="w-8 h-8 object-contain" />
            </div>
            <div>
              <h1 className="text-white font-bold text-lg tracking-wide uppercase group-hover:text-cyan-400 transition-colors duration-300 glow-text">BHXH Đắk Lắk</h1>
              <p className="text-xs text-cyan-500/80 uppercase tracking-widest font-semibold">AI SaaS System</p>
            </div>
          </Link>

          <div className="flex items-center gap-6">
            <nav className="hidden md:flex items-center gap-6">
              <Link to="/" className="text-sm font-medium text-slate-300 hover:text-cyan-400 transition-colors duration-300">Trang chủ</Link>
              <Link to="/settings" className="text-sm font-medium text-slate-300 hover:text-cyan-400 transition-colors duration-300">Cài đặt API</Link>
            </nav>
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full border border-slate-700 hover:border-cyan-500 hover:text-cyan-400 text-slate-400 transition-all duration-300 bg-slate-900"
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
      <footer className="w-full border-t border-slate-800 bg-slate-950/90 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center justify-center gap-2">
          <div className="flex items-center gap-2 text-cyan-500">
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
