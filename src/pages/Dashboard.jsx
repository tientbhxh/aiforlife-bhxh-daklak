import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ScanLine, MessageSquareText, FileCheck2, ShieldCheck } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();

  const stats = [
    { title: 'Hồ sơ đã tiếp nhận', value: '1,248', icon: <FileCheck2 size={24} color="#0b5b9c" />, bg: 'rgba(11, 91, 156, 0.1)' },
    { title: 'Tỉ lệ tự động hóa', value: '85%', icon: <ScanLine size={24} color="#10b981" />, bg: 'rgba(16, 185, 129, 0.1)' },
    { title: 'Hỗ trợ AI (Chatbot)', value: '4,532', icon: <MessageSquareText size={24} color="#f59e0b" />, bg: 'rgba(245, 158, 11, 0.1)' },
    { title: 'Bảo mật dữ liệu', value: 'An toàn', icon: <ShieldCheck size={24} color="#8b5cf6" />, bg: 'rgba(139, 92, 246, 0.1)' },
  ];

  return (
    <div>
      <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2 style={{ fontSize: '2rem', color: 'var(--primary-dark)', marginBottom: '1rem' }}>
            Chào mừng đến với Hệ thống <span style={{ color: 'var(--primary-color)' }}>AI Bộ phận Một cửa</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '800px', marginBottom: '2rem' }}>
            Giải pháp ứng dụng Trí tuệ nhân tạo (AI) giúp tự động hóa quá trình điền biểu mẫu hành chính, đối chiếu dữ liệu và tư vấn chính sách cho người dân tại Đắk Lắk.
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button className="btn btn-primary" onClick={() => navigate('/scanner')}>
              <ScanLine size={20} />
              Quét CCCD Ngay
            </button>
            <button className="btn btn-outline" onClick={() => navigate('/chatbot')}>
              <MessageSquareText size={20} />
              Hỏi đáp Trợ lý AI
            </button>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div style={{
          position: 'absolute',
          right: '-5%',
          top: '-20%',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(11,91,156,0.1) 0%, rgba(255,255,255,0) 70%)',
          borderRadius: '50%',
          zIndex: 0
        }} />
      </div>

      <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem', color: 'var(--text-dark)' }}>Tổng quan hoạt động</h3>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
        {stats.map((stat, idx) => (
          <div key={idx} className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '12px', background: stat.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {stat.icon}
            </div>
            <div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '0.25rem' }}>{stat.title}</p>
              <h4 style={{ fontSize: '1.5rem', margin: 0, color: 'var(--text-dark)' }}>{stat.value}</h4>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
