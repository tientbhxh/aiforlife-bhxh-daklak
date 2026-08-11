import React, { useState, useEffect } from 'react';
import { Save, Key, AlertCircle } from 'lucide-react';

const Settings = () => {
  const [apiKey, setApiKey] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const storedKey = localStorage.getItem('gemini_api_key');
    if (storedKey) setApiKey(storedKey);
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    localStorage.setItem('gemini_api_key', apiKey);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h2 style={{ fontSize: '1.75rem', marginBottom: '1.5rem', color: 'var(--text-dark)' }}>Cài đặt Hệ thống</h2>
      
      <div className="glass-panel" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', color: 'var(--primary-color)' }}>
          <Key size={24} />
          <h3 style={{ fontSize: '1.25rem', margin: 0 }}>Cấu hình AI (Google Gemini API)</h3>
        </div>
        
        <div style={{ 
          background: 'rgba(245, 158, 11, 0.1)', 
          borderLeft: '4px solid var(--warning-color)',
          padding: '1rem',
          borderRadius: '4px 8px 8px 4px',
          marginBottom: '2rem',
          display: 'flex',
          gap: '1rem'
        }}>
          <AlertCircle color="var(--warning-color)" style={{ flexShrink: 0 }} />
          <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-dark)' }}>
            <strong>Lưu ý bảo mật:</strong> Ứng dụng này chạy trực tiếp trên trình duyệt (Client-side) qua GitHub Pages. API Key của bạn được lưu trữ an toàn trong <code>localStorage</code> của trình duyệt hiện tại và KHÔNG bao giờ được gửi về bất kỳ máy chủ nào khác ngoài Google.
          </p>
        </div>

        <form onSubmit={handleSave}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: 'var(--text-dark)' }}>
              Google Gemini API Key
            </label>
            <input 
              type="password"
              className="input-field"
              placeholder="Nhập API Key bắt đầu bằng AIzaSy..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              required
            />
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
              Bạn có thể lấy API Key miễn phí tại <a href="https://aistudio.google.com/" target="_blank" rel="noreferrer" style={{ color: 'var(--primary-color)' }}>Google AI Studio</a>.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button type="submit" className="btn btn-primary">
              <Save size={18} />
              Lưu Cấu hình
            </button>
            
            {saved && (
              <span className="animate-fade-in" style={{ color: 'var(--success-color)', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                Đã lưu thành công!
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;
