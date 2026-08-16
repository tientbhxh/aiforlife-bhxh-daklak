import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, ShieldAlert, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { GoogleGenAI } from '@google/genai';

const SYSTEM_PROMPT = `
Bạn là Trợ lý AI Hành chính của cơ quan Bảo hiểm Xã hội (BHXH) tỉnh Đắk Lắk.
Nhiệm vụ của bạn là tư vấn các chính sách, quy định, thủ tục liên quan đến Bảo hiểm xã hội (BHXH), Bảo hiểm y tế (BHYT), và Bảo hiểm thất nghiệp (BHTN) cho người dân tại Việt Nam, đặc biệt là Đắk Lắk.

QUY TẮC QUAN TRỌNG NHẤT (CHỐNG BỊA ĐẶT THÔNG TIN):
- TUYỆT ĐỐI KHÔNG tự bịa ra các đường link (URL), địa chỉ website, hoặc số điện thoại.
- Chỉ sử dụng các thông tin chính thức sau đây khi hướng dẫn người dân nộp hồ sơ hoặc tra cứu trực tuyến:
  + Cổng Dịch vụ công BHXH Việt Nam: https://dichvucong.baohiemxahoi.gov.vn
  + Cổng Dịch vụ công Quốc gia: https://dichvucong.gov.vn
  + Ứng dụng trên điện thoại: VssID - Bảo hiểm xã hội số
  + Website BHXH tỉnh Đắk Lắk: https://daklak.baohiemxahoi.gov.vn
  + Tổng đài chăm sóc khách hàng của BHXH Việt Nam: 1900 9068

Luôn trả lời bằng tiếng Việt, ngôn ngữ lịch sự, rõ ràng, dễ hiểu. Nếu người dùng hỏi ngoài phạm vi BHXH/BHYT, hãy từ chối một cách lịch sự.
Cố gắng cung cấp các bước thực hiện thủ tục rõ ràng nếu người dùng hỏi về thủ tục.
`;

const Chatbot = ({ embedded = false }) => {
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
      const ai = new GoogleGenAI({ apiKey: apiKey });

      const history = messages.map(m => ({
        role: m.role === 'model' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }));
      
      // Lấy danh sách model từ API để đảm bảo luôn dùng đúng model đang được hỗ trợ
      const modelsResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
      const modelsData = await modelsResponse.json();
      const availableModels = modelsData.models || [];
      
      // Lọc các model flash, hỗ trợ generateContent, và ĐẶC BIỆT loại bỏ gemini-2.5 (vì Google đã khóa user mới)
      const flashModels = availableModels.filter(m => 
        m.name.includes('flash') && 
        !m.name.includes('2.5') &&
        m.supportedGenerationMethods && 
        m.supportedGenerationMethods.includes('generateContent')
      ).sort((a, b) => b.name.localeCompare(a.name));

      const candidateModels = flashModels.map(m => m.name.replace('models/', ''));
      
      // Thêm các alias dự phòng an toàn nhất
      candidateModels.push('gemini-flash-latest', 'gemini-3.6-flash');

      let success = false;
      let responseText = '';
      let lastError = null;

      for (const modelName of candidateModels) {
        try {
          const response = await ai.models.generateContent({
            model: modelName,
            contents: [...history, { role: 'user', parts: [{ text: userMessage.content }] }],
            config: {
              systemInstruction: SYSTEM_PROMPT,
            }
          });
          responseText = response.text;
          success = true;
          break; // Thành công thì thoát vòng lặp
        } catch (err) {
          lastError = err;
          console.warn(`Model ${modelName} failed:`, err);
        }
      }

      if (!success) {
        throw lastError || new Error('Không tìm thấy model nào khả dụng');
      }

      setMessages(prev => [...prev, { role: 'model', content: responseText }]);
    } catch (err) {
      console.error(err);
      setError(`Lỗi kết nối AI: ${err.message}. Vui lòng kiểm tra lại API Key hoặc mạng.`);
      setMessages(prev => [...prev, { role: 'model', content: 'Xin lỗi, tôi đang gặp sự cố kết nối. Vui lòng thử lại sau.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`flex flex-col w-full h-full ${embedded ? 'p-0' : 'max-w-4xl mx-auto p-4'}`}>
      {!embedded && (
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white glow-text mb-2">Trợ lý AI Tự động</h2>
          <p className="text-cyan-500/80">Hỏi đáp nhanh các quy định về BHXH, BHYT, BHTN.</p>
        </div>
      )}

      {error && (
        <div className="bg-red-900/20 border-l-4 border-red-500 p-3 rounded-r-lg mb-4 flex items-center gap-2">
          <ShieldAlert className="text-red-500" size={18} />
          <span className="text-red-400 text-sm">{error}</span>
        </div>
      )}

      <div className={`flex flex-col flex-1 overflow-hidden ${!embedded ? 'bg-slate-900/50 border border-cyan-500/20 rounded-xl backdrop-blur-sm shadow-[0_8px_32px_rgba(0,0,0,0.3)]' : ''}`}>
        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 custom-scrollbar">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'self-end' : 'self-start'}`}>
              {msg.role === 'model' && (
                <div className="w-8 h-8 rounded-full bg-cyan-900 border border-cyan-500/50 flex items-center justify-center text-cyan-400 shrink-0 shadow-[0_0_10px_rgba(34,211,238,0.2)]">
                  <Bot size={16} />
                </div>
              )}
              
              <div className={`p-3 rounded-2xl ${msg.role === 'user' 
                ? 'bg-cyan-600 text-white rounded-tr-sm shadow-[0_0_15px_rgba(8,145,178,0.4)]' 
                : 'bg-slate-800/80 border border-slate-700 text-slate-300 rounded-tl-sm shadow-inner'
              }`}>
                {msg.role === 'user' ? (
                  <p className="text-sm">{msg.content}</p>
                ) : (
                  <div className="markdown-body text-sm leading-relaxed prose prose-invert prose-p:mb-2 prose-p:last:mb-0 prose-ul:my-1 max-w-none">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                )}
              </div>

              {msg.role === 'user' && (
                <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center text-slate-400 shrink-0">
                  <User size={16} />
                </div>
              )}
            </div>
          ))}
          
          {isLoading && (
            <div className="flex gap-3 self-start">
               <div className="w-8 h-8 rounded-full bg-cyan-900 border border-cyan-500/50 flex items-center justify-center text-cyan-400 animate-pulse">
                  <Bot size={16} />
                </div>
                <div className="bg-slate-800/80 border border-slate-700 p-3 rounded-2xl rounded-tl-sm flex items-center gap-2">
                  <Loader2 className="animate-spin text-cyan-400" size={16} />
                  <span className="text-slate-400 text-sm">Đang phân tích dữ liệu...</span>
                </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input form */}
        <div className="p-3 border-t border-cyan-500/20 bg-slate-900/80 backdrop-blur-md">
          <form onSubmit={handleSend} className="flex gap-2">
            <input 
              type="text" 
              className="flex-1 bg-slate-950 border border-slate-700 text-slate-200 text-sm rounded-lg px-4 py-2 focus:outline-none focus:border-cyan-500 focus:shadow-[0_0_10px_rgba(34,211,238,0.2)] transition-all" 
              placeholder="Nhập câu hỏi hoặc truy vấn..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isLoading}
            />
            <button 
              type="submit" 
              className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-lg flex items-center justify-center transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-[0_0_15px_rgba(34,211,238,0.5)]" 
              disabled={isLoading || !input.trim()}
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
