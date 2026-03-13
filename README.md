# Ts-Homework-Ex3

REST API server viết bằng TypeScript, xây dựng phục vụ mục đích học tập. Dự án triển khai nền tảng backend đa module sử dụng Express 5, MongoDB (native driver) và xác thực bằng JWT.

## Công nghệ sử dụng

| Hạng mục | Công nghệ |
|---|---|
| Ngôn ngữ | TypeScript (strict mode, ESNext) |
| Runtime | Node.js (ESM, `"type": "module"`) |
| Framework | Express 5.x |
| Cơ sở dữ liệu | MongoDB 7.x (native driver, không dùng ODM) |
| Xác thực | JWT (access token + refresh token) |
| Mã hóa mật khẩu | bcrypt (12 salt rounds) |
| Công cụ dev | `tsc --watch` + `node --watch` qua `concurrently` |

## Cấu trúc dự án

```
src/
├── index.ts              # Điểm khởi động: kết nối DB → tạo index → khởi động server
├── app.ts                # Khởi tạo Express app, đăng ký các route
├── config/env.ts         # Đọc và kiểm tra biến môi trường
├── database/
│   ├── mongo.ts          # MongoDB client singleton
│   └── indexes.ts        # Định nghĩa index các collection (chạy lúc khởi động)
├── middlewares/
│   ├── auth.middleware.ts    # Xác thực JWT Bearer + phân quyền theo role
│   └── error.middleware.ts   # Xử lý lỗi toàn cục
├── modules/
│   ├── user/             # Đã triển khai đầy đủ
│   ├── auth/             # Đã tạo khung, chưa triển khai
│   ├── chat/             # Đã tạo khung, chưa triển khai
│   └── product/          # Đã tạo khung, chưa triển khai
├── types/express.d.ts    # Mở rộng kiểu dữ liệu Express
└── utils/
    ├── crypto.ts         # Các hàm tiện ích bcrypt
    ├── http.ts           # Class ApiError + hàm ok() trả về response
    └── jwt.ts            # Ký và xác minh access token & refresh token
```

Mỗi module tuân theo kiến trúc 4 lớp: `routes → controller → service → database`.

## API Endpoints

### Health

| Method | Path | Mô tả |
|---|---|---|
| `GET` | `/health` | Kiểm tra trạng thái server — trả về `{ ok: true }` |

### Người dùng — `/api/users`

| Method | Path | Mô tả |
|---|---|---|
| `GET` | `/api/users/` | Lấy danh sách người dùng (tối đa 50) |
| `POST` | `/api/users/` | Tạo người dùng mới |
| `GET` | `/api/users/search?email=` | Tìm người dùng theo email |
| `GET` | `/api/users/:id` | Tìm người dùng theo MongoDB ObjectId |
| `PUT` | `/api/users/:id` | Cập nhật người dùng theo ObjectId |
| `DELETE` | `/api/users/:id` | Xóa người dùng theo ObjectId |

> Các route của module `auth`, `chat` và `product` đã được tạo khung nhưng chưa triển khai.

## Mô hình dữ liệu

### Collection `users`

```ts
{
  email: string;          // duy nhất (unique)
  passwordHash: string;
  role: "customer" | "admin";
  createdAt: Date;
  updatedAt: Date;
}
```

### Collection `refresh_token`

```ts
{
  userId: ObjectId;
  tokenId: string;
  issuedAt: Date;
  expiresAt: Date;
  revokedAt?: Date;
  replacedByTokenId?: string;
  userAgent?: string;
  ip?: string;
}
```

## Hướng dẫn cài đặt

### 1. Cài đặt dependencies

```bash
npm install
```

### 2. Cấu hình biến môi trường

Sao chép file `.env.example` thành `.env` và điền các giá trị cần thiết:

```bash
cp .env.example .env
```

| Biến | Bắt buộc | Mặc định | Mô tả |
|---|---|---|---|
| `NODE_ENV` | Không | `development` | Môi trường chạy |
| `PORT` | Không | `9999` | Cổng HTTP server |
| `MONGODB_URI` | **Có** | — | URI kết nối MongoDB |
| `MONGODB_DB` | **Có** | — | Tên database MongoDB |
| `JWT_ACCESS_SECRET` | **Có** | — | Secret dùng để ký access token |
| `JWT_REFRESH_SECRET` | **Có** | — | Secret dùng để ký refresh token |
| `ACCESS_TOKEN_TTL_SECONDS` | Không | `3600` | Thời gian sống của access token (giây) |
| `REFRESH_TOKEN_TTL_SECONDS` | Không | `72000` | Thời gian sống của refresh token (giây) |
| `REFRESH_COOKIE_NAME` | Không | `rt` | Tên cookie lưu refresh token |

### 3. Chạy ở chế độ development

```bash
npm run dev
```

Lệnh này sẽ biên dịch TypeScript ở chế độ watch và tự động khởi động lại Node khi có thay đổi. Server lắng nghe ở cổng `9999` theo mặc định.

## Trạng thái triển khai

| Module | Trạng thái |
|---|---|
| User CRUD | Hoàn thành |
| Auth (đăng nhập, làm mới token, đăng xuất) | Đã tạo khung, chưa triển khai |
| Product | Đã tạo khung, chưa triển khai |
| Chat | Đã tạo khung, chưa triển khai |
| JWT middleware | Hoàn thành (chưa gắn vào route) |
