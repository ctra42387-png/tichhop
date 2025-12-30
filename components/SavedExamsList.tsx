
import React, { useState, useMemo, useEffect } from 'react';
import { SavedExam } from '../types.ts';
import { ChevronLeft, Eye, Trash2, Archive, Search, ChevronRight, Clock, FileText } from 'lucide-react';

interface Props {
  exams: SavedExam[];
  onView: (exam: SavedExam) => void;
  onDelete: (examId: string) => void;
  onBack: () => void;
}

const ITEMS_PER_PAGE = 6;

const SavedExamsList: React.FC<Props> = ({ exams, onView, onDelete, onBack }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredExams = useMemo(() => {
    return exams.filter(exam =>
      exam.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      exam.config.subject.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [exams, searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const totalPages = Math.ceil(filteredExams.length / ITEMS_PER_PAGE);

  const paginatedExams = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredExams.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredExams, currentPage]);

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  return (
    <div className="max-w-6xl mx-auto px-4">
      <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition font-bold bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100"
        >
          <ChevronLeft size={20} /> Quay lại
        </button>
        <div className="text-center">
            <h2 className="text-2xl font-black text-gray-800">Hồ Sơ Đã Lưu</h2>
            <p className="text-sm text-gray-500">Kho lưu trữ các đề kiểm tra bạn đã tạo</p>
        </div>
        <div className="w-full md:w-auto relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
            type="search"
            placeholder="Tìm kiếm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-64 pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none shadow-sm transition-all"
            />
        </div>
      </div>

      {exams.length === 0 ? (
        <div className="text-center bg-white/60 backdrop-blur-sm p-16 rounded-3xl border border-dashed border-gray-300 flex flex-col items-center gap-6 animate-in fade-in zoom-in duration-500">
            <div className="bg-gray-100 p-6 rounded-full text-gray-300">
                <Archive size={48} />
            </div>
            <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Chưa có hồ sơ nào</h3>
                <p className="text-gray-500 max-w-sm mx-auto">Hãy tạo một đề kiểm tra mới và lưu lại, danh sách các đề đã lưu sẽ xuất hiện tại đây.</p>
            </div>
            <button onClick={onBack} className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 transition-all">
                Tạo đề ngay
            </button>
        </div>
      ) : filteredExams.length === 0 ? (
        <div className="text-center bg-white p-12 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center gap-4">
            <Search size={48} className="text-gray-200" />
            <h3 className="text-lg font-semibold text-gray-700">Không tìm thấy kết quả</h3>
            <p className="text-gray-500">Không có hồ sơ nào khớp với từ khóa "{searchTerm}"</p>
        </div>
      ) : (
        <>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedExams.map((exam) => (
              <div key={exam.id} className="group bg-white rounded-2xl p-5 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-gray-100 hover:border-blue-200 flex flex-col h-full">
                <div className="flex items-start justify-between mb-4">
                    <div className="p-3 rounded-xl bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                        <FileText size={24} />
                    </div>
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button
                            onClick={() => onView(exam)}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                            title="Xem lại"
                        >
                            <Eye size={18} />
                        </button>
                         <button
                            onClick={() => {
                                if(window.confirm(`Bạn có chắc muốn xóa hồ sơ "${exam.title}" không?`)) {
                                    onDelete(exam.id)
                                }
                            }}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                            title="Xóa vĩnh viễn"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                </div>
                
                <div className="flex-grow">
                    <h4 className="font-bold text-lg text-gray-800 mb-2 line-clamp-2 group-hover:text-blue-700 transition-colors">{exam.title}</h4>
                    <div className="flex items-center gap-3 text-xs text-gray-500 mb-4">
                         <span className="bg-gray-100 px-2 py-1 rounded-md">{exam.config.subject}</span>
                         <span className="bg-gray-100 px-2 py-1 rounded-md">Lớp {exam.config.grade}</span>
                    </div>
                </div>

                <div className="pt-4 border-t border-gray-50 flex items-center justify-between text-xs text-gray-400">
                    <div className="flex items-center gap-1"><Clock size={12}/> {new Date(exam.savedAt).toLocaleDateString('vi-VN')}</div>
                    <button onClick={() => onView(exam)} className="font-bold text-blue-600 hover:underline">Chi tiết &rarr;</button>
                </div>
              </div>
            ))}
        </div>

        {totalPages > 1 && (
          <div className="mt-10 flex justify-center items-center gap-4 text-sm font-medium">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-all"
            >
              <ChevronLeft size={16} /> Trước
            </button>
            <div className="bg-white px-4 py-2 rounded-xl border border-gray-200 shadow-sm text-blue-600">
              Trang {currentPage} / {totalPages}
            </div>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-all"
            >
              Sau <ChevronRight size={16} />
            </button>
          </div>
        )}
        </>
      )}
    </div>
  );
};

export default SavedExamsList;
