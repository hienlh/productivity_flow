import React from 'react';
import { Sparkles, Brain, Calendar, Zap, ArrowRight, CheckCircle } from 'lucide-react';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinueToSetup: () => void;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({ 
  isOpen, 
  onClose,
  onContinueToSetup 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col animate-fadeIn">
        
        {/* Hero Section */}
        <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-violet-600 text-white p-8 sm:p-12 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -ml-32 -mt-32 blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mb-32 blur-3xl"></div>
          
          <div className="relative z-10">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 rounded-2xl mb-6 backdrop-blur-sm">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-bold mb-3">
              Chào mừng đến với ProductivityFlow
            </h1>
            <p className="text-lg sm:text-xl text-indigo-100 max-w-2xl mx-auto">
              Trợ lý AI giúp bạn tối ưu hóa thời gian và năng suất mỗi ngày
            </p>
          </div>
        </div>

        {/* Features Section */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8">
          <div className="space-y-6 mb-8">
            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                <Brain className="w-6 h-6 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-1">
                  Lập kế hoạch thông minh
                </h3>
                <p className="text-slate-600 text-sm">
                  AI phân tích ưu tiên, thời lượng và deadline để sắp xếp công việc tối ưu nhất cho bạn
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-1">
                  Timeline tự động
                </h3>
                <p className="text-slate-600 text-sm">
                  Tạo lịch trình chi tiết từ sáng đến tối, có thời gian cụ thể cho mỗi công việc
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-violet-100 rounded-xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-violet-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-1">
                  Theo dõi real-time
                </h3>
                <p className="text-slate-600 text-sm">
                  Highlight công việc hiện tại, countdown thời gian và quick actions ngay trên app
                </p>
              </div>
            </div>
          </div>

          {/* Setup Required Section */}
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-xl p-6">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-amber-900 mb-1">
                  Cần thiết lập API Key
                </h3>
                <p className="text-sm text-amber-800 mb-3">
                  ProductivityFlow sử dụng <span className="font-semibold">Google Gemini AI</span> để tạo lịch trình thông minh. 
                  Bạn cần API key riêng để sử dụng (hoàn toàn miễn phí).
                </p>
              </div>
            </div>

            <div className="bg-white/80 rounded-lg p-4 mb-4">
              <p className="text-sm font-semibold text-slate-800 mb-3">✨ Tại sao cần API key?</p>
              <ul className="space-y-2 text-sm text-slate-700">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span><strong>Bảo mật tốt hơn:</strong> Key của bạn, chỉ bạn quản lý</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span><strong>Miễn phí 100%:</strong> Google cung cấp Free Tier (15 requests/phút)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span><strong>Không cần thẻ:</strong> Không yêu cầu credit card</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                  <span><strong>Dễ dàng:</strong> Chỉ mất 2 phút để lấy key</span>
                </li>
              </ul>
            </div>

            <div className="flex items-center gap-2 text-xs text-amber-800">
              <div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
              <span>Lưu trữ an toàn trên trình duyệt của bạn (localStorage)</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 p-4 sm:p-6 bg-slate-50">
          <div className="flex flex-col sm:flex-row gap-3 justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors order-2 sm:order-1"
            >
              Để sau
            </button>
            <button
              onClick={onContinueToSetup}
              className="px-8 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all text-sm flex items-center justify-center gap-2 order-1 sm:order-2"
            >
              Bắt đầu thiết lập
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

