
import React, { useState } from 'react';
import ManualForm from './components/ManualForm.tsx';
import ResultDisplay from './components/ResultDisplay.tsx';
import ChatAssistant from './components/ChatAssistant.tsx';
import { ManualInputData, GeneratedLessonPlan, GenerationState } from './types.ts';
import { generateLessonPlan } from './services/geminiService.ts';
import { BookOpen, Sparkles, GraduationCap, ArrowLeft, Lightbulb } from 'lucide-react';

const App: React.FC = () => {
  const [state, setState] = useState<GenerationState>({
    isLoading: false,
    error: null,
    data: null,
  });
  const [currentConfig, setCurrentConfig] = useState<ManualInputData | null>(null);
  const [view, setView] = useState<'form' | 'results'>('form');

  const handleGenerate = async (config: ManualInputData) => {
    setState({ isLoading: true, error: null, data: null });
    setCurrentConfig(config);
    try {
      const result = await generateLessonPlan(config);
      setState({ isLoading: false, error: null, data: result });
      setView('results');
    } catch (error: any) {
      console.error(error);
      setState({ 
        isLoading: false, 
        error: "Không thể kết nối với AI. Thầy/cô vui lòng kiểm tra lại kết nối mạng hoặc thử lại sau.", 
        data: null 
      });
    }
  };

  const handleUpdateMarkdown = (newMarkdown: string) => {
    setState(prev => ({
      ...prev,
      data: prev.data ? { ...prev.data, content: newMarkdown } : null
    }));
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none -z-10">
        <div className="absolute top-0 left-0 w-full h-[50vh] bg-gradient-to-b from-sky-100/40 to-transparent"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-indigo-200/20 rounded-full blur-[120px]"></div>
      </div>

      {/* Header */}
      {view === 'form' && (
        <header className="bg-white/70 backdrop-blur-xl border-b border-slate-200 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-slate-950 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-slate-950/20">
                <GraduationCap size={28} />
              </div>
              <div>
                <h1 className="text-xl font-black text-slate-950 tracking-tight">
                  Trợ Lý <span className="text-sky-600">Giáo Án Năng Lực Số</span>
                </h1>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Tiêu chuẩn CV 5512 & Thông tư 02/2025</p>
              </div>
            </div>
            
            <div className="hidden md:flex items-center gap-6">
              <div className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-wider bg-slate-100 px-4 py-2 rounded-full">
                <Lightbulb size={14} className="text-yellow-500" />
                Dành cho giáo viên THCS
              </div>
            </div>
          </div>
        </header>
      )}

      {/* Main Content */}
      <main className={`flex-1 ${view === 'results' ? 'h-screen' : 'py-12 px-6 max-w-7xl mx-auto w-full'}`}>
        {view === 'form' ? (
          <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">
            <div className="text-center mb-16 space-y-4">
              <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-sky-50 text-sky-700 text-xs font-black uppercase tracking-[0.2em] border border-sky-100 shadow-sm">
                <Sparkles size={14} /> AI Chuyên môn giáo dục
              </div>
              <h2 className="text-5xl md:text-6xl font-black text-slate-950 tracking-tight leading-[1.1]">
                Tích hợp Năng Lực Số <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 to-indigo-600">Nhanh Chóng & Chuẩn Mẫu</span>
              </h2>
              <p className="text-slate-500 text-xl font-medium max-w-3xl mx-auto leading-relaxed">
                Soạn thảo kế hoạch bài dạy chi tiết theo mẫu 5512, tự động hóa việc lồng ghép các chỉ báo năng lực số của Thông tư 02/2025.
              </p>
            </div>

            {state.error && (
              <div className="max-w-4xl mx-auto mb-10 p-6 bg-red-50 border-2 border-red-100 rounded-3xl flex gap-4 text-red-700 animate-shake">
                <div className="bg-red-100 p-2 rounded-xl text-red-600 h-fit">
                  <ArrowLeft size={20} className="rotate-90" />
                </div>
                <div>
                  <h4 className="font-black uppercase text-xs tracking-widest mb-1">Đã xảy ra lỗi</h4>
                  <p className="font-semibold">{state.error}</p>
                </div>
              </div>
            )}

            <ManualForm onSubmit={handleGenerate} isLoading={state.isLoading} />
          </div>
        ) : (
          state.data && currentConfig && (
            <ResultDisplay 
              data={state.data} 
              config={currentConfig} 
              onBack={() => setView('form')} 
            />
          )
        )}
      </main>

      {/* Floating Assistant (Chat) */}
      {view === 'results' && state.data && (
        <ChatAssistant 
          currentMarkdown={state.data.content} 
          onUpdateMarkdown={handleUpdateMarkdown} 
        />
      )}

      {view === 'form' && (
        <footer className="py-12 border-t border-slate-100">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex gap-10">
              <div className="flex items-center gap-3 text-slate-400 font-bold">
                <BookOpen size={20} className="text-sky-600" />
                <span className="text-xs uppercase tracking-widest">Phụ lục IV - CV 5512</span>
              </div>
              <div className="flex items-center gap-3 text-slate-400 font-bold">
                <GraduationCap size={20} className="text-indigo-600" />
                <span className="text-xs uppercase tracking-widest">Thông tư 02/2025/BGDĐT</span>
              </div>
            </div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">© 2025 AI Giáo Dục - Chuyên nghiệp & Sáng tạo</p>
          </div>
        </footer>
      )}
    </div>
  );
};

export default App;
