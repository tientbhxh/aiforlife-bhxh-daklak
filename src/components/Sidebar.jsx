import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, ScanLine, MessageSquareText, Settings, ChevronLeft, Moon, Sun } from 'lucide-react';

const Sidebar = ({ isOpen, toggleSidebar, theme, toggleTheme }) => {
  const navItems = [
    { path: '/', name: 'Trang chủ', icon: <LayoutDashboard size={20} /> },
    { path: '/scanner', name: 'Quét CCCD', icon: <ScanLine size={20} /> },
    { path: '/chatbot', name: 'Trợ lý AI', icon: <MessageSquareText size={20} /> },
    { path: '/settings', name: 'Cài đặt', icon: <Settings size={20} /> },
  ];

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`} style={{ 
      transition: 'transform 0.3s ease', 
      position: 'fixed',
      transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
      zIndex: 1000,
      background: 'var(--primary-color)',
      color: '#fff',
      borderRight: 'none',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem', padding: '0.5rem' }}>
        <img src="/aiforlife-bhxh-daklak/logo-bhxh.png" alt="BHXH Logo" style={{ width: '40px', height: '40px', background: '#fff', borderRadius: '50%', padding: '2px' }} />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
           <h2 style={{ color: '#fff', fontSize: '1.1rem', fontWeight: '700', margin: 0, lineHeight: 1.2, textTransform: 'uppercase' }}>BHXH Đắk Lắk</h2>
           <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>Hệ thống quản lý</span>
        </div>
        <button onClick={toggleSidebar} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#fff', display: 'block', marginLeft: 'auto' }} className="mobile-close-btn">
          <ChevronLeft size={24} />
        </button>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', flex: 1 }}>
        {navItems.map((item) => (
          <NavLink 
            key={item.path} 
            to={item.path}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              padding: '0.875rem 1rem',
              borderRadius: 'var(--border-radius)',
              color: '#fff',
              background: isActive ? 'var(--primary-light)' : 'transparent',
              textDecoration: 'none',
              fontWeight: isActive ? '600' : '400',
              transition: 'background 0.2s ease',
            })}
          >
            {item.icon}
            {item.name}
          </NavLink>
        ))}
      </nav>

      <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
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
            color: '#fff',
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
