
export interface CurriculumLesson {
  name: string;
}

export interface CurriculumChapter {
  chapter: string;
  lessons?: CurriculumLesson[];
}

export const CURRICULUM_DATA: Record<string, Record<string, Record<string, CurriculumChapter[]>>> = {
  "Toán học": {
    "6": {
      "Kết nối tri thức với cuộc sống": [
        { 
          chapter: "Chương I: Tập hợp các số tự nhiên",
          lessons: [
            { name: "Bài 1: Tập hợp" },
            { name: "Bài 2: Cách ghi số tự nhiên" },
            { name: "Bài 3: Thứ tự trong tập hợp các số tự nhiên" },
            { name: "Bài 4: Phép cộng và phép trừ số tự nhiên" },
            { name: "Bài 5: Phép nhân và phép chia số tự nhiên" },
            { name: "Luyện tập chung" }
          ]
        },
        { chapter: "Chương II: Tính chia hết trong tập hợp các số tự nhiên" },
        { chapter: "Chương III: Số nguyên" },
        { chapter: "Chương IV: Một số hình phẳng trong thực tiễn" }
      ]
    },
    "7": {
      "Kết nối tri thức với cuộc sống": [
        { 
          chapter: "Chương I: Số hữu tỉ",
          lessons: [
            { name: "Bài 1: Tập hợp các số hữu tỉ" },
            { name: "Bài 2: Cộng, trừ, nhân, chia số hữu tỉ" },
            { name: "Bài 3: Phép tính lũy thừa với số mũ tự nhiên của một số hữu tỉ" },
            { name: "Bài 4: Thứ tự thực hiện các phép tính. Quy tắc chuyển vế" },
            { name: "Luyện tập chung" }
          ]
        }
      ]
    }
  },
  "Khoa học tự nhiên": {
    "6": {
      "Kết nối tri thức với cuộc sống": [
        { 
          chapter: "Chương I: Mở đầu về Khoa học tự nhiên",
          lessons: [
            { name: "Bài 1: Giới thiệu về Khoa học tự nhiên" },
            { name: "Bài 2: An toàn trong phòng thực hành" },
            { name: "Bài 3: Sử dụng kính lúp" },
            { name: "Bài 4: Sử dụng kính hiển vi quang học" },
            { name: "Bài 5: Đo chiều dài" },
            { name: "Bài 6: Đo khối lượng" },
            { name: "Bài 7: Đo thời gian" },
            { name: "Bài 8: Đo nhiệt độ" }
          ]
        },
        { chapter: "Chương II: Chất quanh ta" }
      ]
    }
  },
  "Ngữ văn": {
    "6": {
      "Kết nối tri thức với cuộc sống": [
        { 
          chapter: "Bài 1: Tôi và các bạn",
          lessons: [
            { name: "Đọc: Bài học đường đời đầu tiên" },
            { name: "Đọc: Nếu cậu muốn có một người bạn" },
            { name: "Thực hành tiếng Việt" },
            { name: "Viết: Kể lại một trải nghiệm của bản thân" },
            { name: "Nói và nghe: Kể lại một trải nghiệm của bản thân" }
          ]
        }
      ]
    }
  }
};
