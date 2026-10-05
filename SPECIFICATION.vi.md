Bạn là lập trình viên game full-stack kiêm thiết kế gameplay. Hãy xây dựng hoàn chỉnh một game web tiếng Việt tên **Miu Matcha – Tiệm Trà & Bánh Mèo** theo đặc tả dưới đây.

## 1. Yêu cầu làm việc

- Triển khai trực tiếp trong workspace, không chỉ trả lời ý tưởng, kế hoạch hoặc đoạn code mẫu.
- Đọc hướng dẫn dự án và kiểm tra mã nguồn hiện có trước khi sửa. Nếu có dự án phù hợp, tiếp tục phát triển thay vì ghi đè.
- Nếu bắt đầu mới, dùng React + TypeScript + Vite cho giao diện, Phaser cho cảnh game 2D. Dùng một nguồn trạng thái thống nhất; không tạo hai hệ thống trạng thái mâu thuẫn giữa React và Phaser.
- Chia thành các giai đoạn và tự triển khai lần lượt đến khi hoàn thành. Tự quyết định các chi tiết thông thường, không liên tục hỏi xác nhận.
- Ưu tiên một vòng chơi hoàn chỉnh trước, sau đó tích hợp toàn bộ các hệ thống bổ sung.
- Không để nút giả, tính năng chỉ có thông báo “sắp ra mắt”, dữ liệu báo cáo ngẫu nhiên hoặc TODO cho cơ chế chính.
- Nếu thiếu dịch vụ bên ngoài, cung cấp chế độ cục bộ hoạt động thật và ghi rõ giới hạn.
- Không tự mua dịch vụ, dùng tài nguyên trả phí hoặc công khai triển khai khi chưa được cho phép.
- Cuối cùng chạy build, kiểm thử các luồng quan trọng và hướng dẫn chạy cụ thể.

## 2. Ý tưởng và phong cách

Game một người chơi quản lý tiệm matcha, houjicha, bánh ngọt và mèo.

Người chơi có thể:
- Pha chế bằng thao tác trực tiếp.
- Tạo công thức và đặt giá.
- Phục vụ khách có khẩu vị riêng.
- Chăm, chơi và tương tác với mèo.
- Thuê nhân viên, mua nguyên liệu, quản lý tài chính.
- Trang trí và mở rộng quán.

Phong cách 2D chibi hoặc pixel-art đồng nhất:
- Màu xanh matcha, nâu houjicha, kem sữa, gỗ ấm.
- Góc nhìn từ trên xuống hơi nghiêng.
- Có quầy pha chế, tủ bánh, bàn khách, khu mèo, kho và cửa sổ.
- Nhân vật di chuyển, mèo có hoạt ảnh, đồ uống có hiệu ứng rót và khuấy.
- Giao diện dễ đọc, đầy đủ dấu tiếng Việt.
- Không làm thành một dashboard chỉ có thẻ số liệu; cảnh quán phải là trung tâm trải nghiệm.

Tự tạo hoặc sử dụng tài nguyên được phép dùng, có ghi nguồn khi cần. Không sao chép tài sản của game thương mại. Nếu không có công cụ tạo ảnh, tự dựng đồ họa SVG/canvas hoặc sprite có chủ đích; không dùng emoji làm toàn bộ đồ họa game.

## 3. Nền tảng và điều khiển

- Chơi trên trình duyệt máy tính và điện thoại.
- Hỗ trợ chuột, kéo thả và cảm ứng.
- Trên màn hình nhỏ, bố trí lại bảng điều khiển để không che thao tác chính.
- Có hướng dẫn tương tác lần đầu.
- Có điều chỉnh âm lượng nhạc, hiệu ứng và chế độ giảm chuyển động.
- Âm thanh chỉ bắt đầu sau tương tác của người dùng.
- Có tạm dừng. Chuyển tab tự tạm dừng để tránh thất thoát ngoài ý muốn.

## 4. Vòng chơi theo ngày

Một ngày khoảng 10–15 phút thực, cấu hình được.

Các giai đoạn:
1. Chuẩn bị: nhập nguyên liệu, làm bánh, chọn menu, xếp ca.
2. Mở quán: khách đến, gọi món, pha chế, giao món, thu tiền.
3. Giờ vắng: chăm mèo, chơi minigame, dọn dẹp.
4. Đóng quán: giải quyết đơn còn lại, tính chi phí, xem báo cáo.
5. Sau giờ làm: trang trí, nâng cấp, chuẩn bị ngày tiếp theo.

Có hai chế độ:
- Thư giãn: khách kiên nhẫn hơn, chi phí nhẹ hơn.
- Kinh doanh: áp lực hàng chờ, chi phí và chất lượng cao hơn.

Mở khóa tính năng dần bằng hướng dẫn và cấp độ. Không đưa toàn bộ hệ thống lên màn hình ngay ngày đầu.

## 5. Pha chế và menu

Đồ uống ban đầu:
- Matcha latte.
- Matcha dâu.
- Matcha kem muối.
- Houjicha latte.
- Houjicha caramel.
- Sencha chanh.

Món mở khóa:
- Matcha xoài.
- Houjicha kem cheese.
- Genmaicha latte.
- Đồ uống theo mùa.

Bánh:
- Mochi.
- Cookie.
- Cheesecake matcha.
- Brownie houjicha.
- Tiramisu matcha.

Topping:
- Trân châu trắng.
- Thạch trà.
- Kem sữa.
- Đậu đỏ.

Mỗi công thức có lượng nguyên liệu, giá vốn, thời gian làm và thuộc tính hương vị.

