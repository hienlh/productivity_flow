import React, { useState, useCallback, useEffect } from 'react';
import { Task, DayPlan, ScheduleHistory } from './types';
import { TaskForm } from './components/TaskForm';
import { TaskList } from './components/TaskList';
import { PlanDisplay } from './components/PlanDisplay';
import { HistoryModal } from './components/HistoryModal';
import { generateSchedule } from './services/gemini';
import { Sparkles, BrainCircuit, CalendarClock, LayoutDashboard, History } from 'lucide-react';

// LocalStorage keys
const STORAGE_KEYS = {
  TASKS: 'productivityflow_tasks',
  PLAN: 'productivityflow_plan',
  HISTORY: 'productivityflow_history',
};

// Helper functions for localStorage
const loadFromStorage = <T,>(key: string, defaultValue: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error loading ${key} from localStorage:`, error);
    return defaultValue;
  }
};

const saveToStorage = <T,>(key: string, value: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
};

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(() => 
    loadFromStorage(STORAGE_KEYS.TASKS, [])
  );
  const [plan, setPlan] = useState<DayPlan | null>(() => 
    loadFromStorage(STORAGE_KEYS.PLAN, null)
  );
  const [history, setHistory] = useState<ScheduleHistory[]>(() => 
    loadFromStorage(STORAGE_KEYS.HISTORY, [])
  );
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.TASKS, tasks);
  }, [tasks]);

  // Save plan to localStorage whenever it changes
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.PLAN, plan);
  }, [plan]);

  // Save history to localStorage whenever it changes
  useEffect(() => {
    saveToStorage(STORAGE_KEYS.HISTORY, history);
  }, [history]);

  const handleAddTask = useCallback((task: Task) => {
    setTasks(prev => [...prev, task]);
    // Clear previous plan if tasks change to encourage regeneration
    if (plan) setPlan(null); 
  }, [plan]);

  const handleRemoveTask = useCallback((id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    if (plan) setPlan(null);
  }, [plan]);

  const handleGeneratePlan = async () => {
    if (tasks.length === 0) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { plan: generatedPlan, tokenUsage } = await generateSchedule(tasks);
      setPlan(generatedPlan);

      // Save to history
      const historyEntry: ScheduleHistory = {
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        plan: generatedPlan,
        tasksCount: tasks.length,
        tokenUsage,
        modelUsed: 'gemini-2.5-flash',
      };
      
      setHistory(prev => [historyEntry, ...prev]); // Add to beginning
    } catch (err: any) {
      setError("Không thể tạo lịch trình lúc này. Vui lòng kiểm tra API Key hoặc thử lại sau.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearHistory = () => {
    if (window.confirm('Bạn có chắc muốn xóa toàn bộ lịch sử?')) {
      setHistory([]);
    }
  };

  const handlePlanUpdate = (updatedPlan: DayPlan) => {
    setPlan(updatedPlan);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              <LayoutDashboard className="w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">ProductivityFlow</h1>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsHistoryModalOpen(true)}
              className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors relative"
            >
              <History className="w-4 h-4" />
              <span>Lịch sử</span>
              {history.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-indigo-600 text-white text-xs rounded-full flex items-center justify-center">
                  {history.length}
                </span>
              )}
            </button>
            <div className="text-sm font-medium text-slate-500 flex items-center gap-1">
              Powered by Gemini 2.5 Flash <Sparkles className="w-3 h-3 text-indigo-500" />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Input & Controls */}
          <div className="lg:col-span-4 space-y-6 sticky top-24">
            <div className="bg-indigo-900 text-white p-6 rounded-2xl shadow-xl shadow-indigo-900/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-10 -mt-10 blur-2xl"></div>
              <h2 className="text-2xl font-bold mb-2">Lập kế hoạch</h2>
              <p className="text-indigo-200 text-sm mb-6">
                Nhập danh sách việc cần làm, AI sẽ giúp bạn tối ưu hóa thời gian trong ngày.
              </p>
              
              <div className="flex items-center justify-between text-xs font-mono bg-indigo-800/50 p-3 rounded-lg border border-indigo-700/50">
                <span>{tasks.length} Tasks</span>
                <span className="flex items-center gap-1">
                  {tasks.reduce((acc, t) => acc + t.duration, 0)} phút tổng cộng
                </span>
              </div>
            </div>

            <TaskForm onAddTask={handleAddTask} />
            
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
               <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                  <h3 className="font-semibold text-slate-700">Danh sách chờ</h3>
                  {tasks.length > 0 && (
                    <span className="text-xs bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full">{tasks.length}</span>
                  )}
               </div>
               <div className="p-2">
                 <TaskList tasks={tasks} onRemoveTask={handleRemoveTask} />
               </div>
            </div>

            <button
              onClick={handleGeneratePlan}
              disabled={isLoading || tasks.length === 0}
              className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all transform active:scale-[0.98] flex items-center justify-center gap-3
                ${isLoading || tasks.length === 0
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                  : 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white hover:shadow-indigo-200 hover:-translate-y-0.5'
                }`}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Đang phân tích...
                </>
              ) : (
                <>
                  <BrainCircuit className="w-6 h-6" />
                  Tạo Lịch Trình
                </>
              )}
            </button>
            
            {error && (
              <div className="p-4 bg-rose-50 text-rose-600 text-sm rounded-xl border border-rose-100">
                {error}
              </div>
            )}
          </div>

          {/* Right Column: Output Visualization */}
          <div className="lg:col-span-8">
            {!plan ? (
              <div className="h-[600px] flex flex-col items-center justify-center text-center p-8 border-2 border-dashed border-slate-200 rounded-3xl bg-white/50">
                <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mb-6 animate-pulse">
                  <CalendarClock className="w-10 h-10 text-indigo-300" />
                </div>
                <h3 className="text-xl font-semibold text-slate-700 mb-2">Sẵn sàng lên kế hoạch</h3>
                <p className="text-slate-500 max-w-md">
                  Thêm các công việc của bạn ở bên trái và nhấn "Tạo Lịch Trình". AI sẽ sắp xếp thời gian biểu tối ưu nhất cho bạn.
                </p>
              </div>
            ) : (
              <PlanDisplay plan={plan} onPlanUpdate={handlePlanUpdate} />
            )}
          </div>
        </div>
      </main>

      {/* History Modal */}
      <HistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        history={history}
        onClearHistory={handleClearHistory}
      />
    </div>
  );
}