import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ScanLine, FileText, MessageSquareText, Settings, ChevronLeft, ChevronRight, Moon, Sun } from 'lucide-react';

const Sidebar = ({ isOpen, toggleSidebar, theme, toggleTheme }) => {
  const navItems = [
    { path: '/', name: 'Trang chủ', icon: <LayoutDashboard size={20} /> },
    { path: '/scanner', name: 'Quét CCCD', icon: <ScanLine size={20} /> },
    { path: '/chatbot', name: 'Trợ lý AI', icon: <MessageSquareText size={20} /> },
    { path: '/settings', name: 'Cài đặt', icon: <Settings size={20} /> },
  ];

  return (
    <aside className={`sidebar glass-panel ${isOpen ? 'open' : ''}`} style={{ 
      transition: 'transform 0.3s ease', 
      position: 'fixed',
      transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
      zIndex: 1000
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <h2 style={{ color: 'var(--primary-color)', fontSize: '1.5rem', fontWeight: '700' }}>AI For Life</h2>
        <button onClick={toggleSidebar} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-dark)', display: 'block' }} className="mobile-close-btn">
          <ChevronLeft size={24} />
        </button>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1 }}>
        {navItems.map((item) => (
          <NavLink 
            key={item.path} 
            to={item.path}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '0.875rem 1rem',
              borderRadius: '8px',
              color: isActive ? '#fff' : 'var(--text-dark)',
              background: isActive ? 'linear-gradient(135deg, var(--primary-color), var(--primary-light))' : 'transparent',
              textDecoration: 'none',
              fontWeight: isActive ? '600' : '500',
              transition: 'all 0.2s ease',
              boxShadow: isActive ? '0 4px 12px rgba(11, 91, 156, 0.2)' : 'none'
            })}
          >
            {item.icon}
            {item.name}
          </NavLink>
        ))}
      </nav>

      <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--glass-border)' }}>
        <button 
          onClick={toggleTheme}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            width: '100%',
            padding: '0.875rem 1rem',
            background: 'transparent',
            border: 'none',
            color: 'var(--text-dark)',
            cursor: 'pointer',
            fontWeight: '500',
            textAlign: 'left'
          }}
        >
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          {theme === 'light' ? 'Chế độ tối' : 'Chế độ sáng'}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