Người chơi điều chỉnh:
- Loại và lượng trà.
- Loại và lượng sữa.
- Đường hoặc syrup.
- Đá.
- Nhiệt độ.
- Topping.
- Mức độ hòa tan.
- Trình bày.

Cho phép pha sai, sửa món khi hợp lý hoặc bỏ món với chi phí thật. Nguyên liệu phải bị trừ đúng một lần theo thao tác hoặc quy trình đã chọn.

Có sổ công thức:
- Lưu công thức tự tạo.
- Đặt tên.
- Xem giá vốn và lợi nhuận dự kiến.
- Đặt giá bán.
- Đưa vào menu.
- Giao nhân viên thực hiện khi đã mở khóa.

## 6. Minigame pha chế và làm bánh

Triển khai các minigame ngắn, có thao tác thực:

- Đánh matcha: rê theo đường chữ W, tính nhịp và độ phủ.
- Rót sữa: điều chỉnh vị trí và tốc độ để tạo hình đơn giản.
- Tạo tầng đồ uống: giữ tốc độ rót phù hợp.
- Lắc đồ uống: bấm hoặc chạm theo nhịp.
- Nướng bánh: lấy bánh ra đúng khoảng chín.
- Trang trí bánh: đặt topping và bóp kem.
- Thử vị bí mật: suy luận công thức từ phản hồi của khách.

Điểm thao tác ảnh hưởng chất lượng thành phẩm theo quy tắc rõ ràng.

Sau khi thành thạo, mở khóa làm nhanh hoặc giao nhân viên. Không bắt người chơi lặp mọi minigame cho mọi đơn.

## 7. Khách hàng và AI đánh giá

Mỗi khách có:
- Tên, hình ảnh và tính cách.
- Khẩu vị trà, độ ngọt, độ béo, nhiệt độ, topping.
- Ngân sách, độ kiên nhẫn.
- Thiện cảm và lịch sử ghé quán.
- Mèo yêu thích.
- Một số lời thoại và câu chuyện mở khóa.

Chấm đồ uống bằng thuật toán xác định, thang 100:
- Đúng yêu cầu và nguyên liệu: 30.
- Phù hợp khẩu vị: 30.
- Kỹ thuật pha: 20.
- Nhiệt độ: 10.
- Trình bày: 10.

Tách điểm đồ uống khỏi điểm dịch vụ và không gian.

AI tạo nhận xét dựa trên:
- Thông số đồ uống thực tế.
- Đơn đặt hàng.
- Điểm từng tiêu chí.
- Tính cách khách.
- Lịch sử liên quan.

Ví dụ:
“Houjicha thơm nhưng caramel hơi nhiều, át vị trà rang. Lần sau giảm syrup giúp mình nhé!”

Yêu cầu kỹ thuật:
- Game chơi đầy đủ khi không có API key.
- Khi chưa cấu hình AI, dùng lời nhận xét theo quy tắc và ghi rõ là chế độ nhận xét cục bộ.
- Khi có API key, gọi mô hình qua backend hoặc serverless endpoint.
- Không đưa API key vào frontend, localStorage hoặc repository.
- Có timeout, giới hạn độ dài, kiểm tra cấu trúc đầu ra, rate limit và fallback.
- Không gọi API mỗi khung hình hoặc mỗi thao tác. Chỉ gọi khi cần nhận xét món đã hoàn tất.
- Không để AI tự thay đổi điểm, tiền, kho hoặc trạng thái game.
- Tên công thức do người chơi đặt là dữ liệu, không phải chỉ dẫn cho mô hình.
- Cung cấp .env.example không chứa bí mật và hướng dẫn cấu hình.
- Không tuyên bố AI thực sự nếm được đồ uống.

## 8. Hệ thống mèo

Ba bé khởi đầu:
- Matcha: mèo mướp tinh nghịch.
- Houji: mèo nâu ham ngủ.
- Mochi: mèo trắng quấn người.

Mỗi bé có:
- Đói, vui vẻ, năng lượng, vệ sinh và thân thiết.
- Tính cách, đồ chơi yêu thích, vị trí thích được vuốt.
- Lịch sinh hoạt.
- Giới hạn chịu tương tác và dấu hiệu muốn nghỉ.

Tương tác trực tiếp:
- Vuốt đầu, má, lưng.
- Gãi cằm.
- Chạm nhẹ bàn chân.
- Đưa tay cho ngửi.
- Gọi tên.
- Cho bánh thưởng phù hợp.
- Chải lông.
- Bế hoặc cho ngồi trên đùi khi đủ thân.
- Chụp ảnh.

Phản hồi phải có biểu cảm hoặc hoạt ảnh:
- Lim dim, rừ rừ, dụi đầu, lăn người.
- Rụt chân, quay đầu, chạy lại.
- Bỏ đi hoặc giãy nhẹ khi muốn nghỉ.

Không cho tương tác liên tục để tăng điểm vô hạn. Tôn trọng khoảng nghỉ giúp tăng lòng tin.

Mèo tự hoạt động:
- Ngủ bên cửa sổ.
- Chiếm ghế.
- Chui vào hộp.
- Tha khăn.
- Chạm chuông.
- Ngồi lên sổ thu chi.
- Chơi cùng mèo khác.

Khu mèo tách khỏi khu chế biến. Khi người chơi thoát game, nhu cầu mèo dừng lại; không phạt vì không đăng nhập.

## 9. Minigame với mèo

