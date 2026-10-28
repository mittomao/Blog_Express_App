# Kế Hoạch Kiểm Thử Hồi Quy Giao Diện Admin (Regression Test Plan)

Tài liệu này xác định kịch bản kiểm thử hồi quy (Regression Testing) toàn diện nhằm đảm bảo quá trình thiết kế lại giao diện Admin CMS không làm gián đoạn bất kỳ nghiệp vụ, luồng dữ liệu hoặc tích hợp bên thứ ba nào; đồng thời xác minh tính năng **Light/Dark Mode** và việc **loại bỏ trang Đăng ký**.

---

## 1. Phạm Vi & Điều Kiện Tiên Quyết (Scope & Prerequisites)

### 1.1. Phạm vi kiểm thử
- **Bao gồm**:
  - Toàn bộ giao diện Admin: Đăng nhập, Dashboard danh sách bài viết, Thêm/Sửa/Xóa bài viết, Quản lý Tag, Quản lý Widget Component, Thư viện ảnh Media.
  - Tính năng Light/Dark mode: Chuyển đổi giao diện, lưu trạng thái vào `localStorage`, không bị chớp sáng (FOUC).
  - Xác minh việc xóa bỏ: Trang `/admin/register` không còn truy cập được, không còn link đăng ký trên form đăng nhập.
  - Các tích hợp client: TinyMCE WYSIWYG, Flmngr File Manager, Select2 Multi-select, Highlight.js, Clipboard API.
  - Kiểm tra tính nguyên vẹn của giao diện người dùng công khai (Client Blog).
- **Môi trường yêu cầu**:
  - Node.js 18.x (`nvm use 18.14.0`).
  - MongoDB đang hoạt động và kết nối thành công.
  - Biến môi trường `.env` có đầy đủ thông tin `CLOUDINARY_*` và `FLMNGR_KEY`.

---

## 2. Ma Trận Kịch Bản Kiểm Thử Chi Tiết (Regression Test Matrix)

