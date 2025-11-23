import React from 'react';
import { Task, Priority } from '../types';
import { Trash2, Clock, Calendar, Pin } from 'lucide-react';

interface TaskListProps {
  tasks: Task[];
  onRemoveTask: (id: string) => void;
}

export const TaskList: React.FC<TaskListProps> = ({ tasks, onRemoveTask }) => {
  if (tasks.length === 0) {
    return (
      <div className="text-center py-8 text-slate-400 bg-slate-50 rounded-xl border border-dashed border-slate-200">
        <p>Chưa có công việc nào. Hãy thêm việc cần làm!</p>
      </div>
    );
  }

  const getPriorityColor = (p: Priority) => {
    switch (p) {
      case Priority.High: return 'bg-rose-100 text-rose-700 border-rose-200';
      case Priority.Medium: return 'bg-amber-100 text-amber-700 border-amber-200';
      case Priority.Low: return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
      {tasks.map((task) => (
        <div 
          key={task.id} 
          className={`group p-4 rounded-xl border shadow-sm hover:shadow-md transition-all flex items-start justify-between ${
            task.fixedTime 
              ? 'bg-indigo-50 border-indigo-200' 
              : 'bg-white border-slate-100'
          }`}
        >
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              {task.fixedTime && (
                <Pin className="w-3.5 h-3.5 text-indigo-600" />
              )}
              <h4 className="font-medium text-slate-800">{task.title}</h4>
              <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium border ${getPriorityColor(task.priority)}`}>
                {task.priority}
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" /> {task.duration}p
              </span>
              {task.fixedTime && (
                <span className="flex items-center gap-1 text-indigo-600 font-semibold">
                  <Calendar className="w-3 h-3" /> Cố định lúc {task.fixedTime}
                </span>
              )}
              {task.deadline && !task.fixedTime && (
                <span className="flex items-center gap-1 text-indigo-500">
                  <Calendar className="w-3 h-3" /> Trước {task.deadline}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={() => onRemoveTask(task.id)}
            className="text-slate-300 hover:text-rose-500 transition-colors p-1"
            title="Xóa"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};