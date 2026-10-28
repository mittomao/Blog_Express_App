# Database & Mongoose Rules

## 1. Truy vấn và Phân trang (Pagination & Query Performance)
- **Đếm số lượng bản ghi**: Tuyệt đối không sử dụng `find(query)` rồi lấy `length` của mảng kết quả để tính tổng số trang. Việc này tải toàn bộ documents vào RAM gây cạn kiệt bộ nhớ. Bắt buộc sử dụng:
  ```javascript
  const totalItems = await blogModel.countDocuments(query);
  ```
- **Chỉ mục (Indexes)**: Khi thêm các trường mới thường xuyên dùng để lọc (`topic`, `status`, `author`, `createdAt`), phải khai báo index tương ứng trong Mongoose Schema để tối ưu hóa truy vấn MongoDB.

## 2. Quản lý Thẻ Tag & Tính nhất quán (Tag Consistency)
- Trường `name` trong `tagsModel` đại diện cho tên định danh của thẻ. Cần đảm bảo tính duy nhất và không phân biệt hoa thường nếu cần.
- Khi cập nhật số lượng bài viết (`quantity`) qua `Func_Increment_Quantity` hoặc `Func_Decrement_Quantity`, hãy đảm bảo giá trị `quantity` không bị giảm xuống dưới 0 (`Math.max(0, quantity)` hoặc kiểm tra query `$gte: 0`).

## 3. Mô hình Cấu hình Đơn lẻ vị thế (Component Singletons)
- Các widget trang chủ (`about-author`, `newsletter`, `popular-articles`, `portfolio`) chỉ duy trì **duy nhất 1 bản ghi**.
- Luôn sử dụng cú pháp:
  ```javascript
  model.findOneAndUpdate({}, updateData, { upsert: true, new: true, runValidators: true });
  ```
  để tránh sinh ra nhiều bản ghi dư thừa trong collection.

## 4. Timestamps
- Tất cả các Schema Mongoose đều phải kích hoạt tùy chọn `{ timestamps: true }` để tự động duy trì 2 mốc thời gian `createdAt` và `updatedAt`.

