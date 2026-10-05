# Miu Matcha — Tiệm Trà & Bánh Mèo

Game quản lý quán 2D một người chơi bằng tiếng Việt, chạy trên trình duyệt. React + TypeScript + Vite dựng giao diện; Phaser dựng cảnh quán. Tất cả hình ảnh được tạo bằng mã SVG trong dự án; không dùng ảnh mạng, asset pack, thư viện icon hoặc emoji làm mỹ thuật.

## Chạy ngay

Yêu cầu Node.js **22.12 trở lên** và npm. Trong PowerShell:

```powershell
cd "C:\Users\Admin\Documents\Codex\2026-10-05\files-pasted-by-the-user-b\outputs\miu-matcha"
npm install
npm run dev
```

Mở **http://127.0.0.1:5173**. Chạy một tiệm không cần tài khoản, backend hoặc API key. Không có dịch vụ nào được mua và game chưa được triển khai công khai.

Các lệnh khác:

```powershell
npm run build            # Kiểm tra TypeScript và tạo dist/
npm run preview          # Xem bản build tại http://127.0.0.1:4173
npm test                 # Kiểm thử mô phỏng, lưu game, minigame và AI
npm run test:e2e         # Luồng trình duyệt desktop và mobile
npm run assets           # Tái tạo toàn bộ mỹ thuật, sprite và manifest
node scripts/audit-assets.mjs  # Có dev server đang chạy: kiểm tra mọi ảnh/khung
```

Kiểm thử trình duyệt dùng Chrome đã cài trên máy này. Nếu dùng máy chưa có Chrome, cài Chromium bằng `npx playwright install chromium`, rồi đổi `channel: 'chrome'` trong `playwright.config.ts` sang cấu hình Chromium mặc định. Máy hiện tại đã chạy kiểm thử bằng Chrome thật; kích thước điện thoại và thao tác cảm ứng được mô phỏng bằng Playwright/CDP, không phải kiểm tra trên thiết bị vật lý.

Để mở từ điện thoại cùng mạng nội bộ, có thể tự chạy `npx vite --host 0.0.0.0` và truy cập IP máy tính ở cổng 5173. Đây không phải triển khai công khai; quyền mạng/tường lửa tùy máy. Chế độ loopback mặc định chỉ mở trên máy tính.

## Chơi một ngày

1. Đọc hướng dẫn lần đầu. Kho khởi đầu đã có nguyên liệu và vốn 850.000đ.
2. Trong chuẩn bị, chọn menu, nhập hàng hoặc cho bánh vào lò. Hàng giao và lò dùng giây mô phỏng thật; tạm dừng thì chúng cũng dừng.
3. Chọn **Mở cửa tiệm**. Khách đến với khẩu vị, ngân sách, loại đơn và thời gian chờ riêng.
4. Chọn phiếu gọi món, kiểm tra trà, sữa, đường, topping và nhiệt độ. **Thêm nguyên liệu vào ly** trừ kho một lần.
5. Đánh chữ W, rót sữa, tạo tầng hoặc lắc theo nhịp. Điểm thao tác ảnh hưởng món. Có thể pha nhanh với kỹ thuật thấp; sau ba món cùng công thức có thao tác từ 85 điểm, làm nhanh đạt 88 điểm kỹ thuật.
6. Hoàn tất, đọc điểm và nhận xét, rồi **Giao đúng đơn & thu tiền**. Giao lại một đơn không thu thêm tiền. Khách yêu cầu tránh nguyên liệu sẽ bị chặn nếu món còn thành phần đó.
7. Giờ vắng, chăm mèo, dọn sàn, lấy bánh đúng khoảng chín hoặc xử lý hồ sơ sự kiện. Đừng tăng thân thiết bằng cách chạm liên tục khi mèo muốn nghỉ.
8. Đóng cửa, xử lý đơn cuối hoặc chọn đóng sổ và ghi nhận các đơn bỏ. Chi phí, lương và thuế giả lập chỉ được ghi một lần.
9. Xem báo cáo, trang trí và chuẩn bị ngày tiếp theo. Ngày mặc định 11 phút; cài đặt cho phép 10–15 phút, áp dụng cho ngày tiếp theo.

