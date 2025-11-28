import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

/**
 * Zalo OAuth Token Exchange Endpoint (Step 3)
 * This exchanges the authorization code for an access token.
 * Translates between Clerk's OAuth token request and Zalo's API.
 */
export async function POST(request: NextRequest) {
  console.log('🔵 Token Exchange endpoint called');
  console.log('  - Method:', request.method);
  console.log('  - Content-Type:', request.headers.get('content-type'));
  console.log('  - URL:', request.url);
  
  try {
    // Parse request body (could be JSON or form-urlencoded)
    const contentType = request.headers.get('content-type') || '';
    let params: Record<string, string> = {};
    
    if (contentType.includes('application/json')) {
      params = await request.json();
    } else if (contentType.includes('application/x-www-form-urlencoded')) {
      const formData = await request.formData();
      formData.forEach((value, key) => {
        params[key] = value.toString();
      });
    } else {
      // Try to parse as JSON by default
      params = await request.json();
    }
    
    console.log('  - Parsed params:', Object.keys(params));
    console.log('  - Has code:', !!params.code);
    console.log('  - Has client_id:', !!params.client_id);
    
    const {
      client_id,
      client_secret,
      code,
      grant_type,
      redirect_uri,
    } = params;

    // Use actual Zalo credentials from environment variables
    const zaloAppId = process.env.ZALO_APP_ID;
    const zaloSecretKey = process.env.ZALO_SECRET_KEY;

    // Validate environment configuration
    if (!zaloAppId || !zaloSecretKey) {
      return NextResponse.json(
        { 
          error: 'server_error',
          error_description: 'ZALO_APP_ID or ZALO_SECRET_KEY not configured in environment variables' 
        },
        { status: 500 }
      );
    }

    // Validate required parameters
    if (!code) {
      return NextResponse.json(
        { 
          error: 'invalid_request',
          error_description: 'Missing required parameter: code' 
        },
        { status: 400 }
      );
    }

    // Get code_verifier from cookie (stored during authorization)
    const cookieStore = await cookies();
    const codeVerifier = cookieStore.get('zalo_code_verifier')?.value;
    
    if (!codeVerifier) {
      return NextResponse.json(
        { 
          error: 'invalid_request',
          error_description: 'Code verifier not found. Please restart the authentication flow.' 
        },
        { status: 400 }
      );
    }

    // Exchange authorization code for access token with Zalo
    const tokenParams = new URLSearchParams({
      app_id: zaloAppId,           // Use Zalo App ID from env
      code: code,
      grant_type: grant_type || 'authorization_code',
      code_verifier: codeVerifier, // Required for PKCE
    });

    const tokenResponse = await fetch('https://oauth.zaloapp.com/v4/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'secret_key': zaloSecretKey,  // Zalo requires secret_key in header, not body
      },
      body: tokenParams.toString(),
    });

    const tokenData = await tokenResponse.json();

    console.log('🔑 Zalo Token Exchange:', {
      status: tokenResponse.status,
      ok: tokenResponse.ok,
      hasAccessToken: !!tokenData.access_token,
      hasRefreshToken: !!tokenData.refresh_token,
      error: tokenData.error,
      errorCode: tokenData.error_code,
    });

    // Check for errors from Zalo
    if (!tokenResponse.ok || tokenData.error) {
      console.error('❌ Zalo token exchange failed:', tokenData);
      return NextResponse.json(
        {
          error: tokenData.error || 'token_exchange_failed',
          error_description: tokenData.error_description || tokenData.message || 'Failed to exchange token with Zalo',
        },
        { status: tokenResponse.status || 400 }
      );
    }

    // Clean up code_verifier cookie
    cookieStore.delete('zalo_code_verifier');

    // Return token response in OAuth 2.0 format (compatible with Clerk)
    return NextResponse.json({
      access_token: tokenData.access_token,
      token_type: 'Bearer',
      expires_in: tokenData.expires_in,
      refresh_token: tokenData.refresh_token,
      scope: tokenData.scope,
    });
    
  } catch (error) {
    console.error('Token exchange error:', error);
    return NextResponse.json(
      { 
        error: 'server_error',
        error_description: 'Internal server error during token exchange' 
      },
      { status: 500 }
    );
  }
}

/**
 * Token Refresh Endpoint
 * Handles refresh token flow for Zalo
 */
export async function PUT(request: NextRequest) {
  try {
    const params = await request.json();
    const {
      client_id,
      client_secret,
      refresh_token,
      grant_type,
    } = params;

    // Use actual Zalo credentials from environment variables
    const zaloAppId = process.env.ZALO_APP_ID;
    const zaloSecretKey = process.env.ZALO_SECRET_KEY;

    if (!zaloAppId || !zaloSecretKey) {
      return NextResponse.json(
        { 
          error: 'server_error',
          error_description: 'ZALO_APP_ID or ZALO_SECRET_KEY not configured in environment variables' 
        },
        { status: 500 }
      );
    }

    if (!refresh_token) {
      return NextResponse.json(
        { 
          error: 'invalid_request',
          error_description: 'Missing required parameter: refresh_token' 
        },
        { status: 400 }
      );
    }

    // Refresh access token with Zalo
    const refreshParams = new URLSearchParams({
      app_id: zaloAppId,           // Use Zalo App ID from env
      refresh_token: refresh_token,
      grant_type: grant_type || 'refresh_token',
    });

    const refreshResponse = await fetch('https://oauth.zaloapp.com/v4/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'secret_key': zaloSecretKey,  // Zalo requires secret_key in header, not body
      },
      body: refreshParams.toString(),
    });

    const refreshData = await refreshResponse.json();

    if (!refreshResponse.ok || refreshData.error) {
      console.error('Zalo token refresh error:', refreshData);
      return NextResponse.json(
        {
          error: refreshData.error || 'token_refresh_failed',
          error_description: refreshData.error_description || refreshData.message || 'Failed to refresh token with Zalo',
        },
        { status: refreshResponse.status || 400 }
      );
    }

    return NextResponse.json({
      access_token: refreshData.access_token,
      token_type: 'Bearer',
      expires_in: refreshData.expires_in,
      refresh_token: refreshData.refresh_token,
      scope: refreshData.scope,
    });
    
  } catch (error) {
    console.error('Token refresh error:', error);
    return NextResponse.json(
      { 
        error: 'server_error',
        error_description: 'Internal server error during token refresh' 
      },
      { status: 500 }
    );
  }
}
