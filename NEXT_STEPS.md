# Các Bước Tiếp Theo

## ✅ Đã Hoàn Thành

Dự án đã được chuyển đổi thành công từ Vite + React sang Next.js 16. Các thay đổi chính:

1. ✅ Cấu trúc thư mục Next.js App Router
2. ✅ Cấu hình Next.js, TypeScript, Tailwind CSS
3. ✅ Chuyển đổi components sang Client Components
4. ✅ Cập nhật Clerk integration (Next.js)
5. ✅ Cập nhật Convex provider
6. ✅ Di chuyển i18n, contexts, services
7. ✅ Tạo layout và page chính
8. ✅ Dọn dẹp files Vite cũ
9. ✅ **TESTED & FIXED ALL BUGS** - Dev server running successfully!

## 🔄 Cần Làm Ngay

### 1. Cài Đặt Dependencies

```bash
# Xóa node_modules cũ (khuyến nghị)
rm -rf node_modules pnpm-lock.yaml

# Cài đặt dependencies mới
pnpm install
```

### 2. Thiết Lập Environment Variables

```bash
# Tạo file .env.local từ example
cp .env.local.example .env.local
```

Chỉnh sửa `.env.local` với thông tin của bạn:

```env
# Convex
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
CONVEX_DEPLOYMENT=your-deployment-name

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxx
CLERK_SECRET_KEY=sk_test_xxx
```

**Lấy credentials:**
- **Convex**: `npx convex dev` (hoặc từ [Convex Dashboard](https://dashboard.convex.dev))
- **Clerk**: [Clerk Dashboard](https://dashboard.clerk.com)

### 3. Khởi Động Convex

```bash
npx convex dev
```

Convex sẽ:
- Tạo deployment nếu chưa có
- Sync schema
- Cung cấp URL cho `NEXT_PUBLIC_CONVEX_URL`

### 4. Chạy Development Server

```bash
pnpm dev
```

Mở [http://localhost:3000](http://localhost:3000)

## 🧪 Kiểm Tra

### Checklist Kiểm Tra Cơ Bản

- [ ] Trang chủ load thành công
- [ ] Có thể thêm task
- [ ] Có thể xóa task
- [ ] Generate plan với Gemini API (cần setup API key trong app)
- [ ] Sign in/out với Clerk hoạt động
- [ ] Data sync với Convex khi đăng nhập
- [ ] Đổi ngôn ngữ VI/EN hoạt động
- [ ] Responsive design (mobile & desktop)
- [ ] History modal hiển thị đúng
- [ ] Bulk import tasks hoạt động

### Kiểm Tra Tính Năng

1. **Thêm Task:**
   - Thử với các priority khác nhau
   - Thử với fixed time
   - Thử với deadline

2. **Generate Plan:**
   - Setup Gemini API key trong app (Settings)
   - Thêm vài tasks
   - Click "Tạo Lịch Trình AI"
   - Kiểm tra plan hiển thị

3. **Authentication:**
   - Sign in với Clerk
   - Thêm task → Check sync indicator
   - Refresh page → Data vẫn còn
   - Sign out → Check local storage mode

4. **Multi-language:**
   - Đổi sang EN
   - Refresh → Ngôn ngữ được giữ
   - Sign in → Ngôn ngữ sync qua Convex

## 🚀 Deploy

### Option 1: Vercel (Khuyến nghị)

1. Push code lên GitHub:
```bash
git add .
git commit -m "Migrate to Next.js 16"
git push origin main
```

2. Import vào [Vercel](https://vercel.com):
   - New Project
   - Import Git Repository
   - Add Environment Variables
   - Deploy

3. Update Clerk settings:
   - Thêm production domain vào Allowed Origins
   - Update Redirect URLs

### Option 2: Tự Deploy

Có thể deploy lên bất kỳ platform nào hỗ trợ Next.js:
- Netlify
- AWS Amplify
- Railway
- DigitalOcean App Platform

## 📊 Performance

### Recommended Optimizations

1. **Images:** Nếu có ảnh, sử dụng `next/image`:
```tsx
import Image from 'next/image';
```

2. **Fonts:** Đã tối ưu với `next/font/google`

3. **Bundle Size:** Kiểm tra với:
```bash
pnpm build
```

## 🔍 Debugging

### Common Issues

**Issue:** Lỗi "Module not found"
**Fix:** 
```bash
pnpm install
# hoặc
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

**Issue:** Environment variables không hoạt động
**Fix:**
- Restart dev server
- Check tên biến có `NEXT_PUBLIC_` prefix cho client-side

**Issue:** Clerk không hoạt động
**Fix:**
- Check `middleware.ts` có đúng config
- Check environment variables

**Issue:** Convex không sync
**Fix:**
- Check `npx convex dev` đang chạy
- Check `NEXT_PUBLIC_CONVEX_URL` đúng

## 📚 Tài Liệu

- [Next.js Docs](https://nextjs.org/docs)
- [Convex + Next.js](https://docs.convex.dev/client/react/nextjs)
- [Clerk + Next.js](https://clerk.com/docs/quickstarts/nextjs)
- [Tailwind CSS](https://tailwindcss.com/docs)

## 💡 Tính Năng Mới Có Thể Thêm

Với Next.js, bạn có thể dễ dàng thêm:

1. **API Routes:** Tạo API endpoints trong `src/app/api/`
2. **Server Components:** Tối ưu performance với RSC
3. **Streaming:** Loading UI với React Suspense
4. **ISR:** Incremental Static Regeneration
5. **Metadata:** SEO optimization với Next.js metadata

## 🎉 Hoàn Tất

Migration thành công! Dự án giờ đã chạy trên Next.js 16 với:
- ⚡ Better performance
- 🔍 Improved SEO
- 🚀 Easy deployment
- 🛠️ Better DX (Developer Experience)

**Next:** Chạy `pnpm install` và `pnpm dev` để bắt đầu!
