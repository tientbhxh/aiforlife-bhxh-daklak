import React, { useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Download, CheckCircle, ArrowLeft, Printer } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const FormAutoFill = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const userData = location.state?.userData;
  const formRef = useRef(null);
  
  const [isExporting, setIsExporting] = useState(false);
  const [formType, setFormType] = useState('14-HSB');

  if (!userData) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <h2>Không có dữ liệu</h2>
        <button className="btn btn-primary" onClick={() => navigate('/scanner')}>Quay lại quét CCCD</button>
      </div>
    );
  }

  const handleExportPDF = async () => {
    setIsExporting(true);
    try {
      const element = formRef.current;
      const canvas = await html2canvas(element, { 
        scale: 2,
        useCORS: true,
        logging: false
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Bieu_mau_${formType}_${userData.cccd}.pdf`);
    } catch (error) {
      console.error('Error generating PDF', error);
      alert('Đã xảy ra lỗi khi tạo PDF.');
    } finally {
      setIsExporting(false);
    }
  };

  const today = new Date();
  const dateStr = `ngày ${today.getDate()} tháng ${today.getMonth() + 1} năm ${today.getFullYear()}`;

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button onClick={() => navigate('/scanner')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-dark)' }}>
            <ArrowLeft size={24} />
          </button>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--text-dark)', margin: 0 }}>Xác nhận Biểu mẫu</h2>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem' }}>
          <select 
            className="input-field" 
            style={{ width: '200px', padding: '0.5rem' }}
            value={formType}
            onChange={(e) => setFormType(e.target.value)}
          >
            <option value="14-HSB">Mẫu 14-HSB (Giải quyết chế độ)</option>
            <option value="09-HSB">Mẫu 09-HSB</option>
          </select>
          <button className="btn btn-primary" onClick={handleExportPDF} disabled={isExporting}>
            {isExporting ? 'Đang tạo...' : <><Download size={18} /> Tải PDF</>}
          </button>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(16, 185, 129, 0.1)' }}>
        <CheckCircle color="var(--success-color)" size={24} />
        <div>
          <h4 style={{ margin: 0, color: 'var(--success-color)', fontSize: '1.1rem' }}>Dữ liệu đã được đối chiếu thành công!</h4>
          <p style={{ margin: 0, color: 'var(--text-dark)', fontSize: '0.9rem' }}>Thông tin từ CCCD khớp với cơ sở dữ liệu BHXH (Mã số: {userData.bhxhCode}).</p>
        </div>
      </div>

      {/* Vùng hiển thị biểu mẫu (Sẽ được in ra PDF) */}
      <div 
        className="glass-panel" 
        style={{ padding: '2rem', background: '#fff', color: '#000', overflowX: 'auto' }}
      >
        <div 
          ref={formRef} 
          style={{ width: '210mm', minHeight: '297mm', padding: '20mm', background: 'white', boxSizing: 'border-box', margin: '0 auto', fontFamily: '"Times New Roman", Times, serif', fontSize: '14pt', lineHeight: '1.5' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
            <div style={{ textAlign: 'center', fontWeight: 'bold' }}>
              <p>BẢO HIỂM XÃ HỘI VIỆT NAM</p>
              <p>BHXH TỈNH ĐẮK LẮK</p>
            </div>
            <div style={{ textAlign: 'center', fontWeight: 'bold' }}>
              <p>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</p>
              <p>Độc lập - Tự do - Hạnh phúc</p>
            </div>
          </div>

          <h1 style={{ textAlign: 'center', fontSize: '16pt', fontWeight: 'bold', marginBottom: '2rem' }}>
            ĐƠN ĐỀ NGHỊ HƯỞNG TRỢ CẤP BHXH MỘT LẦN<br/>
            (Mẫu {formType})
          </h1>

          <div style={{ marginBottom: '1rem' }}>
            <p><strong>I. THÔNG TIN NGƯỜI LAO ĐỘNG</strong></p>
            <p>1. Họ và tên: <strong>{userData.fullName}</strong></p>
            <p>2. Ngày tháng năm sinh: {new Date(userData.dob).toLocaleDateString('vi-VN')} &nbsp;&nbsp;&nbsp;&nbsp; 3. Giới tính: {userData.gender}</p>
            <p>4. Số CCCD/Định danh cá nhân: <strong>{userData.cccd}</strong></p>
            <p>5. Mã số BHXH: <strong>{userData.bhxhCode}</strong></p>
            <p>6. Địa chỉ thường trú: {userData.address}</p>
            <p>7. Số điện thoại liên hệ: {userData.phone}</p>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <p><strong>II. THÔNG TIN QUÁ TRÌNH ĐÓNG BHXH</strong></p>
            <p>1. Đơn vị công tác cuối cùng: {userData.employer}</p>
            <p>2. Chức danh/Nghề nghiệp: {userData.currentJob}</p>
            <p>3. Tổng thời gian tham gia BHXH: {Math.floor(userData.participationMonths / 12)} năm {userData.participationMonths % 12} tháng.</p>
            <p>4. Mã thẻ BHYT hiện tại (nếu có): {userData.healthInsuranceCode}</p>
          </div>

          <div style={{ marginBottom: '3rem' }}>
            <p>Tôi xin cam đoan những nội dung kê khai trên là hoàn toàn đúng sự thật. Nếu sai, tôi xin chịu trách nhiệm trước pháp luật.</p>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', textAlign: 'center' }}>
            <div>
              <p><em>Đắk Lắk, {dateStr}</em></p>
              <p><strong>NGƯỜI LÀM ĐƠN</strong></p>
              <p style={{ marginTop: '60px' }}><strong>{userData.fullName}</strong></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormAutoFill;