Chuột, kéo thả và cảm ứng đều được hỗ trợ. Phím **cách** tạm dừng/tiếp tục; **Escape** đóng bảng. Chuyển tab tự tạm dừng, quay lại cần tiếp tục chủ động. Âm thanh tổng hợp bằng Web Audio chỉ khởi động sau tương tác; nhạc và hiệu ứng có âm lượng riêng, có chế độ giảm chuyển động.

## Các hệ thống

- **Cảnh quán:** cửa, cửa sổ, mưa, quầy pha, lò, tủ bánh, khách, nhân viên và khu mèo riêng. Nhân vật dùng sprite nhiều tư thế; đi theo đường tránh nội thất; lớp trước/sau theo vị trí.
- **Menu:** sáu đồ uống đầu, bốn món mở khóa, năm bánh và topping. Công thức tự tạo có tên, lượng nguyên liệu, giá vốn, giá bán và lựa chọn đưa vào menu. Không thể lấy lại nguyên liệu đã hòa vào ly; sửa chỉ thêm khi hợp lý, đổi nguyên liệu đã pha phải bỏ món.
- **Minigame:** đánh trà, rót sữa, tạo tầng, lắc, canh lò, trang trí bánh, thử vị; cần câu, bóng, trốn tìm, hộp, đường khám phá, dạy chạm tay, chụp ảnh; đối soát tiền, kiểm kho/hàng, xếp ca, dọn, phân luồng, tìm dấu vết. Các trò quản lý đọc bản chụp dữ liệu thật của tiệm; kết quả được kiểm lại trước khi áp dụng.
- **Mèo:** Matcha, Houji, Mochi ban đầu và ba bé mở dần; nhu cầu, tính cách, phản hồi, vị trí thích vuốt, khoảng nghỉ, album và tối đa ba lượt thưởng minigame mỗi ngày. Không có hao hụt vì không đăng nhập.
- **Nhân viên:** sáu diện mạo, năm vai trò; thuê, ca làm, tác vụ độc quyền, năng lượng, kỹ năng, kinh nghiệm, đào tạo, thưởng, bữa ăn, điều chuyển và nghỉ. Chấm dứt hợp đồng cần xác nhận, hiển thị quyết toán và giữ hồ sơ; món đang làm được bàn giao, không dùng nguyên liệu lại.
- **Kho và thiết bị:** lô, đơn vị, giá vốn, chất lượng, hạn dùng, ưu tiên lô gần hết hạn; ba nguồn giao hàng, thời gian giao và giá khác nhau; công cụ đánh trà, tủ lạnh, lò, đá, tính tiền, camera và cửa mèo có độ bền, bảo trì, nâng cấp.
- **Kinh tế:** VND nguyên; sổ giao dịch có mã duy nhất. Doanh thu/giảm giá/hoàn tiền, giá vốn, lương, thuê, điện nước, vệ sinh, mèo, bảo trì, quảng bá, bao bì, vận chuyển và thuế tách riêng. Mua kho chưa phải giá vốn; mua đồ là đầu tư; vay/trả gốc và chuyển quỹ không phải doanh thu/lợi nhuận. Có hóa đơn, gia hạn, quỹ, vay, bảo hiểm và phục hồi.
- **Không gian và tiến trình:** ô 16×12, xoay/di chuyển/cất đồ, kiểm tra va chạm, khu mèo và đường cửa–quầy; bàn tăng sức chứa, đồ mèo ảnh hưởng sinh hoạt. Cấp tiệm, danh tiếng, lịch sử khách, thẻ tích điểm, nhiệm vụ, vật kỷ niệm, workshop và ngày hội cộng đồng.
- **Sự kiện:** cùng bộ điều phối có seed, điều kiện, nhân vật, dấu hiệu, chứng cứ, lựa chọn, thời gian xử lý, chi phí, hậu quả và nhật ký. Dữ liệu cùng quán chịu tác động; không có báo cáo doanh thu ngẫu nhiên. Có sự việc tích cực và các cách hồi phục, tần suất ít/vừa/nhiều, bật/tắt trộm cắp và gian lận riêng.

Thuế mặc định **5% doanh thu thuần**, lịch vay, bảo hiểm, kiểm tra vệ sinh, chăm sóc thú y và hợp đồng là **quy tắc trò chơi**, không phải quy định hoặc hướng dẫn trong đời thực.

## Lưu game

