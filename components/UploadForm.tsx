
import React, { useState, useRef, useEffect } from 'react';
import { UploadCloud, FileText, AlertCircle, Search, Hash, ChevronDown, ChevronRight, CheckSquare, Info, X, Copy, Check, ArrowRight, Zap, FileCode, Table, Trash2, Loader2 } from 'lucide-react';
import { UploadInputData, DIGITAL_COMPETENCY_FRAMEWORK, CompetencyComponent } from '../types';
import CompetencyLookupModal from './CompetencyLookupModal';
// @ts-ignore
import mammoth from 'mammoth';
// @ts-ignore
import * as pdfjsLib from 'pdfjs-dist';

// Cấu hình worker cho pdf.js từ CDN phù hợp với phiên bản import map
pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://esm.sh/pdfjs-dist@4.4.168/build/pdf.worker.min.mjs';

interface UploadFormProps {
  onSubmit: (data: UploadInputData) => void;
  isLoading: boolean;
}

// Helper function to get details for a specific code
const getCompetencyDetail = (code: string) => {
  for (const domain of DIGITAL_COMPETENCY_FRAMEWORK) {
    for (const comp of domain.components) {
      // Check component ID
      if (comp.id === code) return { code, desc: comp.description, title: comp.title, domain: domain.title };
      // Check indicators
      if (comp.indicators) {
        const found = comp.indicators.find(i => i.code === code);
        if (found) return { code, desc: found.description, title: comp.title, domain: domain.title };
      }
    }
  }
  return { code, desc: 'Mã tự nhập hoặc chưa xác định', title: 'Khác', domain: 'Khác' };
};

