import React, { useState } from 'react';
import { ScheduleItem } from '../types';
import { Zap, X, CheckCircle, Clock } from 'lucide-react';

interface FloatingActionButtonProps {
  currentTask: ScheduleItem | null;
  timeRemaining?: number;
  progress?: number;
  onMarkDone?: () => void;
  onSkip?: () => void;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  currentTask,
  timeRemaining = 0,
  progress = 0,
  onMarkDone,
  onSkip
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!currentTask) {
    return (
      <button
        className="fixed bottom-6 right-6 w-14 h-14 bg-slate-300 rounded-full shadow-lg flex items-center justify-center z-50 cursor-not-allowed"
        disabled
      >
        <Zap className="w-6 h-6 text-slate-500" />
      </button>
    );
  }

  return (
    <>
      {/* Backdrop */}
      {isExpanded && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
          onClick={() => setIsExpanded(false)}
        ></div>
      )}

      {/* FAB */}
      {!isExpanded ? (
        <button
          onClick={() => setIsExpanded(true)}
          className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full shadow-xl flex items-center justify-center z-50 hover:scale-110 transition-transform active:scale-95"
        >
          <div className="relative">
            <Zap className="w-7 h-7 text-white animate-pulse" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full animate-ping"></div>
          </div>
        </button>
      ) : (
        <div className="fixed bottom-6 right-6 left-6 bg-white rounded-2xl shadow-2xl z-50 border-2 border-green-300 max-w-sm mx-auto animate-fadeIn">
          <div className="p-5">
            {/* Close button */}
            <button
              onClick={() => setIsExpanded(false)}
              className="absolute top-3 right-3 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Current Task Info */}
            <div className="mb-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-700 font-bold text-xs uppercase">
                  Đang làm
                </span>
              </div>
              
              <h3 className="text-lg font-bold text-slate-800 mb-2">
                {currentTask.taskTitle}
              </h3>

              <div className="flex items-center gap-4 text-sm text-slate-600 mb-3">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  Bắt đầu: {currentTask.time}
                </span>
                <span className="font-semibold text-green-600">
                  Còn {timeRemaining} phút
                </span>
              </div>

              {/* Progress bar */}
              <div className="mb-1">
                <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
                  <span>Tiến độ</span>
                  <span className="font-semibold">{progress}%</span>
                </div>
                <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-green-500 to-emerald-500 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  onMarkDone?.();
                  setIsExpanded(false);
                }}
                className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded-lg transition-colors"
              >
                <CheckCircle className="w-4 h-4" />
                Xong
              </button>
              <button
                onClick={() => {
                  onSkip?.();
                  setIsExpanded(false);
                }}
                className="flex items-center justify-center gap-2 bg-white border-2 border-slate-200 text-slate-700 font-medium py-3 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Bỏ qua
              </button>
            </div>

            {currentTask.reason && (
              <div className="mt-3 text-xs text-slate-600 bg-slate-50 p-3 rounded-lg border border-slate-200">
                💡 {currentTask.reason}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

