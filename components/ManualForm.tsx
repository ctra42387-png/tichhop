
import React, { useState, useEffect } from 'react';
import { ManualInputData, DIGITAL_COMPETENCY_FRAMEWORK, CompetencyComponent } from '../types';
import { SAMPLE_LESSONS } from '../constants';
import { 
  BookOpen, 
  Layers, 
  GraduationCap, 
  CheckSquare, 
  ChevronDown, 
  ChevronRight, 
  Hash, 
  Info, 
  X, 
  Copy, 
  BrainCircuit, 
  Library, 
  Edit2, 
  Search, 
  ArrowRight, 
  Bookmark, 
  Table, 
  Trash2, 
  Zap, 
  Book, 
  Sparkles, 
  Atom,
  Check,
  SearchCode,
  MousePointer2,
  Trophy,
  PenTool
} from 'lucide-react';
import CompetencyLookupModal from './CompetencyLookupModal';
import LessonCatalogModal from './LessonCatalogModal';

interface ManualFormProps {
  onSubmit: (data: ManualInputData) => void;
  isLoading: boolean;
}

const getCompetencyDetail = (code: string) => {
  for (const domain of DIGITAL_COMPETENCY_FRAMEWORK) {
    for (const comp of domain.components) {
      if (comp.id === code) return { code, desc: comp.description, title: comp.title, domain: domain.title };
      if (comp.indicators) {
        const found = comp.indicators.find(i => i.code === code);
        if (found) return { code, desc: found.description, title: comp.title, domain: domain.title };
      }
    }
  }
  return { code, desc: 'Mã tự nhập hoặc chưa xác định', title: 'Khác', domain: 'Khác' };
};

