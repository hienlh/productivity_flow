import React, { useState } from 'react';
import { Task, Priority } from '../types';
import { PlusCircle, Clock, AlertCircle, Pin } from 'lucide-react';

interface TaskFormProps {
  onAddTask: (task: Task) => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({ onAddTask }) => {
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState<number>(30);
  const [priority, setPriority] = useState<Priority>(Priority.Medium);
  const [deadline, setDeadline] = useState('');
  const [hasFixedTime, setHasFixedTime] = useState(false);
  const [fixedTime, setFixedTime] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newTask: Task = {
      id: crypto.randomUUID(),
      title,
      duration,
      priority,
      deadline: deadline || undefined,
      fixedTime: hasFixedTime && fixedTime ? fixedTime : undefined,
    };

    onAddTask(newTask);
    setTitle('');
    setDuration(30);
    setPriority(Priority.Medium);
    setDeadline('');
    setHasFixedTime(false);
    setFixedTime('');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-sm border border-slate-100">
      <h3 className="text-base sm:text-lg font-semibold text-slate-800 mb-3 sm:mb-4 flex items-center gap-2">
        <PlusCircle className="w-4 h-4 sm:w-5 sm:h-5 text-indigo-600" />
        Thêm công việc mới
      </h3>
      
      <div className="space-y-3 sm:space-y-4">
        <div>
          <label className="block text-xs sm:text-sm font-medium text-slate-600 mb-1">Tên công việc</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Ví dụ: Hoàn thành báo cáo..."
            className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-slate-600 mb-1 flex items-center gap-1">
              <Clock className="w-3 h-3" /> <span className="hidden sm:inline">Thời lượng</span> (phút)
            </label>
            <input
              type="number"
              min="5"
              step="5"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
            />
          </div>
          
          <div>
            <label className="block text-xs sm:text-sm font-medium text-slate-600 mb-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> Ưu tiên
            </label>
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
              className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
            >
              {Object.values(Priority).map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-600 mb-1">Deadline (Tùy chọn)</label>
          <input
            type="time"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
          />
        </div>

        {/* Fixed Time Option */}
        <div className="border-t border-slate-100 pt-4">
          <div className="flex items-center gap-2 mb-3">
            <input
              type="checkbox"
              id="hasFixedTime"
              checked={hasFixedTime}
              onChange={(e) => setHasFixedTime(e.target.checked)}
              className="w-4 h-4 text-indigo-600 border-slate-300 rounded focus:ring-2 focus:ring-indigo-500"
            />
            <label htmlFor="hasFixedTime" className="text-sm font-medium text-slate-700 flex items-center gap-1 cursor-pointer">
              <Pin className="w-4 h-4 text-indigo-600" />
              Thời gian cố định (VD: Meeting lúc 3h chiều)
            </label>
          </div>
          
          {hasFixedTime && (
            <div className="ml-6 bg-indigo-50 p-3 rounded-lg border border-indigo-100">
              <label className="block text-xs font-medium text-indigo-700 mb-1">
                Giờ bắt đầu
              </label>
              <input
                type="time"
                value={fixedTime}
                onChange={(e) => setFixedTime(e.target.value)}
                className="w-full px-3 py-2 border border-indigo-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none bg-white text-sm"
                required={hasFixedTime}
              />
              <p className="text-xs text-indigo-600 mt-2">
                AI sẽ sắp xếp công việc khác xung quanh thời gian này
              </p>
            </div>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm sm:text-base"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Thêm vào danh sách</span>
        </button>
      </div>
    </form>
  );
};