- Cần câu lông vũ: mèo rình, vồ và bắt được đồ chơi.
- Bóng lăn: lăn qua đường hầm, vật cản.
- Trốn tìm: tìm qua tai, đuôi, tiếng kêu.
- Hộp nào có mèo: ghi nhớ và theo dõi hộp.
- Đường chơi khám phá: đặt cầu thấp, hộp, đệm.
- Dạy chạm tay hoặc ngồi: thưởng đúng thời điểm.
- Chụp ảnh theo nhiệm vụ.

Phần thưởng chủ yếu là thân thiết, album, đồ trang trí và động tác mới. Có giới hạn hợp lý để tránh khai thác tiền vô hạn.

## 10. Nhân viên

Các vị trí:
- Pha chế.
- Thợ bánh.
- Phục vụ/thu ngân.
- Chăm mèo.
- Quản lý ca.

Thuộc tính:
- Lương.
- Tốc độ.
- Tay nghề.
- Giao tiếp.
- Kinh nghiệm.
- Năng lượng và mức hài lòng.

Có tuyển dụng, xếp ca, giao việc, nghỉ, đào tạo, thưởng và chấm dứt hợp đồng với xác nhận.

Nhân viên phải thực sự thực hiện công việc trong mô phỏng:
- Nhận tác vụ.
- Di chuyển khi cần.
- Tiêu hao thời gian và nguyên liệu.
- Tạo kết quả theo kỹ năng.
- Không nhận trùng đơn hoặc tiêu hao trùng tài nguyên.

Thuê người giúp giảm thao tác nhưng làm tăng chi phí. Thiết kế để một mình người chơi vẫn khởi đầu được.

## 11. Kho, nhà cung cấp và thiết bị

- Theo dõi số lượng, đơn vị, giá nhập, lô và hạn sử dụng.
- Ưu tiên dùng lô sắp hết hạn.
- Cảnh báo thiếu hoặc sắp hỏng.
- Nhập hàng có giá, chất lượng và thời gian giao khác nhau.
- Có hao hụt do đồ hỏng, pha sai, bỏ món.
- Không cho tồn kho âm.
- Đồ uống không bán được khi thiếu thành phần bắt buộc.

Thiết bị:
- Dụng cụ đánh trà.
- Tủ lạnh.
- Lò bánh.
- Máy làm đá.
- Máy tính tiền.

Có nâng cấp, độ bền, bảo trì và sửa chữa. Sự cố xuất hiện vừa phải, có dấu hiệu báo trước và cách xử lý.

## 12. Kinh tế, thuế và lợi nhuận

Tiền tệ: VND; lưu bằng số nguyên, định dạng theo tiếng Việt.

Theo dõi riêng:
- Doanh thu.
- Giảm giá, hoàn tiền.
- Giá vốn nguyên liệu đã tiêu thụ.
- Lương.
- Tiền thuê.
- Điện nước.
- Chi phí mèo.
- Vệ sinh, bảo trì, quảng cáo.
- Bao bì và phí giao hàng.
- Thuế giả lập.
- Lợi nhuận.
- Tiền mặt và tồn kho.

Thuế mặc định là 5% doanh thu thuần, cấu hình trong cân bằng game. Ghi rõ đây là luật giả lập, không phải hướng dẫn thuế thực tế.

Lợi nhuận ngày =
doanh thu thuần − giá vốn − chi phí vận hành − thuế giả lập.

Phân biệt lợi nhuận và dòng tiền:
- Mua nguyên liệu giảm tiền mặt và tăng tồn kho.
- Chỉ ghi giá vốn khi nguyên liệu đã dùng hoặc hao hụt.
- Thuế và chi phí phát sinh có thể được thanh toán theo lịch.
- Mua thiết bị phải hiện riêng trong dòng tiền đầu tư, không trừ lặp vào chi phí ngày.
- Mỗi sự kiện tài chính có mã duy nhất để tránh thu hoặc chi hai lần.

Báo cáo cuối ngày:
- Doanh thu và lợi nhuận.
- Tiền đầu ngày, tiền cuối ngày, dòng tiền.
- Các khoản phải trả.
- Món bán chạy, món lời nhất.
- Nguyên liệu bỏ phí.
- Khách phục vụ, khách bỏ đi, giá trị đơn trung bình.
- Điểm đồ uống và dịch vụ.
- So sánh ngày trước.
- Gợi ý cải thiện từ số liệu thật.

Không dùng doanh thu hoặc báo cáo tạo ngẫu nhiên để giả lập việc đã chơi.

## 13. Trang trí, danh tiếng và mở rộng

Chế độ trang trí theo ô:
- Đặt, xoay, di chuyển và cất đồ.
- Kiểm tra va chạm và đường đi.
- Không đặt đồ chặn cửa, quầy hoặc lối cần thiết.
- Bàn ghế tăng sức chứa.
- Đệm, kệ leo và đồ chơi được mèo sử dụng.
- Trang trí ảnh hưởng sự thoải mái trong giới hạn hợp lý.

Khách đánh giá:
- Đồ uống.
- Giá.
- Tốc độ.
- Vệ sinh.
- Không gian.
- Trải nghiệm với mèo.

Có cấp độ quán, danh tiếng, công thức và nội thất mở khóa. Bảng thành tích mặc định là thành tích cá nhân cục bộ; không giả vờ có bảng xếp hạng trực tuyến.

## 14. Sự kiện và nội dung dài hạn

- Thời tiết ảnh hưởng nhu cầu món nóng/lạnh.
- Giờ cao điểm.
- Đơn mang đi và giao hàng.
- Combo trà + bánh.
- Thẻ tích điểm.
- Món theo mùa.
- Sinh nhật mèo.
- Workshop đánh trà.
- Ngày hội nhận nuôi.
- Khách quen có câu chuyện nhiều lần gặp.
- Nhiệm vụ ngày, thành tựu.
- Album ảnh và nhật ký mèo.
- Sưu tập ly, đĩa, túi mang đi.
- Góc thư giãn ngắm mưa và mèo ngủ.

