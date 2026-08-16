import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { QrCode, AlertTriangle } from 'lucide-react';
import mockData from '../data/mock_bhxh_data.json';

const Scanner = () => {
  const navigate = useNavigate();
  const [scanResult, setScanResult] = useState(null);
  const [error, setError] = useState('');
  const scannerRef = useRef(null);

  useEffect(() => {
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
    try {
      const parts = decodedText.split('|');
      if (parts.length >= 6) {
        const cccd = parts[0];
        const user = mockData.find(u => u.cccd === cccd);
        
        if (user) {
          navigate(`/form/${cccd}`, { state: { userData: user } });
        } else {
          setError(`Không tìm thấy dữ liệu BHXH cho số CCCD: ${cccd}`);
        }
      } else {
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
    // suppress errors
  };

  const handleMockScan = (cccd) => {
    processQrData(cccd);
  };

  return (
    <div className="flex flex-col items-center w-full">
      {error && (
        <div className="w-full bg-red-900/20 border-l-4 border-red-500 p-4 rounded-r-lg mb-6 flex items-center gap-3">
          <AlertTriangle className="text-red-500" />
          <p className="m-0 text-red-400 font-medium">{error}</p>
        </div>
      )}

      <div className="w-full max-w-md bg-slate-950/50 rounded-xl overflow-hidden border border-slate-800 shadow-inner p-2">
        <div id="reader" className="w-full rounded-lg overflow-hidden !border-none"></div>
      </div>
      
      <div className="mt-8 text-center w-full">
        <p className="text-blue-200 dark:text-slate-400 text-xs font-semibold tracking-widest uppercase mb-4">Dữ liệu Giả lập (Test Data)</p>
        <div className="flex gap-4 justify-center flex-wrap">
          <button 
            className="group relative overflow-hidden flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium hover:shadow-lg transition-all duration-300 hover:scale-105 border border-white/10" 
            onClick={() => handleMockScan('040090001234')}
          >
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:animate-shimmer"></div>
            <QrCode size={18} className="relative z-10" />
            <span className="relative z-10">Nguyễn Văn A</span>
          </button>
          <button 
            className="group relative overflow-hidden flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium hover:shadow-lg transition-all duration-300 hover:scale-105 border border-white/10" 
            onClick={() => handleMockScan('040085004321')}
          >
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent group-hover:animate-shimmer"></div>
            <QrCode size={18} className="relative z-10" />
            <span className="relative z-10">Trần Thị B</span>
          </button>
        </div>
      </div>
      
      {/* Tweak html5-qrcode UI to match theme */}
      <style>{`
        #reader { border: none !important; }
        #reader__dashboard_section_csr span { color: #bfdbfe !important; } /* blue-200 */
        .dark #reader__dashboard_section_csr span { color: #94a3b8 !important; }
        
        #reader button { 
          background: rgba(255, 255, 255, 0.1);
          color: white; 
          border: 1px solid rgba(255, 255, 255, 0.2); 
          padding: 8px 16px;
          border-radius: 9999px;
          cursor: pointer;
          margin: 4px;
          transition: all 0.3s ease;
          font-weight: 500;
        }
        .dark #reader button {
          background: #1e293b;
          color: #e2e8f0; 
          border-color: #334155; 
        }
        
        #reader button:hover {
          border-color: #60a5fa; 
          background: #2563eb;
          color: white;
        }
        .dark #reader button:hover {
          border-color: #38bdf8; 
          background: #38bdf8;
          color: white;
        }
        
        #reader a { color: #93c5fd !important; }
        .dark #reader a { color: #38bdf8 !important; }
      `}</style>
    </div>
  );
};

export default Scanner;
