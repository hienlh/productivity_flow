import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

/**
 * Zalo OAuth Callback Endpoint (Step 2)
 * This receives the authorization code from Zalo and redirects back to Clerk
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // Get authorization code from Zalo
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');
    
    // Handle authorization errors
    if (error) {
      console.error('Zalo authorization error:', error, errorDescription);
      return NextResponse.json(
        { error: error, error_description: errorDescription },
        { status: 400 }
      );
    }
    
    if (!code) {
      return NextResponse.json(
        { error: 'Authorization code not received from Zalo' },
        { status: 400 }
      );
    }

    // Retrieve stored values from cookies
    const cookieStore = await cookies();
    const clerkRedirectUri = cookieStore.get('zalo_clerk_redirect_uri')?.value;
    const clerkState = cookieStore.get('zalo_clerk_state')?.value;
    
    if (!clerkRedirectUri) {
      return NextResponse.json(
        { error: 'Session expired or invalid request' },
        { status: 400 }
      );
    }

    // Build redirect URL back to Clerk with the authorization code
    const redirectUrl = new URL(clerkRedirectUri);
    redirectUrl.searchParams.set('code', code);
    
    // Pass through state for CSRF validation
    if (clerkState && state === clerkState) {
      redirectUrl.searchParams.set('state', state);
    }

    // Clean up cookies
    cookieStore.delete('zalo_clerk_redirect_uri');
    cookieStore.delete('zalo_clerk_state');
    // Note: Keep zalo_code_verifier for token exchange

    // Redirect back to Clerk
    return NextResponse.redirect(redirectUrl.toString());
    
  } catch (error) {
    console.error('Zalo callback error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
