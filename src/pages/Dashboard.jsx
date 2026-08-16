import React from 'react';
import Scanner from './Scanner';
import Chatbot from './Chatbot';

const Dashboard = () => {
  return (
    <div className="w-full h-[calc(100vh-140px)] flex flex-col lg:flex-row gap-6">
      {/* Left Pane - QR Scanner */}
      <div className="flex-1 h-full min-h-[500px] flex flex-col bg-slate-800/80 border border-cyan-400/40 rounded-xl overflow-hidden backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
        <div className="p-4 border-b border-cyan-400/40 bg-slate-800 flex items-center gap-3">
          <h2 className="text-xl font-bold text-white tracking-wide glow-text">Hệ thống Nhận diện (QR)</h2>
        </div>
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          <Scanner />
        </div>
      </div>

      {/* Right Pane - Chatbot AI */}
      <div className="flex-1 h-full min-h-[500px] flex flex-col bg-slate-800/80 border border-cyan-400/40 rounded-xl overflow-hidden backdrop-blur-md shadow-[0_8px_32px_rgba(0,0,0,0.4)]">
        <div className="p-4 border-b border-cyan-400/40 bg-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white tracking-wide glow-text">Trợ lý AI Phân tích</h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
            </span>
            <span className="text-xs text-cyan-400 font-medium">Online</span>
          </div>
        </div>
        <div className="flex-1 overflow-hidden flex flex-col">
          <Chatbot embedded={true} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