Mỗi sự kiện cần điều kiện kích hoạt, thời gian, tác động và phần thưởng rõ ràng.

## 15. Lưu game và cài đặt

- Tự lưu sau giao dịch quan trọng, khi đóng ngày và theo chu kỳ hợp lý.
- Dùng IndexedDB hoặc giải pháp cục bộ phù hợp.
- Có phiên bản dữ liệu lưu, kiểm tra hợp lệ, migration và bản dự phòng.
- Tải lại không nhân đôi tiền, đơn, phần thưởng hoặc chi phí.
- Có xuất/nhập bản lưu JSON.
- Nhập bản lưu phải kiểm tra dữ liệu trước khi thay thế.
- Có tiếp tục, chơi mới và xác nhận trước khi xóa.
- Lưu riêng cài đặt âm thanh và khả năng tiếp cận.
- Không bắt đăng ký tài khoản để chơi.

## 16. Kiến trúc

Tách các hệ thống:
- Đồng hồ và vòng ngày.
- Khách, hàng chờ và đơn hàng.
- Công thức và chất lượng.
- Kho.
- Tài chính và sổ giao dịch.
- Nhân viên và tác vụ.
- Mèo và tương tác.
- Trang trí và đường đi.
- Nhiệm vụ và mở khóa.
- Lưu game.
- AI và fallback.

Công thức, giá, nhân vật, sự kiện, nội thất và thông số cân bằng nằm trong dữ liệu có cấu trúc, dễ mở rộng.

Dùng bước thời gian ổn định cho mô phỏng; không để tốc độ game phụ thuộc FPS. Dọn sự kiện, timer và tài nguyên khi đổi cảnh.

Tạo chế độ debug chỉ bật trong môi trường phát triển để kiểm tra nhanh các giai đoạn, không đưa công cụ gian lận vào giao diện chơi bình thường.

## 17. Thứ tự thực hiện

1. Dựng cảnh quán, giao diện và vòng ngày.
2. Hoàn thành nhận đơn → pha → giao → thu tiền → báo cáo.
3. Thêm kho, công thức, bánh và minigame pha chế.
4. Thêm mèo, tương tác và minigame mèo.
5. Thêm nhân viên và phân công.
6. Thêm kinh tế đầy đủ, thuế, thiết bị, nhà cung cấp.
7. Thêm trang trí, sự kiện, tiến trình và album.
8. Tích hợp AI có fallback.
9. Hoàn thiện hình ảnh, âm thanh, responsive và kiểm thử.

Duy trì checklist trong dự án để theo dõi. Các giai đoạn là thứ tự triển khai, không phải lý do dừng ở bản demo.

## 18. Tiêu chí nghiệm thu

Phải kiểm tra thực tế:
- Người chơi mới hoàn thành được một ngày.
- Có thể pha ít nhất một matcha và một houjicha.
- Điểm thay đổi hợp lý theo công thức và thao tác.
- Giao đúng đơn chỉ thu tiền một lần.
- Kho không âm; món sai và món bỏ tạo hao hụt đúng.
- Thuê nhân viên làm phát sinh công việc và lương thật.
- Mỗi mèo có phản hồi khác nhau, chơi minigame tăng chỉ số đúng.
- Mua và đặt nội thất làm thay đổi cảnh, lưu lại sau tải trang.
- Báo cáo khớp với giao dịch và tồn kho.
- Đóng ngày không ghi chi phí hoặc thuế hai lần.
- Lưu/tải và xuất/nhập giữ trạng thái nhất quán.
- Thiếu key, mất mạng hoặc AI lỗi không chặn gameplay.
- Hoạt động trên màn hình máy tính và điện thoại.
- Build thành công; không có lỗi runtime nghiêm trọng.

Viết kiểm thử có ý nghĩa cho kinh tế, kho, chấm điểm, xử lý đơn và lưu game. Dùng công cụ tự động hóa trình duyệt nếu có để chơi thử luồng chính, chụp ảnh kiểm tra giao diện và sửa lỗi phát hiện được. Không tuyên bố đã kiểm thử điều chưa chạy.

## 19. Bàn giao

Cung cấp:
- Toàn bộ mã nguồn và tài nguyên.
- README tiếng Việt.
- Lệnh cài đặt, chạy, build và kiểm thử.
- Hướng dẫn bật AI thật.
- .env.example.
- Danh sách tính năng đã hoàn thành.
- Kết quả kiểm thử thực tế và giới hạn còn lại.
- Đường dẫn xem thử nếu môi trường hỗ trợ.

Bắt đầu bằng kiểm tra workspace, lập kế hoạch ngắn, rồi triển khai ngay đến khi có game hoạt động đầy đủ theo đặc tả.

## 20. Mô phỏng đời sống và sự cố kinh doanh

Mở rộng Miu Matcha với những tình huống có nguyên nhân, dấu hiệu, lựa chọn xử lý và hậu quả kéo dài. Triển khai thành gameplay thực tế, liên kết với các hệ thống hiện có; không chỉ hiện hộp thoại rồi cộng/trừ tiền tùy ý.

### 20.1. Hệ thống sự kiện có nguyên nhân

Mỗi sự kiện có:
- Điều kiện kích hoạt và yếu tố tăng/giảm xác suất.
- Dấu hiệu người chơi có thể quan sát.
- Những nhân vật, đồ vật và giao dịch liên quan.
- Lựa chọn xử lý với chi phí, thời gian và hậu quả khác nhau.
- Kết quả tức thời và ảnh hưởng những ngày sau.
- Nhật ký để người chơi hiểu chuyện gì đã xảy ra.

