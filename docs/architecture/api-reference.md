# Tài Liệu Đặc Tả Tuyến Đường & API (API & Route Reference)

Tài liệu liệt kê toàn bộ các tuyến đường HTTP (Routes) và API được định nghĩa trong hệ thống, bao gồm các tham số đầu vào, định dạng dữ liệu và hành vi phản hồi.

---

## 1. Nhóm Tuyến Đường Client Blog & Trải Nghiệm Công Khai (Client Routes)
Gắn tại tiền tố: `/` (Định nghĩa trong [routes/client.js](file:///d:/Project/Personal/Blog_Express_App/routes/client.js))

### 1.1. Duyệt bài viết & Điều hướng chung
| Phương thức | Tuyến đường (URL) | Tham số (Params / Query) | Mô tả & Dữ liệu trả về |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Không | Trang chủ blog, hiển thị danh sách bài viết trang 1 và widget sidebar |
| `GET` | `/p/:page` | `page` (Number): số trang | Xem danh sách bài viết theo trang cụ thể |
| `GET` | `/post/:id` | `id` (String): ObjectId bài viết | Chi tiết bài viết, thông tin tác giả và danh mục 2 bài viết liên quan |
| `GET` | `/tag/:tag` | `tag` (String): tên thẻ tag | Danh sách bài viết được gán thẻ tag tương ứng |
| `GET` | `/topic/:title`| `title` (String): tên chủ đề | Danh sách bài viết theo chuyên mục topic |
| `POST` | `/search/:title`| `title` (String): từ khóa | Tìm kiếm bài viết theo tiêu đề (kết hợp phân trang qua req.params.page) |
| `GET` | `/portfolio` | Không | Trang hồ sơ cá nhân tác giả |
| `GET` | `/about` | Không | Trang giới thiệu về blog |
| `GET` | `/life` | Không | Trang chia sẻ góc cuộc sống |
| `GET` | `/contact` | Không | Trang liên hệ |
| `GET` | `/page-404` | Không | Trang báo lỗi không tìm thấy tài nguyên |
| `GET` | `*` | Bất kỳ | Bộ lọc vét (Wildcard): tự động redirect về `/page-404` |

---

### 1.2. Nhóm Dự án Tương tác Đa phương tiện (Interactive Love Projects)
| Phương thức | Tuyến đường (URL) | Tham số đầu vào | Xử lý & Dữ liệu trả về |
| :--- | :--- | :--- | :--- |
| `GET` | `/projects/form` | Query `?project=tree-story` hoặc `?project=merry-christmas` | Hiển thị form khởi tạo dự án đa phương tiện |
| `POST` | `/projects/tree-story` | `multipart/form-data`: `texts` (chuỗi ngăn cách dấu phẩy), `color`, `music`, `time`, `images` (Tối đa 10 tệp ảnh) | Upload ảnh lên Cloudinary, lưu vào CSDL `project-love`, redirect về `/projects/form/?project=tree-story&id={id}` |
| `GET` | `/projects/tree-story/preview` | Query `?id={ObjectId}` | Render trang hoạt họa cây tình yêu toàn màn hình (`preview-tree-story-page.ejs`) |
| `POST` | `/projects/merry-christmas` | `multipart/form-data`: `texts`, `color`, `music`, `time`, `images` (Tối đa 10 ảnh, kiểm tra lỗi size và count qua Multer) | Upload ảnh Cloudinary, tạo bản ghi `project-love`, redirect về `/projects/form/?project=merry-christmas&id={id}` |
| `GET` | `/projects/merry-christmas/preview` | Query `?id={ObjectId}` | Render giao diện hoạt họa giáng sinh (`preview-merry-christmas-page.ejs`) |
| `GET` | `/projects/qr-love` | Không | Hiển thị form tạo mã QR Love |
| `POST` | `/projects/qr-love` | `multipart/form-data`: `texts`, `color`, `music`, `images` | Lưu CSDL `qr-love`, redirect về `/projects/qr-love/?id={id}` |
| `GET` | `/projects/qr-love/preview` | Query `?id={ObjectId}` | Render trang xem trước QR Code tình yêu (`preview-qr-love-page.ejs`) |
| `GET` | `/projects/firework-love` | Không | Hiển thị form tạo hiệu ứng pháo hoa |
| `POST` | `/projects/firework-love` | `multipart/form-data`: `texts`, `music`, `images` | Lưu CSDL `firework-love`, redirect về `/projects/firework-love/?id={id}` |
| `GET` | `/projects/firework-love/preview` | Query `?id={ObjectId}` | Render trang hoạt họa pháo hoa (`preview-firework-love-page.ejs`) |

---

## 2. Nhóm Tuyến Đường Quản Trị Hệ Thống (Admin CMS Routes)
Gắn tại tiền tố: `/admin` (Định nghĩa trong [routes/index.js](file:///d:/Project/Personal/Blog_Express_App/routes/index.js))

### 2.1. Xác thực & Dashboard
| Phương thức | Tuyến đường (URL) | Body / Query | Hành vi phản hồi |
| :--- | :--- | :--- | :--- |
| `GET` | `/admin` | Không | Nếu đã đăng nhập (`session.account.loggedin`), render Dashboard bài viết. Nếu chưa, chuyển hướng về `/admin/login` |
| `GET` | `/admin/p/:page` | `page` (Number) | Phân trang danh sách bài viết trong bảng quản trị |
| `GET` | `/admin/login` | Không | Render trang đăng nhập quản trị (`login.ejs`) |
| `POST` | `/admin/login` | Body: `{ username, password }` | So sánh thông tin tài khoản; nếu hợp lệ, gán `req.session.account` và redirect về `/admin`. Nếu sai, trả thông báo lỗi |
| `GET` | `/admin/logout` | Không | Xóa session quản trị và redirect về `/admin/login` |

### 2.2. Quản lý Bài viết (Blog Post Management)
| Phương thức | Tuyến đường (URL) | Body / Query | Hành vi phản hồi |
| :--- | :--- | :--- | :--- |
| `GET` | `/admin/add-post` | Không | Render form thêm bài viết kèm danh sách thẻ tag |
| `POST` | `/admin/add-post` | Body: `{ title, tag, topic, summary, thumbnail, content, status }` | Tạo mới bài viết trong `blogModel`, tăng biến đếm thẻ tag trong `tagsModel`, redirect về `/admin` |
| `GET` | `/admin/edit-post/:id` | Param: `id` (ObjectId) | Render form cập nhật bài viết với dữ liệu hiện tại |
| `POST` | `/admin/update-post` | Query: `?id={ObjectId}`, Body: thông tin cập nhật | Cập nhật bản ghi bài viết trong CSDL, redirect về `/admin` |
| `POST` | `/admin/delete-post` | Query: `?id={ObjectId}` | Xóa bài viết, giảm biến đếm số lượng bài viết của thẻ tag tương ứng, redirect về `/admin` |

### 2.3. Quản lý Thẻ Tag (Tag Management)
| Phương thức | Tuyến đường (URL) | Body / Query | Hành vi phản hồi |
| :--- | :--- | :--- | :--- |
| `GET` | `/admin/tag` | Không | Xem bảng danh sách toàn bộ thẻ tag (Yêu cầu session) |
| `GET` | `/admin/add-tag` | Không | Render form tạo thẻ tag mới |
| `POST` | `/admin/add-tag` | Body: `{ name, prioritize }` | Tạo mới bản ghi thẻ trong `tagsModel`, redirect về `/admin/tag` |
| `GET` | `/admin/edit-tag/:id` | Param: `id` (ObjectId) | Render form sửa thông tin thẻ tag |
| `POST` | `/admin/update-tag` | Query: `?id={ObjectId}`, Body: dữ liệu thẻ | Cập nhật thẻ tag, redirect về `/admin/tag` |
| `POST` | `/admin/delete-tag` | Query: `?id={ObjectId}` | Xóa thẻ tag, redirect về `/admin/tag` |

### 2.4. Quản lý Widget & Media (Components & Upload)
| Phương thức | Tuyến đường (URL) | Body / Param | Hành vi phản hồi |
| :--- | :--- | :--- | :--- |
| `GET` | `/admin/components/:name` | Param: `name` (`about_author`, `newsletter`, `popular_articles`, `portfolio`) | Lấy dữ liệu cấu hình widget tương ứng và render form biên tập |
| `POST` | `/admin/components/:name` | Param: `name`, Body: các trường cấu hình | Thực hiện `upsert` cập nhật bản ghi widget, sau đó redirect lại trang component |
| `GET` | `/admin/media-library` | Không | Đọc danh sách ảnh đã tải lên từ Cloudinary API và hiển thị thư viện ảnh |

---

## 3. Nhóm REST API Endpoints
Gắn tại tiền tố: `/api` (Định nghĩa trong [routes/api.js](file:///d:/Project/Personal/Blog_Express_App/routes/api.js))

### 3.1. Lấy dữ liệu tĩnh tổng hợp
- **Tuyến đường**: `GET /api/datas`
- **Mô tả**: Trả về dữ liệu kinh nghiệm làm việc và danh mục dự án cá nhân được định nghĩa tĩnh trong thư mục `api/`.
- **Cấu trúc dữ liệu phản hồi (JSON Response)**:
```json
{
  "succes": true,
  "data": {
    "projects": {
      "settings": { "dots": false, "infinite": true, "slidesToShow": 3 },
      "cards": [
        {
          "name": "Natural landscape",
          "description": "...",
          "tags": [{ "name": "HTML", "color": "blue-text-gradient" }],
          "image": "./assets/nature.png",
          "source_code_link": "https://mittomao.github.io/Landing_01/"
        }
      ]
    },
    "experiences": [
      {
        "title": "KYBEROSC JOINT STOCK COMPANY",
        "company_name": "Fullstack Develop",
        "date": "9/2020 - Present",
        "responsibilities": [...]
      }
    ]
  }
}
```

---

## 4. Tuyến đường Tích hợp Công cụ (Flmngr)
- **Tuyến đường**: `POST /flmngr` (và các HTTP verb liên quan do `@flmngr/flmngr-server-node-express` điều khiển)
- **Mô tả**: Endpoint xử lý giao tiếp giữa TinyMCE Flmngr Client và hệ thống tệp tin máy chủ tại `./public/images`. Cung cấp các tác vụ: duyệt thư mục, tải ảnh, xóa tệp tin và tạo thumbnail.

---

## 5. Tuyến đường Chưa Kích Hoạt / Dự Phòng (Dead / Inactive Routes)
- Tuyến đường gửi email: `POST /` trong `routes/mail.js` kết nối tới `mailController.sendEmail`.
  - **Mục đích**: Nhận `{ name, message }`, lưu vào bảng `wedding-wishes` và gửi email qua SMTP Sendinblue.
  - **Hiện trạng**: Tuyến đường này chưa được mount vào file `index.js`.

