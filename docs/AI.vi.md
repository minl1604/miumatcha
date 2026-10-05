# Nhận xét AI tùy chọn

Miu Matcha chơi đầy đủ khi không có dịch vụ AI. Nhận xét món và diễn đạt hồ sơ khi đó được tạo cục bộ từ công thức, điểm và dữ kiện thật của quán. Nhận xét được ghi rõ nguồn; mô hình không thực sự nếm đồ uống.

## Chạy bằng nhận xét cục bộ

```powershell
npm install
npm run dev
```

Mở địa chỉ Vite in ra trong terminal. Backend không bắt buộc: nếu endpoint chưa chạy, mất mạng hoặc hết thời gian chờ, trình duyệt tự dùng nhận xét cục bộ và vẫn tiếp tục phục vụ, giao dịch và giải quyết vụ việc.

## Bật OpenAI

Bạn tự quyết định sử dụng tài khoản/API có phí. Dự án không tự mua dịch vụ và quá trình kiểm thử không gọi mô hình trả phí.

1. Sao chép `.env.example` thành `.env` tại thư mục dự án.
2. Điền `OPENAI_API_KEY` trong `.env`. Giữ khóa trên máy chủ; không dùng tiền tố `VITE_`, không dán vào game, bản lưu, localStorage hoặc mã nguồn.
3. Tùy chọn thay `OPENAI_MODEL` bằng mô hình hỗ trợ Structured Outputs mà tài khoản của bạn có quyền sử dụng. Mặc định là `gpt-4o-mini`.
4. Chạy hai terminal:

```powershell
# Terminal giao diện
npm run dev

# Terminal backend, Node.js 22.12 trở lên
npm run server
```

Vite chuyển `/api/*` tới backend tại `127.0.0.1:8787`. `/api/health` báo `mode: "local"` hoặc `mode: "ai"` theo việc khóa đã được cấu hình. Chế độ `ai` chỉ xác nhận cấu hình, không xác nhận khóa hoặc mô hình có quyền truy cập; lỗi thực tế luôn có fallback.

## Dữ liệu, giới hạn và bảo vệ gameplay

- Nhận xét món chỉ được yêu cầu sau khi món đã hoàn tất. Hồ sơ chỉ được yêu cầu khi người chơi chủ động bấm nhận xét cho một phiên bản dữ kiện; không gọi mỗi khung hình.
- Backend nhận điểm có giới hạn và các thông số món, hoặc hồ sơ gồm dấu hiệu quan sát và nguồn đã kiểm chứng. Sự thật trong nguồn chưa kiểm tra bị loại bỏ trước khi rời trình duyệt và được loại bỏ lần nữa tại backend.
- Tên tự đặt, lời mô tả và lịch sử luôn nằm trong khối dữ liệu. Chúng không trở thành chỉ dẫn cho mô hình.
- Backend dùng Responses API với `store: false`, JSON Schema nghiêm ngặt và giới hạn token. Chỉ chấp nhận trường `comment`, tối đa 500 ký tự. Mọi trường như điểm, tiền, kết tội, hình phạt hoặc lệnh sửa trạng thái đều không có quyền điều khiển game.
- Với hồ sơ, schema còn giới hạn câu nhận xét trong các cách diễn đạt đã được dựng từ dữ kiện công khai. Backend kiểm tra lại chính xác giá trị này. Vì vậy AI không thể tự thêm bằng chứng, quyết định ai có tội hay tạo hậu quả mới; độ đa dạng diễn đạt hồ sơ được giới hạn có chủ đích.
- Dấu hiệu được gọi rõ là quan sát; nguồn đã kiểm chứng được ghi nguồn; kết quả chỉ được thuật lại khi game đã ghi nhận `outcome`.
- Timeout backend 4 giây, trình duyệt 5 giây; giới hạn 20 yêu cầu/phút cho mỗi địa chỉ, tối đa 2 yêu cầu AI đồng thời. Body tối đa 6 KiB, hồ sơ tối đa 8 nguồn.
- Khóa chỉ được đọc từ biến môi trường phía Node. Backend chỉ lắng nghe loopback và không ghi khóa hoặc nội dung yêu cầu vào log. API từ nguồn web bên ngoài bị từ chối.

Đây là tính năng diễn đạt nội dung của một trò chơi. Điểm, tiền, kho, lương, lựa chọn xử lý, bằng chứng và kết quả đều do bộ mô phỏng xác định.

## Kiểm thử và tài liệu chính thức

```powershell
npx vitest run tests/ai.test.ts
```

Kiểm thử dùng upstream giả lập để kiểm tra thiếu khóa, timeout, offline, cấu trúc đầu ra sai, câu kết tội tự tạo, trường sửa trạng thái, rate limit và lọc dữ kiện chưa kiểm chứng. Chưa kiểm chứng một tài khoản OpenAI thật.

Phần tích hợp đã đối chiếu [OpenAI Docs: Structured Outputs trong Responses API](https://developers.openai.com/api/docs/guides/structured-outputs?api-mode=responses). Khả năng truy cập mô hình phụ thuộc tài khoản và cấu hình của bạn.
