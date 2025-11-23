import React, { useState, useCallback, useEffect } from 'react';
import { Task, DayPlan, ScheduleHistory, Priority } from './types';
import { TaskForm } from './components/TaskForm';
import { TaskList } from './components/TaskList';
import { PlanDisplay } from './components/PlanDisplay';
import { HistoryModal } from './components/HistoryModal';
import { BulkImportModal } from './components/BulkImportModal';
import { DashboardView } from './components/DashboardView';
import { FloatingActionButton } from './components/FloatingActionButton';
import { ApiKeySetup } from './components/ApiKeySetup';
import { WelcomeModal } from './components/WelcomeModal';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { generateSchedule } from './services/gemini';
import { useLanguage } from './contexts/LanguageContext';
import { Sparkles, BrainCircuit, CalendarClock, LayoutDashboard, History, Upload, Copy, Trash2, Check, Edit3, Save, X, Navigation, List, Settings, Languages } from 'lucide-react';

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
  const { t, language } = useLanguage();
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
  const [isBulkImportOpen, setIsBulkImportOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const [isEditingPlan, setIsEditingPlan] = useState(false);
  const [tempEditedPlan, setTempEditedPlan] = useState<DayPlan | null>(null);
  const [isMobileView, setIsMobileView] = useState(false);
  const [currentTime, setCurrentTime] = useState<string>('');
  const [showDashboard, setShowDashboard] = useState(true);
  const [apiKey, setApiKey] = useState<string>('');
  const [showApiKeySetup, setShowApiKeySetup] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);

  // Load API key on mount
  useEffect(() => {
    const storedKey = localStorage.getItem('gemini_api_key');
    setApiKey(storedKey || '');
    
    // Always show welcome if no API key
    if (!storedKey) {
      setShowWelcome(true);
    }
  }, []);

  // Detect mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Update current time
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

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
    
    // Check API key before generating
    if (!apiKey) {
      setError(t.generate.errors.noApiKey);
      setShowApiKeySetup(true);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const { plan: generatedPlan, tokenUsage } = await generateSchedule(tasks, language);
      setPlan(generatedPlan);

      // Export tasks to text for re-import
      const tasksText = exportTasksToText(tasks);

      // Save to history
      const historyEntry: ScheduleHistory = {
        id: crypto.randomUUID(),
        timestamp: Date.now(),
        plan: generatedPlan,
        tasksCount: tasks.length,
        tokenUsage,
        modelUsed: 'gemini-2.5-flash',
        tasksText,
      };
      
      setHistory(prev => [historyEntry, ...prev]); // Add to beginning
    } catch (err: any) {
      const errorMessage = err.message || "";
      if (errorMessage.includes("API Key")) {
        setError(t.generate.errors.invalidApiKey);
        setShowApiKeySetup(true);
      } else {
        setError(t.generate.errors.generic);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveApiKey = (key: string) => {
    if (key) {
      localStorage.setItem('gemini_api_key', key);
      setApiKey(key);
    } else {
      localStorage.removeItem('gemini_api_key');
      setApiKey('');
    }
  };

  const handleWelcomeClose = () => {
    setShowWelcome(false);
    // User chose "Later" - respect their choice
  };

  const handleContinueToSetup = () => {
    setShowWelcome(false);
    setShowApiKeySetup(true);
  };

  const handleClearHistory = () => {
    if (window.confirm('Bạn có chắc muốn xóa toàn bộ lịch sử?')) {
      setHistory([]);
    }
  };

  const handlePlanUpdate = (updatedPlan: DayPlan) => {
    setPlan(updatedPlan);
  };

  const handleStartEditing = () => {
    setIsEditingPlan(true);
    setTempEditedPlan(plan);
  };

  const handleSaveEdit = () => {
    if (tempEditedPlan) {
      setPlan(tempEditedPlan);
    }
    setIsEditingPlan(false);
    setTempEditedPlan(null);
  };

  const handleCancelEdit = () => {
    setIsEditingPlan(false);
    setTempEditedPlan(null);
  };

  const handleScrollToCurrentTask = () => {
    const currentTask = document.getElementById('current-task');
    if (currentTask) {
      currentTask.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  // Get current task for FAB
  const getCurrentTask = () => {
    if (!plan || !currentTime) return null;
    const allItems = [...plan.morning, ...plan.afternoon, ...plan.evening];
    const [currentHour, currentMinute] = currentTime.split(':').map(Number);
    const currentTotalMinutes = currentHour * 60 + currentMinute;

    for (const item of allItems) {
      const [itemHour, itemMinute] = item.time.split(':').map(Number);
      const itemStartMinutes = itemHour * 60 + itemMinute;
      const itemEndMinutes = itemStartMinutes + item.duration;

      if (currentTotalMinutes >= itemStartMinutes && currentTotalMinutes < itemEndMinutes) {
        return item;
      }
    }
    return null;
  };

  const getTimeRemaining = (task: any): number => {
    if (!currentTime) return task.duration;
    const [currentHour, currentMinute] = currentTime.split(':').map(Number);
    const currentTotalMinutes = currentHour * 60 + currentMinute;
    const [taskHour, taskMinute] = task.time.split(':').map(Number);
    const taskEndMinutes = taskHour * 60 + taskMinute + task.duration;
    return Math.max(0, taskEndMinutes - currentTotalMinutes);
  };

  const getProgress = (task: any): number => {
    const remaining = getTimeRemaining(task);
    return Math.round(((task.duration - remaining) / task.duration) * 100);
  };

  const handleBulkImport = (importedTasks: Task[]) => {
    setTasks(prev => [...prev, ...importedTasks]);
    if (plan) setPlan(null); // Clear plan to encourage regeneration
  };

  // Export tasks to text format (compatible with bulk import)
  const exportTasksToText = (tasks: Task[]): string => {
    return tasks.map(task => {
      let line = task.title;
      
      // Add duration
      if (task.duration >= 60 && task.duration % 60 === 0) {
        line += ` - ${task.duration / 60}h`;
      } else {
        line += ` - ${task.duration}p`;
      }
      
      // Add fixed time if exists
      if (task.fixedTime) {
        line += ` - ${task.fixedTime}`;
      }
      
      // Add priority
      if (task.priority === Priority.High) {
        line += ' !cao';
      } else if (task.priority === Priority.Low) {
        line += ' !thấp';
      }
      
      return line;
    }).join('\n');
  };

  const handleCopyTasks = async () => {
    if (tasks.length === 0) return;
    
    const text = exportTasksToText(tasks);
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleClearAllTasks = () => {
    if (tasks.length === 0) return;
    
    if (window.confirm(t.taskList.confirmClear)) {
      setTasks([]);
      if (plan) setPlan(null);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-indigo-200">
              <LayoutDashboard className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <h1 className="text-base sm:text-xl font-bold text-slate-800 tracking-tight">{t.header.title}</h1>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
            <LanguageSwitcher />
            
            <button
              onClick={() => setShowApiKeySetup(true)}
              className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium rounded-lg transition-colors ${
                apiKey 
                  ? 'text-slate-600 hover:text-indigo-600 hover:bg-indigo-50' 
                  : 'text-rose-600 bg-rose-50 hover:bg-rose-100 animate-pulse'
              }`}
              title={apiKey ? 'Quản lý API Key' : 'Cần thiết lập API Key'}
            >
              <Settings className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">{apiKey ? t.header.settings : t.header.apiKey}</span>
              {!apiKey && <span className="sm:hidden">!</span>}
            </button>
            
            <button
              onClick={() => setIsHistoryModalOpen(true)}
              className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-medium text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors relative"
            >
              <History className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">{t.header.history}</span>
              {history.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-indigo-600 text-white text-[10px] sm:text-xs rounded-full flex items-center justify-center">
                  {history.length}
                </span>
              )}
            </button>
            <div className="hidden md:flex text-xs sm:text-sm font-medium text-slate-500 items-center gap-1">
              <span className="hidden lg:inline">{t.common.poweredBy}</span> Gemini <Sparkles className="w-3 h-3 text-indigo-500" />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 lg:h-[calc(100vh-4rem)]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8 lg:h-full">
          
          {/* Left Column: Input & Controls */}
          <div className="lg:col-span-4 space-y-4 sm:space-y-6 py-4 sm:py-8 pb-6">
            <div className="bg-indigo-900 text-white p-6 rounded-2xl shadow-xl shadow-indigo-900/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-5 rounded-full -mr-10 -mt-10 blur-2xl"></div>
              <h2 className="text-2xl font-bold mb-2">{t.planOverview.title}</h2>
              <p className="text-indigo-200 text-sm mb-6">
                {t.planOverview.subtitle}
              </p>
              
              <div className="flex items-center justify-between text-xs font-mono bg-indigo-800/50 p-3 rounded-lg border border-indigo-700/50">
                <span>{tasks.length} {t.planOverview.tasks}</span>
                <span className="flex items-center gap-1">
                  {tasks.reduce((acc, t) => acc + t.duration, 0)} {t.planOverview.totalMinutes}
                </span>
              </div>
            </div>

            <TaskForm onAddTask={handleAddTask} />
            
            {/* Bulk Import Button */}
            <button
              onClick={() => setIsBulkImportOpen(true)}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border-2 border-dashed border-indigo-200 text-indigo-600 font-medium rounded-xl hover:bg-indigo-50 hover:border-indigo-300 transition-all group"
            >
              <Upload className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span>{t.generate.importButton}</span>
            </button>

            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
               <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="font-semibold text-slate-700">{t.taskList.title}</h3>
                    {tasks.length > 0 && (
                      <span className="text-xs bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full">{tasks.length}</span>
                    )}
                  </div>
                  {tasks.length > 0 && (
                    <div className="flex gap-2">
                      <button
                        onClick={handleCopyTasks}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>{t.taskList.copied}</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>{t.taskList.copyText}</span>
                          </>
                        )}
                      </button>
                      <button
                        onClick={handleClearAllTasks}
                        className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>{t.taskList.clearAll}</span>
                      </button>
                    </div>
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
                  {t.generate.loading}
                </>
              ) : (
                <>
                  <BrainCircuit className="w-6 h-6" />
                  {t.generate.button}
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
          <div className="lg:col-span-8 flex flex-col py-4 sm:py-8 lg:h-full">
            {!plan ? (
              <div className="min-h-[400px] sm:h-[600px] flex flex-col items-center justify-center text-center p-4 sm:p-8 border-2 border-dashed border-slate-200 rounded-2xl sm:rounded-3xl bg-white/50">
                <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mb-6 animate-pulse">
                  <CalendarClock className="w-10 h-10 text-indigo-300" />
                </div>
                <h3 className="text-xl font-semibold text-slate-700 mb-2">{t.planDisplay.emptyTitle}</h3>
                <p className="text-slate-500 max-w-md">
                  {t.planDisplay.emptyDesc}
                </p>
              </div>
            ) : (
              <>
                {/* View Switcher & Controls Bar */}
                <div className="bg-white border border-slate-200 rounded-xl p-3 sm:p-4 mb-4 shadow-sm sticky top-0 z-10">
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                    {/* View Toggle */}
                    <div className="flex items-center gap-2">
                      <div className="bg-slate-100 p-1 rounded-lg flex gap-1">
                        <button
                          onClick={() => setShowDashboard(true)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                            showDashboard 
                              ? 'bg-white text-indigo-600 shadow-sm' 
                              : 'text-slate-600 hover:text-slate-800'
                          }`}
                        >
                          <LayoutDashboard className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Dashboard</span>
                        </button>
                        <button
                          onClick={() => setShowDashboard(false)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                            !showDashboard 
                              ? 'bg-white text-indigo-600 shadow-sm' 
                              : 'text-slate-600 hover:text-slate-800'
                          }`}
                        >
                          <List className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Timeline</span>
                        </button>
                      </div>
                      
                      {!showDashboard && (
                        <button
                          onClick={handleScrollToCurrentTask}
                          className="flex items-center justify-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 font-medium rounded-lg hover:bg-green-100 transition-colors text-sm border border-green-200"
                        >
                          <Navigation className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Tới task hiện tại</span>
                        </button>
                      )}
                    </div>
                  
                    {/* Edit Controls */}
                    <div className="flex gap-2">
                    {!isEditingPlan ? (
                      <button
                        onClick={handleStartEditing}
                        className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-white border border-indigo-200 text-indigo-600 font-medium rounded-lg hover:bg-indigo-50 transition-colors shadow-sm text-sm"
                      >
                        <Edit3 className="w-4 h-4" />
                        <span className="hidden sm:inline">Chỉnh sửa</span>
                        <span className="sm:hidden">Sửa</span>
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={handleCancelEdit}
                          className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-white border border-slate-200 text-slate-600 font-medium rounded-lg hover:bg-slate-50 transition-colors text-sm flex-1 sm:flex-none"
                        >
                          <X className="w-4 h-4" />
                          <span>Hủy</span>
                        </button>
                        <button
                          onClick={handleSaveEdit}
                          className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-medium rounded-lg hover:shadow-lg transition-all text-sm flex-1 sm:flex-none"
                        >
                          <Save className="w-4 h-4" />
                          <span>Lưu</span>
                        </button>
                      </>
                    )}
                    </div>
                  </div>
                </div>
                
                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto pr-2 pb-6">
                  {showDashboard ? (
                    <DashboardView plan={plan} />
                  ) : (
                    <PlanDisplay 
                      plan={plan} 
                      onPlanUpdate={handlePlanUpdate}
                      isEditing={isEditingPlan}
                      onEditChange={setTempEditedPlan}
                    />
                  )}
                </div>

                {/* FAB for mobile */}
                {isMobileView && getCurrentTask() && (
                  <FloatingActionButton
                    currentTask={getCurrentTask()}
                    timeRemaining={getTimeRemaining(getCurrentTask()!)}
                    progress={getProgress(getCurrentTask()!)}
                  />
                )}
              </>
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

      {/* Bulk Import Modal */}
      <BulkImportModal
        isOpen={isBulkImportOpen}
        onClose={() => setIsBulkImportOpen(false)}
        onImport={handleBulkImport}
      />

      {/* Welcome Modal */}
      <WelcomeModal
        isOpen={showWelcome}
        onClose={handleWelcomeClose}
        onContinueToSetup={handleContinueToSetup}
      />

      {/* API Key Setup Modal */}
      <ApiKeySetup
        isOpen={showApiKeySetup}
        onClose={() => setShowApiKeySetup(false)}
        currentKey={apiKey}
        onSave={handleSaveApiKey}
      />
    </div>
  );
}