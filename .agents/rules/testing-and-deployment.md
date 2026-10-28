# Testing & Deployment Rules

## 1. Môi trường Node.js (Node Engine Constraints)
- Phiên bản Node.js tối thiểu để chạy dự án là **18.x**.
- Tuyệt đối không hạ cấp cú pháp trong code (như gỡ bỏ optional chaining `?.`) để phục vụ các phiên bản Node cũ lỗi thời (Node 10/12/14). Thay vào đó, môi trường thực thi máy chủ phải nâng cấp lên Node 18 LTS (`nvm use 18.14.0`).

## 2. Quản lý Biến Môi trường (Environment Variables)
- Không bao giờ commit file `.env` chứa thông tin nhạy cảm vào Git repository.
- Khi bổ sung một biến môi trường mới (ví dụ biến liên quan đến email SMTP, Redis, OAuth), bắt buộc phải cập nhật file mẫu `env.example` và tài liệu kiến trúc liên quan.

## 3. Vận hành Production với PM2
- Trong môi trường sản xuất, ứng dụng được khởi chạy thông qua `ecosystem.config.js`.
- Không hardcode các cổng mạng (ports) hoặc chuỗi kết nối trực tiếp trong mã nguồn; luôn đọc thông qua `process.env`.
- Cấu hình port mặc định khi không có biến môi trường là `9000`.

## 4. Kiểm tra An toàn trước khi Thay đổi
- Tuyệt đối không chạy các lệnh có khả năng phá hủy dữ liệu (như xóa thư mục, drop collection, reset database).
- Trước khi thực hiện refactoring hoặc cập nhật logic, cần xác minh các luồng end-to-end liên quan được ghi nhận trong `docs/architecture/business-flows.md`.

