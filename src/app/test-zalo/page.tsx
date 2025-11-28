'use client';

import { useState, useEffect } from 'react';

export default function TestZaloPage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleDirectZaloLogin = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Generate PKCE parameters
      const codeVerifier = generateCodeVerifier();
      const codeChallenge = await generateCodeChallenge(codeVerifier);
      
      // Store code_verifier in sessionStorage
      sessionStorage.setItem('zalo_code_verifier', codeVerifier);
      
      // Build Zalo authorization URL
      const zaloAuthUrl = new URL('https://oauth.zaloapp.com/v4/permission');
      zaloAuthUrl.searchParams.set('app_id', '3285574152132634843'); // Hardcoded for test
      zaloAuthUrl.searchParams.set('redirect_uri', `${window.location.origin}/test-zalo/callback`);
      zaloAuthUrl.searchParams.set('code_challenge', codeChallenge);
      zaloAuthUrl.searchParams.set('code_challenge_method', 'S256');
      zaloAuthUrl.searchParams.set('state', 'test_' + Date.now());
      
      console.log('🔵 Direct Zalo Login:');
      console.log('  - URL:', zaloAuthUrl.toString());
      
      // Redirect to Zalo
      window.location.href = zaloAuthUrl.toString();
      
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-pink-500 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl p-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          🧪 Test Zalo OAuth (Direct - No Clerk)
        </h1>
        
        <div className="space-y-4 mb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h2 className="font-semibold text-blue-800 mb-2">Test Flow:</h2>
            <ol className="list-decimal list-inside space-y-1 text-blue-700">
              <li>Click button bên dưới</li>
              <li>Redirect đến Zalo login</li>
              <li>Đăng nhập với tài khoản Zalo</li>
              <li>Zalo redirect về /test-zalo/callback</li>
              <li>Exchange code lấy access token</li>
              <li>Hiển thị kết quả</li>
            </ol>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h2 className="font-semibold text-yellow-800 mb-2">⚠️ Lưu ý:</h2>
            <ul className="list-disc list-inside space-y-1 text-yellow-700">
              <li>Cần thêm callback URL vào Zalo Portal: <code className="bg-yellow-100 px-1 rounded">http://localhost:3000/test-zalo/callback</code></li>
              <li>Test này bypass Clerk hoàn toàn</li>
              <li>Nếu thành công → vấn đề là ở Clerk integration</li>
              <li>Nếu thất bại → vấn đề là ở Zalo app config</li>
            </ul>
          </div>
        </div>

        <button
          onClick={handleDirectZaloLogin}
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg shadow-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        >
          {loading ? '🔄 Đang chuyển hướng...' : '🚀 Test Zalo Login (Direct)'}
        </button>

        {error && (
          <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="font-semibold text-red-800 mb-2">❌ Error:</h3>
            <pre className="text-red-700 text-sm overflow-auto">{error}</pre>
          </div>
        )}

        {result && (
          <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-semibold text-green-800 mb-2">✅ Result:</h3>
            <pre className="text-green-700 text-sm overflow-auto bg-green-100 p-3 rounded">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="font-semibold text-gray-700 mb-3">Environment Info:</h3>
          <div className="bg-gray-50 rounded p-3 space-y-1 text-sm">
            <div><strong>App ID:</strong> 3285574152132634843</div>
            <div><strong>Callback URL:</strong> {mounted ? `${window.location.origin}/test-zalo/callback` : 'Loading...'}</div>
            <div><strong>Origin:</strong> {mounted ? window.location.origin : 'Loading...'}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper functions
function generateCodeVerifier(): string {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return base64URLEncode(array);
}

async function generateCodeChallenge(verifier: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return base64URLEncode(new Uint8Array(hash));
}

function base64URLEncode(buffer: Uint8Array): string {
  const base64 = btoa(String.fromCharCode(...buffer));
  return base64
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

