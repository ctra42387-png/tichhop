
export interface DigitalIndicator {
  code: string;
  description: string;
}

export interface CompetencyComponent {
  id: string;
  title: string;
  description: string;
  indicators: DigitalIndicator[];
}

export interface DigitalDomain {
  id: string;
  title: string;
  description: string;
  components: CompetencyComponent[];
}

export const DIGITAL_COMPETENCY_FRAMEWORK: DigitalDomain[] = [
  {
    id: "1",
    title: "Năng lực thông tin và dữ liệu",
    description: "Khả năng tìm kiếm, đánh giá và quản lý thông tin dữ liệu số.",
    components: [
      {
        id: "1.1TC1",
        title: "Duyệt, tìm kiếm, lọc dữ liệu, thông tin và nội dung số",
        description: "Truy cập và tìm kiếm thông tin hiệu quả.",
        indicators: [
          { code: "1.1TC1a", description: "Sử dụng từ khóa đơn giản để tìm kiếm thông tin trên internet." },
          { code: "1.1TC1b", description: "Sử dụng các bộ lọc cơ bản để thu hẹp kết quả tìm kiếm." }
        ]
      },
      {
        id: "1.2TC1",
        title: "Đánh giá dữ liệu, thông tin và nội dung số",
        description: "Phân tích tính tin cậy của nguồn tin.",
        indicators: [
          { code: "1.2TC1a", description: "Phân biệt được tin giả và tin thật cơ bản." }
        ]
      }
    ]
  },
  {
    id: "2",
    title: "Giao tiếp và cộng tác",
    description: "Tương tác và làm việc nhóm trong môi trường số.",
    components: [
      {
        id: "2.1TC1",
        title: "Tương tác qua các công nghệ số",
        description: "Sử dụng các kênh liên lạc số.",
        indicators: [
          { code: "2.1TC1a", description: "Sử dụng email, tin nhắn để trao đổi bài học." }
        ]
      },
      {
        id: "2.2TC1",
        title: "Chia sẻ thông tin và nội dung số",
        description: "Phân phối nội dung số an toàn.",
        indicators: [
          { code: "2.2TC1a", description: "Chia sẻ tài liệu qua Google Drive, OneDrive." }
        ]
      }
    ]
  },
  {
    id: "3",
    title: "Sáng tạo nội dung số",
    description: "Tạo lập và biên tập các sản phẩm số.",
    components: [
      {
        id: "3.1TC1",
        title: "Phát triển nội dung số",
        description: "Tạo văn bản, hình ảnh, video.",
        indicators: [
          { code: "3.1TC1a", description: "Thiết kế bài thuyết trình sinh động bằng Canva/PowerPoint." }
        ]
      }
    ]
  },
  {
    id: "4",
    title: "An toàn",
    description: "Bảo vệ thiết bị và thông tin cá nhân.",
    components: [
      {
        id: "4.1TC1",
        title: "Bảo vệ thiết bị",
        description: "Phòng tránh mã độc.",
        indicators: [
          { code: "4.1TC1a", description: "Biết cách đặt mật khẩu mạnh." }
        ]
      }
    ]
  },
  {
    id: "5",
    title: "Giải quyết vấn đề",
    description: "Khắc phục lỗi kỹ thuật và tư duy máy tính.",
    components: [
      {
        id: "5.1TC1",
        title: "Giải quyết các vấn đề kỹ thuật",
        description: "Khắc phục lỗi phần mềm/phần cứng cơ bản.",
        indicators: [
          { code: "5.1TC1a", description: "Tự sửa lỗi mất âm thanh hoặc không kết nối được wifi." }
        ]
      }
    ]
  }
];

export interface ManualInputData {
  lessonName: string;
  subject: string;
  grade: string;
  textbook: string;
  competencies: string[];
}

/** Fix: Added UploadInputData interface which was missing and used in UploadForm.tsx */
export interface UploadInputData {
  textContent: string;
  file: File | null;
  competencies: string[];
}

export interface GeneratedLessonPlan {
  content: string; // Markdown format
}

export interface GenerationState {
  isLoading: boolean;
  error: string | null;
  data: GeneratedLessonPlan | null;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  isUpdatingDoc?: boolean;
}

/** Fix: Added Exam-related types which were missing and used in ExamForm.tsx and storageService.ts */
export enum ExamType {
  REGULAR = 'regular',
  MID_TERM = 'mid-term',
  FINAL = 'final'
}

export enum QuestionFormat {
  OBJECTIVE = 'objective',
  SUBJECTIVE = 'subjective',
  COMBINED = 'combined'
}

export type InputMode = 'manual' | 'upload';

export interface ScopeItem {
  id: string;
  chapter: string;
  name: string;
  periods: number;
}

export interface QuestionCounts {
  part1: number;
  part2: number;
  part3: number;
  part4: number;
}

export interface LevelDistribution {
  awareness: number;
  understanding: number;
  application: number;
}

export interface ExamConfig {
  subject: string;
  grade: string;
  textbook: string;
  scopeType: 'chapter' | 'lesson';
  examType: ExamType;
  duration: number;
  scopeItems: ScopeItem[];
  format: QuestionFormat;
  inputMode: InputMode;
  questionCounts: QuestionCounts;
  levelDistribution: LevelDistribution;
  uploadedContent?: string;
}

export interface GeneratedExamData {
  matrix: string;
  specification: string;
  exam: string;
  answerKey: string;
}

export interface SavedExam {
  id: string;
  title: string;
  savedAt: string;
  config: ExamConfig;
  data: GeneratedExamData;
}
