
import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles, Bot, User, Maximize2, Minimize2, HelpCircle, ChevronRight } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ChatMessage } from '../types';
import { chatWithAI } from '../services/geminiService';

interface ChatAssistantProps {
  currentMarkdown: string;
  onUpdateMarkdown: (newMarkdown: string) => void;
}

const ChatAssistant: React.FC<ChatAssistantProps> = ({ currentMarkdown, onUpdateMarkdown }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Dynamic welcome message based on context
  const getWelcomeMessage = () => {
    if (currentMarkdown) {
      return 'Chào thầy/cô! Tôi đã đọc giáo án hiện tại. Thầy/cô muốn chỉnh sửa phần nào, hay cần gợi ý thêm hoạt động số không?';
    }
    return 'Xin chào! Tôi là **Trợ lý Năng Lực Số**. \n\nTôi có thể giải đáp thắc mắc về **Thông tư 02/2025**, giải nghĩa các mã năng lực (ví dụ: 1.1TC1a) hoặc gợi ý ý tưởng dạy học. Thầy/cô cần hỗ trợ gì không ạ? 😊';
  };

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        id: 'welcome',
        role: 'model',
        text: getWelcomeMessage()
      }]);
    }
  }, [currentMarkdown]); // Re-trigger if context changes drastically (e.g. new plan generated)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen && !isMinimized) {
      scrollToBottom();
    }
  }, [messages, isOpen, isMinimized]);

  const handleSend = async (textInput: string = input) => {
    if (!textInput.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: textInput
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInput('');
    setIsLoading(true);

    // Create a placeholder for AI response
    const aiMsgId = (Date.now() + 1).toString();
    setMessages(prev => [...prev, {
      id: aiMsgId,
      role: 'model',
      text: '', // Start empty
    }]);

    try {
      await chatWithAI(
        newHistory, // Pass full history for context
        currentMarkdown, 
        (streamedText, isFullUpdate) => {
          if (isFullUpdate) {
            // Real-time Update Mode: Update the MAIN document, keep chat message simple
            onUpdateMarkdown(streamedText);
            
            setMessages(prev => prev.map(msg => 
              msg.id === aiMsgId 
                ? { ...msg, text: '✍️ Đang viết lại toàn bộ giáo án theo yêu cầu... (Thầy/cô xem kết quả bên màn hình chính)', isUpdatingDoc: true } 
                : msg
            ));
          } else {
            // Chat Mode: Update the chat bubble
            setMessages(prev => prev.map(msg => 
              msg.id === aiMsgId 
                ? { ...msg, text: streamedText } 
                : msg
            ));
          }
        }
      );
      
      // Final touch after streaming
      setMessages(prev => prev.map(msg => {
        if (msg.id === aiMsgId && msg.isUpdatingDoc) {
             return { ...msg, text: '✅ Đã cập nhật giáo án thành công! Thầy/cô kiểm tra lại nhé. 😊' };
        }
        return msg;
      }));

    } catch (error) {
      setMessages(prev => prev.map(msg => 
        msg.id === aiMsgId 
          ? { ...msg, text: 'Xin lỗi, kết nối bị gián đoạn. Thầy/cô vui lòng thử lại.' } 
          : msg
      ));
    } finally {
      setIsLoading(false);
    }
  };

  // Quick Suggestion Chips
  const suggestions = currentMarkdown 
    ? [
        "Thêm hoạt động khởi động vui nhộn",
        "Tích hợp mã 2.1TC1a vào bài",
        "Kiểm tra lại mục tiêu năng lực",
        "Đề xuất công cụ số thay thế"
      ]
    : [
        "Mã 1.1TC1a là gì?",
        "Năng lực số có mấy miền?",
        "Gợi ý công cụ dạy học số",
        "Cách soạn giáo án CV 5512"
      ];

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-full shadow-2xl hover:shadow-[0_0_30px_rgba(139,92,246,0.6)] hover:scale-110 transition-all z-[100] animate-in zoom-in duration-300 group flex items-center justify-center ring-4 ring-white/30 backdrop-blur-sm"
        title="Chat với trợ lý AI"
      >
        <MessageCircle className="w-8 h-8 group-hover:animate-bounce" />
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span>
        </span>
      </button>
    );
  }

  return (
    <div 
      className={`fixed z-[100] bg-white shadow-2xl flex flex-col transition-all duration-300 overflow-hidden font-sans
        ${isMinimized 
          ? 'bottom-8 right-8 w-80 h-16 rounded-full border-2 border-violet-500' 
          : 'bottom-8 right-8 w-[95vw] md:w-[450px] h-[650px] max-h-[85vh] rounded-3xl border border-gray-100'
        }
      `}
    >
      {/* Header */}
      <div 
        className="bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 p-5 flex justify-between items-center cursor-pointer shrink-0"
        onClick={() => !isMinimized && setIsMinimized(true)}
      >
        <div className="flex items-center text-white">
          <div className="bg-white/20 p-2 rounded-lg mr-3 backdrop-blur-sm">
             <Sparkles className="w-6 h-6 text-yellow-300" />
          </div>
          <div>
            <h3 className="font-bold text-lg leading-tight">Trợ Lý AI</h3>
            <p className="text-xs text-blue-100 opacity-90">{isMinimized ? 'Nhấn để mở rộng' : 'Hỗ trợ Năng lực số 24/7'}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {isMinimized ? (
             <button onClick={(e) => { e.stopPropagation(); setIsMinimized(false); }} className="text-white hover:bg-white/20 p-2 rounded-full transition-colors">
               <Maximize2 className="w-5 h-5" />
             </button>
          ) : (
            <>
              <button onClick={(e) => { e.stopPropagation(); setIsMinimized(true); }} className="text-white hover:bg-white/20 p-2 rounded-full transition-colors">
                <Minimize2 className="w-5 h-5" />
              </button>
              <button onClick={() => setIsOpen(false)} className="text-white hover:bg-white/20 p-2 rounded-full transition-colors">
                <X className="w-6 h-6" />
              </button>
            </>
          )}
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-slate-50 scroll-smooth">
            {messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              >
                {/* Avatar */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm border-2 border-white ${msg.role === 'user' ? 'bg-indigo-100' : 'bg-gradient-to-br from-violet-500 to-fuchsia-500'}`}>
                  {msg.role === 'user' ? <User className="w-6 h-6 text-indigo-600" /> : <Bot className="w-6 h-6 text-white" />}
                </div>
                
                {/* Chat Bubble */}
                <div 
                  className={`max-w-[85%] rounded-2xl p-4 text-base shadow-sm leading-relaxed
                    ${msg.role === 'user' 
                      ? 'bg-indigo-600 text-white rounded-tr-sm' 
                      : 'bg-white text-slate-800 rounded-tl-sm border border-slate-200'
                    }
                  `}
                >
                  {msg.isUpdatingDoc ? (
                    <div className="flex items-center text-indigo-700 font-bold bg-indigo-50 p-3 rounded-xl border border-indigo-100">
                      <Sparkles className="w-5 h-5 mr-3 animate-spin text-fuchsia-500" />
                      {msg.text}
                    </div>
                  ) : (
                    <ReactMarkdown 
                      remarkPlugins={[remarkGfm]} 
                      className={`prose prose-base max-w-none ${msg.role === 'user' ? 'prose-invert' : ''}`}
                      components={{
                        p: ({node, ...props}) => <p className="mb-2 last:mb-0" {...props} />,
                        ul: ({node, ...props}) => <ul className="list-disc pl-4 mb-2" {...props} />,
                        ol: ({node, ...props}) => <ol className="list-decimal pl-4 mb-2" {...props} />,
                      }}
                    >
                      {msg.text}
                    </ReactMarkdown>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Questions */}
          <div className="px-4 py-2 bg-slate-50 border-t border-gray-100 overflow-x-auto">
            <div className="flex gap-2 whitespace-nowrap pb-2">
              {suggestions.map((suggestion, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(suggestion)}
                  disabled={isLoading}
                  className="px-3 py-1.5 bg-white border border-indigo-100 text-indigo-600 text-sm rounded-full hover:bg-indigo-50 hover:border-indigo-300 transition-colors shadow-sm flex items-center disabled:opacity-50"
                >
                  {suggestion}
                  <ChevronRight className="w-3 h-3 ml-1 text-indigo-400" />
                </button>
              ))}
            </div>
          </div>

          {/* Input Area */}
          <div className="p-4 border-t border-gray-100 bg-white shadow-[0_-5px_20px_rgba(0,0,0,0.03)]">
            <form 
              onSubmit={(e) => { e.preventDefault(); handleSend(); }}
              className="flex gap-3 items-end"
            >
              <div className="flex-1 relative">
                <textarea
                  rows={1}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder={currentMarkdown ? "Nhập yêu cầu chỉnh sửa..." : "Hỏi về khung năng lực số..."}
                  className="w-full pl-5 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none text-base resize-none max-h-32 shadow-inner"
                  disabled={isLoading}
                  style={{ minHeight: '52px' }}
                />
              </div>
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="w-14 h-13 flex items-center justify-center bg-gradient-to-br from-violet-600 to-indigo-600 text-white rounded-2xl hover:shadow-lg hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 mb-0.5"
                style={{ height: '52px' }}
              >
                <Send className="w-6 h-6 ml-1" />
              </button>
            </form>
            <div className="mt-2 text-xs text-gray-400 text-center flex items-center justify-center gap-1.5 font-medium">
              <HelpCircle className="w-3.5 h-3.5" />
              AI hỗ trợ chuyên môn THCS & Khung năng lực số
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ChatAssistant;
