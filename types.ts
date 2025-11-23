export enum Priority {
  High = 'Cao',
  Medium = 'Trung bình',
  Low = 'Thấp'
}

export interface Task {
  id: string;
  title: string;
  duration: number; // minutes
  priority: Priority;
  deadline?: string;
  fixedTime?: string; // Fixed start time in HH:mm format (e.g., "15:00" for 3 PM)
}

export enum ScheduleType {
  Work = 'work',
  Break = 'break',
  Buffer = 'buffer'
}

export interface ScheduleItem {
  time: string;
  taskTitle: string;
  type: ScheduleType;
  duration: number;
  reason?: string;
}

export interface DayPlan {
  morning: ScheduleItem[];
  afternoon: ScheduleItem[];
  evening: ScheduleItem[];
  tips: string[];
}

export interface TokenUsage {
  promptTokens: number;
  candidatesTokens: number;
  totalTokens: number;
  estimatedCost: number; // in USD
}

export interface ScheduleHistory {
  id: string;
  timestamp: number;
  plan: DayPlan;
  tasksCount: number;
  tokenUsage: TokenUsage;
  modelUsed: string;
  tasksText: string; // Tasks in text format for re-import
}