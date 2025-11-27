# Hướng dẫn tích hợp Clerk với Zalo OAuth

## Tổng quan

Dự án này cung cấp một API proxy để tích hợp Clerk với Zalo OAuth. Vấn đề chính là Clerk sử dụng các tham số OAuth chuẩn (`client_id`, `client_secret`), trong khi Zalo lại yêu cầu các tham số đặc biệt (`app_id`, `secret_key`) và PKCE flow.

API này giải quyết vấn đề bằng cách:
- Chuyển đổi `client_id` → `app_id`
- Chuyển đổi `client_secret` → `secret_key`
- Xử lý PKCE flow (code_verifier và code_challenge) cho Zalo
- Cung cấp các endpoint tương thích với OAuth 2.0 standard mà Clerk mong đợi

## Kiến trúc

```
Clerk → API Proxy → Zalo OAuth
```

### Các API Endpoints

1. **`/api/auth/zalo/authorize`** - Authorization endpoint
   - Nhận request OAuth từ Clerk
   - Sinh PKCE code_verifier và code_challenge
   - Redirect người dùng đến Zalo để xác thực

2. **`/api/auth/zalo/callback`** - Callback endpoint
   - Nhận authorization code từ Zalo
   - Redirect về Clerk với authorization code

3. **`/api/auth/zalo/token`** - Token exchange endpoint
   - POST: Đổi authorization code lấy access token
   - PUT: Refresh access token khi hết hạn

4. **`/api/auth/zalo/userinfo`** - User info endpoint
   - Lấy thông tin người dùng từ Zalo Graph API
   - Chuyển đổi sang định dạng OIDC chuẩn

---

## 📋 Tóm tắt: 3 thay đổi CẦN THIẾT

Dựa vào cấu hình hiện tại của bạn trong Clerk, bạn cần thực hiện **3 thay đổi** sau:

### ✅ 1. Cập nhật URLs trong Clerk Dashboard
Thay đổi từ:
- ❌ `https://oauth.zaloapp.com/v4/permission` 
- ❌ `https://oauth.zaloapp.com/v4/access_token`
- ❌ `https://graph.zalo.me/v2.0/me?fields=id,name,picture`

Thành:
- ✅ `http://localhost:3000/api/auth/zalo/authorize`
- ✅ `http://localhost:3000/api/auth/zalo/token`
- ✅ `http://localhost:3000/api/auth/zalo/userinfo`

(Production: thay `localhost:3000` bằng `clerk.hienle.tech`)

### ✅ 2. Cập nhật Callback URL trong Zalo Developer Portal
Thay đổi từ:
- ❌ `https://clerk.hienle.tech/v1/oauth_callback`

Thành:
- ✅ `http://localhost:3000/api/auth/zalo/callback` (Development)
- ✅ `https://clerk.hienle.tech/api/auth/zalo/callback` (Production)

### ✅ 3. Thêm environment variables vào `.env.local`
```bash
NEXT_PUBLIC_APP_URL=http://localhost:3000
ZALO_APP_ID=2929451347492988582
ZALO_SECRET_KEY=[copy từ Clerk hoặc Zalo Portal]
```

---

## Hướng dẫn cài đặt

### 1. Cấu hình biến môi trường

Thêm các biến sau vào file `.env.local`:

```bash
# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000  # Development
# NEXT_PUBLIC_APP_URL=https://clerk.hienle.tech  # Production - uncomment khi deploy

# Zalo OAuth Configuration
ZALO_APP_ID=2929451347492988582                    # ✅ Bạn đã có
ZALO_SECRET_KEY=your_zalo_secret_key_here         # ✅ Bạn đã có - copy từ Clerk
```

**Lưu ý:** 
- `ZALO_APP_ID` và `ZALO_SECRET_KEY` là giá trị bạn đã nhập trong Clerk
- Các giá trị này sẽ được API proxy sử dụng để gọi Zalo APIs
- `NEXT_PUBLIC_APP_URL` cần khớp với domain mà bạn cấu hình trong Clerk

### 2. Đăng ký ứng dụng trên Zalo Platform

#### ⚠️ QUAN TRỌNG: Bạn cần SỬA callback URL trong Zalo Developer Portal