Game tự lưu giao dịch quan trọng và mỗi mười giây mô phỏng vào IndexedDB. Có bản chính, bản dự phòng hợp lệ, checksum, dữ liệu phiên bản 3, migration phiên bản 1/2 và kiểm tra cấu trúc cùng sổ sách trước khi thay trạng thái. Cài đặt được lưu riêng; chơi mới giữ tùy chọn âm thanh/tiếp cận.

Trong **Cài đặt & bản lưu**, xuất JSON để giữ bản riêng hoặc chuyển thiết bị. Nhập JSON được kiểm tra trước rồi yêu cầu xác nhận thay tiệm. Tải lại mở tiệm đã lưu trong trạng thái tạm dừng, không mô phỏng thời gian đã thoát. Không đồng bộ đám mây; xóa dữ liệu trình duyệt có thể xóa bản lưu.

## Nhận xét AI tùy chọn

Hướng dẫn đầy đủ ở [docs/AI.vi.md](docs/AI.vi.md). Khóa chỉ nằm trong `.env` phía Node, không dùng `VITE_`, không lưu trong trình duyệt hoặc repository.

```powershell
Copy-Item .env.example .env
# Điền OPENAI_API_KEY trong .env, sau đó mở terminal thứ hai:
npm run server
```

Backend loopback ở 8787; Vite proxy `/api`. Có timeout, kiểm tra JSON Schema/độ dài, rate limit, giới hạn body và fallback. Chỉ diễn đạt món đã chấm hoặc hồ sơ được người chơi yêu cầu; không sửa điểm, tiền, kho, chứng cứ hoặc quyết định nhân sự. Tên tự đặt luôn là dữ liệu. AI không thực sự nếm đồ uống. Không có key, endpoint hoặc mạng vẫn chơi đầy đủ.

## Cấu trúc mã

| Đường dẫn | Vai trò |
|---|---|
| `src/domain/engine.ts` | Một reducer duy nhất cho trạng thái, đồng hồ bước 1 giây, đơn, tác vụ và vòng ngày |
| `src/domain/data.ts`, `types.ts` | Danh mục và hợp đồng dữ liệu |
| `inventory.ts`, `finance.ts`, `scoring.ts`, `decor.ts`, `events.ts` | Kho, sổ sách, chấm điểm, đường đi và điều phối sự kiện |
| `src/store.ts`, `persistence.ts` | Kết nối React với trạng thái, autosave, kiểm tra/migration/dự phòng |
| `src/CafeScene.tsx` | Phaser chỉ vẽ từ cùng trạng thái, không sở hữu kinh tế hoặc kho |
| `src/App.tsx`, `Management.tsx` | Vòng chơi và các sổ quản lý |
| `src/Minigame.tsx`, `audio.ts` | Thao tác có điểm và âm thanh tổng hợp |
| `src/feedback.ts`, `server/` | Nhận xét cục bộ và AI an toàn |
| `scripts/generate-assets.mjs`, `public/assets/` | Nguồn mỹ thuật và toàn bộ tài nguyên cuối |
| `tests/`, `screenshots/` | Kiểm thử và ảnh giao diện đã chạy |

Gallery tại **http://127.0.0.1:5173/?gallery** hiển thị nhân vật, mèo, đồ vật, icon và các khung hoạt ảnh. Công cụ `window.__MIU_DEBUG` chỉ tồn tại trong bản phát triển để kiểm thử; bản production không cung cấp công cụ gian lận.

## Nghiệm thu và giới hạn

Kết quả chạy thực tế được ghi ở [TEST-RESULTS.vi.md](TEST-RESULTS.vi.md); danh mục hoàn thành ở [CHECKLIST.vi.md](CHECKLIST.vi.md). Đặc tả gốc được giữ trong [SPECIFICATION.vi.md](SPECIFICATION.vi.md).

Đây là game cục bộ với nội dung sự kiện có tác giả, không phải mô phỏng vô hạn bằng AI. Các ví dụ đời sống được triển khai bằng các gia đình sự kiện có điều kiện và lựa chọn chung; nội dung cụ thể không diễn ra trong mọi ngày. Không có bảng xếp hạng/tài khoản online, camera ngoài đời, chẩn đoán mèo thực tế hoặc pháp luật thật. Album lưu tư thế/chú thích của cảnh mô phỏng, không sử dụng camera máy. API OpenAI thật chưa được kiểm chứng bằng tài khoản trả phí; các nhánh lỗi đã kiểm thử bằng upstream giả lập.
