# Coding Standards & Architecture Rules

## 1. JavaScript & Module Conventions
- **Strict Mode**: Luôn sử dụng `'use strict';` ở đầu mỗi file module backend.
- **Async / Await**: Ưu tiên sử dụng cú pháp `async/await` thay cho callback lồng nhau. Luôn bọc các hàm bất đồng bộ trong khối `try/catch`.
- **Controllers & Models**:
  - Không viết trực tiếp các câu lệnh truy vấn MongoDB phức tạp trong `routes/` hay view template EJS.
  - Phân tách rõ ràng: Route chỉ làm nhiệm vụ map HTTP endpoint tới phương thức của Controller.
  - Controller tiếp nhận request, validate dữ liệu, gọi Model hoặc Service helper, sau đó render view hoặc trả về JSON.
- **View Models / DTOs**:
  - Khi truyền dữ liệu sang EJS view, luôn sử dụng các lớp chuẩn hóa như `ResonposeDataClient` hoặc `ResonposeDataAdmin` để đảm bảo các thuộc tính mặc định không bị `undefined` gây vỡ giao diện.

## 2. Naming Conventions
- Tên biến và thuộc tính đối tượng: Sử dụng `camelCase` (ví dụ: `listPosts`, `popularArticle`, `currentPage`).
- Tên Model Mongoose: Đặt tên file theo dạng `{name}Model.js` (ví dụ: `blogModel.js`, `tagsModel.js`).
- Tên Route: Sử dụng `kebab-case` cho URL (ví dụ: `/add-post`, `/edit-tag/:id`, `/tree-story`).

## 3. Error Handling
- Trong các controller phía client, khi bắt lỗi bất thường (database disconnect, query lỗi), ghi log chi tiết bằng `console.error` và chuyển hướng người dùng an toàn về `/page-404` thay vì để crash server hoặc lộ stack trace.
- Trong các API endpoint JSON, luôn trả về cấu trúc thống nhất: `{ success: boolean, message: string, data?: any, error?: string }` kèm mã HTTP Status code phù hợp (400, 401, 404, 500).

