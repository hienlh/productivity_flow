# 🌐 Hướng dẫn Cấu hình Proxy cho Zalo OAuth

Tài liệu này hướng dẫn cách khắc phục lỗi chặn IP từ Zalo khi deploy ứng dụng lên server nước ngoài (như Vercel, AWS, DigitalOcean...).

## ❌ Vấn đề

Khi gọi Zalo Graph API (`https://graph.zalo.me/v2.0/me`) từ server đặt tại nước ngoài (ví dụ Vercel ở Mỹ), bạn sẽ gặp lỗi sau:

```json
{
  "error": -501,
  "message": "Personal information is limited due to IP address not inside Vietnam: 3.237.106.146"
}
```

**Nguyên nhân:** Zalo chặn các request lấy thông tin cá nhân (tên, ảnh, email) nếu IP nguồn không thuộc lãnh thổ Việt Nam.

## ✅ Giải pháp: Sử dụng HTTP Proxy Việt Nam

Chúng ta sẽ định tuyến các request gọi đến Zalo API đi qua một Proxy Server có IP tại Việt Nam.

### 🛠️ Các bước thực hiện

#### 1. Chuẩn bị Proxy

Bạn cần mua hoặc thuê một HTTP/HTTPS Proxy có IP Việt Nam.
*   **Format:** `http://username:password@ip:port`
*   **Nhà cung cấp tham khảo:** Tinsoft, TMProxy, v.v.

#### 2. Cài đặt thư viện `undici`

Thư viện này hỗ trợ cấu hình Proxy Agent cho `fetch` trong môi trường Node.js.

```bash
npm install undici
```

#### 3. Cấu hình Biến môi trường

Thêm vào `.env.local` (và Environment Variables trên Vercel):

```bash
# Thay thế bằng thông tin proxy của bạn
ZALO_PROXY_URL=http://username:password@103.1.2.3:8080
```

#### 4. Tạo Utility Function

Tạo file `src/lib/proxy.ts`:

```typescript
import { ProxyAgent } from 'undici';

export function getProxyOptions() {
  const proxyUrl = process.env.ZALO_PROXY_URL;

  if (proxyUrl) {
    console.log('🌐 Using Proxy for Zalo API');
    // undici ProxyAgent xử lý việc routing request qua proxy
    const dispatcher = new ProxyAgent(proxyUrl);
    return { dispatcher };
  }

  return {};
}
```

#### 5. Cập nhật API Route

Sửa file `src/app/api/auth/zalo/userinfo/route.ts`:

```typescript
import { getProxyOptions } from '@/lib/proxy';

// ... bên trong hàm GET ...

    // Lấy options proxy (nếu có cấu hình)
    const proxyOptions = getProxyOptions();
    
    // Gọi Zalo API với proxy agent
    const userInfoResponse = await fetch('https://graph.zalo.me/v2.0/me?fields=id,name,picture', {
      method: 'GET',
      headers: {
        'access_token': accessToken,
      },
      ...proxyOptions, // Inject dispatcher vào fetch options
    });

// ...
```

## ⚠️ Lưu ý quan trọng

1.  **Chi phí & Tốc độ:** Proxy thường có giới hạn băng thông hoặc tốc độ chậm hơn direct connection. Hãy chọn nhà cung cấp uy tín.
2.  **Bảo mật:** Tuyệt đối không commit `ZALO_PROXY_URL` lên git. Luôn dùng biến môi trường.
3.  **Chỉ dùng cho User Info:** Thường chỉ endpoint lấy thông tin user (`graph.zalo.me`) mới bị chặn IP. Các endpoint đổi token (`oauth.zaloapp.com`) thường không bị chặn, nhưng nếu gặp lỗi tương tự, bạn cũng có thể áp dụng proxy cho `token/route.ts`.

---
**Status:** 📝 Drafted. Ready to implement when Proxy is available.
