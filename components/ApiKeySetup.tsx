import React, { useState } from 'react';
import { Key, X, ExternalLink, CheckCircle, AlertCircle, Eye, EyeOff } from 'lucide-react';

interface ApiKeySetupProps {
  isOpen: boolean;
  onClose: () => void;
  currentKey?: string;
  onSave: (key: string) => void;
}

export const ApiKeySetup: React.FC<ApiKeySetupProps> = ({ 
  isOpen, 
  onClose, 
  currentKey = '',
  onSave 
}) => {
  const [apiKey, setApiKey] = useState(currentKey);
  const [showKey, setShowKey] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSave = () => {
    const trimmedKey = apiKey.trim();
    
    // Basic validation
    if (!trimmedKey) {
      setError('Vui lòng nhập API key');
      return;
    }

    if (!trimmedKey.startsWith('AIza')) {
      setError('API key không hợp lệ. Key phải bắt đầu bằng "AIza"');
      return;
    }

    if (trimmedKey.length < 30) {
      setError('API key quá ngắn. Vui lòng kiểm tra lại');
      return;
    }

    onSave(trimmedKey);
    setError('');
    onClose();
  };

  const handleRemove = () => {
    if (window.confirm('Bạn có chắc muốn xóa API key? App sẽ không thể tạo lịch trình nếu không có key.')) {
      onSave('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Key className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Gemini API Key</h2>
                <p className="text-indigo-100 text-sm">Cấu hình để sử dụng AI</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-blue-900 space-y-2">
                <p className="font-semibold">Hướng dẫn lấy API key:</p>
                <ol className="list-decimal list-inside space-y-1 ml-2">
                  <li>Truy cập <a 
                    href="https://aistudio.google.com/app/apikey" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700 underline inline-flex items-center gap-1"
                  >
                    Google AI Studio
                    <ExternalLink className="w-3 h-3" />
                  </a></li>
                  <li>Đăng nhập với Google account</li>
                  <li>Click "Create API key"</li>
                  <li>Copy API key và paste vào ô bên dưới</li>
                </ol>
              </div>
            </div>
          </div>

          {/* API Key Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              API Key
            </label>
            <div className="relative">
              <input
                type={showKey ? "text" : "password"}
                value={apiKey}
                onChange={(e) => {
                  setApiKey(e.target.value);
                  setError('');
                }}
                placeholder="AIza..."
                className="w-full px-4 py-3 pr-12 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none font-mono text-sm"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {error && (
              <p className="mt-2 text-sm text-rose-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {error}
              </p>
            )}
          </div>

          {/* Security Notice */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-green-900 space-y-1">
                <p className="font-semibold">Bảo mật & Quyền riêng tư:</p>
                <ul className="list-disc list-inside space-y-1 ml-2 text-xs">
                  <li>API key chỉ được lưu trên trình duyệt của bạn (localStorage)</li>
                  <li>Không ai khác có thể truy cập key của bạn</li>
                  <li>Key không được gửi đến server nào (chỉ gửi đến Google AI)</li>
                  <li>Bạn có thể xóa key bất cứ lúc nào</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Free Tier Info */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="text-sm text-amber-900">
              <p className="font-semibold mb-2">💰 Free Tier:</p>
              <ul className="list-disc list-inside space-y-1 ml-2 text-xs">
                <li>Gemini API miễn phí với quota 15 requests/phút</li>
                <li>Đủ để tạo ~900 lịch trình mỗi giờ</li>
                <li>Không cần credit card</li>
                <li>Xem quota tại: <a 
                  href="https://aistudio.google.com/app/apikey" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-amber-700 hover:text-amber-800 underline"
                >
                  AI Studio
                </a></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-slate-200 p-4 bg-slate-50 flex items-center justify-between gap-3">
          {currentKey ? (
            <button
              onClick={handleRemove}
              className="text-sm text-rose-600 hover:text-rose-700 font-medium"
            >
              Xóa API key
            </button>
          ) : (
            <div className="text-xs text-slate-500">
              Key sẽ được lưu an toàn trên trình duyệt
            </div>
          )}
          
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors"
            >
              Hủy
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-medium rounded-lg hover:shadow-lg transition-all text-sm"
            >
              Lưu API Key
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