Tần suất phụ thuộc quy mô quán, giờ đông khách, cách quản lý, tinh thần nhân viên, bảo trì và an ninh. Không gán hành vi xấu theo ngoại hình hoặc nhóm nhân khẩu học.

Có thời gian nghỉ giữa các sự cố nghiêm trọng. Tránh dồn nhiều biến cố khiến người chơi không thể phục hồi.

### 20.2. Trộm cắp và thất thoát

Các tình huống:
- Khách lấy món mang đi chưa thanh toán.
- Khách ăn uống rồi bỏ đi.
- Đồ trang trí nhỏ hoặc tiền trong quầy bị mất.
- Hàng giao đến thiếu số lượng.
- Người ngoài giả làm người nhận đơn giao hàng.
- Khách bỏ quên đồ và tưởng bị mất cắp.

Dấu hiệu:
- Chênh lệch số món và hóa đơn.
- Tồn kho thực tế khác sổ.
- Đơn bị đánh dấu đã nhận nhưng còn tranh chấp.
- Nhân chứng hoặc bản ghi camera trong game.

Người chơi có thể:
- Kiểm tra hóa đơn, kiểm kho, hỏi người liên quan.
- Nhắc thanh toán hoặc xác minh mã nhận món.
- Hoàn trả đồ thất lạc.
- Ghi nhận tổn thất.
- Nâng cấp tủ tiền, camera, khu giao đơn và quy trình thanh toán.
- Gọi bảo vệ hoặc cơ quan chức năng trong bối cảnh giả lập khi có bằng chứng phù hợp.

Không biến mọi chênh lệch thành trộm cắp. Phải có trường hợp do nhập sai, đếm nhầm, đồ hỏng hoặc hiểu lầm.

Camera có vùng quan sát và giới hạn; mua camera không tự động loại bỏ toàn bộ rủi ro. Tình huống mất cắp giải quyết bằng quản lý, không có minigame đánh người.

### 20.3. Nhân viên mắc lỗi và gian lận

Phân biệt rõ:
- Sai sót vô ý.
- Thiếu đào tạo.
- Quá tải, mệt mỏi.
- Vi phạm quy trình.
- Gian lận có chủ đích.

Ví dụ:
- Thu sai tiền hoặc trả thiếu tiền thừa.
- Làm sai món, giấu món hỏng.
- Tự ý tặng đồ cho bạn.
- Ghi khống hủy đơn hoặc hoàn tiền.
- Lấy nguyên liệu mang về.
- Khai sai giờ làm.
- Che giấu hư hỏng dụng cụ.

Mô phỏng ở mức sự kiện quản lý, không cần mô tả thủ thuật gian lận chi tiết.

Nhân viên có trạng thái nội bộ về tính trách nhiệm, động lực và thái độ. Không hiển thị một chỉ số “tội phạm” cho phép người chơi biết chắc ai gian lận. Người chơi đánh giá qua hành vi và bằng chứng.

Lương thấp hoặc mệt mỏi không tự động khiến nhân viên ăn cắp; chúng chỉ có thể ảnh hưởng tinh thần, hiệu suất hoặc quyết định nghỉ việc.

### 20.4. Điều tra và xử lý nhân sự

Có màn hình hồ sơ vụ việc:
- Chênh lệch được phát hiện.
- Ca làm, nhân viên và giao dịch liên quan.
- Bằng chứng đã thu thập.
- Lời giải thích.
- Mức độ chắc chắn và khả năng có nguyên nhân khác.

Cho phép:
- Trao đổi riêng.
- Kiểm tra lại dữ liệu.
- Hướng dẫn hoặc đào tạo.
- Nhắc nhở.
- Cảnh cáo có ghi nhận.
- Điều chuyển công việc.
- Tạm ngừng phân công tác vụ nhạy cảm.
- Cho cơ hội cải thiện.
- Chấm dứt hợp đồng.

Không kết luận có tội chỉ từ nghi ngờ. Nếu xử lý thiếu căn cứ, có thể giảm tinh thần đội ngũ, mất nhân viên tốt hoặc phát sinh tranh chấp giả lập.

### 20.5. Đuổi việc, nghỉ việc và tuyển người thay thế

Triển khai giao diện chấm dứt hợp đồng:
- Chọn lý do.
- Xem lịch sử làm việc và vi phạm.
- Xem lương còn phải trả cùng chi phí theo hợp đồng giả lập.
- Xem các ca sẽ thiếu người.
- Xác nhận trước khi thực hiện.

Sau khi nghỉ:
- Nhân viên không nhận tác vụ mới.
- Tác vụ và đơn đang làm được bàn giao an toàn.
- Vật phẩm, tiền và nguyên liệu không bị nhân đôi hoặc mất vô lý.
- Hồ sơ cũ vẫn được giữ để giải thích sổ sách.
- Có thể tuyển hoặc đào tạo người thay thế.

Nhân viên cũng có thể tự xin nghỉ vì lịch làm, kiệt sức, mâu thuẫn, ít cơ hội phát triển hoặc lý do cá nhân. Có thể thương lượng đổi ca, tăng lương hoặc thăng chức.

Các quy định hợp đồng và lao động là luật trong game, không được trình bày như quy định pháp luật thực tế.

### 20.6. Đời sống đội ngũ

