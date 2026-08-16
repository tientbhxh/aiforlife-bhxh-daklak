import React, { useState } from 'react';
import Scanner from './Scanner';
import Chatbot from './Chatbot';
import { MessageCircle, X } from 'lucide-react';

const Dashboard = () => {
  const [isChatOpen, setIsChatOpen] = useState(true);

  return (
    <div className="w-full h-[calc(100vh-140px)] flex flex-col gap-6 relative">
      {/* Full width Scanner */}
      <div className="flex-1 w-full h-full min-h-[500px] flex flex-col bg-gradient-to-b from-white to-blue-50/50 dark:from-[#131b2f] dark:to-[#131b2f] border border-blue-200/60 dark:border-slate-700/50 rounded-2xl overflow-hidden shadow-[0_8px_30px_rgba(37,99,235,0.08)] dark:shadow-lg dark:shadow-black/20 transition-all duration-300 hover:border-blue-300 dark:hover:border-slate-600">
        <div className="p-5 border-b border-blue-100 dark:border-slate-700/50 flex items-center gap-3">
          <h2 className="text-xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-cyan-400 dark:to-blue-500">Hệ thống Nhận diện (QR)</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          <Scanner />
        </div>
      </div>

      {/* Floating Chatbot Widget */}
      <div className={`fixed bottom-6 right-6 z-50 flex flex-col items-end transition-all duration-300 ease-in-out`}>
        {/* Chat Window */}
        <div 
          className={`mb-4 transition-all duration-300 origin-bottom-right ${isChatOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'} flex flex-col w-[400px] h-[600px] max-w-[calc(100vw-2rem)] max-h-[calc(100vh-8rem)] bg-gradient-to-b from-white to-cyan-50/50 dark:from-[#131b2f] dark:to-[#131b2f] border border-cyan-200/60 dark:border-slate-700/50 rounded-2xl overflow-hidden shadow-[0_8px_30px_rgba(6,182,212,0.15)] dark:shadow-2xl dark:shadow-black/50`}
        >
          <div className="p-4 border-b border-cyan-100 dark:border-slate-700/50 flex items-center justify-between bg-white/80 dark:bg-[#131b2f]/80 backdrop-blur-sm z-10">
            <div>
              <h2 className="text-lg font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-cyan-400 dark:to-blue-500">Trợ lý AI</h2>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                </span>
                <span className="text-[10px] text-cyan-500 font-semibold uppercase">Online</span>
              </div>
              <button onClick={() => setIsChatOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
                <X size={20} />
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-hidden flex flex-col relative z-0">
            <Chatbot embedded={true} />
          </div>
        </div>

        {/* Floating Action Button */}
        <button 
          onClick={() => setIsChatOpen(!isChatOpen)}
          className={`w-14 h-14 rounded-full flex items-center justify-center text-white shadow-xl hover:scale-110 transition-all duration-300 relative group ${isChatOpen ? 'bg-slate-800 dark:bg-slate-700' : 'bg-gradient-to-r from-cyan-500 to-blue-600 border border-white/20'}`}
        >
          {!isChatOpen && (
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent group-hover:animate-shimmer rounded-full overflow-hidden"></div>
          )}
          {isChatOpen ? <X size={24} /> : <MessageCircle size={28} className="relative z-10" />}
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
