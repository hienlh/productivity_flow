/**
 * Example: Zalo Sign-In Button Component
 * 
 * This is a sample component showing how to use the Zalo OAuth integration.
 * You can copy and customize this for your application.
 */

'use client';

import { useZaloSignIn } from '@/lib/zalo-oauth';
import { useState } from 'react';

export function ZaloSignInButton() {
  const { signInWithZalo, isLoading } = useZaloSignIn();
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async () => {
    try {
      setError(null);
      await signInWithZalo({
        redirectUrl: '/sso-callback',
        redirectUrlComplete: '/dashboard', // Where to go after successful login
      });
    } catch (err) {
      console.error('Sign-in error:', err);
      setError('Không thể đăng nhập với Zalo. Vui lòng thử lại.');
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={handleSignIn}
        disabled={isLoading}
        className="
          flex items-center justify-center gap-2
          px-6 py-3 
          bg-blue-500 hover:bg-blue-600 
          disabled:bg-gray-400 disabled:cursor-not-allowed
          text-white font-semibold rounded-lg 
          transition-colors duration-200
          shadow-md hover:shadow-lg
        "
      >
        {/* Zalo Icon SVG */}
        <svg 
          width="20" 
          height="20" 
          viewBox="0 0 24 24" 
          fill="currentColor"
          className="flex-shrink-0"
        >
          <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z"/>
        </svg>
        
        {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập với Zalo'}
      </button>
      
      {error && (
        <p className="text-sm text-red-600 text-center">
          {error}
        </p>
      )}
    </div>
  );
}

/**
 * Alternative: Minimal button version
 */
export function ZaloSignInButtonMinimal() {
  const { signInWithZalo, isLoading } = useZaloSignIn();

  return (
    <button
      onClick={() => signInWithZalo()}
      disabled={isLoading}
      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
    >
      Đăng nhập với Zalo
    </button>
  );
}

/**
 * Alternative: Icon-only button
 */
export function ZaloSignInIconButton() {
  const { signInWithZalo, isLoading } = useZaloSignIn();

  return (
    <button
      onClick={() => signInWithZalo()}
      disabled={isLoading}
      className="
        w-12 h-12 rounded-full 
        bg-blue-500 hover:bg-blue-600 
        text-white flex items-center justify-center
        disabled:opacity-50 transition-all
      "
      title="Đăng nhập với Zalo"
      aria-label="Đăng nhập với Zalo"
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z"/>
      </svg>
    </button>
  );
}