| Mã ca (ID) | Tên ca kiểm thử | Các bước thực hiện | Kết quả kỳ vọng | Độ nghiêm trọng |
| :--- | :--- | :--- | :--- | :---: |
| **TC-AUTH-01** | Đăng nhập tài khoản hợp lệ | 1. Truy cập `/admin/login`<br/>2. Nhập username & password đúng<br/>3. Bấm Submit | - Chuyển hướng thành công về `/admin`<br/>- Header và Sidebar hiển thị avatar và username của tài khoản | 🔴 **Blocker** |
| **TC-AUTH-02** | Đăng nhập sai thông tin | 1. Truy cập `/admin/login`<br/>2. Nhập sai username hoặc password<br/>3. Bấm Submit | - Hệ thống không cho đăng nhập<br/>- Hiển thị thông báo lỗi rõ ràng trên UI, không crash server | 🔴 **Critical** |
| **TC-AUTH-03** | Đăng xuất phiên làm việc | 1. Bấm nút "Logout" trên thanh điều hướng Sidebar | - Session bị hủy<br/>- Người dùng được chuyển hướng về `/admin/login` | 🔴 **Critical** |
| **TC-AUTH-04** | Xác minh xóa bỏ trang Đăng ký | 1. Mở trang `/admin/login`<br/>2. Kiểm tra xem có còn dòng "Sign up now" hay không<br/>3. Thử gõ trực tiếp URL `/admin/register` trên thanh địa chỉ | - Không còn bất kỳ liên kết nào tới trang đăng ký trên màn hình đăng nhập<br/>- Truy cập `/admin/register` trả về mã lỗi 404 hoặc tự động chuyển hướng an toàn | 🔴 **Critical** |
| **TC-NAV-01** | Điều hướng & Responsive Sidebar | 1. Thử bấm lần lượt từng menu (Posts, Tags, Components, Media Library)<br/>2. Thu nhỏ màn hình xuống kích thước mobile (< 768px)<br/>3. Bấm nút Hamburger menu | - Chuyển đúng trang, menu tương ứng có trạng thái `active`<br/>- Trên mobile: Menu thu gọn thành drawer trượt mượt mà, bấm ngoài đóng menu | 🟡 **Major** |
| **TC-NAV-02** | Chuyển đổi Chế độ Sáng / Tối (Light/Dark Mode) | 1. Bấm nút Toggle theme (Icon Sun/Moon) trên Top Header hoặc Sidebar<br/>2. Quan sát toàn bộ các thành phần (bảng, form, card, sidebar)<br/>3. Reload lại trang (F5) | - Giao diện chuyển đổi tức thì giữa nền sáng và nền tối với độ tương phản văn bản chuẩn a11y<br/>- `localStorage` ghi nhận đúng `tablerTheme='dark'` hoặc `'light'`<br/>- Khi reload trang: theme được duy trì nguyên vẹn, **không xảy ra hiện tượng chớp nháy màu (No FOUC)** | 🔴 **Critical** |
| **TC-POST-01** | Xem bảng bài viết & Phân trang | 1. Truy cập `/admin`<br/>2. Quan sát bảng danh sách bài viết<br/>3. Bấm chuyển sang trang 2 (`/admin/p/2`) | - Bảng hiển thị đầy đủ các cột: No, Author, Tag, Title, Topic, Summary, Status, Date, Actions<br/>- Trạng thái online/offline có badge màu rõ nét trên cả 2 theme<br/>- Phân trang hoạt động chính xác | 🔴 **Critical** |
| **TC-POST-02** | Tạo bài viết mới thành công | 1. Bấm "+ Create" hoặc vào `/admin/add-post`<br/>2. Chọn 2 tags qua Select2<br/>3. Nhập Title, Topic, Summary<br/>4. Bấm "Select image..." qua Flmngr để chọn ảnh<br/>5. Soạn thảo văn bản trong TinyMCE<br/>6. Chọn Status: Show<br/>7. Bấm Create | - Bài viết được tạo thành công trong MongoDB<br/>- Chuyển hướng về `/admin`<br/>- Bài viết mới xuất hiện ở đầu bảng danh sách<br/>- Số lượng (`quantity`) của 2 thẻ tag tương ứng được cộng thêm 1 | 🔴 **Blocker** |
| **TC-POST-03** | Chỉnh sửa bài viết cũ | 1. Tại bài viết bất kỳ, bấm nút Sửa (Icon Pencil)<br/>2. Kiểm tra dữ liệu cũ có được điền sẵn đầy đủ không<br/>3. Thay đổi tiêu đề và nội dung<br/>4. Bấm Update | - Dữ liệu cũ được prefill chính xác vào form<br/>- Bấm Update lưu thành công và chuyển hướng về `/admin`<br/>- Tiêu đề mới được cập nhật trên bảng | 🔴 **Critical** |
| **TC-POST-04** | Xóa bài viết | 1. Bấm nút Xóa (Icon Trash) tại một dòng bài viết<br/>2. Khi popup hỏi xác nhận xuất hiện, bấm Cancel<br/>3. Bấm lại nút Xóa, lần này chọn OK | - Chọn Cancel: Bài viết không bị xóa<br/>- Chọn OK: Form POST gửi tới `/admin/delete-post?id=...`<br/>- Bài viết bị xóa khỏi CSDL và biến mất khỏi bảng<br/>- Số lượng thẻ tag giảm đi 1 | 🔴 **Critical** |
| **TC-TAG-01** | Xem danh sách thẻ tag | 1. Truy cập `/admin/tag` | - Bảng hiển thị danh sách thẻ: Name, Quantity, Prioritize, Created Date, Actions<br/>- Mức ưu tiên hiển thị badge Primary / Secondary | 🟡 **Major** |
| **TC-TAG-02** | Thêm mới thẻ tag | 1. Vào `/admin/add-tag`<br/>2. Nhập Name: "Docker Test", chọn Prioritize: Primary<br/>3. Bấm Create | - Thẻ tag mới xuất hiện trong bảng `/admin/tag`<br/>- Xuất hiện trong danh sách lựa chọn của Select2 ở form thêm bài viết | 🔴 **Critical** |
| **TC-TAG-03** | Sửa & Xóa thẻ tag | 1. Vào `/admin/edit-tag/:id`, đổi tên tag và bấm Update<br/>2. Bấm nút Xóa thẻ tag và xác nhận | - Sửa lưu thành công vào CSDL<br/>- Xóa thẻ tag thành công và redirect về `/admin/tag` | 🔴 **Critical** |
| **TC-COMP-01**| Quản lý Widget Component | 1. Vào menu Components -> Chọn "Newsletter"<br/>2. Quan sát khối Live Preview và khối Highlight Code<br/>3. Sửa Title, Description, chọn ảnh nền<br/>4. Bấm Update | - Khối Live Preview và Code Highlight hiển thị chuẩn<br/>- Form POST lưu thành công vào CSDL (`newsletterModel`) theo cơ chế `upsert`<br/>- Trang blog người dùng ngoài trang chủ phản ánh đúng nội dung mới | 🔴 **Critical** |
| **TC-MEDIA-01**| Thư viện ảnh Cloudinary | 1. Truy cập `/admin/media-library`<br/>2. Quan sát lưới ảnh từ Cloudinary<br/>3. Bấm nút Copy URL (Icon Save/Copy) trên một ảnh | - Lưới ảnh hiển thị đầy đủ, không bị vỡ hình<br/>- Bấm Copy hiển thị thông báo thành công và clipboard máy nhận đúng link ảnh | 🟡 **Major** |
| **TC-CLIENT-01**| Kiểm tra tính nguyên vẹn của Client Blog | 1. Mở trang chủ `/`<br/>2. Mở chi tiết 1 bài viết `/post/:id`<br/>3. Thử tìm kiếm bài viết `/search/react`<br/>4. Mở 1 trang tương tác `/projects/tree-story` | - Giao diện blog phía client không bị ảnh hưởng style<br/>- Không có lỗi JavaScript runtime trên console | 🔴 **Blocker** |

