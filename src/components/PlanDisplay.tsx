'use client';

import React, { useState, useRef, useEffect } from 'react';
import { DayPlan, ScheduleItem, ScheduleType } from '../lib/types';
import { Sun, Moon, Coffee, Lightbulb, CheckCircle2, Briefcase, ArrowRight, ChevronUp, ChevronDown, Trash2 } from 'lucide-react';

interface PlanDisplayProps {
  plan: DayPlan;
  onPlanUpdate?: (updatedPlan: DayPlan) => void;
  isEditing?: boolean;
  onEditChange?: (plan: DayPlan) => void;
}

interface ScheduleSegmentProps {
  title: string;
  icon: React.ReactNode;
  items: ScheduleItem[];
  colorClass: string;
  isEditing: boolean;
  onItemChange: (idx: number, field: keyof ScheduleItem, value: any) => void;
  onMoveUp: (idx: number) => void;
  onMoveDown: (idx: number) => void;
  onDelete: (idx: number) => void;
  currentTaskTime?: string;
}

const ScheduleSegment: React.FC<ScheduleSegmentProps> = ({ 
  title, 
  icon, 
  items, 
  colorClass, 
  isEditing,
  onItemChange,
  onMoveUp,
  onMoveDown,
  onDelete,
  currentTaskTime
}) => {
  if (items.length === 0) return null;

  // Helper to check if item is current
  const isCurrentTask = (item: ScheduleItem): boolean => {
    if (!currentTaskTime) return false;
    const [currentHour, currentMinute] = currentTaskTime.split(':').map(Number);
    const currentTotalMinutes = currentHour * 60 + currentMinute;

    const [itemHour, itemMinute] = item.time.split(':').map(Number);
    const itemStartMinutes = itemHour * 60 + itemMinute;
    const itemEndMinutes = itemStartMinutes + item.duration;

    return currentTotalMinutes >= itemStartMinutes && currentTotalMinutes < itemEndMinutes;
  };

  return (
    <div className="mb-6 sm:mb-8">
      <div className={`flex items-center gap-2 mb-3 sm:mb-4 pb-2 border-b ${colorClass}`}>
        <div className="p-1 sm:p-1.5 rounded-lg bg-white shadow-sm">{icon}</div>
        <h3 className="font-bold text-base sm:text-lg text-slate-800">{title}</h3>
      </div>
      <div className="relative border-l-2 border-slate-200 ml-2 sm:ml-3 space-y-4 sm:space-y-6 py-2">
        {items.map((item, idx) => {
           let typeStyles = "";
           let TypeIcon = Briefcase;
           if (item.type === ScheduleType.Break) {
             typeStyles = "bg-emerald-50 border-emerald-100 text-emerald-900";
             TypeIcon = Coffee;
           } else if (item.type === ScheduleType.Buffer) {
             typeStyles = "bg-slate-50 border-slate-100 text-slate-500 italic";
             TypeIcon = ArrowRight;
           } else {
             typeStyles = "bg-white border-indigo-100 shadow-sm hover:border-indigo-300";
             TypeIcon = CheckCircle2;
           }

           const isCurrent = isCurrentTask(item);
           
           return (
             <div 
               key={idx} 
               className="relative pl-6 sm:pl-8 group"
               data-task-time={item.time}
               id={isCurrent ? 'current-task' : undefined}
             >
                <div className={`absolute -left-[7px] sm:-left-[9px] top-2 sm:top-3 w-3 h-3 sm:w-4 sm:h-4 rounded-full border-2 border-white transition-all shadow-sm ${
                  isCurrent ? 'bg-green-500 animate-pulse' : 'bg-slate-300 group-hover:bg-indigo-500'
                }`}></div>
                <div className={`p-3 sm:p-4 rounded-lg sm:rounded-xl border ${typeStyles} transition-all ${
                  isEditing ? 'ring-2 ring-indigo-200' : ''
                } ${isCurrent ? 'ring-2 sm:ring-4 ring-green-400 bg-green-50 border-green-300' : ''}`}>
                   {/* Edit Controls */}
                   {isEditing && (
                     <div className="flex gap-1 mb-3 justify-end">
                       <button
                         onClick={() => onMoveUp(idx)}
                         disabled={idx === 0}
                         className="p-1 hover:bg-indigo-100 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                         title="Di chuyển lên"
                       >
                         <ChevronUp className="w-4 h-4 text-indigo-600" />
                       </button>
                       <button
                         onClick={() => onMoveDown(idx)}
                         disabled={idx === items.length - 1}
                         className="p-1 hover:bg-indigo-100 rounded disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                         title="Di chuyển xuống"
                       >
                         <ChevronDown className="w-4 h-4 text-indigo-600" />
                       </button>
                       <button
                         onClick={() => onDelete(idx)}
                         className="p-1 hover:bg-rose-100 rounded transition-colors ml-1"
                         title="Xóa"
                       >
                         <Trash2 className="w-4 h-4 text-rose-600" />
                       </button>
                     </div>
                   )}

                   <div className="flex justify-between items-start mb-1 gap-2">
                     {isEditing ? (
                       <>
                         <input
                           type="time"
                           value={item.time}
                           onChange={(e) => onItemChange(idx, 'time', e.target.value)}
                           className="font-mono text-sm font-bold text-indigo-600 bg-white px-2 py-0.5 rounded border border-indigo-200 focus:ring-2 focus:ring-indigo-400 outline-none"
                         />
                         <div className="flex items-center gap-1">
                           <input
                             type="number"
                             value={item.duration}
                             onChange={(e) => onItemChange(idx, 'duration', Number(e.target.value))}
                             className="w-16 text-xs font-medium px-2 py-0.5 rounded border border-slate-200 focus:ring-2 focus:ring-indigo-400 outline-none text-right"
                             min="5"
                             step="5"
                           />
                           <span className="text-xs font-medium opacity-70">phút</span>
                         </div>
                       </>
                     ) : (
                       <>
                         <span className="font-mono text-sm font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">{item.time}</span>
                         <span className="text-xs font-medium opacity-70 flex items-center gap-1">
                            {item.duration} phút
                         </span>
                       </>
                     )}
                   </div>
                   <div className="flex items-start gap-3">
                      <div className={`mt-0.5 ${item.type === ScheduleType.Work ? 'text-indigo-600' : 'text-emerald-600'}`}>
                        <TypeIcon className="w-5 h-5" />
                      </div>
                      <div className="flex-1">
                        {isEditing ? (
                          <input
                            type="text"
                            value={item.taskTitle}
                            onChange={(e) => onItemChange(idx, 'taskTitle', e.target.value)}
                            className="w-full font-medium px-2 py-1 rounded border border-slate-200 focus:ring-2 focus:ring-indigo-400 outline-none"
                          />
                        ) : (
                          <h4 className={`font-medium ${item.type === ScheduleType.Buffer ? 'text-slate-500' : 'text-slate-800'}`}>
                              {item.taskTitle}
                          </h4>
                        )}
                        {item.reason && (
                            <p className="text-xs text-slate-500 mt-1 opacity-80">💡 {item.reason}</p>
                        )}
                      </div>
                   </div>
                </div>
             </div>
           )
        })}
      </div>
    </div>
  );
};

