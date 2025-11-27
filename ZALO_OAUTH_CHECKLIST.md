# ✅ Checklist: Cài đặt Zalo OAuth với Clerk

Sử dụng checklist này để đảm bảo bạn đã hoàn thành tất cả các bước cần thiết.

## 📝 Trước khi bắt đầu

- [ ] Đã có tài khoản Zalo Developer và ứng dụng Zalo (App ID: `2929451347492988582`)
- [ ] Đã có tài khoản Clerk và project đang chạy
- [ ] Đã clone code về máy và cài đặt dependencies (`npm install` hoặc `pnpm install`)

## 🔧 Bước 1: Cấu hình Environment Variables

- [ ] Mở file `.env.local` (hoặc tạo mới nếu chưa có)
- [ ] Thêm biến `NEXT_PUBLIC_APP_URL=http://localhost:3000`
- [ ] Thêm biến `ZALO_APP_ID=2929451347492988582`
- [ ] Thêm biến `ZALO_SECRET_KEY=[copy từ Clerk hoặc Zalo Portal]`
- [ ] Verify: File `.env.local` có đủ các biến: CONVEX, CLERK, APP_URL, ZALO

## 🌍 Bước 2: Cập nhật Zalo Developer Portal

- [ ] Truy cập https://developers.zalo.me/
- [ ] Đăng nhập và mở ứng dụng của bạn
- [ ] Vào phần **OAuth Settings**
- [ ] **XÓA** callback URL cũ: `https://clerk.hienle.tech/v1/oauth_callback` (nếu có)
- [ ] **THÊM** callback URL mới:
  - [ ] `http://localhost:3000/api/auth/zalo/callback` (cho development)
  - [ ] `https://clerk.hienle.tech/api/auth/zalo/callback` (cho production)
- [ ] Lưu lại thay đổi

## 🔐 Bước 3: Cập nhật Clerk Dashboard

- [ ] Truy cập https://dashboard.clerk.com
- [ ] Mở project của bạn
- [ ] Vào **User & Authentication** → **Social Connections**
- [ ] Mở cấu hình **Custom OAuth** cho Zalo

### Identity Provider Configuration:

- [ ] **Authorization URL** → Sửa thành:
  - Development: `http://localhost:3000/api/auth/zalo/authorize`
  - Production: `https://clerk.hienle.tech/api/auth/zalo/authorize`

- [ ] **Token URL** → Sửa thành:
  - Development: `http://localhost:3000/api/auth/zalo/token`
  - Production: `https://clerk.hienle.tech/api/auth/zalo/token`

- [ ] **User Info URL** → Sửa thành:
  - Development: `http://localhost:3000/api/auth/zalo/userinfo`
  - Production: `https://clerk.hienle.tech/api/auth/zalo/userinfo`

- [ ] **Client ID** → Giữ nguyên: `2929451347492988582`
- [ ] **Client Secret** → Giữ nguyên (không thay đổi)
- [ ] **Scopes** → Giữ nguyên hoặc xóa (tùy chọn)

### Auth Provider Configuration:

- [ ] **Authorized redirect URI** → Giữ nguyên: `https://clerk.hienle.tech/v1/oauth_callback`
- [ ] **Authorized redirect URL (debug)** → Giữ nguyên: `https://dapi.clerk.com/v1/oauth_debug/callback`

- [ ] Click **Save** hoặc **Update** để lưu thay đổi

## 🧪 Bước 4: Test Local

- [ ] Chạy dev server: `npm run dev`
- [ ] Dev server chạy thành công tại http://localhost:3000
- [ ] Mở trình duyệt, truy cập trang sign-in của app
- [ ] Thấy nút "Sign in with Zalo" (hoặc tương tự)
- [ ] Click vào nút Zalo login
- [ ] Được redirect đến trang đăng nhập Zalo
- [ ] Đăng nhập Zalo thành công
- [ ] Cấp quyền cho ứng dụng
- [ ] Được redirect về app với session đã đăng nhập
- [ ] Check console logs không có lỗi
- [ ] User info hiển thị đúng (tên, avatar từ Zalo)

## 🐛 Nếu gặp lỗi:

### Lỗi "Code verifier not found"
- [ ] Xóa cookies và thử lại
- [ ] Kiểm tra `NEXT_PUBLIC_APP_URL` có đúng không
- [ ] Restart dev server

### Lỗi "Invalid redirect_uri" 
- [ ] Kiểm tra lại callback URL trong Zalo Portal
- [ ] Verify `NEXT_PUBLIC_APP_URL` trong `.env.local`

### Lỗi "Token exchange failed"
- [ ] Kiểm tra `ZALO_APP_ID` và `ZALO_SECRET_KEY` có chính xác không
- [ ] Verify rằng App ID và Secret Key khớp với ứng dụng trong Zalo Portal
- [ ] Check network connectivity

### Lỗi 404 trên các endpoint `/api/auth/zalo/*`
- [ ] Verify các file API route đã được tạo đúng vị trí:
  - `/src/app/api/auth/zalo/authorize/route.ts`
  - `/src/app/api/auth/zalo/callback/route.ts`
  - `/src/app/api/auth/zalo/token/route.ts`
  - `/src/app/api/auth/zalo/userinfo/route.ts`
- [ ] Restart dev server sau khi tạo các file mới

## 🚀 Bước 5: Deploy Production (Tùy chọn)

- [ ] Cập nhật `NEXT_PUBLIC_APP_URL` trong production environment variables
- [ ] Deploy code lên server
- [ ] Verify callback URL trong Zalo Portal có domain production
- [ ] Verify URLs trong Clerk Dashboard có domain production
- [ ] Test OAuth flow trên production

## ✅ Hoàn thành!

Nếu tất cả các bước đều pass, bạn đã tích hợp thành công Zalo OAuth với Clerk! 🎉

## 📚 Tài liệu tham khảo

- Chi tiết đầy đủ: Xem file `ZALO_OAUTH_SETUP.md`
- Zalo Docs: https://developers.zalo.me/docs/social-api/tham-khao/user-access-token-v4
- Clerk Docs: https://clerk.com/docs/authentication/social-connections/custom-provider