1. Truy cập https://developers.zalo.me/
2. Mở ứng dụng hiện có của bạn (App ID: `2929451347492988582`)
3. Trong phần **OAuth Settings**, **XÓA** callback URL hiện tại và thêm callback URL mới:
   
   ❌ **XÓA URL cũ** (nếu đang trỏ đến Clerk):
   ```
   https://clerk.hienle.tech/v1/oauth_callback
   ```
   
   ✅ **THÊM URL mới** (trỏ đến API Proxy):
   ```
   http://localhost:3000/api/auth/zalo/callback        # Development
   https://clerk.hienle.tech/api/auth/zalo/callback   # Production
   ```
   
   **Lưu ý:** Bạn có thể thêm CẢ HAI URLs (local và production) để test được ở cả 2 môi trường.

4. Lưu lại `App ID` và `Secret Key` (bạn đã có rồi)

### 3. Cấu hình Custom OAuth trong Clerk

#### ⚠️ QUAN TRỌNG: Bạn cần SỬA LẠI cấu hình hiện tại

Dựa vào screenshot, bạn đang cấu hình trực tiếp với Zalo APIs (`https://oauth.zaloapp.com/...`). **Điều này sẽ KHÔNG HOẠT ĐỘNG** vì Zalo yêu cầu `app_id`/`secret_key` thay vì `client_id`/`client_secret`.

Bạn cần thay đổi các URLs để trỏ đến **API Proxy** (các endpoint `/api/auth/zalo/...` đã tạo ở trên).

#### Hướng dẫn cấu hình:

