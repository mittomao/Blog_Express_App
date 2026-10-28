# Security & Access Control Rules

## 1. Lưu trữ và Xác thực Mật khẩu (Password Hashing)
- **Cấm lưu mật khẩu plain-text**: Tuyệt đối không lưu hoặc so sánh mật khẩu dạng văn bản thuần trong CSDL.
- Khi triển khai tính năng đăng ký/đổi mật khẩu, bắt buộc sử dụng thuật toán băm an toàn với salt (ví dụ: `bcrypt` hoặc `argon2`).
- Nếu sử dụng thư viện `md5` có sẵn trong `package.json`, bắt buộc phải kết hợp chuỗi salt bí mật và kế hoạch nâng cấp lên `bcrypt`.

## 2. Quản lý Phiên (Session Invariants)
- Đối tượng lưu trữ phiên đăng nhập quản trị viên được chuẩn hóa là `req.session.account`.
- Thuộc tính xác nhận đăng nhập là `req.session.account.loggedin === true`.
- Không tạo biến thể hoặc cấu trúc phân nhánh khác như `req.session.user` gây mất đồng bộ với middleware.
- Khuyến nghị nâng cấp Session Store từ In-Memory sang Redis Store (`connect-redis`) hoặc MongoDB Store (`connect-mongo`) khi chạy môi trường phân tán/PM2 cluster.

## 3. Bảo vệ Tuyến đường Quản trị (Admin Route Protection)
- **Tất cả các route trong `/admin/*`** làm thay đổi trạng thái hệ thống (`POST /add-post`, `POST /update-post`, `POST /delete-post`, `POST /add-tag`, `POST /update-tag`, `POST /delete-tag`, `POST /components/*`) **bắt buộc phải đi qua middleware kiểm tra đăng nhập** trước khi thực thi controller.
- Không để tồn tại các route POST/DELETE mở công khai trên namespace `/admin`.

## 4. Kiểm soát Tải tệp tin (File Upload Validation)
- Chỉ cho phép các định dạng ảnh hợp lệ: `['image/jpg', 'image/jpeg', 'image/png', 'image/gif']`.
- Giới hạn dung lượng tệp tin tải lên tối đa là `10MB` cho mỗi request.
- Số lượng tệp tải lên đồng thời không vượt quá `10` ảnh (`upload.array('images', 10)`).
- Xử lý triệt để mã lỗi Multer: `LIMIT_FILE_SIZE`, `LIMIT_FILE_COUNT` và thông báo lỗi thân thiện cho người dùng.