Thêm:
- Xin đổi ca, nghỉ đột xuất, đi trễ.
- Đồng nghiệp hợp tác tốt hoặc có mâu thuẫn.
- Nhân viên lâu năm hướng dẫn người mới.
- Sáng kiến món mới hoặc cải thiện quy trình.
- Thưởng theo thành tích có tiêu chí rõ ràng.
- Bữa ăn ca và khu nghỉ.
- Thăng cấp từ học việc lên nhân viên chính và quản lý.
- Nhân viên giỏi được nơi khác mời làm.

Quản lý tốt giúp giảm sai sót, tăng gắn bó và hiệu quả. Luôn có sự kiện tích cực để đội ngũ không chỉ là nguồn gây rắc rối.

### 20.7. Khách hàng và tranh chấp

Các tình huống:
- Khách đổi yêu cầu sau khi món đã làm.
- Làm đổ nước.
- Khiếu nại đúng về chất lượng.
- Hiểu lầm đơn hàng.
- Yêu cầu hoàn tiền thiếu căn cứ.
- Đánh giá tiêu cực hoặc thông tin sai.
- Khách chiếm bàn quá lâu trong giờ cao điểm.
- Nhóm khách ồn ào ảnh hưởng người khác.
- Khách tương tác với mèo khi mèo muốn nghỉ.
- Trẻ nhỏ cần được người đi cùng hướng dẫn.
- Khách làm hỏng đồ.

Cách xử lý:
- Giải thích, kiểm tra đơn.
- Làm lại món, hoàn tiền một phần hoặc toàn bộ.
- Tặng mã giảm giá trong giới hạn.
- Nhắc nội quy.
- Từ chối phục vụ hoặc mời rời quán khi cần.
- Phản hồi đánh giá dựa trên dữ kiện.

Hậu quả phụ thuộc cách xử lý và bằng chứng, không mặc định “khách luôn đúng”. Bảo vệ nhân viên và mèo cũng là một phần của quản lý tốt.

### 20.8. Vệ sinh, sức khỏe mèo và an toàn quán

Thêm các hệ thống nhẹ nhàng, không đồ họa gây khó chịu:
- Sàn ướt cần lau và đặt biển.
- Thùng rác đầy.
- Côn trùng xuất hiện nếu vệ sinh kém.
- Tủ lạnh hỏng làm tăng nguy cơ hỏng nguyên liệu.
- Món có thành phần khách đã yêu cầu tránh phải bị chặn hoặc cảnh báo rõ.
- Mèo mệt hoặc có dấu hiệu bất thường cần nghỉ và được đưa đến thú y trong game.
- Mèo trốn ra khu cửa; có thể dụ về và nâng cấp cửa ngăn.
- Kiểm tra vệ sinh theo tiêu chuẩn giả lập của game.

Khu chế biến luôn tách khỏi khu mèo. Không đưa hướng dẫn chữa bệnh thực tế vào trò chơi.

### 20.9. Thị trường và nhà cung cấp

- Giá trà, sữa và trái cây biến động có báo trước.
- Nhà cung cấp giao trễ, thiếu hoặc sai chất lượng.
- Lô hàng có vấn đề cần cách ly và trả lại.
- Có thể đàm phán, đổi nhà cung cấp hoặc giữ nguồn dự phòng.
- Quán cạnh tranh mới mở.
- Trào lưu đồ uống thay đổi.
- Công trình gần quán làm giảm khách tạm thời.
- Lễ hội, văn phòng mới hoặc bài giới thiệu tích cực làm tăng khách.

Không cho đối thủ phá quán ngẫu nhiên liên tục. Cạnh tranh chủ yếu qua giá, chất lượng, món mới và dịch vụ.

### 20.10. Tiền mặt, nợ và khả năng phục hồi

Thêm:
- Hóa đơn đến hạn.
- Quỹ dự phòng.
- Khoản vay trong game với lịch trả rõ ràng.
- Thương lượng gia hạn một số khoản.
- Bán lại thiết bị, giảm menu hoặc điều chỉnh ca để cắt chi phí.
- Bảo hiểm giả lập cho một số sự cố, có điều kiện và giới hạn bồi thường.
- Kế hoạch phục hồi khi thiếu tiền.

Tách tiền vay và tiền chủ quán góp khỏi doanh thu; trả gốc vay không phải chi phí lợi nhuận, lãi vay là chi phí. Xử lý đúng các khoản mất tiền, mất hàng, hoàn tiền và bồi thường; không ghi trùng tổn thất.

Trong chế độ thư giãn, cung cấp hỗ trợ phục hồi. Trong chế độ kinh doanh, có thể thất bại sau cảnh báo rõ và nhiều cơ hội xử lý; cho phép xem lại báo cáo và bắt đầu lại.

### 20.11. Minigame quản lý bổ sung

- Đối soát quầy tiền: tìm giao dịch gây chênh lệch.
- Kiểm kho: đếm và phân loại nguyên liệu.
- Kiểm hàng nhập: so số lượng, nhãn và tình trạng.
- Xếp lịch ca: cân bằng kỹ năng, nhu cầu và ngân sách.
- Dọn quán: ưu tiên khu vực trong thời gian ngắn.
- Xử lý giờ cao điểm: phân luồng đơn, tránh tắc quầy.
- Tìm đồ thất lạc: lần theo dấu vết trong quán.

Cho phép giao các tác vụ lặp lại cho nhân viên đã được đào tạo. Không biến mỗi ngày thành chuỗi công việc bắt buộc quá dài.

### 20.12. Sự kiện tích cực và câu chuyện dài hạn