1. Đăng nhập vào Clerk Dashboard (https://dashboard.clerk.com)
2. Chọn application của bạn
3. Vào **User & Authentication** → **Social Connections**
4. Mở cấu hình **Custom OAuth** hiện tại cho Zalo
5. **SỬA LẠI** các thông tin sau:

#### Identity Provider Configuration - CẦN SỬA:

**Authorization URL:** ❌ Sửa từ
```
https://oauth.zaloapp.com/v4/permission
```
✅ Thành:
```
http://localhost:3000/api/auth/zalo/authorize
```
(Production: `https://clerk.hienle.tech/api/auth/zalo/authorize` hoặc domain của bạn)

**Token URL:** ❌ Sửa từ
```
https://oauth.zaloapp.com/v4/access_token
```
✅ Thành:
```
http://localhost:3000/api/auth/zalo/token
```
(Production: `https://clerk.hienle.tech/api/auth/zalo/token`)

**User Info URL:** ❌ Sửa từ
```
https://graph.zalo.me/v2.0/me?fields=id,name,picture
```
✅ Thành:
```
http://localhost:3000/api/auth/zalo/userinfo
```
(Production: `https://clerk.hienle.tech/api/auth/zalo/userinfo`)

**Client ID:** ✅ GIỮ NGUYÊN
```
2929451347492988582
```
(Đây là Zalo App ID của bạn)

**Client Secret:** ✅ GIỮ NGUYÊN
```
[Your current Zalo Secret Key - giữ nguyên giá trị đã nhập]
```

**Scopes:** ✅ CÓ THỂ XÓA hoặc giữ lại
```
openid, profile
```
Note: Zalo không sử dụng scopes theo chuẩn OIDC, nhưng giữ lại cũng không sao.

#### Auth Provider Configuration - CẦN SỬA:

**Authorized redirect URI:** ✅ GIỮ NGUYÊN
```
https://clerk.hienle.tech/v1/oauth_callback
```

**Authorized redirect URL (only for debug):** ✅ GIỮ NGUYÊN
```
https://dapi.clerk.com/v1/oauth_debug/callback
```

6. Sau khi sửa xong, click **Save** hoặc **Update**

### 4. Cập nhật `.env.local.example`

```bash
# Convex
NEXT_PUBLIC_CONVEX_URL=your_convex_url_here
CONVEX_DEPLOYMENT=your_convex_deployment_here

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key_here
CLERK_SECRET_KEY=your_clerk_secret_key_here

# Zalo OAuth
NEXT_PUBLIC_APP_URL=http://localhost:3000
ZALO_APP_ID=your_zalo_app_id_here
ZALO_SECRET_KEY=your_zalo_secret_key_here
```

### 5. Sử dụng trong ứng dụng

Sau khi cấu hình xong, bạn có thể sử dụng Zalo login như các social provider khác của Clerk:

```tsx
import { SignIn, SignUp } from '@clerk/nextjs';

// Trong component của bạn
<SignIn 
  routing="path"
  path="/sign-in"
  redirectUrl="/dashboard"
/>

// Hoặc sử dụng button custom
import { useSignIn } from '@clerk/nextjs';

function ZaloSignInButton() {
  const { signIn } = useSignIn();
  
  const signInWithZalo = () => {
    signIn?.authenticateWithRedirect({
      strategy: 'oauth_custom',
      identifier: 'zalo', // Provider ID bạn đã cấu hình trong Clerk
      redirectUrl: '/sso-callback',
      redirectUrlComplete: '/dashboard',
    });
  };
  
  return <button onClick={signInWithZalo}>Đăng nhập với Zalo</button>;
}
```

## Luồng xác thực (Authentication Flow)

```
1. User clicks "Sign in with Zalo" trong Clerk UI
   ↓
2. Clerk redirects to /api/auth/zalo/authorize
   ↓
3. API tạo PKCE code_verifier & code_challenge
   ↓
4. API redirects user to Zalo OAuth (https://oauth.zaloapp.com/v4/permission)
   ↓
5. User đăng nhập và cấp quyền trên Zalo
   ↓
6. Zalo redirects to /api/auth/zalo/callback with authorization code
   ↓
7. API redirects back to Clerk với authorization code
   ↓
8. Clerk gọi /api/auth/zalo/token để đổi code lấy access token
   ↓
9. Clerk gọi /api/auth/zalo/userinfo để lấy thông tin user
   ↓
10. Clerk tạo session và redirect user vào app
```

## Security Features

1. **PKCE (Proof Key for Code Exchange)**
   - Bảo vệ chống lại authorization code interception attacks
   - Code verifier được lưu trong HTTPOnly cookie

2. **State Parameter**
   - Ngăn chặn CSRF attacks
   - State được truyền qua toàn bộ OAuth flow

3. **HTTPOnly Cookies**
   - Sensitive data (code_verifier, redirect_uri) được lưu trong HTTPOnly cookies
   - Không thể truy cập từ JavaScript

4. **Secure Cookie Settings**
   - SameSite=Lax
   - Secure flag trong production
   - Short expiration time (10 phút)

## Xử lý lỗi

API xử lý các lỗi phổ biến:

- **Missing parameters:** Thiếu client_id, client_secret, code
- **Session expired:** Code verifier không tồn tại hoặc đã hết hạn
- **Zalo API errors:** Token exchange thất bại, user info không khả dụng
- **Network errors:** Timeout, connection issues

Tất cả lỗi được trả về theo chuẩn OAuth 2.0 error response:
```json
{
  "error": "error_code",
  "error_description": "Human readable error description"
}
```

## Testing

### Local Development
```bash
npm run dev
```

### Test OAuth Flow
1. Truy cập http://localhost:3000
2. Click "Sign in with Zalo"
3. Kiểm tra console logs để debug
4. Verify user info sau khi login thành công

## Tài liệu tham khảo

- [Zalo OAuth Documentation](https://developers.zalo.me/docs/social-api/tham-khao/user-access-token-v4)
- [Clerk Custom OAuth Documentation](https://clerk.com/docs/authentication/social-connections/custom-provider)
- [OAuth 2.0 PKCE RFC](https://datatracker.ietf.org/doc/html/rfc7636)

## Troubleshooting

### Lỗi "Code verifier not found"
- Cookie đã hết hạn (10 phút)
- User cần restart authentication flow

### Lỗi "Invalid redirect_uri"
- Kiểm tra callback URL trong Zalo Developer Portal
- Ensure NEXT_PUBLIC_APP_URL được set đúng

### Token exchange failed
- Verify ZALO_APP_ID và ZALO_SECRET_KEY chính xác
- Check network connectivity to Zalo APIs

### User info không có email
- Zalo có thể không cung cấp email cho tất cả user
- App cần handle trường hợp email = null/undefined
