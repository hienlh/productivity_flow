'use client';

import React, { useState, useEffect } from 'react';
import { DayPlan, ScheduleItem, ScheduleType } from '../lib/types';
import { Clock, ChevronRight, CheckCircle, Circle, Zap, Coffee, Calendar } from 'lucide-react';

interface DashboardViewProps {
  plan: DayPlan;
  onMarkDone?: (item: ScheduleItem) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ plan, onMarkDone }) => {
  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentTask, setCurrentTask] = useState<ScheduleItem | null>(null);
  const [nextTasks, setNextTasks] = useState<ScheduleItem[]>([]);
  const [completedCount, setCompletedCount] = useState(0);

  // Update current time every minute
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

  // Find current and next tasks
  useEffect(() => {
    if (!currentTime) return;

    const allItems = [...plan.morning, ...plan.afternoon, ...plan.evening];
    const [currentHour, currentMinute] = currentTime.split(':').map(Number);
    const currentTotalMinutes = currentHour * 60 + currentMinute;

    let found = false;
    const upcoming: ScheduleItem[] = [];

    for (const item of allItems) {
      const [itemHour, itemMinute] = item.time.split(':').map(Number);
      const itemStartMinutes = itemHour * 60 + itemMinute;
      const itemEndMinutes = itemStartMinutes + item.duration;

      // Current task
      if (currentTotalMinutes >= itemStartMinutes && currentTotalMinutes < itemEndMinutes) {
        setCurrentTask(item);
        found = true;
      }
      // Next tasks (next 3)
      else if (itemStartMinutes > currentTotalMinutes && upcoming.length < 3) {
        upcoming.push(item);
      }
    }

    if (!found) {
      setCurrentTask(null);
    }
    setNextTasks(upcoming);

    // Count completed (tasks before current time)
    const completed = allItems.filter(item => {
      const [h, m] = item.time.split(':').map(Number);
      return (h * 60 + m + item.duration) <= currentTotalMinutes;
    }).length;
    setCompletedCount(completed);
  }, [currentTime, plan]);

  const getTimeRemaining = (task: ScheduleItem): number => {
    if (!currentTime) return task.duration;
    const [currentHour, currentMinute] = currentTime.split(':').map(Number);
    const currentTotalMinutes = currentHour * 60 + currentMinute;
    const [taskHour, taskMinute] = task.time.split(':').map(Number);
    const taskEndMinutes = taskHour * 60 + taskMinute + task.duration;
    return Math.max(0, taskEndMinutes - currentTotalMinutes);
  };

  const getProgress = (task: ScheduleItem): number => {
    const remaining = getTimeRemaining(task);
    return Math.round(((task.duration - remaining) / task.duration) * 100);
  };

  const formatDate = () => {
    const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    const now = new Date();
    return `${days[now.getDay()]}, ${now.getDate()}/${now.getMonth() + 1}`;
  };

  const totalTasks = plan.morning.length + plan.afternoon.length + plan.evening.length;
  const totalDuration = [...plan.morning, ...plan.afternoon, ...plan.evening]
    .reduce((sum, item) => sum + item.duration, 0);

  return (
    <div className="space-y-4 pb-20">
      {/* Time Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white p-4 rounded-xl shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-3xl font-bold">{currentTime || '--:--'}</div>
            <div className="text-indigo-100 text-sm">{formatDate()}</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-indigo-200">Hôm nay</div>
            <div className="text-lg font-semibold">{totalTasks} tasks</div>
          </div>
        </div>
      </div>

      {/* Current Task - Prominent */}
      {currentTask ? (
        <div className="bg-green-50 border-2 border-green-300 rounded-xl p-4 shadow-lg">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-green-700 font-bold text-sm uppercase tracking-wide">
              Đang làm • Còn {getTimeRemaining(currentTask)} phút
            </span>
          </div>
          
          <h3 className="text-xl font-bold text-slate-800 mb-3">
            {currentTask.type === ScheduleType.Work ? '📝' : currentTask.type === ScheduleType.Break ? '☕' : '⏸️'} {currentTask.taskTitle}
          </h3>
          
          <div className="mb-3">
            <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
              <span>{currentTask.time} - {currentTask.duration} phút</span>
              <span className="font-semibold">{getProgress(currentTask)}%</span>
            </div>
            <div className="h-2 bg-green-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-300"
                style={{ width: `${getProgress(currentTask)}%` }}
              ></div>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => onMarkDone?.(currentTask)}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              Hoàn thành
            </button>
            <button
              className="px-4 bg-white border border-green-300 text-green-700 font-medium py-2.5 rounded-lg hover:bg-green-50 transition-colors"
            >
              Bỏ qua
            </button>
          </div>

          {currentTask.reason && (
            <div className="mt-3 text-xs text-slate-600 bg-white/50 p-2 rounded border border-green-200">
              💡 {currentTask.reason}
            </div>
          )}
        </div>
      ) : (
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 text-center">
          <Circle className="w-12 h-12 mx-auto mb-2 text-slate-300" />
          <p className="text-slate-500 text-sm">Không có task nào đang diễn ra</p>
        </div>
      )}

      {/* Next Up */}
      {nextTasks.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="bg-slate-50 px-4 py-3 border-b border-slate-200 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 flex items-center gap-2">
              <ChevronRight className="w-4 h-4 text-indigo-500" />
              Sắp tới
            </h3>
            <span className="text-xs text-slate-500">{nextTasks.length} tasks</span>
          </div>
          <div className="divide-y divide-slate-100">
            {nextTasks.map((task, idx) => (
              <div key={idx} className="p-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="font-medium text-slate-800 mb-1">
                      {task.type === ScheduleType.Work ? '📝' : task.type === ScheduleType.Break ? '☕' : '⏸️'} {task.taskTitle}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {task.time}
                      </span>
                      <span>{task.duration} phút</span>
                    </div>
                  </div>
                  <div className="text-xs text-slate-400">
                    #{idx + 1}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Today Summary */}
      <div className="bg-white border border-slate-200 rounded-xl p-4">
        <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
          <Zap className="w-4 h-4 text-indigo-500" />
          Tổng quan hôm nay
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="text-blue-600 text-xs mb-1">Tổng tasks</div>
            <div className="text-2xl font-bold text-blue-900">{totalTasks}</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-3">
            <div className="text-purple-600 text-xs mb-1">Thời gian</div>
            <div className="text-2xl font-bold text-purple-900">{Math.round(totalDuration / 60)}h</div>
          </div>
          <div className="bg-green-50 rounded-lg p-3">
            <div className="text-green-600 text-xs mb-1">Hoàn thành</div>
            <div className="text-2xl font-bold text-green-900">{completedCount}</div>
          </div>
          <div className="bg-amber-50 rounded-lg p-3">
            <div className="text-amber-600 text-xs mb-1">Tiến độ</div>
            <div className="text-2xl font-bold text-amber-900">
              {totalTasks > 0 ? Math.round((completedCount / totalTasks) * 100) : 0}%
            </div>
          </div>
        </div>
      </div>

      {/* Quick Tips */}
      {plan.tips.length > 0 && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
          <h3 className="font-bold text-indigo-800 mb-2 text-sm">💡 Mẹo từ AI</h3>
          <ul className="space-y-1.5">
            {plan.tips.slice(0, 3).map((tip, idx) => (
              <li key={idx} className="text-xs text-slate-700 flex items-start gap-2">
                <span className="text-indigo-400 mt-0.5">•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