Cân bằng khó khăn bằng:
- Nhân viên trả lại đồ khách bỏ quên.
- Khách giúp tìm mèo đang trốn.
- Khách quen đặt đơn lớn.
- Món tự sáng tạo trở nên nổi tiếng.
- Nhân viên vượt qua giai đoạn học việc.
- Cộng đồng hỗ trợ quán sau sự cố.
- Lễ kỷ niệm ngày mở quán.
- Một bé mèo nhút nhát dần tin tưởng người chơi.

Một sự kiện có thể mở thành chuỗi nhiều ngày. Quyết định trước đó phải được ghi nhớ và ảnh hưởng hội thoại hoặc kết quả sau này.

## 21. Công bằng, độ khó và AI trong sự kiện

- Có cài đặt tần suất biến cố: ít, vừa, nhiều.
- Cho phép tắt trộm cắp và gian lận nhân viên riêng.
- Ngày đầu chỉ có tình huống nhẹ, có hướng dẫn.
- Sự cố phải có cách phòng ngừa hoặc phục hồi.
- Không âm thầm trừ tiền mà không có dấu vết để điều tra.
- Không tạo sự kiện mất hàng khi không tồn tại hàng tương ứng.
- Không tạo sự kiện với nhân viên đã nghỉ hoặc khách không có mặt.
- Dùng bộ sinh ngẫu nhiên có seed, lưu trạng thái và kết quả khi sự kiện phát sinh để tải lại không tạo sự kiện trùng.

AI chỉ tạo lời thoại và cách diễn đạt dựa trên dữ kiện đã xác định. AI không tự bịa bằng chứng, quyết định ai phạm lỗi, xử phạt hoặc thay đổi sổ sách.

Phân biệt rõ lời cáo buộc, suy đoán và sự thật đã được xác minh.

## 22. Kiến trúc và nghiệm thu bổ sung

Xây dựng một bộ điều phối sự kiện dùng chung, có:
- Điều kiện kích hoạt.
- Đối tượng tham gia.
- Các giai đoạn của sự kiện.
- Lựa chọn và hậu quả.
- Thời gian chờ giữa các lần.
- Nhật ký.
- Cơ chế lưu/tải.
- Mã giao dịch và tác vụ duy nhất.

Mỗi lựa chọn quan trọng phải hiển thị hậu quả đã biết; không tiết lộ chắc chắn những kết quả nhân vật chưa thể biết.

Bổ sung kiểm thử:
- Thất thoát tiền và hàng được ghi đúng, không trừ hai lần.
- Sai sót vô ý không tự động bị gán thành gian lận.
- Sa thải giữa ca bàn giao được tác vụ và thanh toán đúng.
- Nhân viên đã nghỉ không tiếp tục nhận lương hoặc nhiệm vụ mới ngoài nghĩa vụ còn tồn.
- Tải lại không lặp sự cố hoặc phần thưởng.
- Cài đặt tắt sự kiện được tôn trọng.
- Mọi sự cố nghiêm trọng đều có hướng xử lý hợp lệ.
- AI lỗi không chặn việc giải quyết sự kiện.
- Báo cáo tài chính vẫn đối soát đúng sau hoàn tiền, trộm cắp, vay và bồi thường.

Tích hợp phần bổ sung này vào tiến trình triển khai trước khi nghiệm thu cuối. Không làm các tính năng thành những màn hình rời rạc: chúng phải thực sự tác động lên khách, nhân viên, mèo, kho, tiền và danh tiếng của cùng một quán.
## 23. Bắt buộc game 2D và tự tạo toàn bộ tài nguyên hình ảnh

### 23.1. Định hướng hình ảnh

- Game 2D hoàn toàn, góc nhìn từ trên xuống hơi nghiêng.
- Phong cách chibi vẽ tay bằng đồ họa 2D, hình khối mềm, viền rõ, màu pastel ấm.
- Bảng màu chủ đạo: xanh matcha, nâu houjicha, kem sữa và gỗ.
- Giữ đồng nhất tỷ lệ, nét vẽ, hướng sáng và mức chi tiết.
- Không dựng game 3D hoặc đưa mô hình 3D vào thay thế.
- Cảnh quán có chiều sâu nhờ lớp vẽ, bóng đổ và sắp xếp trước/sau theo vị trí nhân vật.

### 23.2. Codex tự tạo tất cả tài nguyên

Tự thiết kế và tạo:
- Nhân vật người chơi.
- Khách hàng.
- Toàn bộ nhân viên và nhân vật sự kiện.
- Mèo.
- Đồ uống, nguyên liệu, topping và bánh.
- Nội thất, thiết bị, đồ chơi mèo.
- Sàn, tường, cửa, cửa sổ, đường phố và cảnh nền.
- Icon, nút, khung giao diện, huy hiệu và con trỏ tương tác.
- Hiệu ứng hình ảnh và hoạt ảnh.

Không yêu cầu tôi cung cấp ảnh, thuê họa sĩ hoặc tự tìm asset.

Không dùng:
- Asset pack tải sẵn.
- Ảnh tìm trên mạng.
- Nhân vật hoặc tài nguyên sao chép từ game khác.
- Thư viện icon có sẵn thay cho bộ icon tự thiết kế.
- Emoji hoặc ký tự Unicode làm hình nhân vật, vật phẩm hay icon chính.
- Hình placeholder trong bản bàn giao.

Được dùng thư viện lập trình, công cụ dựng hình và font hỗ trợ tiếng Việt có giấy phép phù hợp. Yêu cầu tự tạo áp dụng cho tài nguyên mỹ thuật, không yêu cầu tự viết game engine hoặc tự tạo font chữ.

### 23.3. Cách tạo tài nguyên