const ManualForm: React.FC<ManualFormProps> = ({ onSubmit, isLoading }) => {
  const [formData, setFormData] = useState<ManualInputData>({
    lessonName: '',
    subject: '',
    grade: '',
    textbook: '',
    competencies: []
  });

  const [expandedDomain, setExpandedDomain] = useState<string | null>(null);
  const [codeInputValue, setCodeInputValue] = useState('');
  const [viewingCompetency, setViewingCompetency] = useState<CompetencyComponent | null>(null);
  const [availableLessons, setAvailableLessons] = useState<string[]>([]);
  const [isManualLessonEntry, setIsManualLessonEntry] = useState(false);
  const [isLookupModalOpen, setIsLookupModalOpen] = useState(false);
  const [isCatalogModalOpen, setIsCatalogModalOpen] = useState(false);

  useEffect(() => {
    const { textbook, subject, grade } = formData;
    if (textbook && subject && grade && 
        SAMPLE_LESSONS[textbook] && 
        SAMPLE_LESSONS[textbook][subject] && 
        SAMPLE_LESSONS[textbook][subject][grade]) {
      setAvailableLessons(SAMPLE_LESSONS[textbook][subject][grade]);
    } else {
      setAvailableLessons([]);
      setIsManualLessonEntry(true);
    }
  }, [formData.textbook, formData.subject, formData.grade]);

  useEffect(() => {
    if (formData.competencies) {
       setCodeInputValue(formData.competencies.join(', '));
    }
  }, [formData.competencies]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCodeInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCodeInputValue(val);
    const codes = val.split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0);
    setFormData(prev => ({ ...prev, competencies: codes }));
  };

  const toggleCompetency = (id: string) => {
    setFormData(prev => {
      let newCompetencies;
      const currentCompetencies = prev.competencies || [];
      const exists = currentCompetencies.includes(id);
      if (exists) {
        newCompetencies = currentCompetencies.filter(c => c !== id);
      } else {
        newCompetencies = [...currentCompetencies, id];
      }
      return { ...prev, competencies: newCompetencies };
    });
  };

  const removeCompetency = (codeToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      competencies: prev.competencies?.filter(c => c !== codeToRemove) || []
    }));
  };

  const addSpecificCode = (fullCode: string) => {
    setFormData(prev => {
      const currentCompetencies = prev.competencies || [];
      if (!currentCompetencies.includes(fullCode)) {
        const newCompetencies = [...currentCompetencies, fullCode];
        return { ...prev, competencies: newCompetencies };
      }
      return prev;
    });
  };

  const toggleDomain = (domainId: string) => {
    setExpandedDomain(expandedDomain === domainId ? null : domainId);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleCatalogSelect = (lesson: any) => {
    setFormData(prev => ({
      ...prev,
      textbook: lesson.textbook,
      subject: lesson.subject,
      grade: lesson.grade,
      lessonName: lesson.lessonName
    }));
    setIsManualLessonEntry(false);
    setIsCatalogModalOpen(false);
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-16 w-full pb-40">
        
        {/* SECTION 1: DOCUMENT INFO */}
        <div className="glass-card-premium p-12 md:p-16 rounded-[4rem] relative overflow-hidden transition-all duration-700">
           <div className="absolute top-0 right-0 w-80 h-80 bg-sky-50 rounded-bl-full -mr-40 -mt-40 opacity-40"></div>
           
           <div className="flex justify-between items-start mb-16 flex-wrap gap-8 relative z-10">
             <div className="space-y-3">
               <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-slate-950 rounded-2xl flex items-center justify-center text-white font-black text-sm">01</div>
                 <h3 className="text-4xl font-black text-slate-950 tracking-tight">Kịch bản bài học</h3>
               </div>
               <p className="text-slate-500 font-semibold pl-16 text-lg">Cung cấp bối cảnh để AI biên soạn đúng trọng tâm.</p>
             </div>

             <button
               type="button"
               onClick={() => setIsCatalogModalOpen(true)}
               className="group flex items-center gap-4 px-10 py-5 bg-sky-50 text-sky-700 rounded-2xl border-2 border-sky-100 font-extrabold text-sm uppercase tracking-widest hover:bg-sky-600 hover:text-white hover:border-sky-600 transition-all shadow-sm active:scale-95"
             >
               <SearchCode className="w-6 h-6 group-hover:rotate-12 transition-transform" />
               Mở thư viện số
             </button>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 relative z-10">
                 {/* Textbook */}
                 <div className="md:col-span-2 space-y-4">
                   <label className="block text-xs font-black text-slate-400 uppercase tracking-[0.4em] ml-4">Hệ Thống Sách Giáo Khoa</label>
                   <div className="relative group/field">
                     <select
                       required
                       name="textbook"
                       value={formData.textbook}
                       onChange={handleInputChange}
                       className="w-full glass-input pl-10 pr-14 py-6 rounded-[2.5rem] outline-none text-slate-950 text-xl font-black appearance-none cursor-pointer"
                     >
                       <option value="">-- Click để chọn bộ sách giảng dạy --</option>
                       <option value="Kết nối tri thức với cuộc sống">📖 Kết nối tri thức với cuộc sống</option>
                       <option value="Chân trời sáng tạo">🌅 Chân trời sáng tạo</option>
                       <option value="Cánh Diều">🪁 Cánh Diều</option>
                       <option value="Sách chuyên đề / Khác">✨ Khác</option>
                     </select>
                     <ChevronDown className="absolute right-8 top-1/2 -translate-y-1/2 w-8 h-8 text-slate-300 pointer-events-none group-focus-within/field:rotate-180 transition-transform" />
                   </div>
                 </div>

                 {/* Subject */}
                 <div className="space-y-4">
                   <label className="block text-xs font-black text-slate-400 uppercase tracking-[0.4em] ml-4">Môn Học</label>
                    <div className="relative group/field">
                     <select
                       required
                       name="subject"
                       value={formData.subject}
                       onChange={handleInputChange}
                        className="w-full glass-input pl-10 pr-14 py-6 rounded-[2.5rem] outline-none text-slate-950 text-xl font-black appearance-none cursor-pointer"
                     >
                       <option value="">-- Chọn môn học --</option>
                       <option value="Khoa học tự nhiên">🧪 Khoa học tự nhiên</option>
                       <option value="Tin học">💻 Tin học</option>
                       <option value="Toán học">📐 Toán học</option>
                       <option value="Ngữ văn">📝 Ngữ văn</option>
                       <option value="Lịch sử & Địa lí">🌍 Lịch sử & Địa lí</option>
                       <option value="Công nghệ">⚙️ Công nghệ</option>
                       <option value="Giáo dục công dân">⚖️ Giáo dục công dân</option>
                       <option value="Tiếng Anh">🇬🇧 Tiếng Anh</option>
                       <option value="Hoạt động trải nghiệm">🎡 HĐ Trải nghiệm</option>
                     </select>
                     <ChevronDown className="absolute right-8 top-1/2 -translate-y-1/2 w-8 h-8 text-slate-300 pointer-events-none" />
                   </div>
                 </div>

                 {/* Grade */}
                 <div className="space-y-4">
                   <label className="block text-xs font-black text-slate-400 uppercase tracking-[0.4em] ml-4">Khối Lớp</label>
                   <div className="relative group/field">
                     <select
                       required
                       name="grade"
                       value={formData.grade}
                       onChange={handleInputChange}
                       className="w-full glass-input pl-10 pr-14 py-6 rounded-[2.5rem] outline-none text-slate-950 text-xl font-black appearance-none cursor-pointer"
                     >
                       <option value="">-- Chọn lớp --</option>
                       <option value="6">Lớp 6</option>
                       <option value="7">Lớp 7</option>
                       <option value="8">Lớp 8</option>
                       <option value="9">Lớp 9</option>
                     </select>
                     <ChevronDown className="absolute right-8 top-1/2 -translate-y-1/2 w-8 h-8 text-slate-300 pointer-events-none" />
                   </div>
                 </div>

                 {/* Lesson Name */}
                 <div className="md:col-span-2 space-y-4">
                   <div className="flex justify-between items-center ml-4">
                     <label className="text-xs font-black text-slate-400 uppercase tracking-[0.4em]">Tên Bài Dạy</label>
                     <button
                        type="button"
                        onClick={() => setIsManualLessonEntry(!isManualLessonEntry)}
                        className="text-[10px] font-black text-slate-500 bg-slate-100 px-5 py-2.5 rounded-xl hover:bg-slate-950 hover:text-white transition-all uppercase tracking-widest border border-slate-200"
                      >
                        {isManualLessonEntry ? 'Dùng thư viện' : 'Nhập tự do'}
                      </button>
                   </div>
                   
                   {!isManualLessonEntry && availableLessons.length > 0 ? (
                      <div className="relative group/field">
                       <select
                         required
                         name="lessonName"
                         value={formData.lessonName}
                         onChange={handleInputChange}
                         className="w-full glass-input pl-10 pr-14 py-6 rounded-[2.5rem] outline-none text-slate-950 text-xl font-black appearance-none cursor-pointer"
                       >
                         <option value="">-- Chọn bài học từ kho dữ liệu --</option>
                         {availableLessons.map((lesson, idx) => (
                           <option key={idx} value={lesson}>📌 {lesson}</option>
                         ))}
                       </select>
                       <ChevronDown className="absolute right-8 top-1/2 -translate-y-1/2 w-8 h-8 text-slate-300 pointer-events-none" />
                     </div>
                   ) : (
                     <div className="relative group/field">
                       <input
                         required
                         type="text"
                         name="lessonName"
                         value={formData.lessonName}
                         onChange={handleInputChange}
                         placeholder="Nhập tên bài dạy của thầy/cô tại đây..."
                         className="w-full glass-input px-10 py-6 rounded-[2.5rem] outline-none font-black text-slate-950 text-xl placeholder-slate-300"
                       />
                     </div>
                   )}
                 </div>
           </div>
        </div>

        {/* SECTION 2: COMPETENCIES */}
        <div className="glass-card-premium p-12 md:p-16 rounded-[4rem] relative overflow-hidden transition-all duration-700 border-t-4 border-sky-500/20">
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-50/50 rounded-tr-full -ml-48 -mb-48 opacity-40"></div>
          
          <div className="flex justify-between items-start mb-16 flex-wrap gap-8 relative z-10">
             <div className="space-y-3">
               <div className="flex items-center gap-4">
                 <div className="w-12 h-12 bg-sky-600 rounded-2xl flex items-center justify-center text-white font-black text-sm shadow-lg shadow-sky-600/30">02</div>
                 <h3 className="text-4xl font-black text-slate-950 tracking-tight">Cấu hình Năng lực số</h3>
               </div>
               <p className="text-slate-500 font-semibold pl-16 text-lg">Tích hợp các chỉ báo Thông tư 02/2025.</p>
             </div>
             
             <button
                type="button"
                onClick={() => setIsLookupModalOpen(true)}
                className="group flex items-center gap-4 px-10 py-5 bg-slate-950 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-sky-600 transition-all shadow-[0_15px_30px_rgba(0,0,0,0.2)] active:scale-95"
              >
                <Search className="w-6 h-6 group-hover:scale-110 transition-transform" />
                Tra cứu mã
              </button>
          </div>

          <div className="relative mb-12 group/field z-10">
            <div className="absolute inset-y-0 left-8 flex items-center pointer-events-none">
              <Hash className="h-7 w-7 text-sky-400" />
            </div>
            <input
              type="text"
              value={codeInputValue}
              onChange={handleCodeInputChange}
              placeholder="Nhập mã nhanh (VD: 1.1TC1a, 6.2TC1a...) hoặc tick chọn bên dưới"
              className="w-full glass-input pl-20 pr-10 py-6 rounded-[2.5rem] outline-none font-black text-slate-950 text-xl placeholder-slate-300 shadow-inner"
            />
          </div>
          
          {/* PREMIUM CHIPS FOR SELECTED CODES */}
          {formData.competencies && formData.competencies.length > 0 && (
            <div className="flex flex-wrap gap-4 mb-14 relative z-10 animate-in fade-in slide-in-from-top-4 duration-500">
               {formData.competencies.map(code => (
                 <div 
                   key={code}
                   className="group flex items-center gap-4 pl-6 pr-3 py-3.5 bg-sky-50 border-2 border-sky-100 rounded-2xl shadow-sm hover:border-sky-500 hover:bg-white hover:shadow-xl hover:shadow-sky-500/10 transition-all cursor-default"
                 >
                   <span className="text-sm font-black text-sky-800 uppercase tracking-widest">{code}</span>
                   <button 
                     onClick={() => removeCompetency(code)}
                     className="p-2 text-sky-200 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                   >
                     <X className="w-4 h-4" />
                   </button>
                 </div>
               ))}
               <button 
                onClick={() => setFormData(p => ({...p, competencies: []}))}
                className="px-8 py-3.5 text-xs font-black text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-2xl border-2 border-dashed border-slate-200 hover:border-red-300 transition-all uppercase tracking-widest"
               >
                 Gỡ tất cả
               </button>
            </div>
          )}
          
          <div className="border border-slate-100 rounded-[3rem] overflow-hidden bg-white/40 shadow-sm relative z-10 backdrop-blur-md">
             <div className="px-12 py-8 text-[11px] font-black text-slate-400 border-b border-slate-50 uppercase tracking-[0.4em] flex items-center justify-between">
               <div className="flex items-center">
                 <Sparkles className="w-6 h-6 mr-4 text-sky-500" />
                 Lựa chọn nhanh từ danh mục
               </div>
               <div className="bg-sky-50 text-sky-700 px-6 py-2 rounded-full border border-sky-100 font-black text-xs">6 Miền nội dung</div>
             </div>
            {DIGITAL_COMPETENCY_FRAMEWORK.map((domain) => (
              <div key={domain.id} className="border-b last:border-b-0 border-slate-50">
                <button
                  type="button"
                  onClick={() => toggleDomain(domain.id)}
                  className={`w-full flex items-center justify-between p-10 transition-all text-left group/row
                    ${expandedDomain === domain.id ? 'bg-sky-50/50' : 'hover:bg-slate-50/50'}
                  `}
                >
                  <div className="flex items-center gap-8">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-sm font-black transition-all duration-700
                      ${expandedDomain === domain.id ? 'bg-slate-950 text-white shadow-xl rotate-[360deg]' : 'bg-white text-slate-300 border border-slate-100 group-hover/row:border-sky-200 group-hover/row:text-slate-600'}
                    `}>
                      {domain.id}
                    </div>
                    <div>
                      <span className={`block font-black text-2xl tracking-tight transition-colors ${expandedDomain === domain.id ? 'text-slate-950' : 'text-slate-700'}`}>
                        {domain.title}
                      </span>
                      <p className="text-base text-slate-400 font-semibold mt-1 opacity-80 leading-relaxed">{domain.description}</p>
                    </div>
                  </div>
                  {expandedDomain === domain.id ? (
                    <ChevronDown className="w-8 h-8 text-slate-900" />
                  ) : (
                    <ChevronRight className="w-8 h-8 text-slate-200 group-hover/row:translate-x-2 transition-transform" />
                  )}
                </button>
                
                {expandedDomain === domain.id && (
                  <div className="p-10 bg-white/60 grid grid-cols-1 md:grid-cols-2 gap-8 animate-in slide-in-from-top-6 duration-700">
                    {domain.components.map((comp) => {
                       const isSelected = formData.competencies?.includes(comp.id);
                       return (
                        <div
                          key={comp.id}
                          className={`
                            group flex items-start p-8 rounded-[2.5rem] border-2 transition-all duration-500 cursor-pointer
                            ${isSelected 
                              ? 'bg-white border-sky-500 shadow-2xl scale-[1.03] translate-y-[-4px]' 
                              : 'bg-white/40 border-slate-50 hover:border-sky-300 hover:bg-white hover:shadow-xl'}
                          `}
                          onClick={() => toggleCompetency(comp.id)}
                        >
                          <div className={`w-8 h-8 mt-1 mr-6 rounded-xl border-2 flex items-center justify-center flex-shrink-0 transition-all duration-500 ${isSelected ? 'bg-sky-500 border-sky-500 text-white rotate-[360deg]' : 'border-slate-100 bg-white group-hover:border-sky-200'}`}>
                            {isSelected && <Check className="w-5 h-5 stroke-[5]" />}
                          </div>
                          <div className="flex-1">
                            <span className={`block font-black text-lg leading-tight ${isSelected ? 'text-slate-950' : 'text-slate-800'}`}>{comp.title}</span>
                            <span className="text-sm text-slate-400 mt-3 block leading-relaxed font-semibold opacity-80">{comp.description}</span>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setViewingCompetency(comp);
                            }}
                            className="ml-3 p-3 text-slate-200 hover:text-sky-600 hover:bg-sky-50 rounded-2xl transition-all"
                          >
                            <Info className="w-6 h-6" />
                          </button>
                        </div>
                       )
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* MODERN ACTION BAR - FLOATING GLASS */}
        <div className="fixed bottom-12 left-1/2 -translate-x-1/2 w-full max-w-4xl px-8 z-[90]">
           <button
            type="submit"
            disabled={isLoading}
            className="w-full relative group overflow-hidden bg-slate-950 hover:bg-sky-600 text-white font-black py-8 px-12 rounded-[3rem] shadow-[0_40px_80px_rgba(0,0,0,0.4)] transition-all duration-700 flex items-center justify-center disabled:opacity-70 transform hover:-translate-y-4 active:scale-95 border-2 border-white/10"
          >
             <div className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-20 translate-x-[-150%] group-hover:animate-shine"></div>
             
             {isLoading ? (
              <div className="flex items-center gap-6">
                <Atom className="animate-spin h-10 w-10 text-sky-400" />
                <span className="text-3xl tracking-tighter uppercase font-black">AI Đang soạn thảo...</span>
              </div>
            ) : (
              <div className="flex items-center gap-8">
                <Zap className="w-10 h-10 text-yellow-400 fill-yellow-400 animate-pulse" />
                <span className="text-3xl uppercase tracking-[0.2em] font-black">Tạo giáo án AI</span>
                <ArrowRight className="w-10 h-10 group-hover:translate-x-4 transition-transform duration-700" />
              </div>
            )}
          </button>
        </div>
      </form>

      {/* REFINED DETAIL MODAL */}
      {viewingCompetency && (
        <div className="fixed inset-0 z-[180] flex items-center justify-center p-8 bg-slate-950/90 backdrop-blur-3xl animate-in fade-in duration-500">
          <div className="bg-white rounded-[4rem] shadow-[0_60px_100px_rgba(0,0,0,0.6)] w-full max-w-4xl overflow-hidden animate-in zoom-in-95 duration-500 flex flex-col max-h-[85vh] border-8 border-white">
            <div className="p-12 border-b border-slate-50 flex justify-between items-start bg-slate-50/50">
              <div className="space-y-4">
                <div className="flex items-center gap-5">
                  <div className="bg-sky-600 text-white text-[11px] font-black px-5 py-2 rounded-xl shadow-lg">{viewingCompetency.id}</div>
                  <h3 className="font-black text-3xl text-slate-950 leading-tight tracking-tight">{viewingCompetency.title}</h3>
                </div>
                <p className="text-slate-500 text-xl font-semibold leading-relaxed">{viewingCompetency.description}</p>
              </div>
              <button 
                onClick={() => setViewingCompetency(null)}
                 className="text-slate-300 hover:text-slate-950 transition-all p-4 hover:bg-slate-100 rounded-full"
              >
                <X className="w-10 h-10" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-12 space-y-8 custom-scrollbar">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-2 h-8 bg-sky-600 rounded-full"></div>
                <h4 className="text-[12px] font-black text-slate-400 uppercase tracking-[0.4em]">Hành vi chỉ báo chi tiết</h4>
              </div>
              {viewingCompetency.indicators?.map((ind) => {
                const isAdded = formData.competencies?.includes(ind.code);
                return (
                  <div 
                    key={ind.code} 
                    onClick={() => addSpecificCode(ind.code)}
                    className={`p-10 rounded-[3rem] border-4 transition-all duration-500 cursor-pointer group/item flex items-center gap-10 ${isAdded ? 'border-sky-500 bg-sky-50/50 shadow-2xl translate-x-4' : 'border-slate-50 hover:border-sky-200 hover:bg-slate-50/30'}`}
                  >
                    <div className="flex flex-col flex-1">
                      <span className="font-black text-sky-600 text-[12px] mb-3 uppercase tracking-widest">{ind.code}</span>
                      <p className="text-slate-950 font-bold text-2xl leading-relaxed tracking-tight">{ind.description}</p>
                    </div>
                    <div className={`w-16 h-16 rounded-[2rem] flex items-center justify-center transition-all duration-700 shadow-xl ${isAdded ? 'bg-sky-600 text-white rotate-[360deg] scale-110' : 'bg-white border-4 border-slate-100 text-slate-200 group-hover:text-sky-600 group-hover:border-sky-200'}`}>
                      {isAdded ? <CheckSquare className="w-8 h-8 stroke-[3]" /> : <Copy className="w-8 h-8" />}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-10 bg-slate-50/50 border-t border-slate-50 flex justify-end">
              <button 
                onClick={() => setViewingCompetency(null)} 
                className="px-14 py-5 bg-slate-950 text-white hover:bg-sky-600 rounded-[2rem] transition-all font-black text-sm uppercase tracking-[0.25em] shadow-2xl active:scale-95"
              >
                Hoàn tất xem
              </button>
            </div>
          </div>
        </div>
      )}

      <CompetencyLookupModal 
        isOpen={isLookupModalOpen}
        onClose={() => setIsLookupModalOpen(false)}
        selectedCodes={formData.competencies || []}
        onToggleCode={toggleCompetency}
      />

      <LessonCatalogModal 
        isOpen={isCatalogModalOpen}
        onClose={() => setIsCatalogModalOpen(false)}
        onSelect={handleCatalogSelect}
      />
    </>
  );
};

export default ManualForm;
