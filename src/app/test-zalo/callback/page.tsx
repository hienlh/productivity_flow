'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function TestZaloCallbackPage() {
  const searchParams = useSearchParams();
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${message}`]);
    console.log(message);
  };

  useEffect(() => {
    const handleCallback = async () => {
      try {
        addLog('📥 Callback received');
        
        // Get authorization code from URL
        const code = searchParams.get('code');
        const state = searchParams.get('state');
        const error = searchParams.get('error');
        
        addLog(`Code: ${code ? '✅ Present' : '❌ Missing'}`);
        addLog(`State: ${state || 'N/A'}`);
        
        if (error) {
          throw new Error(`Zalo returned error: ${error}`);
        }
        
        if (!code) {
          throw new Error('No authorization code received from Zalo');
        }

        // Get code_verifier from sessionStorage
        const codeVerifier = sessionStorage.getItem('zalo_code_verifier');
        addLog(`Code Verifier: ${codeVerifier ? '✅ Found' : '❌ Missing'}`);
        
        if (!codeVerifier) {
          throw new Error('Code verifier not found in sessionStorage');
        }

        // Exchange code for token via our API
        addLog('🔄 Exchanging code for token...');
        
        const tokenResponse = await fetch('/api/test-zalo/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            code: code,
            code_verifier: codeVerifier,
          }),
        });

        const responseData = await tokenResponse.json();
        addLog(`Token Response: ${tokenResponse.ok ? '✅ Success' : '❌ Failed'}`);
        
        if (!tokenResponse.ok || responseData.error) {
          throw new Error(`Token exchange failed: ${JSON.stringify(responseData)}`);
        }

        const tokenData = responseData.data;
        addLog('✅ Got access token!');
        
        if (tokenData.user_info) {
          addLog('👤 User info retrieved successfully');
        }

        // Clean up
        sessionStorage.removeItem('zalo_code_verifier');
        
        setResult(tokenData);
        setLoading(false);
        addLog('🎉 Test completed successfully!');
        
      } catch (err: any) {
        addLog(`❌ Error: ${err.message}`);
        setError(err.message);
        setLoading(false);
      }
    };

    handleCallback();
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-pink-500 p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl p-8">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">
          🔄 Zalo OAuth Callback
        </h1>

        {/* Logs */}
        <div className="mb-6 bg-gray-900 rounded-lg p-4">
          <h3 className="font-semibold text-gray-300 mb-2">📋 Logs:</h3>
          <div className="space-y-1 font-mono text-xs text-green-400 max-h-60 overflow-auto">
            {logs.map((log, index) => (
              <div key={index}>{log}</div>
            ))}
            {loading && <div className="animate-pulse">⏳ Processing...</div>}
          </div>
        </div>

        {/* Loading */}
        {loading && !error && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-blue-700 font-semibold">Đang xử lý callback từ Zalo...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h3 className="font-bold text-red-800 text-xl mb-3">❌ Lỗi</h3>
            <pre className="text-red-700 text-sm overflow-auto bg-red-100 p-3 rounded whitespace-pre-wrap">
              {error}
            </pre>
            <button
              onClick={() => window.location.href = '/test-zalo'}
              className="mt-4 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
            >
              ← Thử lại
            </button>
          </div>
        )}

        {/* Success */}
        {result && !loading && (
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="font-bold text-green-800 text-xl mb-3">✅ Thành công!</h3>
              
              {result.access_token && (
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-green-700 mb-1">Access Token:</label>
                  <code className="block bg-green-100 p-2 rounded text-xs break-all">
                    {result.access_token}
                  </code>
                </div>
              )}
              
              {result.refresh_token && (
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-green-700 mb-1">Refresh Token:</label>
                  <code className="block bg-green-100 p-2 rounded text-xs break-all">
                    {result.refresh_token}
                  </code>
                </div>
              )}
              
              {result.expires_in && (
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-green-700 mb-1">Expires In:</label>
                  <code className="block bg-green-100 p-2 rounded text-xs">
                    {result.expires_in} seconds ({Math.floor(result.expires_in / 3600)} hours)
                  </code>
                </div>
              )}
            </div>

            {result.user_info && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="font-bold text-blue-800 text-xl mb-3">👤 User Info:</h3>
                <div className="space-y-2">
                  {result.user_info.id && (
                    <div>
                      <strong>ID:</strong> {result.user_info.id}
                    </div>
                  )}
                  {result.user_info.name && (
                    <div>
                      <strong>Name:</strong> {result.user_info.name}
                    </div>
                  )}
                  {result.user_info.picture?.data?.url && (
                    <div className="flex items-center gap-2">
                      <strong>Picture:</strong>
                      <img 
                        src={result.user_info.picture.data.url} 
                        alt="Profile" 
                        className="w-12 h-12 rounded-full"
                      />
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
              <h3 className="font-bold text-gray-800 text-lg mb-3">📦 Full Response:</h3>
              <pre className="text-gray-700 text-xs overflow-auto bg-gray-100 p-3 rounded max-h-96">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>

            <button
              onClick={() => window.location.href = '/test-zalo'}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg"
            >
              ← Test lại
            </button>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="font-semibold text-gray-700 mb-3">🔍 URL Parameters:</h3>
          <div className="bg-gray-50 rounded p-3 space-y-1 text-sm font-mono">
            <div><strong>code:</strong> {searchParams.get('code') || 'N/A'}</div>
            <div><strong>state:</strong> {searchParams.get('state') || 'N/A'}</div>
            <div><strong>error:</strong> {searchParams.get('error') || 'N/A'}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

