# Hướng Dẫn Cài Đặt & Vận Hành (Setup & Operation Guide)

Tài liệu này cung cấp hướng dẫn từng bước để thiết lập môi trường, cấu hình biến môi trường và vận hành dự án **Blog Express App** trong cả môi trường Phát triển (Development) và Sản xuất (Production).

---

## 1. Yêu cầu Tiên quyết (Prerequisites)

1. **Node.js**:
   - Yêu cầu phiên bản Node.js **18.x** (khuyến nghị `18.14.0` hoặc mới hơn).
   > [!IMPORTANT]
   > Mã nguồn sử dụng cú pháp **Optional Chaining** (`?.`) tại [controllers/indexController.js#L35](file:///d:/Project/Personal/Blog_Express_App/controllers/indexController.js#L35). Nếu chạy trên các phiên bản Node.js cũ (ví dụ Node 10/12), tiến trình sẽ báo lỗi cú pháp: `SyntaxError: Unexpected token '.'`.
   >
   > Nếu máy của bạn đang dùng NVM (Node Version Manager) và đang trỏ vào phiên bản thấp, hãy chuyển sang Node 18 trước khi chạy:
   > ```powershell
   > nvm use 18.14.0
   > ```
2. **MongoDB**:
   - Một máy chủ MongoDB cục bộ (Local instance trên port `27017`) hoặc một cụm dịch vụ MongoDB Atlas trên mây.
3. **Tài khoản Dịch vụ Bên ngoài**:
   - **Cloudinary**: Cần có tài khoản Cloudinary để lấy API Key, Secret và Cloud Name (dùng cho upload ảnh).
   - **Flmngr**: Key cho trình quản lý tệp tin TinyMCE (có thể dùng key mặc định `FLMNFLMN` cho môi trường dev).
   - **Sendinblue / SMTP** *(Tùy chọn)*: Cần thiết nếu muốn kích hoạt tính năng gửi email trong `mailController.js`.

---

## 2. Cấu hình Biến Môi trường (.env)

Tạo file `.env` tại thư mục gốc của dự án dựa trên mẫu `env.example`. Dưới đây là giải thích chi tiết toàn bộ các biến môi trường:

```env
# ==========================================
# CẤU HÌNH MÁY CHỦ & CSDL
# ==========================================
PORT=9000
MONGODB_URL=mongodb://localhost:27017/blog_express_db
PER_PAGE=6

# ==========================================
# TÀI NGUYÊN TĨNH & FILE MANAGER
# ==========================================
# Tiền tố đường dẫn ảnh (để trống hoặc đặt theo CDN/static path, vd: /images)
IMAGE_PREFIX=
FLMNGR_KEY=FLMNFLMN

# ==========================================
# DỊCH VỤ LƯU TRỮ ẢNH CLOUDINARY
# ==========================================
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_API_FOLDER=uploads

# ==========================================
# DỊCH VỤ EMAIL SMTP (Nếu kích hoạt mailController)
# ==========================================
EMAIL_SMTP_HOST=smtp-relay.brevo.com
EMAIL_SMTP_PORT=587
EMAIL_SMTP_USER=your_smtp_username
EMAIL_SMTP_PASS=your_smtp_password
EMAIL_FROM=no-reply@yourdomain.com
EMAIL_TO=admin@yourdomain.com
```

---

## 3. Cài đặt Thư viện Phụ thuộc (Dependencies)

Sau khi chuyển sang Node.js 18, thực hiện cài đặt các package:

```bash
npm install
```

> [!NOTE]
> Lệnh này sẽ cài đặt các dependencies chính như: `express`, `mongoose`, `ejs`, `cloudinary`, `multer`, `multer-storage-cloudinary`, `@flmngr/flmngr-server-node-express`, `nodemailer`, `sass`,...

---

## 4. Chạy Ứng Dụng (Running the Application)

### 4.1. Môi trường Phát triển (Development)
Chạy bằng `nodemon` để tự động khởi động lại máy chủ khi sửa code backend:

```bash
npm run dev
```
Truy cập vào ứng dụng qua trình duyệt: `http://localhost:9000`

### 4.2. Môi trường Sản xuất (Production)
Chạy trực tiếp qua Node.js:
```bash
npm start
```

Hoặc chạy nền với trình quản lý tiến trình **PM2** thông qua file cấu hình `ecosystem.config.js`:
```bash
# Cài đặt PM2 toàn cục (nếu chưa có)
npm install -g pm2

# Khởi chạy ứng dụng
pm2 start ecosystem.config.js

# Kiểm tra trạng thái
pm2 status

# Xem logs
pm2 logs Blog-App
```

---

## 5. Biên dịch CSS / Sass (Sass Watch / Build)

Trong `package.json` có script biên dịch SCSS:
```json
"sass": "sass --watch assets/css/:public/css/"
```

> [!WARNING]
> Thư mục `assets/` hiện không tồn tại ở thư mục gốc của repository. Các file SCSS nguồn thực tế đang nằm tại thư mục `public/css/components/` (`add-post.scss` và `blog-table.scss`).
>
> Để biên dịch đúng các file SCSS hiện có, bạn có thể chạy lệnh Sass trực tiếp trỏ vào thư mục components:
> ```bash
> npx sass --watch public/css/components/:public/css/components/
> ```

---

## 6. Kiểm tra & Xác minh Hoạt động (Health Checks)

1. **Giao diện Client**: Mở `http://localhost:9000` kiểm tra xem bài viết, thanh gợi ý tìm kiếm động và các widget có kết xuất đầy đủ hay không.
2. **Giao diện Admin**: Mở `http://localhost:9000/admin/login` để đăng nhập vào trang quản trị.
3. **Kiểm tra Upload Cloudinary**: Mở `http://localhost:9000/projects/form?project=tree-story`, thử tải lên 1 hình ảnh và kiểm tra xem ảnh có được upload thành công lên thư mục Cloudinary và hiển thị preview hay không.
4. **Kiểm tra File Manager (Flmngr)**: Trong trang thêm bài viết (`/admin/add-post`), kiểm tra xem TinyMCE có nạp plugin Flmngr để duyệt ảnh từ `./public/images` hay không.