Ưu tiên xây dựng bộ tạo tài nguyên bằng mã:
- SVG cho icon, vật phẩm và các thành phần phù hợp.
- Canvas hoặc công cụ dựng ảnh để xuất texture, atlas và sprite sheet.
- Hoạt ảnh theo khung hoặc chuyển động các bộ phận 2D.
- Lưu mã nguồn tạo hình để có thể chỉnh sửa và tái tạo.

Nếu có công cụ tạo ảnh, có thể dùng để tạo tài nguyên nguyên bản, sau đó xử lý thành tài nguyên chạy được trong game. Nếu không có công cụ đó, tự hoàn thành bằng SVG/canvas; không dừng công việc để chờ ảnh.

Không chỉ đưa một ảnh lớn làm nền rồi đặt nút lên trên. Nhân vật, mèo, bàn ghế, đồ uống và đối tượng tương tác phải là những thành phần riêng.

### 23.4. Bộ nhân vật tối thiểu

Tạo:
- Một nhân vật người chơi có lựa chọn tóc, màu da và trang phục.
- Ít nhất 12 diện mạo khách khác nhau.
- Ít nhất 6 diện mạo nhân viên, với trang phục phân biệt 5 vai trò.
- Ít nhất 4 nhân vật sự kiện: giao hàng, kỹ thuật viên, thanh tra giả lập và bác sĩ thú y.
- Ít nhất 6 bé mèo; Matcha, Houji và Mochi thuộc nhóm ban đầu, các bé còn lại mở khóa.

Có thể dùng hệ thống ghép bộ phận để tạo biến thể, nhưng không chỉ đổi màu cùng một hình. Kết hợp tóc, vóc dáng, trang phục, phụ kiện và biểu cảm.

Mèo khác nhau về màu lông, hoa văn, tai, đuôi và dáng. Thể hiện tính cách qua chuyển động.

### 23.5. Hoạt ảnh

Nhân vật người:
- Đứng chờ và đi theo bốn hướng.
- Ngồi.
- Cầm hoặc giao món.
- Các động tác làm việc phù hợp với vai trò.
- Biểu cảm vui, thất vọng, mệt và ngạc nhiên.

Mèo:
- Đứng, đi và chạy.
- Ngồi, nằm, ngủ và ngáp.
- Vẫy đuôi, liếm chân.
- Rình và vồ đồ chơi.
- Dụi đầu, phản ứng khi vuốt.
- Ăn và chui vào hộp.

Đồ vật và môi trường:
- Rót sữa, khuấy trà, hơi nóng.
- Lò bánh hoạt động.
- Chuông rung, cửa mở.
- Mưa ngoài cửa sổ.
- Hiệu ứng hoàn thành món, tăng thân thiết và lên cấp.

Có thể tái sử dụng bộ khung chuyển động giữa các nhân vật cùng loại. Không dùng một hình tĩnh lắc qua lại để thay thế toàn bộ hoạt ảnh.

### 23.6. Bộ icon riêng

Thiết kế bộ icon đồng nhất cho:
- Tiền, doanh thu, lợi nhuận, thuế và nợ.
- Kho, nguyên liệu, đơn hàng và công thức.
- Nhân viên, lịch ca, đào tạo và nghỉ việc.
- Mèo, thức ăn, vui vẻ, năng lượng và thân thiết.
- Trang trí, cửa hàng, thiết bị và sửa chữa.
- Camera, cảnh báo, bằng chứng và thất thoát.
- Nhiệm vụ, album, thành tích và cài đặt.
- Lưu game, âm thanh, tạm dừng và trợ giúp.

Icon phải đọc rõ ở kích thước nhỏ. Các nút quan trọng có nhãn tiếng Việt hoặc tooltip; không bắt người chơi đoán ý nghĩa.

### 23.7. Tổ chức và chất lượng tài nguyên

- Có thư mục riêng cho nhân vật, mèo, vật phẩm, nội thất, môi trường, giao diện và hiệu ứng.
- Có manifest ánh xạ tên tài nguyên với đường dẫn, kích thước, khung hình và điểm neo.
- Chuẩn hóa tỷ lệ giữa nhân vật, cửa, bàn ghế và vật phẩm.
- Cắt sprite nhất quán, không rung vị trí giữa các khung.
- Dùng atlas và tái sử dụng texture khi phù hợp.
- Không tạo lại toàn bộ ảnh trong mỗi khung hình.
- Vùng bấm đủ lớn và khớp đối tượng hiển thị.
- Đối tượng tương tác có hiệu ứng chọn hoặc phản hồi khi chạm.

Tạo một trang xem trước nội bộ hiển thị các nhân vật, mèo, icon, vật phẩm và hoạt ảnh để kiểm tra độ đồng nhất.

### 23.8. Nghiệm thu đồ họa

Trước khi bàn giao:
- Kiểm tra trực tiếp cảnh quán ở kích thước máy tính và điện thoại.
- Kiểm tra nhân vật đi trước/sau nội thất đúng lớp.
- Kiểm tra sprite không mất khung, bị cắt hoặc có nền thừa.
- Kiểm tra chữ tiếng Việt không lỗi dấu.
- Kiểm tra không còn icon từ thư viện, emoji thay hình hoặc placeholder.
- Đảm bảo tất cả tài nguyên cần thiết được lưu cùng dự án, không phụ thuộc URL ảnh bên ngoài.
- Bàn giao cả tài nguyên cuối cùng và mã nguồn tạo tài nguyên.

Đây là yêu cầu triển khai bắt buộc. Hãy tự tạo và tích hợp toàn bộ tài nguyên vào gameplay, không chỉ viết danh sách hình ảnh cần làm sau.