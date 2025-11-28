import { NextRequest, NextResponse } from 'next/server';
import { ZaloLogger } from '@/lib/zaloLogger';

/**
 * Test endpoint: Direct Zalo token exchange
 * For debugging purposes only
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, code_verifier } = body;

    if (!code || !code_verifier) {
      return NextResponse.json(
        { error: 'Missing code or code_verifier' },
        { status: 400 }
      );
    }

    // Initialize logger (create README if needed)
    await ZaloLogger.createSummary();

    const zaloAppId = process.env.ZALO_APP_ID;
    const zaloSecretKey = process.env.ZALO_SECRET_KEY;

    if (!zaloAppId || !zaloSecretKey) {
      return NextResponse.json(
        { error: 'ZALO_APP_ID or ZALO_SECRET_KEY not configured' },
        { status: 500 }
      );
    }

    console.log('🔵 Test Token Exchange:');
    console.log('  - App ID:', zaloAppId);
    console.log('  - Code:', code.substring(0, 10) + '...');
    console.log('  - Code Verifier:', code_verifier.substring(0, 10) + '...');
    console.log('  - App Secret:', zaloSecretKey.substring(0, 10) + '...');

    // Exchange code for token
    const tokenParams = new URLSearchParams({
      app_id: zaloAppId,
      code: code,
      grant_type: 'authorization_code',
      code_verifier: code_verifier,
    });

    const tokenResponse = await fetch('https://oauth.zaloapp.com/v4/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'secret_key': zaloSecretKey,
      },
      body: tokenParams.toString(),
    });

    const tokenData = await tokenResponse.json();

    console.log('📤 Zalo Token Response:', {
      status: tokenResponse.status,
      ok: tokenResponse.ok,
      hasAccessToken: !!tokenData.access_token,
      hasRefreshToken: !!tokenData.refresh_token,
      error: tokenData.error,
    });

    // Log API call to markdown
    await ZaloLogger.log({
      timestamp: new Date().toISOString(),
      apiCall: 'Token Exchange',
      request: {
        url: 'https://oauth.zaloapp.com/v4/access_token',
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'secret_key': zaloSecretKey,
        },
        body: tokenParams.toString(),
      },
      response: {
        status: tokenResponse.status,
        ok: tokenResponse.ok,
        data: tokenData,
      },
      error: tokenData.error ? tokenData : undefined,
    });

    if (!tokenResponse.ok || tokenData.error) {
      return NextResponse.json(
        {
          error: 'Token exchange failed',
          details: tokenData,
        },
        { status: tokenResponse.status || 400 }
      );
    }

    // Get user info if we have access token
    if (tokenData.access_token) {
      try {
        const userInfoResponse = await fetch(
          'https://graph.zalo.me/v2.0/me?fields=id,name,picture',
          {
            headers: {
              'access_token': tokenData.access_token,
            },
          }
        );

        const userData = await userInfoResponse.json();

        // Log user info API call
        await ZaloLogger.log({
          timestamp: new Date().toISOString(),
          apiCall: 'Get User Info',
          request: {
            url: 'https://graph.zalo.me/v2.0/me?fields=id,name,picture',
            method: 'GET',
            headers: {
              'access_token': tokenData.access_token,
            },
            body: null,
          },
          response: {
            status: userInfoResponse.status,
            ok: userInfoResponse.ok,
            data: userData,
          },
          error: !userInfoResponse.ok ? userData : undefined,
        });

        if (userInfoResponse.ok) {
          tokenData.user_info = userData;
          console.log('👤 User Info:', userData);
        }
      } catch (error) {
        console.error('Failed to fetch user info:', error);
        // Don't fail the whole request if user info fails
      }
    }

    return NextResponse.json({
      success: true,
      data: tokenData,
    });

  } catch (error: any) {
    console.error('❌ Token exchange error:', error);
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error.message,
      },
      { status: 500 }
    );
  }
}
