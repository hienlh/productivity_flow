import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import crypto from 'crypto';

/**
 * Zalo OAuth Authorization Endpoint (Step 1)
 * This endpoint acts as a proxy between Clerk and Zalo's OAuth flow.
 * It translates Clerk's OAuth parameters to Zalo's requirements.
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // Get parameters from Clerk's OAuth request
    const clientId = searchParams.get('client_id'); // This will be mapped to app_id
    const redirectUri = searchParams.get('redirect_uri');
    const state = searchParams.get('state');
    const scope = searchParams.get('scope');
    
    if (!clientId || !redirectUri) {
      return NextResponse.json(
        { error: 'Missing required parameters: client_id or redirect_uri' },
        { status: 400 }
      );
    }

    // Generate PKCE code_verifier and code_challenge (required by Zalo)
    const codeVerifier = generateCodeVerifier();
    const codeChallenge = await generateCodeChallenge(codeVerifier);
    
    // Store code_verifier in cookie for later use in token exchange
    // Also store the original redirect_uri and state from Clerk
    const cookieStore = await cookies();
    cookieStore.set('zalo_code_verifier', codeVerifier, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 600, // 10 minutes
      path: '/',
    });
    
    cookieStore.set('zalo_clerk_redirect_uri', redirectUri, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 600,
      path: '/',
    });
    
    if (state) {
      cookieStore.set('zalo_clerk_state', state, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 600,
        path: '/',
      });
    }

    // Build Zalo authorization URL
    const zaloAuthUrl = new URL('https://oauth.zaloapp.com/v4/permission');
    zaloAuthUrl.searchParams.set('app_id', clientId); // Map client_id to app_id
    zaloAuthUrl.searchParams.set('redirect_uri', `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/auth/zalo/callback`);
    zaloAuthUrl.searchParams.set('code_challenge', codeChallenge);
    
    // Pass through state to maintain CSRF protection
    if (state) {
      zaloAuthUrl.searchParams.set('state', state);
    }

    // Redirect user to Zalo for authorization
    return NextResponse.redirect(zaloAuthUrl.toString());
    
  } catch (error) {
    console.error('Zalo authorization error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * Generate a cryptographically random code_verifier for PKCE
 * Must be 43-128 characters containing [A-Z, a-z, 0-9, -, ., _, ~]
 */
function generateCodeVerifier(): string {
  return base64URLEncode(crypto.randomBytes(32));
}

/**
 * Generate code_challenge from code_verifier using SHA256
 */
async function generateCodeChallenge(verifier: string): Promise<string> {
  const hash = crypto.createHash('sha256').update(verifier).digest();
  return base64URLEncode(hash);
}

/**
 * Base64 URL encode helper
 */
function base64URLEncode(buffer: Buffer): string {
  return buffer
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}
