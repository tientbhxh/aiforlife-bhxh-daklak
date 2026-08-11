import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { QrCode, Upload, FileText, AlertTriangle } from 'lucide-react';
import mockData from '../data/mock_bhxh_data.json';

const Scanner = () => {
  const navigate = useNavigate();
  const [scanResult, setScanResult] = useState(null);
  const [error, setError] = useState('');
  const scannerRef = useRef(null);

  useEffect(() => {
    // Only init scanner once
    if (!scannerRef.current) {
      const html5QrcodeScanner = new Html5QrcodeScanner(
        "reader",
        { fps: 10, qrbox: { width: 250, height: 250 }, aspectRatio: 1.0 },
        /* verbose= */ false
      );
      
      html5QrcodeScanner.render(onScanSuccess, onScanFailure);
      scannerRef.current = html5QrcodeScanner;
    }

    return () => {
      if (scannerRef.current) {
        scannerRef.current.clear().catch(err => console.error(err));
        scannerRef.current = null;
      }
    };
  }, []);

  const processQrData = (decodedText) => {
    // Format of CCCD QR: 040090001234|040090001234|Nguyễn Văn A|01011990|Nam|Phường Tân Lợi, TP BMT...|...
    try {
      const parts = decodedText.split('|');
      if (parts.length >= 6) {
        const cccd = parts[0];
        // Tìm kiếm trong CSDL giả lập
        const user = mockData.find(u => u.cccd === cccd);
        
        if (user) {
          navigate(`/form/${cccd}`, { state: { userData: user } });
        } else {
          setError(`Không tìm thấy dữ liệu BHXH cho số CCCD: ${cccd}`);
        }
      } else {
        // Fallback for simple testing if QR is just CCCD number
        const user = mockData.find(u => u.cccd === decodedText);
        if (user) {
          navigate(`/form/${decodedText}`, { state: { userData: user } });
        } else {
          setError('Mã QR không đúng định dạng CCCD.');
        }
      }
    } catch (err) {
      setError('Lỗi phân tích dữ liệu QR.');
    }
  };

  const onScanSuccess = (decodedText, decodedResult) => {
    setScanResult(decodedText);
    processQrData(decodedText);
    if (scannerRef.current) {
      scannerRef.current.clear();
    }
  };

  const onScanFailure = (error) => {
    // suppress errors as they fire on every frame where QR is not found
  };

  // Tính năng giả lập (dành cho Demo khi không có camera/QR)
  const handleMockScan = (cccd) => {
    processQrData(cccd);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.75rem', color: 'var(--text-dark)' }}>Quét Căn cước công dân</h2>
      </div>

      {error && (
        <div style={{ 
          background: 'rgba(239, 68, 68, 0.1)', 
          borderLeft: '4px solid var(--danger-color)',
          padding: '1rem',
          borderRadius: '4px 8px 8px 4px',
          marginBottom: '1.5rem',
          display: 'flex',
          gap: '1rem',
          alignItems: 'center'
        }}>
          <AlertTriangle color="var(--danger-color)" />
          <p style={{ margin: 0, color: 'var(--danger-color)', fontWeight: '500' }}>{error}</p>
        </div>
      )}

      <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div id="reader" style={{ width: '100%', maxWidth: '500px', border: 'none', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}></div>
        
        <div style={{ marginTop: '2rem', textAlign: 'center', width: '100%' }}>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>HOẶC SỬ DỤNG DỮ LIỆU MẪU ĐỂ TEST</p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button className="btn btn-outline" onClick={() => handleMockScan('040090001234')}>
              <QrCode size={18} />
              Test Nguyễn Văn A
            </button>
            <button className="btn btn-outline" onClick={() => handleMockScan('040085004321')}>
              <QrCode size={18} />
              Test Trần Thị B
            </button>
            <button className="btn btn-outline" onClick={() => handleMockScan('invalid_cccd')}>
              <AlertTriangle size={18} />
              Test Lỗi QR
            </button>
          </div>
        </div>
      </div>
      
      {/* Thêm CSS cho html5-qrcode UI vì nó tạo HTML nội tuyến khá xấu */}
      <style>{`
        #reader { border: none !important; }
        #reader__dashboard_section_csr span { color: var(--text-dark) !important; }
        #reader button { 
          background: var(--primary-color);
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 6px;
          cursor: pointer;
          margin: 4px;
        }
      `}</style>
    </div>
  );
};

export default Scanner;
