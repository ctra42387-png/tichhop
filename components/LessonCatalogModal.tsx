
import React, { useState, useMemo } from 'react';
import { Search, X, Book, GraduationCap, Layers, Library, Check, ChevronRight, SortAsc, SortDesc, FilterX } from 'lucide-react';
import { SAMPLE_LESSONS } from '../constants';

interface LessonResult {
  textbook: string;
  subject: string;
  grade: string;
  lessonName: string;
}

interface LessonCatalogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (lesson: LessonResult) => void;
}

const LessonCatalogModal: React.FC<LessonCatalogModalProps> = ({ isOpen, onClose, onSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTextbook, setFilterTextbook] = useState('');
  const [filterSubject, setFilterSubject] = useState('');
  const [filterGrade, setFilterGrade] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Flatten the catalog for easier searching/filtering
  const flatCatalog = useMemo(() => {
    const results: LessonResult[] = [];
    Object.entries(SAMPLE_LESSONS).forEach(([textbook, subjects]) => {
      Object.entries(subjects).forEach(([subject, grades]) => {
        Object.entries(grades).forEach(([grade, lessons]) => {
          lessons.forEach(lessonName => {
            results.push({ textbook, subject, grade, lessonName });
          });
        });
      });
    });
    return results;
  }, []);

  // Extract unique filters for dropdowns
  const textbooks = Object.keys(SAMPLE_LESSONS);
  const subjects = useMemo(() => {
    const s = new Set<string>();
    Object.values(SAMPLE_LESSONS).forEach(textbookObj => {
      Object.keys(textbookObj).forEach(sub => s.add(sub));
    });
    return Array.from(s).sort();
  }, []);
  const grades = ["6", "7", "8", "9"];

  const filteredResults = useMemo(() => {
    return flatCatalog
      .filter(item => {
        const matchesSearch = !searchTerm || item.lessonName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesTextbook = !filterTextbook || item.textbook === filterTextbook;
        const matchesSubject = !filterSubject || item.subject === filterSubject;
        const matchesGrade = !filterGrade || item.grade === filterGrade;
        return matchesSearch && matchesTextbook && matchesSubject && matchesGrade;
      })
      .sort((a, b) => {
        const comparison = a.lessonName.localeCompare(b.lessonName, 'vi');
        return sortOrder === 'asc' ? comparison : -comparison;
      });
  }, [flatCatalog, searchTerm, filterTextbook, filterSubject, filterGrade, sortOrder]);

  const resetFilters = () => {
    setSearchTerm('');
    setFilterTextbook('');
    setFilterSubject('');
    setFilterGrade('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200">
        
        {/* Header */}
        <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center shrink-0 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="bg-brand-600 p-2.5 rounded-xl text-white shadow-lg shadow-brand-600/20">
              <Library className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-800 tracking-tight uppercase">Thư viện bài học điện tử</h2>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-0.5">Tìm kiếm nhanh từ hàng ngàn bài học chuẩn SGK</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-400">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Filter Toolbar */}
        <div className="p-6 bg-white border-b border-slate-100 shrink-0 space-y-4 shadow-sm relative z-10">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input 
                type="text"
                placeholder="Tìm tên bài học (VD: Đạo hàm, Lực ma sát...)"
                className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-brand-100 focus:border-brand-400 outline-none transition-all font-bold text-slate-800"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button 
              onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl font-black text-xs text-slate-600 hover:bg-slate-50 transition-all uppercase tracking-widest"
            >
              {sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
              Sắp xếp A-Z
            </button>
          </div>

          <div className="flex flex-wrap gap-3 items-center">
            <div className="flex items-center gap-2 bg-slate-100/50 p-1.5 rounded-xl border border-slate-200">
               <Book className="w-4 h-4 text-slate-400 ml-2" />
               <select 
                 value={filterTextbook} 
                 onChange={(e) => setFilterTextbook(e.target.value)}
                 className="bg-transparent text-xs font-black text-slate-600 outline-none pr-4 py-1"
               >
                 <option value="">Tất cả bộ sách</option>
                 {textbooks.map(t => <option key={t} value={t}>{t}</option>)}
               </select>
            </div>

            <div className="flex items-center gap-2 bg-slate-100/50 p-1.5 rounded-xl border border-slate-200">
               <Layers className="w-4 h-4 text-slate-400 ml-2" />
               <select 
                 value={filterSubject} 
                 onChange={(e) => setFilterSubject(e.target.value)}
                 className="bg-transparent text-xs font-black text-slate-600 outline-none pr-4 py-1"
               >
                 <option value="">Tất cả môn</option>
                 {subjects.map(s => <option key={s} value={s}>{s}</option>)}
               </select>
            </div>

            <div className="flex items-center gap-2 bg-slate-100/50 p-1.5 rounded-xl border border-slate-200">
               <GraduationCap className="w-4 h-4 text-slate-400 ml-2" />
               <select 
                 value={filterGrade} 
                 onChange={(e) => setFilterGrade(e.target.value)}
                 className="bg-transparent text-xs font-black text-slate-600 outline-none pr-4 py-1"
               >
                 <option value="">Khối lớp</option>
                 {grades.map(g => <option key={g} value={g}>Lớp {g}</option>)}
               </select>
            </div>

            {(filterTextbook || filterSubject || filterGrade || searchTerm) && (
              <button 
                onClick={resetFilters}
                className="flex items-center gap-2 px-4 py-2 text-xs font-black text-red-500 hover:bg-red-50 rounded-xl transition-colors uppercase tracking-tight"
              >
                <FilterX className="w-4 h-4" />
                Xóa lọc
              </button>
            )}

            <div className="ml-auto text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
              Tìm thấy {filteredResults.length} bài học
            </div>
          </div>
        </div>

        {/* Results Grid */}
        <div className="flex-1 overflow-y-auto p-8 bg-slate-50/30">
          {filteredResults.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredResults.map((item, index) => (
                <button
                  key={index}
                  onClick={() => onSelect(item)}
                  className="group p-5 bg-white border border-slate-200 rounded-3xl text-left hover:border-brand-400 hover:shadow-xl hover:shadow-brand-900/5 transition-all flex flex-col justify-between h-full relative overflow-hidden active:scale-[0.98]"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-brand-600 text-white p-1.5 rounded-full">
                      <Check className="w-3 h-3" />
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="bg-indigo-50 text-indigo-600 text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-tighter">
                        {item.subject}
                      </span>
                      <span className="bg-slate-100 text-slate-500 text-[9px] font-black px-2 py-0.5 rounded-md uppercase tracking-tighter">
                        Lớp {item.grade}
                      </span>
                    </div>
                    <h4 className="font-bold text-slate-800 text-base leading-tight mb-4 group-hover:text-brand-600 transition-colors">
                      {item.lessonName}
                    </h4>
                  </div>
                  
                  <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-slate-400 group-hover:text-slate-500 transition-colors">
                      <Book className="w-3.5 h-3.5" />
                      <span className="text-[10px] font-bold truncate max-w-[150px]">{item.textbook}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-brand-600 transition-all group-hover:translate-x-1" />
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-slate-400 opacity-50">
              <Search className="w-20 h-20 mb-4 stroke-[1]" />
              <p className="text-xl font-bold uppercase tracking-widest">Không tìm thấy bài học phù hợp</p>
              <p className="text-sm mt-2">Thầy/cô hãy thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-8 py-5 border-t border-slate-100 bg-slate-50/50 flex justify-between items-center shrink-0">
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
            Hệ thống dữ liệu chuẩn chương trình phổ thông mới 2018
          </p>
          <button 
            onClick={onClose}
            className="px-8 py-3 bg-white border border-slate-200 rounded-xl font-black text-xs uppercase tracking-widest text-slate-600 hover:bg-slate-100 transition-all shadow-sm"
          >
            Đóng cửa sổ
          </button>
        </div>
      </div>
    </div>
  );
};

export default LessonCatalogModal;
