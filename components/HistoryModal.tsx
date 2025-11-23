import React, { useState } from 'react';
import { ScheduleHistory } from '../types';
import { X, History, TrendingUp, DollarSign, Zap, Calendar, Trash2, Copy, Check, FileText } from 'lucide-react';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: ScheduleHistory[];
  onClearHistory: () => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({ 
  isOpen, 
  onClose, 
  history,
  onClearHistory 
}) => {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (!isOpen) return null;

  const totalTokens = history.reduce((sum, h) => sum + h.tokenUsage.totalTokens, 0);
  const totalCost = history.reduce((sum, h) => sum + h.tokenUsage.estimatedCost, 0);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCost = (cost: number) => {
    return cost < 0.01 ? '< $0.01' : `$${cost.toFixed(4)}`;
  };

  const handleCopyTasks = async (entry: ScheduleHistory) => {
    try {
      await navigator.clipboard.writeText(entry.tasksText);
      setCopiedId(entry.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <History className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Lịch sử tạo lịch trình</h2>
                <p className="text-indigo-100 text-sm">{history.length} lần tạo lịch</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <div className="flex items-center gap-2 text-indigo-100 text-sm mb-1">
                <Zap className="w-4 h-4" />
                <span>Tổng Tokens</span>
              </div>
              <div className="text-2xl font-bold">{totalTokens.toLocaleString()}</div>
            </div>
            <div className="bg-white/10 backdrop-blur rounded-lg p-4">
              <div className="flex items-center gap-2 text-indigo-100 text-sm mb-1">
                <DollarSign className="w-4 h-4" />
                <span>Tổng Chi phí ước tính</span>
              </div>
              <div className="text-2xl font-bold">{formatCost(totalCost)}</div>
            </div>
          </div>
        </div>

        {/* History List */}
        <div className="flex-1 overflow-y-auto p-6">
          {history.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <History className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>Chưa có lịch sử tạo lịch trình</p>
              <p className="text-sm mt-2">Hãy tạo lịch trình đầu tiên của bạn!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {history.map((entry) => (
                <div
                  key={entry.id}
                  className="border border-slate-200 rounded-xl p-5 hover:shadow-md transition-shadow bg-white"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2 text-slate-500 text-sm">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(entry.timestamp)}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full font-medium">
                        {entry.tasksCount} tasks
                      </span>
                      <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full font-mono">
                        {entry.modelUsed}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-3 text-sm mb-3">
                    <div className="bg-blue-50 rounded-lg p-3">
                      <div className="text-blue-600 text-xs mb-1">Input Tokens</div>
                      <div className="font-semibold text-blue-900">
                        {entry.tokenUsage.promptTokens.toLocaleString()}
                      </div>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-3">
                      <div className="text-purple-600 text-xs mb-1">Output Tokens</div>
                      <div className="font-semibold text-purple-900">
                        {entry.tokenUsage.candidatesTokens.toLocaleString()}
                      </div>
                    </div>
                    <div className="bg-emerald-50 rounded-lg p-3">
                      <div className="text-emerald-600 text-xs mb-1">Total Tokens</div>
                      <div className="font-semibold text-emerald-900">
                        {entry.tokenUsage.totalTokens.toLocaleString()}
                      </div>
                    </div>
                    <div className="bg-amber-50 rounded-lg p-3">
                      <div className="text-amber-600 text-xs mb-1 flex items-center gap-1">
                        <TrendingUp className="w-3 h-3" />
                        Cost
                      </div>
                      <div className="font-semibold text-amber-900">
                        {formatCost(entry.tokenUsage.estimatedCost)}
                      </div>
                    </div>
                  </div>

                  {/* Tasks Text Section */}
                  {entry.tasksText && (
                    <div className="mt-3 border-t border-slate-100 pt-3">
                      <div className="flex items-center justify-between mb-2">
                        <button
                          onClick={() => toggleExpand(entry.id)}
                          className="flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-indigo-600 transition-colors"
                        >
                          <FileText className="w-4 h-4" />
                          <span>Danh sách tasks ({entry.tasksCount})</span>
                          <span className="text-xs text-slate-400">
                            {expandedId === entry.id ? '▼' : '▶'}
                          </span>
                        </button>
                        <button
                          onClick={() => handleCopyTasks(entry)}
                          className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
                        >
                          {copiedId === entry.id ? (
                            <>
                              <Check className="w-3.5 h-3.5" />
                              <span>Đã copy!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy tasks</span>
                            </>
                          )}
                        </button>
                      </div>
                      
                      {expandedId === entry.id && (
                        <pre className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-700 overflow-x-auto whitespace-pre-wrap font-mono max-h-48 overflow-y-auto">
{entry.tasksText}
                        </pre>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 p-4 bg-slate-50">
          <div className="flex items-center justify-between mb-2">
            <div className="text-xs text-slate-500">
              💡 Chi phí được tính dựa trên Gemini 2.5 Flash pricing
            </div>
            {history.length > 0 && (
              <button
                onClick={onClearHistory}
                className="flex items-center gap-2 px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Xóa lịch sử
              </button>
            )}
          </div>
          <div className="text-xs text-indigo-600 bg-indigo-50 px-3 py-2 rounded-lg border border-indigo-100">
            📋 <strong>Mẹo:</strong> Click "Copy tasks" để sao chép danh sách, sau đó dùng "Import hàng loạt" để tái sử dụng!
          </div>
        </div>
      </div>
    </div>
  );
};

