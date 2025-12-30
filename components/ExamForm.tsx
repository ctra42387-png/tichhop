
import React, { useState, useEffect, useRef } from 'react';
import mammoth from 'mammoth';
import { ExamConfig, ExamType, QuestionCounts, LevelDistribution, ScopeItem, QuestionFormat, InputMode } from '../types.ts';
import { CURRICULUM_DATA } from '../data/curriculum.ts';
import { FileText, CheckCircle, PieChart, Book, Library, Plus, Trash2, Calculator, CalendarCheck, Save, RotateCcw, Upload, FileUp, AlertCircle, Sparkles, PlusCircle, LayoutGrid } from 'lucide-react';

interface Props {
  onSubmit: (config: ExamConfig) => void;
  isLoading: boolean;
}

const SUBJECTS = [
  "Toán học", "Ngữ văn", "Ngoại ngữ 1 (Tiếng Anh)", "Khoa học tự nhiên", 
  "Lịch sử và Địa lí", "Giáo dục công dân", "Công nghệ", "Tin học", 
  "Giáo dục thể chất", "Nghệ thuật (Âm nhạc)", "Nghệ thuật (Mỹ thuật)", 
  "Hoạt động trải nghiệm, hướng nghiệp", "Nội dung giáo dục địa phương"
];

const TEXTBOOKS = [
  "Kết nối tri thức với cuộc sống", "Chân trời sáng tạo", "Cánh Diều", 
  "Cùng khám phá", "Bình đẳng dân chủ trong giáo dục", "Khác (Tự biên soạn)"
];

const STORAGE_KEY_DEFAULT_CONFIG = 'exam_default_config';

const INITIAL_CONFIG: ExamConfig = {
  subject: 'Toán học',
  grade: '6',
  textbook: 'Kết nối tri thức với cuộc sống',
  scopeType: 'chapter',
  examType: ExamType.MID_TERM,
  duration: 60,
  scopeItems: [{ id: '1', chapter: '', name: '', periods: 0 }],
  format: QuestionFormat.COMBINED,
  inputMode: 'manual',
  questionCounts: { part1: 12, part2: 4, part3: 4, part4: 2 },
  levelDistribution: { awareness: 40, understanding: 30, application: 30 }
};

