import { GoogleGenAI, Type } from "@google/genai";
import { Task, DayPlan, Priority, TokenUsage } from "../types";
import { vi } from '../../i18n/vi';
import { en } from '../../i18n/en';
import type { Language } from '../../contexts/LanguageContext';

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

export const generateSchedule = async (tasks: Task[], language: Language = 'vi'): Promise<{ plan: DayPlan; tokenUsage: TokenUsage }> => {
  // Get API key from localStorage
  const apiKey = localStorage.getItem('gemini_api_key');
  
  if (!apiKey) {
    throw new Error("API Key not found. Please add your Gemini API key in settings.");
  }

  const ai = new GoogleGenAI({ apiKey });

  // Get translations based on language
  const translations = language === 'vi' ? vi : en;
  const t = translations.aiPrompt;

  const currentTime = new Date().toLocaleTimeString(language === 'vi' ? 'vi-VN' : 'en-US', { hour: '2-digit', minute: '2-digit' });
  
  // Separate fixed time tasks from flexible tasks
  const fixedTimeTasks = tasks.filter(t => t.fixedTime);
  const flexibleTasks = tasks.filter(t => !t.fixedTime);

  const prompt = `
    ${t.intro}
    
    ${t.currentTime}: ${currentTime}.
    ${t.timeNote}
    
    ${fixedTimeTasks.length > 0 ? `
    ${t.fixedTasksTitle}
    ${JSON.stringify(fixedTimeTasks, null, 2)}
    
    ${t.fixedTasksNote}
    ` : ''}
    
    ${flexibleTasks.length > 0 ? `
    ${t.flexibleTasksTitle}
    ${JSON.stringify(flexibleTasks, null, 2)}
    ` : ''}
    
    ${t.requirementsTitle}
    1. ${t.req1}
    2. ${t.req2}
    3. ${t.req3}
    4. ${t.req4}
    5. ${t.req5}
    6. ${t.req6}
    7. ${t.req7}
    8. ${t.req8}
    9. ${t.req9}
    10. ${t.req10}
    11. ${t.req11}
    12. ${t.req12}
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
