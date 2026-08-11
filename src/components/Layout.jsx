import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Menu } from 'lucide-react';

const Layout = ({ theme, toggleTheme }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };
    
    // Initial check
    handleResize();
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="app-container">
      <Sidebar 
        isOpen={sidebarOpen} 
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
        theme={theme}
        toggleTheme={toggleTheme}
      />
      
      <main 
        className="main-content" 
        style={{ 
          marginLeft: sidebarOpen && window.innerWidth >= 768 ? 'var(--sidebar-width)' : '0',
          transition: 'margin-left 0.3s ease',
          width: '100%',
          maxWidth: '1200px',
          margin: '0 auto',
          paddingLeft: sidebarOpen && window.innerWidth >= 768 ? 'calc(var(--sidebar-width) + 2rem)' : '2rem'
        }}
      >
        <header style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
          {(!sidebarOpen || window.innerWidth < 768) && (
            <button 
              onClick={() => setSidebarOpen(true)}
              style={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '8px', padding: '0.5rem', cursor: 'pointer', marginRight: '1rem', color: 'var(--text-dark)' }}
            >
              <Menu size={24} />
            </button>
          )}
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: '500' }}>Hệ thống Quản lý Hành chính</p>
            <h1 style={{ color: 'var(--primary-dark)', fontSize: '1.5rem', margin: 0 }}>Bảo hiểm Xã hội Tỉnh Đắk Lắk</h1>
          </div>
        </header>
        
        <div className="animate-fade-in" style={{ paddingBottom: '2rem' }}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