export const PlanDisplay: React.FC<PlanDisplayProps> = ({ plan, onPlanUpdate, isEditing = false, onEditChange }) => {
  const [editedPlan, setEditedPlan] = useState<DayPlan>(plan);
  const [currentTime, setCurrentTime] = useState<string>('');

  // Update current time every minute
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);
    };
    
    updateTime();
    const interval = setInterval(updateTime, 60000); // Update every minute
    
    return () => clearInterval(interval);
  }, []);

  // Reset edited plan when plan prop changes
  useEffect(() => {
    setEditedPlan(plan);
  }, [plan]);

  // Notify parent when edit changes
  useEffect(() => {
    if (isEditing && onEditChange) {
      onEditChange(editedPlan);
    }
  }, [editedPlan, isEditing, onEditChange]);

  const handleItemChange = (segment: 'morning' | 'afternoon' | 'evening', idx: number, field: keyof ScheduleItem, value: any) => {
    setEditedPlan(prev => ({
      ...prev,
      [segment]: prev[segment].map((item, i) => 
        i === idx ? { ...item, [field]: value } : item
      )
    }));
  };

  const handleMoveUp = (segment: 'morning' | 'afternoon' | 'evening', idx: number) => {
    if (idx === 0) return;
    setEditedPlan(prev => {
      const items = [...prev[segment]];
      [items[idx - 1], items[idx]] = [items[idx], items[idx - 1]];
      return { ...prev, [segment]: items };
    });
  };

  const handleMoveDown = (segment: 'morning' | 'afternoon' | 'evening', idx: number) => {
    setEditedPlan(prev => {
      const items = [...prev[segment]];
      if (idx >= items.length - 1) return prev;
      [items[idx], items[idx + 1]] = [items[idx + 1], items[idx]];
      return { ...prev, [segment]: items };
    });
  };

  const handleDelete = (segment: 'morning' | 'afternoon' | 'evening', idx: number) => {
    if (window.confirm('Bạn có chắc muốn xóa mục này khỏi lịch trình?')) {
      setEditedPlan(prev => ({
        ...prev,
        [segment]: prev[segment].filter((_, i) => i !== idx)
      }));
    }
  };

  const displayPlan = isEditing ? editedPlan : plan;

  return (
    <div className="space-y-4 sm:space-y-6 animate-fadeIn">
      {/* Tips Section */}
      {displayPlan.tips.length > 0 && (
        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-100 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-3 sm:mb-4 text-indigo-800">
            <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5" />
            <h3 className="font-bold text-sm sm:text-base">Lời khuyên tối ưu từ AI</h3>
          </div>
          <ul className="space-y-2">
            {displayPlan.tips.map((tip, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-700">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0" />
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Timeline Sections */}
      <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-100 p-4 sm:p-6 shadow-xl shadow-slate-100/50">
          <ScheduleSegment 
            title="Buổi Sáng" 
            icon={<Sun className="w-5 h-5 text-amber-500" />} 
            items={displayPlan.morning} 
            colorClass="border-amber-200"
            isEditing={isEditing}
            onItemChange={(idx, field, value) => handleItemChange('morning', idx, field, value)}
            onMoveUp={(idx) => handleMoveUp('morning', idx)}
            onMoveDown={(idx) => handleMoveDown('morning', idx)}
            onDelete={(idx) => handleDelete('morning', idx)}
            currentTaskTime={currentTime}
          />
          <ScheduleSegment 
            title="Buổi Chiều" 
            icon={<Sun className="w-5 h-5 text-orange-500" />} 
            items={displayPlan.afternoon} 
            colorClass="border-orange-200"
            isEditing={isEditing}
            onItemChange={(idx, field, value) => handleItemChange('afternoon', idx, field, value)}
            onMoveUp={(idx) => handleMoveUp('afternoon', idx)}
            onMoveDown={(idx) => handleMoveDown('afternoon', idx)}
            onDelete={(idx) => handleDelete('afternoon', idx)}
            currentTaskTime={currentTime}
          />
          <ScheduleSegment 
            title="Buổi Tối" 
            icon={<Moon className="w-5 h-5 text-indigo-500" />} 
            items={displayPlan.evening} 
            colorClass="border-indigo-200"
            isEditing={isEditing}
            onItemChange={(idx, field, value) => handleItemChange('evening', idx, field, value)}
            onMoveUp={(idx) => handleMoveUp('evening', idx)}
            onMoveDown={(idx) => handleMoveDown('evening', idx)}
            onDelete={(idx) => handleDelete('evening', idx)}
            currentTaskTime={currentTime}
          />
      </div>
    </div>
  );
};