
import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { GeneratedLessonPlan, ManualInputData } from '../types.ts';
import { Download, Printer, ChevronLeft, FileText, Settings, X, FileType, Check } from 'lucide-react';

interface Props {
  data: GeneratedLessonPlan;
  config: ManualInputData;
  onBack: () => void;
}

const ResultDisplay: React.FC<Props> = ({ data, config, onBack }) => {
  const [showSettings, setShowSettings] = useState(false);
  const [printSettings, setPrintSettings] = useState({
    schoolName: 'TRƯỜNG THCS ........................',
    deptName: `TỔ: ${config.subject.toUpperCase()}`,
    teacherName: '....................................',
    schoolYear: '2024 - 2025'
  });

  const handlePrint = () => window.print();

  const exportToWord = () => {
    const content = document.getElementById('lesson-print-area')?.innerHTML;
    if (!content) return;
    
    const header = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head><meta charset='utf-8'><title>Giáo án CV 5512</title>
      <style>
        @page { size: A4; margin: 2.0cm 2.0cm; }
        body { font-family: "Times New Roman", Times, serif; font-size: 11pt; line-height: 1.5; color: black; }
        table { border-collapse: collapse; width: 100%; border: 0.5pt solid black; margin-bottom: 10pt; }
        th, td { border: 0.5pt solid black; padding: 6pt; text-align: left; vertical-align: top; font-size: 11pt; }
        h1, h2, h3 { text-align: center; text-transform: uppercase; font-weight: bold; }
        .red-text { color: red !important; }
      </style>
      </head><body>
    `;
    const footer = "</body></html>";
    const sourceHTML = header + content + footer;
    
    const blob = new Blob(['\ufeff', sourceHTML], { type: 'application/msword' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Giao_an_Nang_luc_so_${config.lessonName.replace(/\s+/g, '_')}.doc`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full bg-slate-100">
      <style>{`
        @media print {
          @page { size: A4; margin: 1.5cm 1.5cm 1.5cm 2.5cm; }
          .no-print { display: none !important; }
          body { background: white !important; }
          .print-area { box-shadow: none !important; margin: 0 !important; width: 100% !important; padding: 0 !important; }
          .red-text { color: red !important; -webkit-print-color-adjust: exact; }
          table { width: 100% !important; border-collapse: collapse !important; }
          th, td { border: 1px solid black !important; padding: 5px !important; }
        }
        .lesson-markdown-body h1 { font-size: 14pt; font-weight: bold; text-align: center; margin: 15pt 0; text-transform: uppercase; }
        .lesson-markdown-body h2 { font-size: 12pt; font-weight: bold; margin: 12pt 0 5pt 0; text-transform: uppercase; }
        .lesson-markdown-body h3 { font-size: 11pt; font-weight: bold; margin: 10pt 0 5pt 0; }
        .lesson-markdown-body table { width: 100%; border-collapse: collapse; margin-bottom: 15pt; }
        .lesson-markdown-body th, .lesson-markdown-body td { border: 1px solid black; padding: 8px; vertical-align: top; }
        .lesson-markdown-body p { margin-bottom: 8pt; text-align: justify; }
        .lesson-markdown-body ul, .lesson-markdown-body ol { margin-bottom: 8pt; padding-left: 20pt; }
      `}</style>

      {/* Toolbar */}
      <div className="no-print bg-white border-b px-8 py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <button onClick={onBack} className="flex items-center gap-2 text-slate-600 hover:text-sky-600 font-black text-xs uppercase tracking-widest transition-all">
          <ChevronLeft size={20} /> Quay lại
        </button>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className="p-3 bg-slate-50 text-slate-500 hover:bg-slate-100 rounded-xl transition-all"
            title="Thiết lập văn bản"
          >
            <Settings size={20} />
          </button>
          <button 
            onClick={exportToWord}
            className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-slate-100 text-slate-700 hover:border-sky-500 hover:text-sky-600 rounded-xl font-black text-xs uppercase tracking-widest transition-all"
          >
            <FileType size={18} /> Word
          </button>
          <button 
            onClick={handlePrint}
            className="flex items-center gap-2 px-6 py-3 bg-slate-950 text-white hover:bg-sky-600 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-slate-950/20"
          >
            <Printer size={18} /> In / PDF
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-12 flex justify-center relative">
        {/* Settings Flyout */}
        {showSettings && (
          <div className="absolute top-12 right-12 w-80 bg-white shadow-2xl rounded-[2.5rem] p-8 border border-slate-100 z-[60] animate-in fade-in slide-in-from-top-4">
             <div className="flex justify-between items-center mb-6">
                <h4 className="font-black text-xs uppercase tracking-[0.2em] text-slate-400">Thiết lập mẫu</h4>
                <button onClick={() => setShowSettings(false)}><X size={18} /></button>
             </div>
             <div className="space-y-4">
               <div>
                 <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Tên trường</label>
                 <input className="w-full px-4 py-3 bg-slate-50 border rounded-xl font-bold text-sm" value={printSettings.schoolName} onChange={e => setPrintSettings({...printSettings, schoolName: e.target.value})} />
               </div>
               <div>
                 <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Tổ chuyên môn</label>
                 <input className="w-full px-4 py-3 bg-slate-50 border rounded-xl font-bold text-sm" value={printSettings.deptName} onChange={e => setPrintSettings({...printSettings, deptName: e.target.value})} />
               </div>
               <div>
                 <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Họ tên giáo viên</label>
                 <input className="w-full px-4 py-3 bg-slate-50 border rounded-xl font-bold text-sm" value={printSettings.teacherName} onChange={e => setPrintSettings({...printSettings, teacherName: e.target.value})} />
               </div>
               <button onClick={() => setShowSettings(false)} className="w-full py-4 bg-slate-950 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl">Áp dụng</button>
             </div>
          </div>
        )}

        <div 
          id="lesson-print-area"
          className="bg-white w-[21cm] min-h-[29.7cm] p-[2.5cm] shadow-2xl shadow-slate-300/40 print-area animate-in zoom-in-95 duration-500 border-t-[12px] border-sky-600"
        >
          {/* Header CV 5512 */}
          <div className="flex justify-between items-start mb-10 font-serif">
            <div className="w-[45%] text-center">
              <p className="uppercase text-[11pt] font-medium leading-tight">{printSettings.schoolName}</p>
              <p className="uppercase text-[11pt] font-bold leading-tight">{printSettings.deptName}</p>
              <div className="w-24 h-[0.5pt] bg-black mx-auto mt-1"></div>
            </div>
            <div className="w-[50%] text-center italic text-[11pt]">
              Họ và tên giáo viên: <br/>
              <span className="font-bold uppercase not-italic">{printSettings.teacherName}</span>
            </div>
          </div>

          <div className="lesson-markdown-body font-serif text-[11pt] leading-relaxed text-black">
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]}
              components={{
                span: ({node, style, children, ...props}) => {
                  // Custom handling for the red text
                  const isRed = style?.color === 'red' || (props as any).style?.color === 'red';
                  return <span className={isRed ? 'red-text font-bold' : ''} style={style} {...props}>{children}</span>;
                }
              }}
            >
              {data.content}
            </ReactMarkdown>
          </div>

          {/* Footer Signature */}
          <div className="mt-16 flex justify-between font-serif text-[11pt] italic">
            <div className="w-1/3 text-center">
              <p className="font-bold uppercase not-italic mb-20">PHÊ DUYỆT CỦA BGH</p>
              <p>.......................................</p>
            </div>
            <div className="w-1/3 text-center">
              <p className="font-bold uppercase not-italic mb-20">TỔ TRƯỞNG CHUYÊN MÔN</p>
              <p>.......................................</p>
            </div>
            <div className="w-1/3 text-center">
              <p className="mb-1">........, ngày .... tháng .... năm 20...</p>
              <p className="font-bold uppercase not-italic mb-20">NGƯỜI SOẠN</p>
              <p className="font-bold not-italic">{printSettings.teacherName}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultDisplay;
