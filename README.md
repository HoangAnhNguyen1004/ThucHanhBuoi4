# StudyManager — Thực hành 4

Ứng dụng quản lý học tập sử dụng React Native CLI, React Navigation,
AsyncStorage, NetInfo và json-server 0.17.4.

## Chạy Android

Cài thư viện:

```bash
npm install
```

Terminal 1 — mock API:

```bash
npx json-server --watch db.json --host 0.0.0.0 --port 3000 --delay 800
```

Terminal 2 — Metro:

```bash
npm start
```

Terminal 3 — chạy ứng dụng:

```bash
npm run android
```

## Cấu hình API

BASE_URL trong src/config.ts:

- Android Emulator: http://10.0.2.2:3000
- Điện thoại thật: http://IP_LAN_MAY_TINH:3000
- iOS Simulator: http://localhost:3000

Điện thoại thật và máy tính phải cùng mạng.
Cho phép cổng 3000 qua firewall nếu cần.

## Luồng dữ liệu

flowchart TD
    S["Màn hình"] --> H["Hook / Context"]
    H --> V["Service / HTTP client"]
    V --> A["REST API"]
    H <--> C["Cache / Outbox"]
    A --> V --> H --> S
```

- Màn hình gọi hook/context; hook lấy dữ liệu từ cache rồi gọi service để yêu cầu API.
- Khi GET thành công, dữ liệu phản hồi được ghi vào cache; khi offline, giao diện vẫn dùng cache.
- Thao tác ghi được đưa vào outbox và đồng bộ qua service khi có mạng; dữ liệu trả về cập nhật cache rồi giao diện.
- Màn hình không gọi `fetch` hoặc `AsyncStorage` trực tiếp. Service gọi HTTP client; storage chỉ làm việc với AsyncStorage.
- Context chia sẻ dữ liệu giữa các tab để thay đổi ở một tab cập nhật ở các tab khác.

## Cache trước, mạng sau

Dữ liệu cache có dạng:

{ "data": ..., "savedAt": "ISO timestamp" }

Ứng dụng hiển thị cache trước rồi gọi API khi có mạng.
Cache quá TTL vẫn được dùng khi offline; TTL không làm mất dữ liệu cũ.
Mỗi lần GET thành công đều lưu cache mới.

Cache chi tiết có thể lấy bản ghi từ cache danh sách nếu chưa mở chi tiết
trước đó.

## Hàng đợi offline

Thao tác gồm:
- Đổi trạng thái bài tập.
- Thêm bài tập.
- Sửa thông tin cá nhân.

Outbox lưu:
id, method, url, body, createdAt, resource, entityId.

Giao diện được tính từ dữ liệu cache cộng các thao tác chưa đồng bộ.
Vì vậy dữ liệu offline và nhãn "Chưa đồng bộ" vẫn còn sau khi mở lại app.

Hàng đợi gửi theo FIFO.
Thao tác lỗi sẽ chặn các thao tác sau và được giữ để thử lại.
Đồng bộ chạy khi có mạng trở lại, khi app trở về foreground,
khi bấm "Đồng bộ ngay", và thử lại mỗi 15 giây khi app đang hoạt động.

Bài tập tạo offline có ID riêng do client cấp.
Trước POST, ứng dụng kiểm tra ID trên server để tránh tạo trùng khi retry.

## Optimistic update

Trạng thái bài tập đổi ngay khi bấm.

Nếu thao tác vừa thực hiện online nhận lỗi HTTP:
- Xóa thao tác đó khỏi overlay.
- Khôi phục dữ liệu trước thao tác.
- Hiện thông báo lỗi.

Nếu mất kết nối hoặc timeout:
- Giữ thao tác trong outbox.
- Hiện "Chưa đồng bộ".
- Thử lại khi kết nối phục hồi.

## Xử lý xung đột

Khi đồng bộ một thao tác `PATCH` trong outbox, ứng dụng GET bản ghi hiện tại trên server rồi so sánh `server.updatedAt` với `action.body.updatedAt` (thời điểm sửa offline).

- Nếu `server.updatedAt` mới hơn, giữ dữ liệu server, cập nhật cache, bỏ thao tác xung đột khỏi outbox và thông báo cho người dùng.
- Nếu không, gửi PATCH với dữ liệu trong outbox, cập nhật cache bằng phản hồi và xóa thao tác khỏi outbox.

Các thao tác được xử lý theo thứ tự FIFO; lỗi mạng giữ thao tác để thử lại. Cách so sánh timestamp giả định đồng hồ thiết bị và server tương đối đồng bộ. Với hệ thống thực tế nên dùng version/ETag và kiểm tra xung đột phía server; GET rồi PATCH không phải giao dịch nguyên tử.

## GPA

GPA = tổng(điểm hệ 4 × tín chỉ) / tổng tín chỉ đã có điểm.

Môn F:
- Vẫn tham gia mẫu số GPA.
- Không tính vào tín chỉ tích lũy.

Với dữ liệu mẫu:
- Tổng tín chỉ đã có điểm: 16.
- Tín chỉ tích lũy: 13.
- GPA hiển thị: 2.47.

## Kiểm thử

1. Xóa dữ liệu ứng dụng, tắt json-server, mở app:
   Có lỗi và nút Thử lại, không crash.

2. Chạy server, mở app và chờ dữ liệu tải.
   Bật chế độ máy bay rồi khởi động lại:
   Vẫn có cache, banner offline và thời gian cập nhật.

3. Offline: đổi hai bài tập sang đã xong, thêm một bài mới:
   Giao diện cập nhật và có nhãn Chưa đồng bộ.

4. Bật mạng:
   Outbox gửi tuần tự; nhãn biến mất; db.json được cập nhật.

5. Offline sửa họ tên.
   Trên máy tính sửa fullName của students/1 và đặt updatedAt
   mới hơn thời điểm thao tác offline.
   Bật mạng:
   Dữ liệu server thắng và có thông báo xung đột.

6. Tìm tên môn không tồn tại:
   Hiển thị trạng thái rỗng.

7. Kéo xuống ở các danh sách:
   Hiện refreshing và tải lại dữ liệu.

Để thử thêm bài tập, nhập hạn nộp ở tương lai theo giờ địa phương:
dd/MM/yyyy HH:mm.

Ứng dụng minh họa hồ sơ students/1.
Không bao gồm đăng nhập hoặc phân quyền nhiều sinh viên.
