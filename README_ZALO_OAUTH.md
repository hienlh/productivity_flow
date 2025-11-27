# Zalo OAuth Integration - Quick Start

## 📚 Tổng quan

Tích hợp Zalo OAuth với Clerk cho Next.js App Router. API proxy giải quyết vấn đề incompatibility giữa Clerk's OAuth flow và Zalo's authentication requirements.

## 🎯 Vấn đề

- **Clerk** sử dụng: `client_id` và `client_secret`
- **Zalo** yêu cầu: `app_id` và `secret_key` + PKCE flow

## ✅ Giải pháp

API Proxy chuyển đổi giữa 2 hệ thống:

```
User → Clerk → API Proxy → Zalo
                ↓ Translates
        client_id → app_id
        client_secret → secret_key
        + Handles PKCE
```

## 📁 Files đã tạo

### Backend APIs (API Routes)
- ✅ `/src/app/api/auth/zalo/authorize/route.ts` - Authorization endpoint
- ✅ `/src/app/api/auth/zalo/callback/route.ts` - Callback handler  
- ✅ `/src/app/api/auth/zalo/token/route.ts` - Token exchange
- ✅ `/src/app/api/auth/zalo/userinfo/route.ts` - User info

### Frontend Utilities
- ✅ `/src/lib/zalo-oauth.ts` - React hooks và utilities
- ✅ `/src/components/ZaloSignInButton.tsx` - Example components

### Documentation
- ✅ `ZALO_OAUTH_SETUP.md` - Hướng dẫn chi tiết
- ✅ `ZALO_OAUTH_CHECKLIST.md` - Checklist từng bước
- ✅ `README_ZALO_OAUTH.md` - File này

## 🚀 Quick Start

### 1. Environment Variables

Thêm vào `.env.local`:

```bash
NEXT_PUBLIC_APP_URL=http://localhost:3000
ZALO_APP_ID=2929451347492988582
ZALO_SECRET_KEY=your_secret_key
```

### 2. Update Clerk Dashboard

Trong Clerk → Social Connections → Custom OAuth:

- **Name**: `Zalo`
- **Key**: `zalo` (hoặc bất kỳ, không quan trọng vì API sẽ dùng env vars)
- **Authorization URL**: `http://localhost:3000/api/auth/zalo/authorize`
- **Token URL**: `http://localhost:3000/api/auth/zalo/token`
- **User Info URL**: `http://localhost:3000/api/auth/zalo/userinfo`
- **Client ID**: `dummy` (giá trị này không được sử dụng, API sẽ dùng ZALO_APP_ID từ env)
- **Client Secret**: `dummy` (giá trị này không được sử dụng, API sẽ dùng ZALO_SECRET_KEY từ env)
- **Enable for sign-up and sign-in**: ✅ Enabled

⚠️ **Quan trọng**: Clerk's Client ID và Client Secret là "dummy values" vì:
- API proxy sẽ tự động sử dụng `ZALO_APP_ID` và `ZALO_SECRET_KEY` từ environment variables
- Điều này đảm bảo bảo mật và dễ quản lý credentials

### 3. Update Zalo Developer Portal

Callback URL: `http://localhost:3000/api/auth/zalo/callback`

### 4. Sử dụng trong code

```tsx
import { ZaloSignInButton } from '@/components/ZaloSignInButton';

export default function LoginPage() {
  return (
    <div>
      <h1>Đăng nhập</h1>
      <ZaloSignInButton />
    </div>
  );
}
```

## 📖 Documentation

- **Chi tiết đầy đủ**: `ZALO_OAUTH_SETUP.md`
- **Checklist**: `ZALO_OAUTH_CHECKLIST.md`

## 🔍 OAuth Flow

```
1. User clicks "Sign in with Zalo"
2. Clerk → /api/auth/zalo/authorize
3. API generates PKCE codes
4. Redirect to Zalo login
5. User authorizes
6. Zalo → /api/auth/zalo/callback
7. API → Clerk (with code)
8. Clerk → /api/auth/zalo/token
9. API → Zalo (get access token)
10. Clerk → /api/auth/zalo/userinfo
11. API → Zalo Graph API (get user)
12. ✅ User logged in
```

## 🛠️ Development

```bash
# Install dependencies
npm install

# Run dev server  
npm run dev

# Test Zalo login
# Navigate to http://localhost:3000
# Click "Sign in with Zalo"
```

## 🐛 Troubleshooting

| Lỗi | Giải pháp |
|-----|-----------|
| "Code verifier not found" | Xóa cookies, restart OAuth flow |
| "Invalid redirect_uri" | Kiểm tra callback URL trong Zalo Portal |
| "Token exchange failed" | Verify App ID và Secret Key |
| 404 on `/api/auth/zalo/*` | Restart dev server |

## 📚 Resources

- [Zalo OAuth Docs](https://developers.zalo.me/docs/social-api/tham-khao/user-access-token-v4)
- [Clerk Custom OAuth](https://clerk.com/docs/authentication/social-connections/custom-provider)
- [OAuth 2.0 PKCE](https://datatracker.ietf.org/doc/html/rfc7636)

## ✅ Production Checklist

- [ ] Update `NEXT_PUBLIC_APP_URL` to production domain
- [ ] Update Clerk URLs to production domain
- [ ] Update Zalo callback URL to production domain
- [ ] Test OAuth flow on production
- [ ] Monitor error logs

## 📧 Support

Nếu gặp vấn đề, check:
1. Console logs (browser + server)
2. Network tab (check API calls)
3. Clerk Dashboard logs
4. Zalo Developer Portal logs

---

**Created**: 2025-11-27  
**Status**: ✅ Ready for testing
