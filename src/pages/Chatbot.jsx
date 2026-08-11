import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, ShieldAlert, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const SYSTEM_PROMPT = `
Bạn là Trợ lý AI Hành chính của cơ quan Bảo hiểm Xã hội (BHXH) tỉnh Đắk Lắk.
Nhiệm vụ của bạn là tư vấn các chính sách, quy định, thủ tục liên quan đến Bảo hiểm xã hội (BHXH), Bảo hiểm y tế (BHYT), và Bảo hiểm thất nghiệp (BHTN) cho người dân tại Việt Nam, đặc biệt là Đắk Lắk.
Luôn trả lời bằng tiếng Việt, ngôn ngữ lịch sự, rõ ràng, dễ hiểu. Nếu người dùng hỏi ngoài phạm vi BHXH/BHYT, hãy từ chối một cách lịch sự.
Cố gắng cung cấp các bước thực hiện thủ tục rõ ràng nếu người dùng hỏi về thủ tục.
`;

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { role: 'model', content: 'Xin chào! Tôi là Trợ lý AI của cơ quan Bảo hiểm Xã hội Đắk Lắk. Tôi có thể giúp gì cho bạn hôm nay về các thủ tục BHXH, BHYT?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const apiKey = localStorage.getItem('gemini_api_key');
    if (!apiKey) {
      setError('Vui lòng cấu hình Google Gemini API Key trong phần Cài đặt trước khi sử dụng Chatbot.');
      return;
    }
    setError('');

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Lấy danh sách các mô hình khả dụng để tự động chọn mô hình flash mới nhất
      const modelsResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
      const modelsData = await modelsResponse.json();
      
      if (modelsData.error) {
        throw new Error(modelsData.error.message || 'Lỗi khi lấy danh sách mô hình');
      }

      // Tìm mô hình flash hỗ trợ generateContent, sắp xếp giảm dần (để lấy phiên bản mới nhất như 3.0, 3.5 thay vì 2.5)
      const availableModels = modelsData.models || [];
      const flashModels = availableModels.filter(m => 
        m.name.includes('flash') && 
        m.supportedGenerationMethods && 
        m.supportedGenerationMethods.includes('generateContent')
      ).sort((a, b) => b.name.localeCompare(a.name));

      const fallbackModels = availableModels.filter(m => 
        m.name.includes('gemini') && 
        m.supportedGenerationMethods && 
        m.supportedGenerationMethods.includes('generateContent')
      ).sort((a, b) => b.name.localeCompare(a.name));

      const candidateModels = [...flashModels, ...fallbackModels];

      if (candidateModels.length === 0) {
        throw new Error('Không tìm thấy mô hình AI nào khả dụng trên tài khoản của bạn.');
      }

      // Chuẩn bị payload cho Gemini API
      const history = messages.map(m => ({
        role: m.role === 'model' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }));
      
      const payload = {
        system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents: [...history, { role: 'user', parts: [{ text: userMessage.content }] }]
      };

      let success = false;
      let responseData = null;
      let lastError = null;

      // Thử lần lượt các mô hình từ mới nhất xuống cũ nhất
      for (const model of candidateModels) {
        try {
          const modelName = model.name.replace('models/', '');
          const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });
          
          const data = await response.json();
          if (data.error) {
            throw new Error(data.error.message);
          }
          
          responseData = data;
          success = true;
          break; // Thành công thì thoát vòng lặp
        } catch (err) {
          lastError = err;
          console.warn(`Model ${model.name} failed:`, err);
        }
      }

      if (!success) {
        throw new Error(lastError.message || 'Tất cả mô hình đều bị lỗi hoặc không được hỗ trợ.');
      }

      const botText = responseData.candidates[0].content.parts[0].text;
      setMessages(prev => [...prev, { role: 'model', content: botText }]);
    } catch (err) {
      console.error(err);
      setError(`Lỗi kết nối AI: ${err.message}. Vui lòng kiểm tra lại API Key hoặc mạng.`);
      setMessages(prev => [...prev, { role: 'model', content: 'Xin lỗi, tôi đang gặp sự cố kết nối. Vui lòng thử lại sau.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 150px)' }}>
      <div style={{ marginBottom: '1rem' }}>
        <h2 style={{ fontSize: '1.75rem', color: 'var(--text-dark)' }}>Trợ lý AI Tư vấn Chính sách</h2>
        <p style={{ color: 'var(--text-muted)' }}>Hỏi đáp nhanh các quy định về BHXH, BHYT, BHTN.</p>
      </div>

      {error && (
        <div style={{ background: 'rgba(239, 68, 68, 0.1)', borderLeft: '4px solid var(--danger-color)', padding: '0.75rem', borderRadius: '4px', marginBottom: '1rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <ShieldAlert color="var(--danger-color)" size={18} />
          <span style={{ color: 'var(--danger-color)', fontSize: '0.9rem' }}>{error}</span>
        </div>
      )}

      <div className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Khung Chat */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {messages.map((msg, idx) => (
            <div key={idx} style={{ 
              display: 'flex', 
              gap: '1rem', 
              alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '80%'
            }}>
              {msg.role === 'model' && (
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0 }}>
                  <Bot size={20} />
                </div>
              )}
              
              <div style={{ 
                background: msg.role === 'user' ? 'var(--primary-color)' : 'rgba(255,255,255,0.7)', 
                color: msg.role === 'user' ? 'white' : 'var(--text-dark)',
                padding: '1rem', 
                borderRadius: msg.role === 'user' ? '16px 16px 0 16px' : '16px 16px 16px 0',
                boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
                border: msg.role === 'model' ? '1px solid var(--glass-border)' : 'none'
              }}>
                {msg.role === 'user' ? (
                  msg.content
                ) : (
                  <div className="markdown-body" style={{ fontSize: '0.95rem', lineHeight: '1.5' }}>
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                )}
              </div>

              {msg.role === 'user' && (
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--bg-light)', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', flexShrink: 0 }}>
                  <User size={20} />
                </div>
              )}
            </div>
          ))}
          
          {isLoading && (
            <div style={{ display: 'flex', gap: '1rem', alignSelf: 'flex-start' }}>
               <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                  <Bot size={20} />
                </div>
                <div style={{ background: 'rgba(255,255,255,0.7)', padding: '1rem', borderRadius: '16px 16px 16px 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Loader2 className="animate-spin" size={18} color="var(--primary-color)" style={{ animation: 'spin 1s linear infinite' }} />
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Đang suy nghĩ...</span>
                </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input form */}
        <div style={{ padding: '1rem', borderTop: '1px solid var(--glass-border)', background: 'rgba(255,255,255,0.3)' }}>
          <form onSubmit={handleSend} style={{ display: 'flex', gap: '0.5rem' }}>
            <input 
              type="text" 
              className="input-field" 
              placeholder="Nhập câu hỏi của bạn về BHXH, BHYT..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
              style={{ flex: 1 }}
            />
            <button 
              type="submit" 
              className="btn btn-primary" 
              disabled={isLoading || !input.trim()}
              style={{ padding: '0 1.5rem' }}
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>
      <style>{`
        @keyframes spin { 100% { transform: rotate(360deg); } }
        .markdown-body p { margin-bottom: 0.5rem; }
        .markdown-body p:last-child { margin-bottom: 0; }
        .markdown-body ul, .markdown-body ol { margin-left: 1.5rem; margin-bottom: 0.5rem; }
        .markdown-body strong { font-weight: 600; color: var(--primary-dark); }
      `}</style>
    </div>
  );
};

export default Chatbot;
