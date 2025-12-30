
import React, { useState, useEffect, useMemo } from 'react';
import { DIGITAL_COMPETENCY_FRAMEWORK } from '../types';
import { Search, X, CheckSquare, Square, ChevronDown, ChevronRight, Database, Users, PenTool, ShieldCheck, Puzzle, Bot, Check, LayoutGrid, List, Filter, Info, Trash2 } from 'lucide-react';

interface CompetencyLookupModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCodes: string[];
  onToggleCode: (code: string) => void;
}

const getDomainIcon = (id: string) => {
  switch (id) {
    case '1': return <Database className="w-6 h-6 text-sky-600" />;
    case '2': return <Users className="w-6 h-6 text-sky-600" />;
    case '3': return <PenTool className="w-6 h-6 text-sky-600" />;
    case '4': return <ShieldCheck className="w-6 h-6 text-sky-600" />;
    case '5': return <Puzzle className="w-6 h-6 text-sky-600" />;
    case '6': return <Bot className="w-6 h-6 text-sky-600" />;
    default: return <LayoutGrid className="w-6 h-6 text-sky-600" />;
  }
};

const CompetencyLookupModal: React.FC<CompetencyLookupModalProps> = ({ isOpen, onClose, selectedCodes, onToggleCode }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<string>('all');
  const [expandedDomains, setExpandedDomains] = useState<Set<string>>(new Set(['1']));

  // Filter logic
  const filteredFramework = useMemo(() => {
    let result = DIGITAL_COMPETENCY_FRAMEWORK;

    if (activeTab !== 'all') {
      result = result.filter(d => d.id === activeTab);
    }

    if (!searchTerm.trim()) return result;

    const term = searchTerm.toLowerCase();
    return result.map(domain => {
      const domainMatches = domain.title.toLowerCase().includes(term) || domain.description.toLowerCase().includes(term);
      const matchingComponents = domain.components.map(comp => {
        const compMatches = comp.title.toLowerCase().includes(term) || comp.description.toLowerCase().includes(term) || comp.id.toLowerCase().includes(term);
        const matchingIndicators = comp.indicators?.filter(ind => 
          ind.code.toLowerCase().includes(term) || ind.description.toLowerCase().includes(term)
        );
        
        if (compMatches || (matchingIndicators && matchingIndicators.length > 0) || domainMatches) {
          return {
            ...comp,
            indicators: (matchingIndicators && !compMatches && !domainMatches) 
              ? matchingIndicators 
              : (comp.indicators || [])
          };
        }
        return null;
      }).filter(Boolean);

      if (domainMatches || matchingComponents.length > 0) {
        return { ...domain, components: matchingComponents as any[] };
      }
      return null;
    }).filter(Boolean) as typeof DIGITAL_COMPETENCY_FRAMEWORK;
  }, [searchTerm, activeTab]);

  // Expand domains automatically when searching
  useEffect(() => {
    if (searchTerm.trim()) {
      const allIds = filteredFramework.map(d => d.id);
      setExpandedDomains(new Set(allIds));
    }
  }, [searchTerm, filteredFramework]);

  const toggleDomain = (id: string) => {
    const newSet = new Set(expandedDomains);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setExpandedDomains(newSet);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[160] flex items-center justify-center bg-slate-950/80 backdrop-blur-xl animate-in fade-in duration-300 p-4">
      <div className="bg-white rounded-[3rem] shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-300 border border-white">
        
        {/* MODAL HEADER */}
        <div className="px-10 py-8 border-b border-slate-100 flex justify-between items-center bg-white shrink-0">
          <div className="flex items-center gap-5">
            <div className="w-14 h-14 bg-slate-950 rounded-2xl flex items-center justify-center text-white shadow-xl">
              <Filter className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-2xl font-[900] text-slate-900 tracking-tight">Tra Cứu Năng Lực Số</h2>
              <p className="text-[10px] text-sky-600 font-black uppercase tracking-[0.3em] mt-1">Hệ thống chỉ báo Thông tư 02/2025</p>
            </div>
          </div>
          <button onClick={onClose} className="p-4 hover:bg-slate-100 rounded-full transition-all text-slate-400 hover:text-slate-950">
            <X className="w-8 h-8" />
          </button>
        </div>

        {/* SEARCH & FILTERS BAR */}
        <div className="p-8 bg-slate-50/50 border-b border-slate-100 space-y-6">
          <div className="relative max-w-3xl">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-400" />
            <input
              type="text"
              className="w-full pl-16 pr-6 py-5 bg-white border-2 border-slate-100 rounded-3xl outline-none focus:border-sky-500 focus:ring-8 focus:ring-sky-500/5 transition-all text-lg font-bold text-slate-900 placeholder-slate-300 shadow-sm"
              placeholder="Tìm mã hoặc từ khóa (Ví dụ: 1.1TC1a, tìm kiếm, an toàn)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <button 
              onClick={() => setActiveTab('all')}
              className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap border-2
                ${activeTab === 'all' ? 'bg-slate-900 text-white border-slate-900 shadow-lg' : 'bg-white text-slate-500 border-slate-100 hover:border-slate-300'}`}
            >
              Tất cả miền
            </button>
            {DIGITAL_COMPETENCY_FRAMEWORK.map(d => (
              <button 
                key={d.id}
                onClick={() => setActiveTab(d.id)}
                className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap border-2
                  ${activeTab === d.id ? 'bg-sky-600 text-white border-sky-600 shadow-lg' : 'bg-white text-slate-500 border-slate-100 hover:border-slate-300'}`}
              >
                Miền {d.id}
              </button>
            ))}
          </div>
        </div>

        {/* CONTENT AREA */}
        <div className="flex-1 overflow-y-auto p-8 lg:p-10 space-y-8 bg-white custom-scrollbar">
          {filteredFramework.length > 0 ? (
            <div className="grid grid-cols-1 gap-8 max-w-5xl mx-auto">
              {filteredFramework.map((domain) => {
                const isExpanded = expandedDomains.has(domain.id);
                let selectedInDomain = 0;
                domain.components.forEach(c => c.indicators?.forEach(i => { if (selectedCodes.includes(i.code)) selectedInDomain++; }));

                return (
                  <div key={domain.id} className={`rounded-[2.5rem] border-2 transition-all duration-500 overflow-hidden ${isExpanded ? 'border-sky-200 bg-white shadow-2xl' : 'border-slate-50 bg-slate-50/30'}`}>
                    <button
                      onClick={() => toggleDomain(domain.id)}
                      className={`w-full flex items-center justify-between p-8 transition-colors text-left ${isExpanded ? 'bg-sky-50/50' : 'hover:bg-slate-100'}`}
                    >
                      <div className="flex items-center gap-6">
                        <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-lg border border-slate-50">
                          {getDomainIcon(domain.id)}
                        </div>
                        <div>
                          <h3 className="font-extrabold text-xl text-slate-900 leading-tight">{domain.title}</h3>
                          <p className="text-sm text-slate-500 font-semibold mt-1">{domain.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        {selectedInDomain > 0 && (
                          <span className="bg-sky-600 text-white text-[10px] font-black px-3 py-1.5 rounded-full shadow-lg">
                            Đã chọn {selectedInDomain}
                          </span>
                        )}
                        {isExpanded ? <ChevronDown className="w-6 h-6 text-slate-900" /> : <ChevronRight className="w-6 h-6 text-slate-300" />}
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="p-8 space-y-12 animate-in slide-in-from-top-4 duration-500 border-t border-sky-100">
                        {domain.components.map((comp) => (
                          <div key={comp.id} className="relative pl-8 border-l-4 border-slate-100 group/comp">
                            <div className="mb-6">
                              <span className="text-[10px] font-black text-sky-600 bg-sky-50 px-3 py-1 rounded-md uppercase tracking-widest">{comp.id}</span>
                              <h4 className="text-lg font-extrabold text-slate-900 mt-2">{comp.title}</h4>
                              <p className="text-sm text-slate-400 font-medium mt-1 leading-relaxed">{comp.description}</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {comp.indicators?.map((ind) => {
                                const isSelected = selectedCodes.includes(ind.code);
                                return (
                                  <div 
                                    key={ind.code}
                                    onClick={() => onToggleCode(ind.code)}
                                    className={`relative p-5 rounded-3xl border-2 transition-all duration-300 cursor-pointer group/ind flex flex-col justify-between
                                      ${isSelected ? 'bg-sky-600 border-sky-600 text-white shadow-xl shadow-sky-600/20 translate-y-[-4px]' : 'bg-white border-slate-100 hover:border-sky-400 hover:shadow-lg'}`}
                                  >
                                    <div className="flex justify-between items-start mb-4">
                                      <span className={`text-[10px] font-black px-3 py-1 rounded-lg ${isSelected ? 'bg-white/20' : 'bg-slate-100 text-slate-500'}`}>
                                        {ind.code}
                                      </span>
                                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${isSelected ? 'bg-white border-white' : 'border-slate-200 bg-white'}`}>
                                        {isSelected && <Check className="w-4 h-4 text-sky-600 stroke-[5]" />}
                                      </div>
                                    </div>
                                    <p className={`text-sm font-bold leading-relaxed ${isSelected ? 'text-white' : 'text-slate-700'}`}>
                                      {ind.description}
                                    </p>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-40 text-slate-200">
               <Search className="w-24 h-24 mb-6 opacity-20" />
               <p className="text-xl font-black uppercase tracking-[0.2em]">Không tìm thấy kết quả phù hợp</p>
               <button onClick={() => { setSearchTerm(''); setActiveTab('all'); }} className="mt-6 text-sky-600 font-bold hover:underline">Xóa tất cả bộ lọc</button>
            </div>
          )}
        </div>

        {/* MODAL FOOTER */}
        <div className="px-10 py-8 border-t border-slate-100 bg-slate-50 flex flex-col md:flex-row justify-between items-center gap-6 shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-sky-600 shadow-md border border-slate-100">
              <List className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest leading-none mb-1">Tổng cộng đã chọn</p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-[900] text-slate-900 leading-none">{selectedCodes.length}</span>
                <span className="text-sm font-bold text-slate-400 uppercase tracking-tighter">Chỉ báo năng lực</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-4 w-full md:w-auto">
            {selectedCodes.length > 0 && (
              <button 
                onClick={() => selectedCodes.forEach(c => onToggleCode(c))}
                className="px-6 py-4 text-slate-400 hover:text-red-500 font-black text-xs uppercase tracking-widest transition-all"
              >
                Bỏ chọn tất cả
              </button>
            )}
            <button 
              onClick={onClose}
              className="flex-1 md:flex-none px-12 py-5 bg-slate-950 hover:bg-sky-600 text-white font-extrabold rounded-2xl shadow-xl transition-all active:scale-95 text-sm uppercase tracking-[0.15em] flex items-center justify-center"
            >
              Hoàn tất lựa chọn
              <ChevronRight className="w-5 h-5 ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompetencyLookupModal;