export const UploadForm: React.FC<UploadFormProps> = ({ onSubmit, isLoading }) => {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState('');
  const [competencies, setCompetencies] = useState<string[]>([]);
  const [isReadingFile, setIsReadingFile] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Competency Selection State
  const [expandedDomain, setExpandedDomain] = useState<string | null>(null);
  const [codeInputValue, setCodeInputValue] = useState('');
  const [isLookupModalOpen, setIsLookupModalOpen] = useState(false);
  const [viewingCompetency, setViewingCompetency] = useState<CompetencyComponent | null>(null);

  const processFile = async (selectedFile: File) => {
    setIsReadingFile(true);
    setFile(selectedFile);
    
    try {
      if (selectedFile.name.endsWith('.docx')) {
        // Handle Word Document
        const arrayBuffer = await selectedFile.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        setText(result.value);
      } else if (selectedFile.name.endsWith('.pdf')) {
        // Handle PDF Document using pdf.js
        const arrayBuffer = await selectedFile.arrayBuffer();
        const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;
        let fullText = '';
        
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageStrings = textContent.items.map((item: any) => item.str);
          fullText += pageStrings.join(' ') + '\n';
        }
        setText(fullText);
      } else if (selectedFile.type === 'text/plain') {
        // Handle Text File
        const textContent = await selectedFile.text();
        setText(textContent);
      } else {
        // Unsupported format for local extraction
        alert("Định dạng file không được hỗ trợ để trích xuất văn bản cục bộ. AI có thể vẫn xử lý được nhưng tốt nhất hãy dùng DOCX, PDF hoặc TXT.");
      }
    } catch (error) {
      console.error("Lỗi khi đọc file:", error);
      alert("Có lỗi xảy ra khi đọc file. Vui lòng thử lại.");
    } finally {
      setIsReadingFile(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  // Sync competencies with codeInputValue
  useEffect(() => {
    setCodeInputValue(competencies.join(', '));
  }, [competencies]);

  const handleCodeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCodeInputValue(val);
    const codes = val.split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0);
    setCompetencies(codes);
  };

  const toggleCompetency = (id: string) => {
    setCompetencies(prev => {
      const exists = prev.includes(id);
      if (exists) {
        return prev.filter(c => c !== id);
      } else {
        return [...prev, id];
      }
    });
  };
  
  const removeCompetency = (codeToRemove: string) => {
    setCompetencies(prev => prev.filter(c => c !== codeToRemove));
  };

  const addSpecificCode = (fullCode: string) => {
    setCompetencies(prev => {
      if (!prev.includes(fullCode)) {
        return [...prev, fullCode];
      }
      return prev;
    });
  };

  const toggleDomain = (domainId: string) => {
    if (expandedDomain === domainId) {
      setExpandedDomain(null);
    } else {
      setExpandedDomain(domainId);
    }
  };

  const handleSubmit = () => {
    if (!file && !text.trim()) {
      alert("Vui lòng tải lên file hoặc dán nội dung giáo án.");
      return;
    }

    // Với DOCX và PDF ta đã trích xuất text, ta ưu tiên gửi text để AI xử lý nhanh và chính xác nhất
    const isExtracted = file?.name.endsWith('.docx') || file?.name.endsWith('.pdf');
    
    onSubmit({ 
      textContent: text, 
      file: isExtracted ? null : file, 
      competencies 
    });
  };

  return (
    <div className="space-y-8 animate-fade-in-up w-full">
      <div className="bg-white/90 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/60 shadow-xl relative overflow-hidden transition-all hover:shadow-2xl">
         
        <div className="flex items-center gap-3 mb-8">
            <div className="bg-fuchsia-100 p-2 rounded-lg text-fuchsia-600">
               <FileCode className="w-6 h-6" />
             </div>
            <h3 className="text-xl font-bold text-slate-800">1. Cung cấp nội dung giáo án</h3>
        </div>
        
        <div 
          className="border-2 border-dashed border-fuchsia-200 rounded-3xl p-10 text-center bg-white hover:bg-fuchsia-50/50 transition-all cursor-pointer relative group/dropzone hover:border-fuchsia-400"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept=".pdf, .txt, .docx" 
            onChange={handleFileChange} 
          />
          
          {file ? (
            <div className="flex flex-col items-center text-fuchsia-600 animate-in zoom-in duration-300">
              <div className="w-24 h-24 bg-fuchsia-100 rounded-full flex items-center justify-center shadow-inner mb-4 relative">
                 {isReadingFile ? (
                   <Loader2 className="w-10 h-10 animate-spin text-fuchsia-600" />
                 ) : (
                   <FileText className="w-12 h-12" />
                 )}
              </div>
              <p className="font-bold text-2xl text-slate-800 mb-1">{file.name}</p>
              <p className="text-base text-slate-500 mb-6 font-mono">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              <div className="flex gap-2">
                 <button 
                  onClick={(e) => { e.stopPropagation(); setFile(null); setText(''); }}
                  className="text-sm text-red-500 hover:text-white hover:bg-red-500 px-6 py-2.5 rounded-full z-10 font-bold transition-all border border-red-200 hover:border-red-500 shadow-sm"
                >
                  Gỡ bỏ file
                </button>
              </div>
              {(file.name.endsWith('.docx') || file.name.endsWith('.pdf')) && !isReadingFile && (
                 <p className="text-xs text-green-600 mt-3 font-medium flex items-center">
                    <Check className="w-3 h-3 mr-1" /> Đã trích xuất nội dung văn bản thành công
                 </p>
              )}
              {isReadingFile && (
                <p className="text-xs text-indigo-600 mt-3 font-medium animate-pulse">
                  Đang phân tích dữ liệu từ file...
                </p>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center text-slate-500">
              <div className="w-24 h-24 bg-fuchsia-50 rounded-full flex items-center justify-center shadow-sm mb-6 group-hover/dropzone:scale-110 group-hover/dropzone:bg-fuchsia-100 transition-transform duration-300">
                <UploadCloud className="w-12 h-12 text-fuchsia-400" />
              </div>
              <p className="text-2xl font-bold text-slate-700">Tải lên file giáo án</p>
              <p className="text-base mt-3 text-slate-400 max-w-sm mx-auto">Kéo thả hoặc nhấn để chọn file <br/><span className="font-bold text-fuchsia-500">(Hỗ trợ PDF, DOCX, TXT)</span></p>
            </div>
          )}
        </div>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-slate-200/60"></div>
          </div>
          <div className="relative flex justify-center">
            <span className="px-4 bg-white/80 backdrop-blur text-sm font-bold text-slate-400 tracking-widest uppercase rounded-full">Hoặc dán văn bản</span>
          </div>
        </div>

        <div className="space-y-3">
          <textarea
            rows={8}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Dán nội dung bài học vào đây hoặc nội dung trích xuất từ file sẽ hiển thị tại đây..."
            className="w-full px-6 py-5 bg-white border border-slate-200 rounded-3xl focus:ring-2 focus:ring-fuchsia-400 focus:border-transparent outline-none transition text-base shadow-inner placeholder-slate-400 font-medium"
          />
          <div className="flex items-center text-sm text-amber-700 bg-amber-50/80 p-4 rounded-2xl border border-amber-100">
            <AlertCircle className="w-5 h-5 mr-3 text-amber-500" />
            <span className="font-bold mr-1">Lưu ý:</span> Ứng dụng đã hỗ trợ trích xuất văn bản từ <span className="font-bold">PDF</span>. Bạn có thể kiểm tra nội dung ở trên trước khi gửi cho AI.
          </div>
        </div>
      </div>

      <div className="bg-white/90 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/60 shadow-xl relative overflow-hidden transition-all hover:shadow-2xl">
        <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
             <div className="flex items-center gap-3">
               <div className="bg-violet-100 p-2 rounded-lg text-violet-600">
                 <Zap className="w-6 h-6" />
               </div>
               <h3 className="text-xl font-bold text-slate-800">2. Tích hợp Năng lực số</h3>
             </div>
          <button
              type="button"
              onClick={() => setIsLookupModalOpen(true)}
              className="flex items-center text-sm bg-violet-50 text-violet-600 border border-violet-200 hover:bg-violet-50 px-5 py-2.5 rounded-full transition-all shadow-sm font-bold group/btn ring-2 ring-transparent hover:ring-violet-100"
            >
              <Search className="w-4 h-4 mr-2 group-hover/btn:scale-110 transition-transform" />
              Tra cứu nhanh
            </button>
        </div>
        
        {/* Code Input Field */}
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Hash className="h-5 w-5 text-violet-400" />
          </div>
          <input
            type="text"
            value={codeInputValue}
            onChange={handleCodeInputChange}
            placeholder="Nhập mã nhanh (ví dụ: 1.1TC1a, 6.2TC1a...) hoặc sử dụng nút Tra cứu"
             className="w-full pl-11 pr-6 py-3.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-violet-400 focus:border-transparent outline-none transition shadow-sm font-medium"
          />
        </div>
        
        {/* Accordion List (Compact) */}
        <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white/50 shadow-sm ring-1 ring-slate-100">
             <div className="bg-slate-50/80 px-6 py-4 text-sm font-bold text-slate-600 border-b border-slate-200 uppercase tracking-wide backdrop-blur-sm">
               Danh sách các miền năng lực
             </div>
            {DIGITAL_COMPETENCY_FRAMEWORK.map((domain) => (
              <div key={domain.id} className="border-b last:border-b-0 border-slate-100">
                <button
                  type="button"
                  onClick={() => toggleDomain(domain.id)}
                   className="w-full flex items-center justify-between p-5 bg-transparent hover:bg-violet-50/50 transition text-left group"
                >
                  <div className="flex items-center">
                    <span className="font-bold text-slate-700 text-base group-hover:text-violet-700 transition-colors">{domain.title}</span>
                  </div>
                  {expandedDomain === domain.id ? (
                    <ChevronDown className="w-5 h-5 text-slate-500" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-violet-500" />
                  )}
                </button>
                
                {expandedDomain === domain.id && (
                  <div className="p-4 bg-slate-50/30 grid grid-cols-1 gap-3 animate-fade-in-up border-t border-slate-100">
                    <p className="text-sm text-slate-500 mb-2 px-2">{domain.description}</p>
                    {domain.components.map((comp) => {
                      const isSelected = competencies.includes(comp.id);
                      return (
                        <div
                          key={comp.id}
                           className={`
                            group flex items-center p-3 rounded-xl border text-sm transition-all duration-200 cursor-pointer
                            ${isSelected 
                              ? 'bg-violet-50 border-violet-300 shadow-sm' 
                              : 'bg-white border-slate-200 hover:border-violet-300 hover:shadow-sm'}
                          `}
                          onClick={() => toggleCompetency(comp.id)}
                        >
                          <div className="flex-1 flex items-start">
                            <div className={`w-5 h-5 mt-0.5 mr-3 rounded border flex items-center justify-center flex-shrink-0 transition-colors ${isSelected ? 'bg-violet-600 border-violet-600' : 'border-slate-300 bg-slate-50 group-hover:border-violet-400'}`}>
                              {isSelected && (
                                <Check className="w-3.5 h-3.5 text-white" />
                              )}
                            </div>
                            <div>
                               <span className={`block font-bold ${isSelected ? 'text-violet-700' : 'text-slate-800 group-hover:text-slate-900'}`}>{comp.title}</span>
                              <span className="text-xs text-slate-500 font-normal mt-0.5 block">{comp.description}</span>
                            </div>
                          </div>
                          
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setViewingCompetency(comp);
                            }}
                            className="ml-2 p-2 text-slate-400 hover:text-violet-600 hover:bg-violet-100 rounded-full transition-colors"
                            title="Xem chỉ báo chi tiết"
                          >
                            <Info className="w-4 h-4" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
        </div>
      </div>
      
      {/* PREVIEW TABLE */}
      {competencies.length > 0 && (
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm mb-8 animate-in fade-in slide-in-from-bottom-2">
            <div className="bg-slate-50/80 backdrop-blur-sm px-6 py-4 border-b border-slate-200 flex justify-between items-center">
              <h4 className="font-bold text-slate-700 flex items-center">
                <Table className="w-5 h-5 mr-2 text-violet-600" />
                Bảng xem trước năng lực đã chọn ({competencies.length})
              </h4>
              <span className="text-xs text-slate-500 italic">Kiểm tra kỹ trước khi tạo giáo án</span>
            </div>
            <div className="overflow-x-auto bg-white/60">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-100/50 text-slate-600 font-semibold uppercase text-xs">
                  <tr>
                    <th className="px-6 py-3 w-32">Mã số</th>
                    <th className="px-6 py-3">Nội dung / Hành vi chỉ báo</th>
                    <th className="px-6 py-3 w-24 text-center">Xóa</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {competencies.map(code => {
                    const detail = getCompetencyDetail(code);
                    return (
                      <tr key={code} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 font-bold text-violet-600 align-top">{code}</td>
                        <td className="px-6 py-4 align-top">
                           <div className="font-bold text-slate-800 mb-1">{detail.title}</div>
                           <div className="text-slate-600">{detail.desc}</div>
                        </td>
                        <td className="px-6 py-4 text-center align-top">
                          <button 
                            type="button"
                            onClick={() => removeCompetency(code)}
                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                            title="Xóa mã này"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={isLoading || isReadingFile}
        className="w-full relative overflow-hidden bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 hover:from-purple-700 hover:via-fuchsia-700 hover:to-pink-700 text-white font-extrabold py-5 px-10 rounded-2xl shadow-xl hover:shadow-2xl hover:shadow-purple-500/30 transition-all duration-300 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed group transform hover:-translate-y-1 active:scale-95"
      >
        <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
         {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-xl">Đang phân tích & tích hợp...</span>
          </>
        ) : (
          <>
            <Zap className="w-6 h-6 mr-3 group-hover:fill-yellow-300 group-hover:text-yellow-100 transition-colors" />
            <span className="text-xl uppercase tracking-wider">Tích hợp Năng Lực Số</span>
            <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform" />
          </>
        )}
      </button>

       {/* Competency Detail Modal (Specific Item) */}
       {viewingCompetency && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh] ring-1 ring-slate-200">
            <div className="bg-gradient-to-r from-fuchsia-50 to-white px-8 py-6 border-b border-slate-200 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-xl text-fuchsia-700">{viewingCompetency.title}</h3>
                <p className="text-base text-slate-500 mt-1">{viewingCompetency.description}</p>
              </div>
              <button 
                onClick={() => setViewingCompetency(null)}
                 className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full p-2 transition-all"
              >
                <X className="w-7 h-7" />
              </button>
            </div>
            
            <div className="p-0 overflow-y-auto">
              {/* Indicators Table */}
              {viewingCompetency.indicators && viewingCompetency.indicators.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-slate-200">
                    <thead className="bg-fuchsia-50 sticky top-0 z-10">
                      <tr>
                        <th className="px-8 py-4 text-left text-sm font-bold text-slate-600 uppercase tracking-wider w-40">Mã chi tiết</th>
                        <th className="px-8 py-4 text-left text-sm font-bold text-slate-600 uppercase tracking-wider">Hành vi / Chỉ báo</th>
                        <th className="px-6 py-4 w-20 text-center">Chọn</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-slate-200">
                      {viewingCompetency.indicators.map((ind) => {
                        const fullCode = ind.code; // Use raw code directly
                        const isAdded = competencies.includes(fullCode);
                        
                        return (
                          <tr key={ind.code} className="hover:bg-slate-50 transition-colors group">
                            <td className="px-8 py-6 whitespace-nowrap align-top">
                              <span className="font-bold text-fuchsia-600 block text-lg">{fullCode}</span>
                            </td>
                            <td className="px-8 py-6 text-base text-slate-700 align-top leading-loose group-hover:text-slate-900">
                              {ind.description}
                            </td>
                            <td className="px-6 py-6 text-center align-top">
                              <button
                                type="button"
                                onClick={() => addSpecificCode(fullCode)}
                                className={`p-3 rounded-xl transition-all shadow-sm border ${
                                  isAdded 
                                    ? 'bg-green-600 border-green-600 text-white hover:bg-green-700 scale-110 shadow-lg' 
                                    : 'bg-white border-slate-300 text-slate-400 hover:text-fuchsia-600 hover:border-fuchsia-400 hover:shadow-md'
                                }`}
                                title={isAdded ? "Đã chọn" : "Chọn mã này"}
                              >
                                {isAdded ? <CheckSquare className="w-6 h-6" /> : <Copy className="w-6 h-6" />}
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-10 text-center text-slate-500 italic bg-slate-50 m-6 rounded-2xl border border-dashed border-slate-300">
                  Không có chỉ báo chi tiết cho năng lực này.
                </div>
              )}
            </div>

            <div className="px-8 py-5 bg-slate-50 border-t border-slate-200 flex justify-between items-center">
              <span className="text-sm text-slate-500 italic font-medium">
                 *Tích hợp theo Thông tư 02/2025
              </span>
              <button 
                onClick={() => setViewingCompetency(null)} 
                className="px-6 py-3 text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded-xl transition font-bold text-sm ml-auto shadow-sm"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Full Lookup Modal */}
      <CompetencyLookupModal 
        isOpen={isLookupModalOpen}
        onClose={() => setIsLookupModalOpen(false)}
        selectedCodes={competencies}
        onToggleCode={toggleCompetency}
      />
    </div>
  );
};
