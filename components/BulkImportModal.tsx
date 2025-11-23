import React, { useState } from 'react';
import { Task, Priority } from '../types';
import { X, Upload, FileText, AlertCircle } from 'lucide-react';

interface BulkImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (tasks: Task[]) => void;
}

// Parse a single line into a Task
const parseTaskLine = (line: string, lineNumber: number): Task | null => {
  const trimmed = line.trim();
  if (!trimmed) return null;

  // Format examples:
  // "Task name - 60p - 9am !cao"
  // "Task name - 60 - 9:00"
  // "Task name - 2h"
  // "Task name"
  
  let title = trimmed;
  let duration = 30; // default
  let fixedTime: string | undefined;
  let priority: Priority = Priority.Medium;

  // Extract priority (!cao, !thap, !trung)
  const priorityMatch = title.match(/!(cao|thấp|thap|trung|trungbinh)/i);
  if (priorityMatch) {
    const p = priorityMatch[1].toLowerCase();
    if (p === 'cao') priority = Priority.High;
    else if (p === 'thấp' || p === 'thap') priority = Priority.Low;
    else priority = Priority.Medium;
    title = title.replace(/!(cao|thấp|thap|trung|trungbinh)/i, '').trim();
  }

  // Split by separator (-, |, or tab)
  const parts = title.split(/\s*[-|]\s*/).map(p => p.trim());
  
  if (parts.length >= 1) {
    title = parts[0];
  }

  if (parts.length >= 2) {
    // Parse duration: "60p", "60", "2h", "1.5h"
    const durationStr = parts[1].toLowerCase();
    const hoursMatch = durationStr.match(/(\d+\.?\d*)h/);
    const minutesMatch = durationStr.match(/(\d+)p?/);
    
    if (hoursMatch) {
      duration = Math.round(parseFloat(hoursMatch[1]) * 60);
    } else if (minutesMatch) {
      duration = parseInt(minutesMatch[1]);
    }
  }

  if (parts.length >= 3) {
    // Parse time: "9am", "15:00", "3pm", "9:30"
    let timeStr = parts[2].toLowerCase().trim();
    
    // Convert 12-hour to 24-hour
    const ampmMatch = timeStr.match(/(\d+):?(\d+)?\s*(am|pm)/);
    if (ampmMatch) {
      let hours = parseInt(ampmMatch[1]);
      const minutes = ampmMatch[2] ? parseInt(ampmMatch[2]) : 0;
      const ampm = ampmMatch[3];
      
      if (ampm === 'pm' && hours !== 12) hours += 12;
      if (ampm === 'am' && hours === 12) hours = 0;
      
      fixedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    } else {
      // Already in HH:mm format or just hours
      const timeMatch = timeStr.match(/(\d+):?(\d+)?/);
      if (timeMatch) {
        const hours = parseInt(timeMatch[1]);
        const minutes = timeMatch[2] ? parseInt(timeMatch[2]) : 0;
        fixedTime = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
      }
    }
  }

  return {
    id: crypto.randomUUID(),
    title,
    duration,
    priority,
    fixedTime,
  };
};

export const BulkImportModal: React.FC<BulkImportModalProps> = ({ 
  isOpen, 
  onClose, 
  onImport 
}) => {
  const [text, setText] = useState('');
  const [preview, setPreview] = useState<Task[]>([]);
  const [showPreview, setShowPreview] = useState(false);

  if (!isOpen) return null;

  const handleParse = () => {
    const lines = text.split('\n');
    const tasks: Task[] = [];
    
    lines.forEach((line, idx) => {
      const task = parseTaskLine(line, idx + 1);
      if (task) tasks.push(task);
    });
    
    setPreview(tasks);
    setShowPreview(true);
  };

  const handleImport = () => {
    if (preview.length > 0) {
      onImport(preview);
      setText('');
      setPreview([]);
      setShowPreview(false);
      onClose();
    }
  };

  const handleCancel = () => {
    setText('');
    setPreview([]);
    setShowPreview(false);
    onClose();
  };

  const exampleText = `Meeting với client - 60p - 9am !cao
Viết báo cáo - 2h
Code review - 30p - 2pm
Nghiên cứu tài liệu - 45p !thấp`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Upload className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Import hàng loạt</h2>
                <p className="text-indigo-100 text-sm">Thêm nhiều công việc cùng lúc</p>
              </div>
            </div>
            <button
              onClick={handleCancel}
              className="text-white/80 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {!showPreview ? (
            <>
              {/* Instructions */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <div className="flex items-start gap-2">
                  <FileText className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div className="text-sm text-blue-900">
                    <p className="font-semibold mb-2">Định dạng mỗi dòng:</p>
                    <code className="bg-white px-2 py-1 rounded text-xs">
                      Tên công việc - Thời lượng - Giờ cố định (tùy chọn) !Ưu tiên (tùy chọn)
                    </code>
                    <ul className="mt-2 space-y-1 text-xs">
                      <li>• Thời lượng: <code>60p</code>, <code>2h</code>, <code>1.5h</code></li>
                      <li>• Giờ cố định: <code>9am</code>, <code>15:00</code>, <code>2pm</code></li>
                      <li>• Ưu tiên: <code>!cao</code>, <code>!thấp</code>, <code>!trung</code></li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Example */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-slate-600">Ví dụ:</label>
                  <button
                    onClick={() => setText(exampleText)}
                    className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
                  >
                    Dùng ví dụ này
                  </button>
                </div>
                <pre className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-700 overflow-x-auto">
{exampleText}
                </pre>
              </div>

              {/* Textarea */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-600 mb-2">
                  Paste danh sách công việc (mỗi dòng 1 task):
                </label>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Paste hoặc gõ danh sách công việc vào đây..."
                  className="w-full h-64 px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none font-mono text-sm resize-none"
                />
              </div>

              {/* Parse Button */}
              <button
                onClick={handleParse}
                disabled={!text.trim()}
                className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <FileText className="w-5 h-5" />
                Xem trước ({text.split('\n').filter(l => l.trim()).length} dòng)
              </button>
            </>
          ) : (
            <>
              {/* Preview */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-slate-800">
                    Xem trước: {preview.length} công việc
                  </h3>
                  <button
                    onClick={() => setShowPreview(false)}
                    className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                  >
                    ← Quay lại chỉnh sửa
                  </button>
                </div>

                {preview.length === 0 ? (
                  <div className="text-center py-8 text-slate-400 bg-slate-50 rounded-lg">
                    <AlertCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>Không tìm thấy công việc hợp lệ</p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
                    {preview.map((task, idx) => (
                      <div
                        key={idx}
                        className="bg-white border border-slate-200 rounded-lg p-4 hover:border-indigo-300 transition-colors"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-slate-800">{task.title}</h4>
                            <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                              <span className="bg-slate-100 px-2 py-1 rounded">
                                {task.duration} phút
                              </span>
                              <span className={`px-2 py-1 rounded ${
                                task.priority === Priority.High ? 'bg-rose-100 text-rose-700' :
                                task.priority === Priority.Low ? 'bg-emerald-100 text-emerald-700' :
                                'bg-amber-100 text-amber-700'
                              }`}>
                                {task.priority}
                              </span>
                              {task.fixedTime && (
                                <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded font-mono">
                                  📍 {task.fixedTime}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Import Button */}
              {preview.length > 0 && (
                <button
                  onClick={handleImport}
                  className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:shadow-lg text-white font-bold py-3 rounded-lg transition-all flex items-center justify-center gap-2"
                >
                  <Upload className="w-5 h-5" />
                  Import {preview.length} công việc
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

