# Hướng Dẫn & Quy Tắc Dành Cho AI Agents (Agent Working Instructions)

Tài liệu này là cẩm nang hướng dẫn bắt buộc dành cho mọi AI Agent (và kỹ sư phát triển) khi đọc, phân tích, đề xuất giải pháp hoặc chỉnh sửa mã nguồn trong repository **Blog Express App**.

---

## 1. Bản Đồ Tài Liệu Kiến Trúc (Architecture Documentation Index)

Trước khi thực hiện bất kỳ thay đổi nào liên quan đến logic, cấu trúc cơ sở dữ liệu hay giao diện, Agent **bắt buộc phải tham khảo tài liệu chuyên sâu** trong thư mục [docs/architecture/](file:///d:/Project/Personal/Blog_Express_App/docs/architecture/):

| Tài liệu | Đường dẫn tệp tin | Mục đích & Nội dung chính |
| :--- | :--- | :--- |
| **Tổng quan kiến trúc** | [overview.md](file:///d:/Project/Personal/Blog_Express_App/docs/architecture/overview.md) | Kiến trúc tổng thể, sơ đồ khối Mermaid, công nghệ, cấu trúc thư mục |
| **Kiến trúc Frontend** | [frontend.md](file:///d:/Project/Personal/Blog_Express_App/docs/architecture/frontend.md) | Hệ thống EJS Layouts, View Models, Module JS client (Search, Carousel, Common) |
| **Kiến trúc Backend** | [backend.md](file:///d:/Project/Personal/Blog_Express_App/docs/architecture/backend.md) | Express pipeline, chuỗi middleware, chi tiết controller, bảo mật và phân quyền |
| **Đặc tả Routes & API** | [api-reference.md](file:///d:/Project/Personal/Blog_Express_App/docs/architecture/api-reference.md) | Danh mục chi tiết toàn bộ các route client, admin, api json và flmngr |
| **Lược đồ CSDL** | [data-model.md](file:///d:/Project/Personal/Blog_Express_App/docs/architecture/data-model.md) | Mongoose schemas, collections, indexes, quan hệ thực thể (ER diagram) |
| **Truy vết Nghiệp vụ** | [business-flows.md](file:///d:/Project/Personal/Blog_Express_App/docs/architecture/business-flows.md) | Luồng nghiệp vụ end-to-end: Tìm kiếm, Tạo bài, Tạo Love project, Đăng nhập |
| **Hướng dẫn Vận hành** | [setup-guide.md](file:///d:/Project/Personal/Blog_Express_App/docs/architecture/setup-guide.md) | Yêu cầu Node 18, NVM, cấu hình .env, chạy dev/prod, PM2, lưu ý về Sass |

---

## 2. Các Quy Tắc Bất Biến (Architectural Invariants)

Khi thực thi công việc trong repository này, Agent phải tuân thủ nghiêm ngặt các nguyên tắc sau:

1. **Phiên bản Runtime**:
   - Dự án yêu cầu **Node.js 18.x** (`"engines": { "node": "18.x" }`).
   - Tuyệt đối không thay đổi mã nguồn (như hạ cấp cú pháp `?.`) để tương thích với các phiên bản Node cũ đã hết hạn hỗ trợ (End of Life).
2. **Quy tắc Bảo mật & Xác thực**:
   - Tuyệt đối không lưu mật khẩu người dùng ở dạng plain text. Khi sửa chức năng user/login, bắt buộc phải sử dụng mã hóa băm mật khẩu.
   - Định danh session đăng nhập là `req.session.account` (với cờ `loggedin === true`).
   - Mọi route thay đổi dữ liệu trong `/admin/*` đều phải được bảo vệ bởi middleware xác thực đăng nhập.
3. **Hiệu năng Truy vấn CSDL**:
   - Khi phân trang, bắt buộc dùng `Model.countDocuments(query)` thay cho `Model.find(query).length`.
4. **Không Sửa Đổi Tùy Tiện**:
   - Không tự ý commit, push lên remote, xóa dữ liệu hay cài thêm các dependency không được yêu cầu.
   - Giữ nguyên các ghi chú và comment giải thích có sẵn trong codebase.

---

## 3. Hệ Thống Quy Tắc Chuyên Sâu (.agents/rules/)

Để tiết kiệm context window và tăng tính chuyên biệt theo từng tác vụ, các quy tắc chi tiết được chia nhỏ thành các tệp tin chuyên đề:

- 📜 [Coding Standards](file:///d:/Project/Personal/Blog_Express_App/.agents/rules/coding-standards.md): Chuẩn viết mã JavaScript, async/await, view models và phân tầng MVC.
- 🔒 [Security & Access Control](file:///d:/Project/Personal/Blog_Express_App/.agents/rules/security.md): Quy định băm mật khẩu, session, bảo vệ route admin và kiểm duyệt file upload.
- 🗄️ [Database Rules](file:///d:/Project/Personal/Blog_Express_App/.agents/rules/database.md): Quy định thiết kế schema Mongoose, đánh index, tối ưu hóa phân trang và Singleton widget.
- 🚀 [Testing & Deployment](file:///d:/Project/Personal/Blog_Express_App/.agents/rules/testing-and-deployment.md): Quy định về biến môi trường, khởi chạy PM2 và bảo toàn dữ liệu.

---

## 4. Checklist Trước Khi Trả Lời Người Dùng / Triển Khai Code
- [ ] Đã đọc kỹ tài liệu kiến trúc liên quan trong `docs/architecture/` chưa?
- [ ] Thay đổi có phá vỡ cấu trúc MVC hoặc gây lỗi cú pháp trên Node 18 không?
- [ ] Route admin mới thêm có được bảo vệ bởi middleware kiểm tra session không?
- [ ] Câu lệnh đếm CSDL có dùng `countDocuments()` thay cho `find().length` không?
- [ ] Có phát sinh biến môi trường mới nào chưa được cập nhật vào `env.example` và `setup-guide.md` không?

