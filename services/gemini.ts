import { GoogleGenAI, Type } from "@google/genai";
import { Task, DayPlan, Priority, TokenUsage } from "../types";

// Gemini 2.5 Flash Pricing (as of 2024)
// Source: https://ai.google.dev/pricing
const GEMINI_PRICING = {
  model: 'gemini-2.5-flash',
  inputPer1M: 0.075,  // $0.075 per 1M input tokens
  outputPer1M: 0.30,  // $0.30 per 1M output tokens
};

const calculateCost = (promptTokens: number, candidatesTokens: number): number => {
  const inputCost = (promptTokens / 1_000_000) * GEMINI_PRICING.inputPer1M;
  const outputCost = (candidatesTokens / 1_000_000) * GEMINI_PRICING.outputPer1M;
  return inputCost + outputCost;
};

// Define the schema for the AI response strictly
const scheduleItemSchema = {
  type: Type.OBJECT,
  properties: {
    time: { type: Type.STRING, description: "Start time of the block, e.g., '09:00'" },
    taskTitle: { type: Type.STRING, description: "Name of the task or 'Nghỉ giải lao'" },
    type: { type: Type.STRING, enum: ["work", "break", "buffer"] },
    duration: { type: Type.NUMBER, description: "Duration in minutes" },
    reason: { type: Type.STRING, description: "Why this slot was chosen (optional)" }
  },
  required: ["time", "taskTitle", "type", "duration"]
};

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    morning: {
      type: Type.ARRAY,
      items: scheduleItemSchema,
      description: "Tasks scheduled from start of day until 12:00"
    },
    afternoon: {
      type: Type.ARRAY,
      items: scheduleItemSchema,
      description: "Tasks scheduled from 12:00 until 18:00"
    },
    evening: {
      type: Type.ARRAY,
      items: scheduleItemSchema,
      description: "Tasks scheduled from 18:00 onwards"
    },
    tips: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "3-5 productivity tips specific to this schedule (e.g., grouping similar tasks)"
    }
  },
  required: ["morning", "afternoon", "evening", "tips"]
};

export const generateSchedule = async (tasks: Task[]): Promise<{ plan: DayPlan; tokenUsage: TokenUsage }> => {
  // Get API key from localStorage
  const apiKey = localStorage.getItem('gemini_api_key');
  
  if (!apiKey) {
    throw new Error("API Key not found. Please add your Gemini API key in settings.");
  }

  const ai = new GoogleGenAI({ apiKey });

  const currentTime = new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  
  // Separate fixed time tasks from flexible tasks
  const fixedTimeTasks = tasks.filter(t => t.fixedTime);
  const flexibleTasks = tasks.filter(t => !t.fixedTime);

  const prompt = `
    Tôi là một trợ lý năng suất cá nhân. Hãy giúp tôi lập kế hoạch làm việc dựa trên danh sách công việc sau đây.
    
    Thời gian hiện tại là: ${currentTime}.
    Nếu thời gian hiện tại là buổi chiều hoặc tối, hãy lên lịch cho ngày mai hoặc phần còn lại của ngày hôm nay một cách hợp lý.
    
    ${fixedTimeTasks.length > 0 ? `
    ⚠️ QUAN TRỌNG - CÁC CÔNG VIỆC CÓ THỜI GIAN CỐ ĐỊNH (BẮT BUỘC):
    ${JSON.stringify(fixedTimeTasks, null, 2)}
    
    Những công việc này PHẢI được sắp xếp đúng thời gian "fixedTime" được chỉ định.
    Ví dụ: Nếu có "fixedTime": "15:00" và "duration": 60, thì phải sắp xếp từ 15:00-16:00.
    KHÔNG ĐƯỢC thay đổi thời gian này!
    ` : ''}
    
    ${flexibleTasks.length > 0 ? `
    Các công việc linh hoạt (có thể sắp xếp):
    ${JSON.stringify(flexibleTasks, null, 2)}
    ` : ''}
    
    Yêu cầu:
    1. **BẮT BUỘC**: Các công việc có "fixedTime" PHẢI được sắp xếp đúng thời gian đã chỉ định.
    2. Sắp xếp các công việc linh hoạt xung quanh các công việc có thời gian cố định.
    3. Sắp xếp công việc linh hoạt dựa trên Mức độ ưu tiên (Cao làm trước) và Thời hạn (Deadline).
    4. Tự động chèn thời gian nghỉ (break) hợp lý (ví dụ: làm 60-90 phút nghỉ 10-15 phút), nhưng tránh đặt break ngay trước/sau fixed time tasks.
    5. Thêm thời gian đệm (buffer) nếu cần thiết để tránh quá tải và để di chuyển giữa các công việc.
    6. Gom nhóm các công việc tương tự nhau nếu có thể.
    7. Xuất ra các mẹo tối ưu hóa cụ thể cho danh sách này.
    8. Ngôn ngữ phản hồi: Tiếng Việt.
    9. Có thời gian cho các việc hằng ngày như: ăn sáng, ăn trưa, ăn tối, tắm, ngủ, ...
    10. Nên thiết kế theo pomodoro technique. Giữa các lần làm việc nên có break time tầm 5 phút.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.4, // Low temperature for more deterministic planning
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    const plan = JSON.parse(text) as DayPlan;
    
    // Extract token usage from response
    const usage = response.usageMetadata;
    const promptTokens = usage?.promptTokenCount || 0;
    const candidatesTokens = usage?.candidatesTokenCount || 0;
    const totalTokens = usage?.totalTokenCount || 0;
    
    const tokenUsage: TokenUsage = {
      promptTokens,
      candidatesTokens,
      totalTokens,
      estimatedCost: calculateCost(promptTokens, candidatesTokens),
    };

    return { plan, tokenUsage };

  } catch (error) {
    console.error("Error generating schedule:", error);
    throw error;
  }
};