const ExamForm: React.FC<Props> = ({ onSubmit, isLoading }) => {
  const [config, setConfig] = useState<ExamConfig>(INITIAL_CONFIG);
  const [totalPercent, setTotalPercent] = useState(100);
  const [totalPeriods, setTotalPeriods] = useState(0);
  const [isCustomSubject, setIsCustomSubject] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saved'>('idle');
  const [fileName, setFileName] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Gợi ý chương dựa trên môn học/lớp/bộ sách (Chỉ để tham khảo tên chương)
  const suggestedChapters = config.subject && config.grade && config.textbook 
    ? CURRICULUM_DATA[config.subject]?.[config.grade]?.[config.textbook]?.map(c => c.chapter) || []
    : [];

  useEffect(() => {
    const savedDefault = localStorage.getItem(STORAGE_KEY_DEFAULT_CONFIG);
    if (savedDefault) {
      try {
        const parsed = JSON.parse(savedDefault);
        if (parsed.scopeItems) {
          parsed.scopeItems = parsed.scopeItems.map((item: ScopeItem) => ({
            ...item,
            id: Math.random().toString(36).substr(2, 9)
          }));
        }
        const cleanConfig = { ...INITIAL_CONFIG, ...parsed };
        cleanConfig.inputMode = 'manual';
        cleanConfig.uploadedContent = undefined;
        
        setConfig(cleanConfig);
        if (!SUBJECTS.includes(parsed.subject)) {
          setIsCustomSubject(true);
        }
      } catch (e) {
        console.error("Lỗi khi tải cấu hình mặc định", e);
      }
    }
  }, []);

  useEffect(() => {
    const total = config.levelDistribution.awareness + config.levelDistribution.understanding + config.levelDistribution.application;
    setTotalPercent(total);
  }, [config.levelDistribution]);

  useEffect(() => {
    const total = config.scopeItems.reduce((sum, item) => sum + (item.periods || 0), 0);
    setTotalPeriods(total);
  }, [config.scopeItems]);

  const handleChange = (field: keyof ExamConfig, value: any) => {
    setConfig((prev) => ({ ...prev, [field]: value }));
  };

  const handleLevelChange = (field: keyof LevelDistribution, value: number) => {
    setConfig(prev => ({
      ...prev,
      levelDistribution: { ...prev.levelDistribution, [field]: value }
    }));
  };

  const handleCountChange = (field: keyof QuestionCounts, value: number) => {
    setConfig(prev => ({
      ...prev,
      questionCounts: { ...prev.questionCounts, [field]: Math.max(0, value) }
    }));
  };

  const updateScopeItem = (id: string, field: keyof ScopeItem, value: any) => {
    setConfig(prev => ({
      ...prev,
      scopeItems: prev.scopeItems.map(item => item.id === id ? { ...item, [field]: value } : item)
    }));
  };

  const addScopeItemAt = (index: number) => {
    const currentItem = config.scopeItems[index];
    const newItems = [...config.scopeItems];
    newItems.splice(index + 1, 0, { 
      id: Date.now().toString() + Math.random(), 
      chapter: currentItem.chapter, 
      name: '', 
      periods: 0 
    });
    setConfig(prev => ({ ...prev, scopeItems: newItems }));
  };

  const addScopeItem = (duplicateLastChapter = false) => {
    const lastChapter = duplicateLastChapter && config.scopeItems.length > 0 
      ? config.scopeItems[config.scopeItems.length - 1].chapter 
      : '';
    setConfig(prev => ({
      ...prev,
      scopeItems: [...prev.scopeItems, { id: Date.now().toString() + Math.random(), chapter: lastChapter, name: '', periods: 0 }]
    }));
  };

  const removeScopeItem = (id: string) => {
    if (config.scopeItems.length <= 1) return;
    setConfig(prev => ({
      ...prev,
      scopeItems: prev.scopeItems.filter(item => item.id !== id)
    }));
  };

  const handleSaveAsDefault = () => {
    localStorage.setItem(STORAGE_KEY_DEFAULT_CONFIG, JSON.stringify(config));
    setSaveStatus('saved');
    setTimeout(() => setSaveStatus('idle'), 2000);
  };

  const handleResetToInitial = () => {
    if (window.confirm("Bạn có muốn xóa cấu hình mặc định và quay về thiết lập ban đầu không?")) {
      localStorage.removeItem(STORAGE_KEY_DEFAULT_CONFIG);
      setConfig(INITIAL_CONFIG);
      setIsCustomSubject(false);
      setFileName("");
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.docx')) {
      alert('Vui lòng chỉ tải lên file Word (.docx)');
      return;
    }

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const arrayBuffer = event.target?.result as ArrayBuffer;
        const result = await mammoth.convertToHtml({ arrayBuffer });
        setConfig(prev => ({ ...prev, uploadedContent: result.value }));
      } catch (error) {
        console.error("Error reading file", error);
        alert("Lỗi khi đọc file. Vui lòng thử lại.");
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (config.inputMode === 'manual' && totalPercent !== 100) {
      alert("Tổng tỉ lệ mức độ nhận thức phải bằng 100%.");
      return;
    }
    const filteredScope = config.scopeItems.filter(item => item.chapter.trim() !== '' && item.name.trim() !== '');
    if (filteredScope.length === 0 && config.inputMode === 'manual') {
      alert("Vui lòng nhập ít nhất một nội dung bài học.");
      return;
    }
    if (config.inputMode === 'upload' && !config.uploadedContent) {
      alert("Vui lòng tải lên file Ma trận/Đặc tả trước khi tiếp tục.");
      return;
    }
    onSubmit({...config, scopeItems: filteredScope.length > 0 ? filteredScope : config.scopeItems});
  };

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-xl shadow-blue-900/5 p-6 md:p-10 border border-white">
      <div className="flex items-center justify-between mb-8 border-b border-gray-100 pb-6">
        <div className="flex items-center gap-4">
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-xl text-white shadow-lg shadow-blue-500/30">
            <FileText size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">Thiết Lập Đề Kiểm Tra</h2>
            <p className="text-sm text-gray-500 font-medium">Xây dựng hồ sơ kiểm tra chuẩn Công văn 7791</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSaveAsDefault}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-xl border transition-all duration-300 ${
              saveStatus === 'saved' 
                ? 'bg-green-50 border-green-200 text-green-700' 
                : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300'
            }`}
          >
            {saveStatus === 'saved' ? <CheckCircle size={14} className="text-green-600" /> : <Save size={14} />}
            {saveStatus === 'saved' ? 'Đã lưu mặc định' : 'Lưu mặc định'}
          </button>
          <button
            type="button"
            onClick={handleResetToInitial}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
            title="Reset về mặc định"
          >
            <RotateCcw size={16} />
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="flex p-1 bg-gray-100 rounded-xl font-bold text-sm mb-6">
          <button
            type="button"
            onClick={() => handleChange('inputMode', 'manual')}
            className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all ${config.inputMode === 'manual' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <PieChart size={18} /> Thiết lập thủ công
          </button>
          <button
            type="button"
            onClick={() => handleChange('inputMode', 'upload')}
            className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-all ${config.inputMode === 'upload' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <FileUp size={18} /> Tải lên Ma trận & Đặc tả
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700">Môn học</label>
            {!isCustomSubject ? (
              <select className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-gray-50/50 transition-all hover:bg-white font-medium"
                value={config.subject} onChange={(e) => e.target.value === 'other' ? setIsCustomSubject(true) : handleChange('subject', e.target.value)}>
                {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                <option value="other">-- Nhập môn khác --</option>
              </select>
            ) : (
              <div className="flex gap-2">
                <input type="text" autoFocus className="w-full px-4 py-3 border border-blue-500 rounded-xl focus:ring-2 focus:ring-blue-500/20 outline-none"
                  value={config.subject} onChange={(e) => handleChange('subject', e.target.value)} />
                <button type="button" onClick={() => { setIsCustomSubject(false); handleChange('subject', SUBJECTS[0]); }} className="px-4 py-2 text-sm text-gray-500 border rounded-xl hover:bg-gray-100">Hủy</button>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700">Bộ sách</label>
            <div className="relative">
              <Library className="absolute left-4 top-3.5 text-gray-400" size={18} />
              <select className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none appearance-none bg-gray-50/50 hover:bg-white transition-all font-medium"
                value={config.textbook} onChange={(e) => handleChange('textbook', e.target.value)}>
                {TEXTBOOKS.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700">Lớp / Khối</label>
            <select className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-gray-50/50 hover:bg-white transition-all font-medium"
              value={config.grade} onChange={(e) => handleChange('grade', e.target.value)}>
              {[6, 7, 8, 9, 10, 11, 12].map(g => <option key={g} value={g}>Lớp {g}</option>)}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-gray-700">Thời gian (phút)</label>
            <div className="relative">
                <input type="number" min="15" className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none bg-gray-50/50 hover:bg-white transition-all font-medium"
                value={config.duration} onChange={(e) => handleChange('duration', parseInt(e.target.value))} />
                <span className="absolute right-4 top-3.5 text-gray-400 text-sm font-medium">phút</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
           <label className="text-sm font-bold text-gray-700 uppercase tracking-wider flex items-center gap-2">
            <CalendarCheck size={16} className="text-blue-500"/> Hình thức kiểm tra
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { id: ExamType.REGULAR, label: 'Thường xuyên', desc: '15-45 phút' },
              { id: ExamType.MID_TERM, label: 'Giữa kỳ', desc: '45-60 phút' },
              { id: ExamType.FINAL, label: 'Cuối kỳ', desc: '60-90 phút' }
            ].map((type) => {
              const isActive = config.examType === type.id;
              return (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => handleChange('examType', type.id)}
                  className={`relative flex flex-col items-center justify-center gap-1 p-4 rounded-2xl border-2 transition-all duration-300 ${
                    isActive 
                      ? 'border-blue-500 bg-blue-50/50 text-blue-700 shadow-md shadow-blue-100 scale-[1.02]' 
                      : 'border-gray-100 bg-white text-gray-500 hover:border-blue-200 hover:bg-blue-50/30'
                  }`}
                >
                  <span className="font-bold uppercase tracking-tight">{type.label}</span>
                  <span className={`text-[10px] ${isActive ? 'text-blue-500' : 'text-gray-400'}`}>{type.desc}</span>
                  {isActive && <div className="absolute top-2 right-2 text-blue-500"><CheckCircle size={14}/></div>}
                </button>
              );
            })}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <label className="block text-sm font-bold text-gray-700 flex items-center gap-2">
                <Book size={16} className="text-blue-500"/> Phạm vi kiến thức (Nội dung chi tiết)
            </label>
            <div className="flex items-center gap-2 text-gray-400 text-[10px] font-bold uppercase tracking-widest italic">
               * Nhập thủ công bài học để có đề thi sát thực tế nhất
            </div>
          </div>
          
          <div className="border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="grid grid-cols-12 bg-gray-50 p-4 text-[10px] font-bold text-gray-500 uppercase tracking-widest border-b">
              <div className="col-span-4">Chương / Chủ đề</div>
              <div className="col-span-5">Tên bài học (Nhập thủ công)</div>
              <div className="col-span-1 text-center">Tiết</div>
              <div className="col-span-2 text-center">Tác vụ</div>
            </div>
            <div className="divide-y divide-gray-100 bg-white">
              <datalist id="chapters-list">
                {suggestedChapters.map((ch, i) => <option key={i} value={ch} />)}
              </datalist>
              
              {config.scopeItems.map((item, idx) => {
                const isFirstInChapter = idx === 0 || config.scopeItems[idx - 1].chapter !== item.chapter;
                
                return (
                  <div key={item.id} className={`grid grid-cols-12 p-3 gap-3 items-center hover:bg-blue-50/10 transition-colors group ${!isFirstInChapter ? 'bg-gray-50/30' : ''}`}>
                    <div className="col-span-4 relative">
                      {isFirstInChapter ? (
                        <input 
                          type="text" 
                          list="chapters-list"
                          className="w-full p-2 border border-transparent hover:border-gray-200 focus:border-blue-500 rounded-lg text-sm outline-none transition-all bg-transparent focus:bg-white font-black text-blue-900" 
                          value={item.chapter} 
                          placeholder="Tên chương..." 
                          onChange={(e) => updateScopeItem(item.id, 'chapter', e.target.value)} 
                        />
                      ) : (
                        <div className="flex items-center gap-2 pl-2 text-gray-400 italic text-[10px] font-medium">
                           <LayoutGrid size={12} className="text-gray-300" /> Cùng chương trên
                        </div>
                      )}
                    </div>
                    <div className="col-span-5 flex items-center gap-2">
                      <input 
                        type="text" 
                        className="flex-grow p-2 border border-transparent hover:border-gray-200 focus:border-blue-500 rounded-lg text-sm outline-none transition-all bg-transparent focus:bg-white font-medium" 
                        value={item.name} 
                        placeholder="Nhập tên bài học..." 
                        onChange={(e) => updateScopeItem(item.id, 'name', e.target.value)} 
                      />
                      <button 
                        type="button" 
                        onClick={() => addScopeItemAt(idx)} 
                        title="Thêm bài khác cho chương này"
                        className="flex items-center gap-1 px-2 py-1 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-lg transition-all text-[10px] font-black"
                      >
                        <Plus size={14} /> BÀI
                      </button>
                    </div>
                    <div className="col-span-1 text-center">
                      <input type="number" className="w-full p-2 border border-transparent hover:border-gray-200 focus:border-blue-500 rounded-lg text-center text-sm font-bold outline-none text-blue-700 bg-transparent focus:bg-white" 
                          value={item.periods || ''} onChange={(e) => updateScopeItem(item.id, 'periods', parseInt(e.target.value) || 0)} />
                    </div>
                    <div className="col-span-2 flex items-center justify-center">
                      <button 
                        type="button" 
                        onClick={() => removeScopeItem(item.id)} 
                        className="text-gray-300 hover:text-red-500 hover:bg-red-50 p-2 rounded-lg transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="bg-gray-50 p-3 flex flex-wrap gap-3 justify-between items-center border-t border-gray-100">
              <button type="button" onClick={() => addScopeItem(false)} className="text-xs text-blue-600 font-bold bg-white border border-blue-200 hover:bg-blue-50 px-4 py-2 rounded-xl flex items-center gap-2 transition-all shadow-sm uppercase tracking-tight">
                <PlusCircle size={16} /> Thêm chương mới
              </button>
              <div className="text-xs font-bold text-gray-600 flex items-center gap-2 bg-white px-4 py-2 rounded-xl border shadow-sm">
                <Calculator size={16} className="text-blue-500" /> TỔNG: <span className="text-blue-700 text-sm font-black">{totalPeriods}</span> TIẾT
              </div>
            </div>
          </div>
        </div>

        <div className="h-px bg-gray-100"></div>

        {config.inputMode === 'manual' ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-emerald-50 to-green-50 p-6 rounded-2xl border border-emerald-100">
                <h4 className="font-black text-emerald-800 mb-5 flex items-center gap-2 uppercase text-[10px] tracking-widest">
                    <span className="bg-emerald-200 p-1.5 rounded-lg"><CheckCircle size={16} className="text-emerald-700"/></span> 
                    Cấu trúc đề kiểm tra
                </h4>
                <div className="space-y-4">
                  {[
                    { key: 'part1', label: 'TN nhiều lựa chọn' },
                    { key: 'part2', label: 'TN Đúng/Sai' },
                    { key: 'part3', label: 'TN trả lời ngắn' },
                    { key: 'part4', label: 'Tự luận' }
                  ].map((item) => (
                    <div key={item.key} className="flex justify-between items-center text-sm bg-white p-3 rounded-xl border border-emerald-100/50 shadow-sm group">
                      <span className="font-bold text-gray-700 group-hover:text-emerald-600 transition-colors">{item.label}</span>
                      <div className="flex items-center gap-2">
                        <input type="number" className="w-16 px-2 py-1.5 border border-emerald-200 rounded-lg text-center font-black text-emerald-700 outline-none focus:ring-4 focus:ring-emerald-500/10" 
                            value={config.questionCounts[item.key as keyof QuestionCounts]} onChange={(e) => handleCountChange(item.key as keyof QuestionCounts, parseInt(e.target.value) || 0)} />
                        <span className="text-[10px] text-gray-400 font-black uppercase">câu</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100">
                <h4 className="font-black text-blue-800 mb-5 flex items-center gap-2 uppercase text-[10px] tracking-widest">
                    <span className="bg-blue-200 p-1.5 rounded-lg"><PieChart size={16} className="text-blue-700"/></span>
                    Mức độ nhận thức (%)
                </h4>
                <div className="space-y-6">
                  {[ ['awareness', 'Nhận biết', 'blue'], ['understanding', 'Thông hiểu', 'indigo'], ['application', 'Vận dụng', 'violet'] ].map(([key, label, color]) => (
                    <div key={key}>
                      <div className="flex justify-between text-[10px] font-black mb-2 uppercase text-gray-500 tracking-widest">
                        <span>{label}</span>
                        <span className={`text-${color}-600 bg-white px-3 py-1 rounded-lg border border-${color}-100 font-black shadow-sm`}>{config.levelDistribution[key as keyof LevelDistribution]}%</span>
                      </div>
                      <input type="range" min="0" max="100" step="5" 
                        className={`w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-${color}-600`} 
                        value={config.levelDistribution[key as keyof LevelDistribution]} onChange={(e) => handleLevelChange(key as keyof LevelDistribution, parseInt(e.target.value))} />
                    </div>
                  ))}
                  <div className="flex justify-end pt-2">
                     <div className={`text-xs font-black flex items-center gap-2 px-4 py-2 rounded-xl border shadow-sm transition-all ${totalPercent === 100 ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                        TỔNG TỈ LỆ: {totalPercent}%
                        {totalPercent === 100 ? <CheckCircle size={16}/> : <span className="text-[10px]">(Cần đạt 100%)</span>}
                     </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="space-y-6 animate-in fade-in zoom-in duration-500">
             <div className="bg-amber-50 border border-amber-200 p-5 rounded-2xl flex gap-4 text-amber-900 shadow-sm">
                <AlertCircle className="flex-shrink-0 text-amber-600" size={24} />
                <div className="text-sm">
                   <p className="font-black mb-1 uppercase tracking-tight">Ghi chú tải file:</p>
                   <ul className="list-disc pl-5 space-y-1 font-medium">
                      <li>Hệ thống sẽ giữ nguyên ma trận từ file Word bạn cung cấp.</li>
                      <li>Các bài học đã nhập ở trên sẽ được sử dụng để "lấp đầy" đề minh họa.</li>
                   </ul>
                </div>
             </div>

             <div 
               className="border-4 border-dashed border-gray-200 rounded-3xl p-12 flex flex-col items-center justify-center gap-6 hover:bg-blue-50/50 hover:border-blue-400 transition-all cursor-pointer group bg-white shadow-inner"
               onClick={() => fileInputRef.current?.click()}
             >
                <div className="p-5 bg-blue-100 rounded-2xl text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-lg">
                   <Upload size={40} />
                </div>
                <div className="text-center">
                   <p className="font-black text-gray-700 text-xl group-hover:text-blue-700 transition-colors">{fileName || "Chọn file Ma trận chuẩn (.docx)"}</p>
                   <p className="text-sm text-gray-400 font-bold mt-2">Kéo thả hoặc nhấp để chọn file</p>
                </div>
                <input 
                   type="file" 
                   accept=".docx" 
                   ref={fileInputRef} 
                   onChange={handleFileChange} 
                   className="hidden" 
                />
             </div>
          </div>
        )}

        <button type="submit" disabled={isLoading} className={`w-full py-5 rounded-2xl text-white font-black text-xl shadow-2xl shadow-blue-500/30 flex items-center justify-center gap-4 transition-all duration-300 hover:translate-y-[-2px] active:scale-[0.98] ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-600 to-indigo-700 hover:shadow-blue-500/50'}`}>
          {isLoading ? (
            <>
              <div className="animate-spin h-7 w-7 border-4 border-white border-t-transparent rounded-full"></div>
              <span>HỆ THỐNG ĐANG XỬ LÝ...</span>
            </>
          ) : (
            <>
              <span>KHỞI TẠO HỒ SƠ KIỂM TRA</span>
              <Sparkles size={24} className="text-blue-200" />
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default ExamForm;
