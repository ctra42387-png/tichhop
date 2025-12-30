
import { GoogleGenAI, Type } from "@google/genai";
import { ManualInputData, GeneratedLessonPlan, ChatMessage } from "../types";
import { SYSTEM_INSTRUCTION } from "../constants";

const MODEL_NAME = 'gemini-3-pro-preview';

export const generateLessonPlan = async (config: ManualInputData): Promise<GeneratedLessonPlan> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    Hãy soạn thảo Kế hoạch bài dạy cho bài: "${config.lessonName}"
    Môn: ${config.subject}
    Khối: ${config.grade}
    Bộ sách: ${config.textbook}
    
    Các mã Năng lực số cần tích hợp: ${config.competencies.join(', ')}
    
    Yêu cầu: Tuân thủ mẫu Phụ lục IV (CV 5512). 
    Đặc biệt quan trọng: Bôi đỏ (<span style="color: red;">...</span>) các hoạt động có yếu tố công nghệ và mã hóa năng lực số tương ứng.
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        thinkingConfig: { thinkingBudget: 32768 },
      },
    });

    const text = response.text;
    if (!text) throw new Error("Empty response from Gemini API");
    return { content: text };
  } catch (error) {
    console.error("Gemini Error:", error);
    throw error;
  }
};

export const chatWithAI = async (
  history: ChatMessage[],
  currentMarkdown: string,
  onStream: (text: string, isFullUpdate: boolean) => void
) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const lastUserMsg = history[history.length - 1].text;
  
  const prompt = `
    Nội dung giáo án hiện tại:
    ---
    ${currentMarkdown}
    ---
    
    Yêu cầu của giáo viên: ${lastUserMsg}
    
    Nếu giáo viên yêu cầu chỉnh sửa/viết lại giáo án, hãy phản hồi bằng TOÀN BỘ nội dung giáo án đã cập nhật và bắt đầu bằng từ khóa "FULL_UPDATE:". 
    Nếu giáo viên chỉ hỏi đáp, hãy trả lời ngắn gọn như một trợ lý chuyên môn.
  `;

  try {
    const responseStream = await ai.models.generateContentStream({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        thinkingConfig: { thinkingBudget: 16000 },
      },
    });

    let fullText = '';
    for await (const chunk of responseStream) {
      fullText += chunk.text;
      const isFullUpdate = fullText.startsWith("FULL_UPDATE:");
      const displayContent = isFullUpdate ? fullText.replace("FULL_UPDATE:", "").trim() : fullText;
      onStream(displayContent, isFullUpdate);
    }
  } catch (error) {
    console.error("Chat Error:", error);
    throw error;
  }
};
