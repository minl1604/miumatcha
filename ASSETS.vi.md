# Nguồn tài nguyên Miu Matcha

Toàn bộ mỹ thuật được thiết kế và sinh từ `scripts/generate-assets.mjs` cho dự án này, phát hành kèm dự án theo CC0-1.0. Không sử dụng asset pack, ảnh mạng, thư viện icon, tài nguyên game thương mại hoặc emoji làm hình ảnh.

Manifest tại `public/assets/manifest.json` và bản dùng trong bundler `src/assetsManifest.json` ghi đường dẫn, nhóm, kích thước, số khung, kích thước mỗi khung và điểm neo.

| Nhóm | Nội dung |
|---|---|
| characters | 12 khách; 6 nhân viên; người chơi có 27 phối hợp tóc/da/trang phục; giao hàng, kỹ thuật, kiểm tra và thú y; chân dung và sprite sheet |
| cats | 6 mèo khác lông, hoa văn, đuôi, tai, dáng; chân dung và 19 tư thế hoạt ảnh |
| items | Trà, đồ uống, sữa, syrup, topping, bánh, nguyên liệu và thức ăn mèo |
| furniture | Nội thất, ghế, quầy, lò, tủ, thiết bị và đồ mèo |
| environment | Sàn, tường, cửa, cửa sổ, đường phố, cây và chi tiết quán |
| ui | Bộ icon nét riêng cho sổ sách, kho, đội ngũ, mèo, sự kiện, cài đặt và thao tác |
| effects | Hơi nóng, rót sữa, chuyển động cửa/chuông và phản hồi |

Tổng hiện tại: **249 SVG**, **59 sprite sheet**, **1.157 khung hình**. Số này gồm biến thể, chân dung và các alias có chủ đích để catalog và cảnh dùng chung tài nguyên.

Nhân vật người dùng 21 tư thế gồm đứng, 4 hướng đi, ngồi, cầm món, làm việc, biểu cảm. Mèo dùng 19 tư thế gồm đứng/đi/chạy/ngồi/nằm/ngủ/ngáp, liếm chân, rình/vồ, dụi, ăn, hộp và phản ứng. Chuyển động sử dụng khung và bộ phận khác nhau; không chỉ lắc một ảnh tĩnh.

```powershell
npm run assets
npm run dev
node scripts/audit-assets.mjs
```

Script kiểm tra mọi SVG giải mã được, kích thước khớp manifest và không có khung trống/chạm biên. Gallery tại `/?gallery` cho phép xem trực tiếp. Font dùng font hệ thống hỗ trợ tiếng Việt, không tải font hoặc ảnh từ URL ngoài. Nhạc/hiệu ứng được tổng hợp bằng Web Audio trong `src/audio.ts`.