---

## 3. Tiêu Chuẩn Phân Loại Lỗi (Defect Severity Classification)

| Mức độ | Định nghĩa & Tiêu chuẩn xử lý | Ví dụ điển hình |
| :--- | :--- | :--- |
| 🔴 **Blocker (P0)** | Không thể thực hiện nghiệp vụ cốt lõi; hệ thống crash hoặc mất dữ liệu. Phải sửa ngay trước khi chuyển giai đoạn. | Không thể đăng nhập; không lưu được bài viết mới; mất sạch bài viết trong CSDL. |
| 🔴 **Critical (P1)** | Một tính năng chính bị hỏng nhưng có giải pháp thay thế tạm thời. Phải xử lý trước khi kết thúc giai đoạn. | Nút Xóa bài không kích hoạt; TinyMCE không gõ được chữ; chế độ Dark mode bị lỗi chớp trắng liên tục. |
| 🟡 **Major (P2)** | Lỗi giao diện nghiêm trọng hoặc một tính năng phụ không hoạt động đúng. | Bảng bị tràn màn hình trên mobile; thanh phân trang bị lệch vị trí; icon theme toggle không đổi hình. |
| 🟢 **Minor (P3)** | Lỗi nhỏ về thẩm mỹ, khoảng cách, căn lề hoặc typography. | Khoảng cách margin/padding chưa đều; màu border ở dark mode hơi chói. |

---

## 4. Báo Cáo Nghiệm Thu & Tiêu Chí Đạt (Exit Criteria)
Một giai đoạn được coi là hoàn tất khi:
1. **0 lỗi Blocker (P0) và 0 lỗi Critical (P1)** còn tồn đọng.
2. Tất cả các test cases liên quan trong ma trận đều có kết quả **PASS**.
3. Được xác nhận và phê duyệt từ Tech Lead / Senior Architect trước khi hợp nhất.
