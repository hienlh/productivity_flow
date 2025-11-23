import React, { useState } from 'react';
import { DayPlan, ScheduleItem, ScheduleType } from '../types';
import { Sun, Moon, Coffee, Lightbulb, CheckCircle2, Briefcase, ArrowRight, Edit3, Save, X, ChevronUp, ChevronDown, Trash2 } from 'lucide-react';

interface PlanDisplayProps {
  plan: DayPlan;
  onPlanUpdate?: (updatedPlan: DayPlan) => void;
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
  onDelete
}) => {
  if (items.length === 0) return null;

  return (
    <div className="mb-8">
      <div className={`flex items-center gap-2 mb-4 pb-2 border-b ${colorClass}`}>
        <div className="p-1.5 rounded-lg bg-white shadow-sm">{icon}</div>
        <h3 className="font-bold text-lg text-slate-800">{title}</h3>
      </div>
      <div className="relative border-l-2 border-slate-200 ml-3 space-y-6 py-2">
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

           return (
             <div key={idx} className="relative pl-8 group">
                <div className="absolute -left-[9px] top-3 w-4 h-4 rounded-full border-2 border-white bg-slate-300 group-hover:bg-indigo-500 transition-colors shadow-sm"></div>
                <div className={`p-4 rounded-xl border ${typeStyles} transition-all ${isEditing ? 'ring-2 ring-indigo-200' : ''}`}>
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

export const PlanDisplay: React.FC<PlanDisplayProps> = ({ plan, onPlanUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedPlan, setEditedPlan] = useState<DayPlan>(plan);

  // Reset edited plan when plan prop changes
  React.useEffect(() => {
    setEditedPlan(plan);
  }, [plan]);

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

  const handleSave = () => {
    if (onPlanUpdate) {
      onPlanUpdate(editedPlan);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedPlan(plan);
    setIsEditing(false);
  };

  const displayPlan = isEditing ? editedPlan : plan;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Edit Controls */}
      <div className="flex justify-end gap-2">
        {!isEditing ? (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-indigo-200 text-indigo-600 font-medium rounded-lg hover:bg-indigo-50 transition-colors shadow-sm"
          >
            <Edit3 className="w-4 h-4" />
            Chỉnh sửa lịch trình
          </button>
        ) : (
          <>
            <button
              onClick={handleCancel}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 font-medium rounded-lg hover:bg-slate-50 transition-colors"
            >
              <X className="w-4 h-4" />
              Hủy
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-medium rounded-lg hover:shadow-lg transition-all"
            >
              <Save className="w-4 h-4" />
              Lưu thay đổi
            </button>
          </>
        )}
      </div>

      {/* Tips Section */}
      {displayPlan.tips.length > 0 && (
        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 border border-indigo-100 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4 text-indigo-800">
            <Lightbulb className="w-5 h-5" />
            <h3 className="font-bold">Lời khuyên tối ưu từ AI</h3>
          </div>
          <ul className="space-y-2">
            {displayPlan.tips.map((tip, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-slate-700">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0" />
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Timeline Sections */}
      <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-xl shadow-slate-100/50">
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
          />
      </div>
    </div>
  );
};