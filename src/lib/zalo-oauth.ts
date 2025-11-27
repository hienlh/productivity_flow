/**
 * Zalo OAuth Helper Utilities
 * 
 * This file provides helper functions and React hooks to integrate
 * Zalo OAuth with Clerk in your Next.js application.
 */

import { useSignIn } from '@clerk/nextjs';
import { useCallback } from 'react';

/**
 * Custom hook to handle Zalo sign-in with Clerk
 * 
 * @example
 * ```tsx
 * function LoginButton() {
 *   const { signInWithZalo, isLoading } = useZaloSignIn();
 *   
 *   return (
 *     <button onClick={signInWithZalo} disabled={isLoading}>
 *       {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập với Zalo'}
 *     </button>
 *   );
 * }
 * ```
 */
export function useZaloSignIn() {
  const { signIn, isLoaded } = useSignIn();

  const signInWithZalo = useCallback(
    async (options?: {
      redirectUrl?: string;
      redirectUrlComplete?: string;
    }) => {
      if (!isLoaded || !signIn) {
        console.warn('Clerk is not loaded yet');
        return;
      }

      try {
        await signIn.authenticateWithRedirect({
          strategy: 'oauth_custom',
          identifier: 'oauth_zalo', // This should match the provider ID in Clerk
          redirectUrl: options?.redirectUrl || '/sso-callback',
          redirectUrlComplete: options?.redirectUrlComplete || '/dashboard',
        });
      } catch (error) {
        console.error('Zalo sign-in error:', error);
        throw error;
      }
    },
    [signIn, isLoaded]
  );

  return {
    signInWithZalo,
    isLoading: !isLoaded,
  };
}

/**
 * Zalo OAuth Configuration
 * These values should match your Clerk configuration
 */
export const ZALO_OAUTH_CONFIG = {
  providerId: 'oauth_zalo', // Custom provider ID in Clerk
  providerName: 'Zalo',
  scopes: ['openid', 'profile'], // Optional, Zalo doesn't strictly use these
} as const;

/**
 * Type definitions for Zalo user data
 */
export interface ZaloUserInfo {
  id: string;
  name: string;
  picture?: {
    data?: {
      url?: string;
    };
  };
  email?: string;
  birthday?: string;
  gender?: number; // 0: female, 1: male, -1: unknown
}

/**
 * Standard OIDC user info format (returned by our API proxy)
 */
export interface StandardUserInfo {
  sub: string;          // User ID
  name: string;         // Display name
  given_name: string;   // First name
  picture?: string;     // Profile picture URL
  email?: string;       // Email (may not be available)
  email_verified: boolean;
  locale: string;
}
