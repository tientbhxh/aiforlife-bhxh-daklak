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
        <p className="text-slate-400 text-xs font-semibold tracking-widest uppercase mb-4">Dữ liệu Giả lập (Test Data)</p>
        <div className="flex gap-4 justify-center flex-wrap">
          <button 
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 border border-cyan-400 text-white font-medium hover:from-cyan-500 hover:to-blue-500 hover:shadow-[0_0_20px_rgba(34,211,238,0.6)] transition-all duration-300 transform hover:scale-105" 
            onClick={() => handleMockScan('040090001234')}
          >
            <QrCode size={18} />
            <span>Nguyễn Văn A</span>
          </button>
          <button 
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 border border-cyan-400 text-white font-medium hover:from-cyan-500 hover:to-blue-500 hover:shadow-[0_0_20px_rgba(34,211,238,0.6)] transition-all duration-300 transform hover:scale-105" 
            onClick={() => handleMockScan('040085004321')}
          >
            <QrCode size={18} />
            <span>Trần Thị B</span>
          </button>
        </div>
      </div>
      
      {/* Tweak html5-qrcode UI to match cyberpunk theme */}
      <style>{`
        #reader { border: none !important; }
        #reader__dashboard_section_csr span { color: #94a3b8 !important; }
        #reader button { 
          background: #0f172a;
          color: #22d3ee;
          border: 1px solid #1e293b;
          padding: 8px 16px;
          border-radius: 8px;
          cursor: pointer;
          margin: 4px;
          transition: all 0.3s ease;
          font-weight: 500;
        }
        #reader button:hover {
          border-color: #06b6d4;
          box-shadow: 0 0 10px rgba(6, 182, 212, 0.3);
        }
        #reader a { color: #38bdf8 !important; }
      `}</style>
    </div>
  );
};

export default Scanner;
