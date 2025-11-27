# Migration Guide: Vite + React → Next.js 16

Dự án đã được chuyển đổi từ Vite + React sang Next.js 16 với App Router.

## Những Thay Đổi Chính

### 1. Cấu Trúc Thư Mục

**Trước (Vite):**
```
/
├── components/
├── contexts/
├── i18n/
├── services/
├── types.ts
├── App.tsx
├── index.tsx
├── index.html
└── vite.config.ts
```

**Sau (Next.js):**
```
/
├── src/
│   ├── app/              # Next.js App Router
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/       # Client Components
│   ├── contexts/
│   ├── i18n/
│   └── lib/
│       ├── convex.ts
│       ├── types.ts
│       └── services/
├── convex/              # Convex backend (không đổi)
├── middleware.ts        # Clerk middleware
└── next.config.js
```

### 2. Dependencies

**Đã Thay Đổi:**
- `@clerk/clerk-react` → `@clerk/nextjs`
- `vite` → `next`
- `@vitejs/plugin-react` → (không cần thiết)

**Đã Thêm:**
- `autoprefixer`, `postcss`, `tailwindcss` (cho Next.js)
- `eslint`, `eslint-config-next`

### 3. Scripts

**Trước:**
```json
{
  "dev": "vite",
  "build": "npx convex deploy && vite build"
}
```

**Sau:**
```json
{
  "dev": "next dev",
  "build": "npx convex deploy && next build",
  "start": "next start",
  "lint": "next lint"
}
```

### 4. Environment Variables

**Trước (Vite):**
- `VITE_CONVEX_URL`
- `VITE_CLERK_PUBLISHABLE_KEY`

**Sau (Next.js):**
- `NEXT_PUBLIC_CONVEX_URL`
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
- `CLERK_SECRET_KEY`
- `CONVEX_DEPLOYMENT`

**⚠️ LƯU Ý:** Bạn cần cập nhật file `.env.local` với các biến môi trường mới.

### 5. Components

Tất cả components đã được thêm directive `'use client'` ở đầu file vì chúng sử dụng React hooks và browser APIs.

**Ví dụ:**
```tsx
'use client';

import React, { useState } from 'react';
// ... rest of component
```

### 6. Import Paths

**Trước:**
```tsx
import { Task } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
```

**Sau:**
```tsx
import { Task } from '@/lib/types';
import { useLanguage } from '@/contexts/LanguageContext';
```

Đường dẫn `@/` được cấu hình trong `tsconfig.json` để trỏ đến thư mục `src/`.

### 7. Authentication

**Trước (Vite):**
```tsx
import { ClerkProvider, useUser } from '@clerk/clerk-react';
import { ConvexProviderWithClerk } from 'convex/react-clerk';

// Setup ở index.tsx
```

**Sau (Next.js):**
```tsx
// middleware.ts - Xử lý authentication tự động
import { clerkMiddleware } from '@clerk/nextjs/server';

// src/lib/convex.ts - Provider setup
import { ClerkProvider, useAuth } from '@clerk/nextjs';

// Components
import { useUser } from '@clerk/nextjs';
```

### 8. Styling

**Trước:**
- Tailwind CSS qua CDN trong `index.html`
- Custom styles trong `index.html`

**Sau:**
- Tailwind CSS được cài đặt như dependency
- Global styles trong `src/app/globals.css`
- Configuration trong `tailwind.config.js` và `postcss.config.js`

## Các Bước Để Chạy Dự Án

### 1. Cài Đặt Dependencies Mới

```bash
# Xóa node_modules và lock files cũ (tùy chọn)
rm -rf node_modules pnpm-lock.yaml

# Cài đặt lại
pnpm install
```

### 2. Cập Nhật Environment Variables

Sao chép file mẫu và cập nhật với thông tin của bạn:

```bash
cp .env.local.example .env.local
```

Chỉnh sửa `.env.local`:
```env
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
CONVEX_DEPLOYMENT=your-deployment-name
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

### 3. Khởi Động Convex

```bash
npx convex dev
```

### 4. Chạy Development Server

```bash
pnpm dev
```

Mở [http://localhost:3000](http://localhost:3000)

## Tính Năng Mới

### 1. Server-Side Rendering (SSR)
Next.js hỗ trợ SSR out-of-the-box, giúp cải thiện SEO và performance.

### 2. API Routes
Có thể thêm API routes trong `src/app/api/` nếu cần.

### 3. Middleware
Clerk middleware tự động bảo vệ routes và xử lý authentication.

### 4. Optimized Images
Có thể sử dụng `next/image` component cho tối ưu hóa hình ảnh.

### 5. Font Optimization
Next.js tự động tối ưu hóa fonts (đã dùng `next/font` cho Inter).

## Breaking Changes

### 1. localStorage
`localStorage` chỉ hoạt động trong Client Components (đã có `'use client'`).

### 2. Browser APIs
Tất cả browser APIs (như `window`, `document`, `navigator`) chỉ hoạt động trong Client Components.

### 3. React Hooks
Hooks như `useState`, `useEffect` chỉ hoạt động trong Client Components.

## Troubleshooting

### Lỗi: "You're importing a component that needs X"
**Giải pháp:** Thêm `'use client'` ở đầu file component.

### Lỗi: "Module not found"
**Giải pháp:** 
- Kiểm tra import paths (sử dụng `@/` thay vì relative paths)
- Chạy `pnpm install` lại

### Lỗi: Environment variables không hoạt động
**Giải pháp:**
- Đảm bảo các biến cho client bắt đầu với `NEXT_PUBLIC_`
- Restart development server sau khi thay đổi `.env.local`

### Lỗi: Clerk authentication không hoạt động
**Giải pháp:**
- Kiểm tra `middleware.ts` đã được cấu hình đúng
- Xác nhận `CLERK_SECRET_KEY` đã được set trong `.env.local`

## Deployment

### Vercel (Khuyến nghị)

1. Push code lên GitHub
2. Import repository trong [Vercel](https://vercel.com)
3. Thêm environment variables
4. Deploy

Vercel tự động detect Next.js và cấu hình tối ưu.

### Các Platform Khác

Next.js có thể deploy lên bất kỳ platform nào hỗ trợ Node.js:
- Netlify
- AWS Amplify
- Railway
- DigitalOcean App Platform
- etc.

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Clerk Next.js Integration](https://clerk.com/docs/quickstarts/nextjs)
- [Convex with Next.js](https://docs.convex.dev/client/react/nextjs)
- [Tailwind CSS Next.js Setup](https://tailwindcss.com/docs/guides/nextjs)

## Support

Nếu gặp vấn đề, vui lòng tạo issue trên GitHub repository.
