import { NextRequest, NextResponse } from 'next/server';
import { getProxyOptions } from '@/lib/proxy';

/**
 * Zalo User Info Endpoint
 * Fetches user profile information from Zalo Graph API.
 * This endpoint is called by Clerk to get user information after authentication.
 */
export async function GET(request: NextRequest) {
  console.log('👤 User Info endpoint called');
  
  try {
    // Get access token from Authorization header
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { 
          error: 'unauthorized',
          error_description: 'Missing or invalid authorization header' 
        },
        { status: 401 }
      );
    }

    const accessToken = authHeader.substring(7); // Remove 'Bearer ' prefix

    // Fetch user info from Zalo Graph API
    // Use proxy if configured to bypass IP restrictions
    const proxyOptions = getProxyOptions();
    
    const userInfoResponse = await fetch('https://graph.zalo.me/v2.0/me?fields=id,name,picture', {
      method: 'GET',
      headers: {
        'access_token': accessToken,
      },
      ...proxyOptions, // Inject dispatcher/agent here
    });

    const userData = await userInfoResponse.json();

    // Check for errors from Zalo
    if (!userInfoResponse.ok || userData.error) {
      console.error('Zalo user info error:', userData);
      return NextResponse.json(
        {
          error: userData.error?.code || 'userinfo_failed',
          error_description: userData.error?.message || 'Failed to fetch user info from Zalo',
        },
        { status: userInfoResponse.status || 400 }
      );
    }

    // Transform Zalo user data to standard OAuth/OIDC format (compatible with Clerk)
    const standardUserInfo = {
      id: userData.id,                     // Clerk expects 'id' based on your mapping
      sub: userData.id,                    // Standard OIDC subject identifier
      name: userData.name,
      given_name: userData.name,           // Zalo doesn't split names, so use full name
      family_name: '',                     // Placeholder
      picture: userData.picture?.data?.url,
      avatar_url: userData.picture?.data?.url, // Alias for picture
      // Add any additional fields that Clerk might expect
      email: userData.email,               // If available (requires extra permission)
      email_verified: false,
      locale: 'vi',
    };

    console.log('👤 Zalo User Info Response:', standardUserInfo);

    return NextResponse.json(standardUserInfo);
    
  } catch (error) {
    console.error('User info error:', error);
    return NextResponse.json(
      { 
        error: 'server_error',
        error_description: 'Internal server error while fetching user info' 
      },
      { status: 500 }
    );
  }
}
