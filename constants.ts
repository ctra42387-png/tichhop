
import { DIGITAL_COMPETENCY_FRAMEWORK } from "./types";

// Generate a string representation of the framework for the prompt
const frameworkDescription = DIGITAL_COMPETENCY_FRAMEWORK.map(d => {
  return `${d.title}:\n` + d.components.map(c => {
    let compStr = `   - Mã ${c.id}: ${c.title} (${c.description})`;
    if (c.indicators && c.indicators.length > 0) {
      compStr += '\n     + Chỉ báo: ' + c.indicators.map(i => `${i.code}: ${i.description}`).join(' | ');
    }
    return compStr;
  }).join('\n');
}).join('\n');

export const SYSTEM_INSTRUCTION = `
Bạn là một trợ lý AI chuyên nghiệp dành cho giáo viên Trung học cơ sở (THCS) tại Việt Nam.
Nhiệm vụ của bạn là hỗ trợ soạn thảo "Kế hoạch bài dạy" (Giáo án) theo đúng mẫu công văn 5512/BGDĐT-GDTrH (Mẫu Phụ lục IV).

ĐỐI TƯỢNG HỌC SINH:
- Cấp: THCS (Lớp 6, 7, 8, 9).

NHIỆM VỤ CHÍNH:
Soạn thảo giáo án chi tiết, tích hợp Năng lực số (NLS) theo Thông tư 02/2025.

DỮ LIỆU KHUNG NĂNG LỰC SỐ THAM KHẢO (Mã TC1):
${frameworkDescription}

QUY ĐỊNH QUAN TRỌNG VỀ ĐỊNH DẠNG VÀ NỘI DUNG (BẮT BUỘC TUÂN THỦ):
1. **CỤ THỂ HÓA CÔNG CỤ:** Khi mô tả hoạt động có sử dụng công nghệ, KHÔNG ĐƯỢC viết chung chung (như "dùng phần mềm", "dùng internet"). PHẢI viết cụ thể tên công cụ và hành động (ví dụ: "dùng GeoGebra đo góc", "truy cập Google Form trả lời", "quét mã QR", "dùng Padlet thảo luận").
2. **TÔ MÀU ĐỎ (RED TEXT):** Đối với tất cả các đoạn văn bản mô tả hoạt động của GV hoặc HS có sử dụng yếu tố công nghệ/số, hãy bao quanh bằng thẻ HTML màu đỏ: 
   \`<span style="color: red;">Nội dung hoạt động số... (Mã: ...)</span>\`
   *Lưu ý: Chỉ tô đỏ phần hoạt động số, không tô đỏ cả bảng.*

CẤU TRÚC BẮT BUỘC CỦA GIÁO ÁN (OUTPUT MARKDOWN):

# KẾ HOẠCH BÀI DẠY (Theo CV 5512)
**Trường:** ....................  
**Tổ:** ....................  
**Họ và tên giáo viên:** ....................

**TÊN BÀI DẠY:** [Tên bài]
**Môn học:** [Môn] - **Lớp:** [Lớp]
**Thời gian thực hiện:** ... (tiết)

## I. MỤC TIÊU
1. **Về kiến thức**: Nêu yêu cầu cần đạt về kiến thức.
2. **Về năng lực**:
   - **Năng lực chung**: Tự chủ và tự học, Giao tiếp và hợp tác, Giải quyết vấn đề và sáng tạo.
   - **Năng lực đặc thù**: Năng lực của môn học.
   - **Năng lực số (Tích hợp)**:
     *(Liệt kê các mã năng lực số được tích hợp. Ví dụ: **1.1TC1a**: Sử dụng từ khóa chính xác trên Google).*
3. **Về phẩm chất**: Yêu nước, Nhân ái, Chăm chỉ, Trung thực, Trách nhiệm.

## II. THIẾT BỊ DẠY HỌC VÀ HỌC LIỆU
- Liệt kê thiết bị, phần mềm, học liệu số...

## III. TIẾN TRÌNH DẠY HỌC

### 1. Hoạt động 1: Xác định vấn đề (Mở đầu)
**a) Mục tiêu:** ...
**b) Nội dung:** ...
**c) Sản phẩm:** ...
**d) Tổ chức thực hiện:**
| Hoạt động của GV và HS | Dự kiến sản phẩm |
| :--- | :--- |
| **B1. Chuyển giao nhiệm vụ:**...<br>**B2. Thực hiện nhiệm vụ:**... <br> *[Ví dụ: <span style="color: red;">HS sử dụng điện thoại cá nhân quét mã QR để tham gia trò chơi trên Quizizz (Mã: 2.1TC1a)</span>]*<br>**B3. Báo cáo, thảo luận:**...<br>**B4. Kết luận, nhận định:**... | ... |

### 2. Hoạt động 2: Hình thành kiến thức mới
*(Chia nhỏ thành các hoạt động con theo nội dung bài học)*
**a) Mục tiêu:** ...
**b) Nội dung:** ...
**c) Sản phẩm:** ...
**d) Tổ chức thực hiện:** (Kẻ bảng 2 cột như trên. Nhớ **tô màu đỏ** cho các hành động số)

### 3. Hoạt động 3: Luyện tập
**a) Mục tiêu:** ...
**b) Nội dung:** ...
**c) Sản phẩm:** ...
**d) Tổ chức thực hiện:** (Kẻ bảng 2 cột như trên. Nhớ **tô màu đỏ** cho các hành động số)

### 4. Hoạt động 4: Vận dụng
**a) Mục tiêu:** ...
**b) Nội dung:** ...
**c) Sản phẩm:** ...
**d) Tổ chức thực hiện:** (Kẻ bảng 2 cột như trên. Nhớ **tô màu đỏ** cho các hành động số)

---

## PHÂN TÍCH PHÁT TRIỂN NLS CHO HỌC SINH
*(Bảng này chỉ liệt kê những hoạt động thực sự CÓ tích hợp công nghệ/năng lực số)*

| Thứ tự | Tên hoạt động | Tóm tắt nhiệm vụ của học sinh | Biểu hiện phát triển NLS |
| :---: | :--- | :--- | :--- |
| 1 | [Tên hoạt động] | <span style="color: red;">[Mô tả nhiệm vụ cụ thể có dùng công nghệ. VD: HS dùng chuột di chuyển điểm A trên GeoGebra]</span> | **[Mã số]**: [Mô tả hành vi tương ứng] |
| 2 | ... | ... | ... |

LƯU Ý QUAN TRỌNG:
1. **VỊ TRÍ BẢNG:** Bảng "PHÂN TÍCH PHÁT TRIỂN NLS CHO HỌC SINH" bắt buộc đặt ở **CUỐI CÙNG**.
2. **NỘI DUNG:** Chỉ đưa vào bảng các hoạt động ĐÃ ĐƯỢC TÔ ĐỎ ở phần Tiến trình dạy học.
3. **MÀU SẮC:** Bắt buộc dùng \`<span style="color: red;">...</span>\` cho nội dung liên quan đến công nghệ số.
4. Nội dung phải sát với Sách giáo khoa của chương trình GDPT 2018.
`;

export const SAMPLE_LESSONS: Record<string, Record<string, Record<string, string[]>>> = {
  "Kết nối tri thức với cuộc sống": {
    "Toán học": {
      "6": [
        "Bài 1. Tập hợp", "Bài 2. Cách ghi số tự nhiên", "Bài 3. Thứ tự trong tập hợp các số tự nhiên", "Bài 4. Phép cộng và phép trừ số tự nhiên", "Bài 5. Phép nhân và phép chia số tự nhiên", "Bài 6. Lũy thừa với số mũ tự nhiên", "Bài 7. Thứ tự thực hiện các phép tính", "Bài 8. Quan hệ chia hết và tính chất", "Bài 9. Dấu hiệu chia hết cho 2, cho 5, cho 3, cho 9", "Bài 10. Số nguyên tố", "Bài 11. Phân tích một số ra thừa số nguyên tố", "Bài 12. Ước chung và ước chung lớn nhất", "Bài 13. Bội chung và bội chung nhỏ nhất", "Bài 14. Số nguyên âm và tập hợp các số nguyên", "Bài 15. Quy tắc dấu ngoặc", "Bài 16. Phép nhân số nguyên", "Bài 17. Phép chia hết. Ước và bội của một số nguyên", "Bài 18. Hình tam giác đều. Hình vuông. Hình lục giác đều", "Bài 19. Hình chữ nhật. Hình thoi. Hình bình hành. Hình thang cân", "Bài 20. Chu vi và diện tích của một số hình phẳng", "Bài 21. Tính đối xứng của hình phẳng", "Bài 22. Hình có tâm đối xứng", "Bài 23. Mở rộng phân số. Phân số bằng nhau", "Bài 24. So sánh phân số. Hỗn số dương", "Bài 25. Phép cộng và phép trừ phân số", "Bài 26. Phép nhân và phép chia phân số", "Bài 27. Hai bài toán về phân số", "Bài 28. Số thập phân", "Bài 29. Tính toán với số thập phân", "Bài 30. Làm tròn và ước lượng", "Bài 31. Một số bài toán về tỉ số và tỉ số phần trăm", "Bài 32. Điểm và đường thẳng", "Bài 33. Tia", "Bài 34. Đoạn thẳng. Độ dài đoạn thẳng", "Bài 35. Trung điểm của đoạn thẳng", "Bài 36. Góc", "Bài 37. Số đo góc", "Bài 38. Dữ liệu và tài liệu", "Bài 39. Bảng thống kê và biểu đồ tranh", "Bài 40. Biểu đồ cột", "Bài 41. Biểu đồ cột kép", "Bài 42. Kết quả có thể và sự kiện trong trò chơi, thí nghiệm", "Bài 43. Xác suất thực nghiệm"
      ],
      "7": [
        "Bài 1. Tập hợp các số hữu tỉ", "Bài 2. Cộng, trừ, nhân, chia số hữu tỉ", "Bài 3. Phép tính lũy thừa với số mũ tự nhiên của một số hữu tỉ", "Bài 4. Thứ tự thực hiện các phép tính. Quy tắc chuyển vế", "Bài 5. Làm quen với số thập phân vô hạn tuần hoàn", "Bài 6. Số vô tỉ. Căn bậc hai số học", "Bài 7. Tập hợp các số thực", "Bài 8. Góc ở vị trí đặc biệt. Tia phân giác của một góc", "Bài 9. Hai đường thẳng song song và dấu hiệu nhận biết", "Bài 10. Tiên đề Euclid. Tính chất của hai đường thẳng song song", "Bài 11. Định lí và chứng minh định lí", "Bài 12. Tổng các góc trong một tam giác", "Bài 13. Hai tam giác bằng nhau. Trường hợp bằng nhau thứ nhất của tam giác", "Bài 14. Trường hợp bằng nhau thứ hai và thứ ba của tam giác", "Bài 15. Các trường hợp bằng nhau của tam giác vuông", "Bài 16. Tam giác cân. Đường trung trực của đoạn thẳng", "Bài 17. Thu thập và phân loại dữ liệu", "Bài 18. Biểu đồ hình quạt tròn", "Bài 19. Biểu đồ đoạn thẳng", "Bài 20. Tỉ lệ thức", "Bài 21. Tính chất của dãy tỉ số bằng nhau", "Bài 22. Đại lượng tỉ lệ thuận", "Bài 23. Đại lượng tỉ lệ nghịch", "Bài 24. Biểu thức đại số", "Bài 25. Đa thức một ẩn", "Bài 26. Phép cộng và phép trừ đa thức một ẩn", "Bài 27. Phép nhân đa thức một ẩn", "Bài 28. Phép chia đa thức một ẩn", "Bài 29. Làm quen with biến cố của trò chơi tung đồng xu", "Bài 30. Làm quen with xác suất của biến cố", "Bài 31. Quan hệ giữa góc và cạnh đối diện trong một tam giác", "Bài 32. Quan hệ giữa đường vuông góc và đường xiên", "Bài 33. Quan hệ giữa ba cạnh của một tam giác", "Bài 34. Sự đồng quy của ba đường trung tuyến, ba đường phân giác trong một tam giác", "Bài 35. Sự đồng quy của ba đường trung trực, ba đường cao trong một tam giác", "Bài 36. Hình hộp chữ nhật và hình lập phương", "Bài 37. Hình lăng trụ đứng tam giác. Hình lăng trụ đứng tứ giác"
      ],
      "8": [
        "Bài 1. Đơn thức", "Bài 2. Đa thức", "Bài 3. Phép cộng và phép trừ đa thức", "Bài 4. Phép nhân đa thức", "Bài 5. Phép chia đa thức cho đơn thức", "Bài 6. Hiệu hai bình phương. Bình phương của một tổng hoặc một hiệu", "Bài 7. Lập phương của một tổng hoặc một hiệu", "Bài 8. Tổng và hiệu hai lập phương", "Bài 9. Phân tích đa thức thành nhân tử", "Bài 10. Tứ giác", "Bài 11. Hình thang cân", "Bài 12. Hình bình hành", "Bài 13. Hình chữ nhật", "Bài 14. Hình thoi và hình vuông", "Bài 15. Định lí Thales trong tam giác", "Bài 16. Đường trung bình của tam giác", "Bài 17. Tính chất đường phân giác của tam giác", "Bài 18. Thu thập và phân loại dữ liệu", "Bài 19. Biểu diễn dữ liệu bằng bảng, biểu đồ", "Bài 20. Phân tích số liệu thống kê dựa vào biểu đồ", "Bài 21. Phân thức đại số", "Bài 22. Tính chất cơ bản của phân thức đại số", "Bài 23. Phép cộng và phép trừ phân thức đại số", "Bài 24. Phép nhân và phép chia phân thức đại số", "Bài 25. Phương trình bậc nhất một ẩn", "Bài 26. Giải bài toán bằng cách lập phương trình", "Bài 27. Khái niệm hàm số và đồ thị của hàm số", "Bài 28. Hàm số bậc nhất và đồ thị của hàm số bậc nhất", "Bài 29. Hệ số góc của đường thẳng", "Bài 30. Kết quả có thể và kết quả thuận lợi", "Bài 31. Cách tính xác suất của biến cố bằng tỉ số", "Bài 32. Mối liên hệ giữa xác suất thực nghiệm với xác suất bằng lý thuyết", "Bài 33. Hình chóp tam giác đều", "Bài 34. Hình chóp tứ giác đều", "Bài 35. Định lí Pythagore và ứng dụng", "Bài 36. Các trường hợp đồng dạng của hai tam giác", "Bài 37. Hình đồng dạng"
      ],
      "9": [
        "Bài 1. Khái niệm phương trình và hệ hai phương trình bậc nhất hai ẩn", "Bài 2. Giải hệ hai phương trình bậc nhất hai ẩn", "Bài 3. Giải bài toán bằng cách lập hệ phương trình", "Bài 4. Phương trình quy về phương trình bậc nhất một ẩn", "Bài 5. Bất đẳng thức và tính chất", "Bài 6. Bất phương trình bậc nhất một ẩn", "Bài 7. Căn bậc hai và căn thức bậc hai", "Bài 8. Khai căn bậc hai với phép nhân và phép chia", "Bài 9. Biến đổi đơn giản biểu thức chứa căn bậc hai", "Bài 10. Căn bậc ba và căn thức bậc ba", "Bài 11. Tỉ số lượng giác của góc nhọn", "Bài 12. Một số hệ thức giữa cạnh và góc trong tam giác vuông", "Bài 13. Mở đầu về đường tròn", "Bài 14. Vị trí tương đối của đường thẳng và đường tròn", "Bài 15. Vị trí tương đối của hai đường tròn", "Bài 16. Cung và dây của đường tròn", "Bài 17. Độ dài đường tròn và diện tích hình tròn", "Bài 18. Hàm số y = ax² (a ≠ 0)", "Bài 19. Phương trình bậc hai một ẩn", "Bài 20. Định lí Viète và ứng dụng", "Bài 21. Giải bài toán bằng cách lập phương trình bậc hai", "Bài 22. Bảng tần số và biểu đồ tần số", "Bài 23. Bảng tần số tương đối và biểu đồ tần số tương đối", "Bài 24. Phép thử ngẫu nhiên và không gian mẫu", "Bài 25. Hình trụ", "Bài 26. Hình nón và hình cầu", "Bài 27. Góc nội tiếp", "Bài 28. Tiếp tuyến của đường tròn", "Bài 29. Tứ giác nội tiếp", "Bài 30. Tần số và tần số tương đối"
      ]
    },
    "Ngữ văn": {
      "6": [
        "Bài 1. Tôi và các bạn (Truyện đồng thoại)", "Bài 2. Gõ cửa trái tim (Thơ)", "Bài 3. Yêu thương và chia sẻ (Truyện ngắn)", "Bài 4. Quê hương yêu dấu (Thơ)", "Bài 5. Những nẻo đường xứ sở (Du kí)", "Bài 6. Chuyện kể về những anh hùng (Truyền thuyết)", "Bài 7. Thế giới cổ tích (Truyện cổ tích)", "Bài 8. Khác biệt và gần gũi (Nghị luận)", "Bài 9. Trái Đất – ngôi nhà chung (Văn bản thông tin)", "Bài 10. Cuốn sách tôi yêu"
      ],
      "7": [
        "Bài 1. Bầu trời tuổi thơ (Truyện)", "Bài 2. Khúc nhạc tâm hồn (Thơ bốn chữ, năm chữ)", "Bài 3. Cội nguồn yêu thương (Truyện)", "Bài 4. Giai điệu đất nước (Thơ)", "Bài 5. Màu sắc dân gian (Tục ngữ và chèo, tuồng)", "Bài 6. Bài học cuộc sống (Ngụ ngôn)", "Bài 7. Thế giới viễn tưởng (Truyện khoa học viễn tưởng)", "Bài 8. Trải nghiệm để trưởng thành (Nghị luận)", "Bài 9. Hòa điệu với tự nhiên (Văn bản thông tin)", "Bài 10. Trang sách và cuộc sống"
      ],
      "8": [
        "Bài 1. Câu chuyện của lịch sử (Truyện lịch sử)", "Bài 2. Vẻ đẹp cổ điển (Thơ Đường luật)", "Bài 3. Lời sông núi (Văn bản nghị luận)", "Bài 4. Tiếng cười trong văn học (Truyện cười)", "Bài 5. Những câu chuyện hài (Kịch)", "Bài 6. Chân dung kẻ sĩ (Truyện ngắn)", "Bài 7. Tin yêu và ước vọng (Thơ tự do)", "Bài 8. Chủ quyền quốc gia (Văn bản thông tin)", "Bài 9. Hôm nay và ngày mai (Nghị luận xã hội)", "Bài 10. Sách – người bạn đồng hành"
      ],
      "9": [
        "Bài 1. Vườn quốc gia Cúc Phương (Văn bản thuyết minh)", "Bài 2. Những hồn thơ đẹp (Thơ hiện đại)", "Bài 3. Di sản văn hóa (Nghị luận văn học)", "Bài 4. Khám phá bí ẩn (Truyện trinh thám)", "Bài 5. Khát vọng công lí (Truyện thơ Nôm)", "Bài 6. Bản sắc dân tộc (Kịch)", "Bài 7. Thế giới đa dạng (Truyện ngắn)", "Bài 8. Tiếng nói của văn chương (Nghị luận)", "Bài 9. Hành trang vào đời (Văn bản thông tin)"
      ]
    },
    "Khoa học tự nhiên": {
      "6": [
        "Bài 1. Giới thiệu về Khoa học tự nhiên", "Bài 2. An toàn trong phòng thực hành", "Bài 3. Sử dụng kính lúp", "Bài 4. Sử dụng kính hiển vi quang học", "Bài 5. Đo chiều dài", "Bài 6. Đo khối lượng", "Bài 7. Đo thời gian", "Bài 8. Đo nhiệt độ", "Bài 9. Sự đa dạng của chất", "Bài 10. Các thể của chất và sự chuyển thể", "Bài 11. Oxygen và không khí", "Bài 12. Một số vật liệu", "Bài 13. Một số nhiên liệu", "Bài 14. Một số nguyên liệu", "Bài 15. Một số lương thực - thực phẩm", "Bài 16. Hỗn hợp các chất", "Bài 17. Tách chất ra khỏi hỗn hợp", "Bài 18. Tế bào – Đơn vị cơ sở của sự sống", "Bài 19. Cấu tạo và chức năng các thành phần của tế bào", "Bài 20. Sự lớn lên và sinh sản của tế bào", "Bài 21. Thực hành: Quan sát và phân biệt một số loại tế bào", "Bài 22. Cơ thể sinh vật", "Bài 23. Tổ chức cơ thể đa bào", "Bài 24. Thực hành: Quan sát và mô tả cơ thể đơn bào, cơ thể đa bào", "Bài 25. Hệ thống phân loại sinh vật", "Bài 26. Khóa lưỡng phân", "Bài 27. Vi khuẩn", "Bài 28. Nấm", "Bài 29. Thực vật", "Bài 30. Động vật", "Bài 31. Thực hành: Quan sát và phân loại động vật ngoài thiên nhiên", "Bài 32. Nấm và vai trò của nấm", "Bài 33. Thực hành: Quan sát các loại nấm", "Bài 34. Thực vật - Đa dạng thực vật", "Bài 35. Thực hành: Quan sát và phân loại thực vật", "Bài 36. Động vật không xương sống", "Bài 37. Động vật có xương sống", "Bài 38. Đa dạng sinh học", "Bài 39. Tìm hiểu sinh vật ngoài thiên nhiên", "Bài 40. Lực là gì?", "Bài 41. Biểu diễn lực", "Bài 42. Biến dạng của lò xo", "Bài 43. Trọng lượng và khối lượng", "Bài 44. Lực ma sát", "Bài 45. Lực tiếp xúc và lực không tiếp xúc", "Bài 46. Năng lượng và sự truyền năng lượng", "Bài 47. Một số dạng năng lượng", "Bài 48. Sự chuyển hóa năng lượng", "Bài 49. Năng lượng hao phí", "Bài 50. Năng lượng tái tạo", "Bài 51. Tiết kiệm năng lượng", "Bài 52. Chuyển động nhìn thấy của Mặt Trời", "Bài 53. Mặt Trăng", "Bài 54. Hệ Mặt Trời", "Bài 55. Ngân Hà"
      ],
      "7": [
        "Bài 1. Phương pháp và kĩ năng học tập môn KHTN", "Bài 2. Nguyên tử", "Bài 3. Nguyên tố hóa học", "Bài 4. Sơ lược về bảng tuần hoàn các nguyên tố hóa học", "Bài 5. Phân tử - Đơn chất - Hợp chất", "Bài 6. Giới thiệu về liên kết hóa học", "Bài 7. Hóa trị và công thức hóa học", "Bài 8. Tốc độ chuyển động", "Bài 9. Đo tốc độ", "Bài 10. Đồ thị quãng đường - thời gian", "Bài 11. Thảo luận về ảnh hưởng của tốc độ trong an toàn giao thông", "Bài 12. Sóng âm", "Bài 13. Độ to và độ cao của âm", "Bài 14. Phản xạ âm, chống ô nhiễm tiếng ồn", "Bài 15. Năng lượng ánh sáng. Tia sáng, vùng tối", "Bài 16. Sự phản xạ ánh sáng", "Bài 17. Ảnh hưởng của vật qua gương phẳng", "Bài 18. Nam châm", "Bài 19. Từ trường", "Bài 20. Chế tạo nam châm điện đơn giản", "Bài 21. Khái quát về trao đổi chất và chuyển hóa năng lượng", "Bài 22. Quang hợp ở thực vật", "Bài 23. Một số yếu tố ảnh hưởng đến quang hợp", "Bài 24. Thực hành: Chứng minh quang hợp ở cây xanh", "Bài 25. Hô hấp tế bào", "Bài 26. Thực hành: Hô hấp ở hạt nảy mầm", "Bài 27. Trao đổi khí ở sinh vật", "Bài 28. Trao đổi nước và chất dinh dưỡng ở thực vật", "Bài 29. Trao đổi nước và chất dinh dưỡng ở động vật", "Bài 30. Vận chuyển các chất trong thân cây", "Bài 31. Trao đổi chất và chuyển hóa năng lượng ở người", "Bài 32. Cảm ứng ở sinh vật", "Bài 33. Tập tính ở động vật", "Bài 34. Sinh trưởng và phát triển ở sinh vật", "Bài 35. Các nhân tố ảnh hưởng đến sinh trưởng và phát triển của sinh vật", "Bài 36. Khái quát về sinh trưởng và phát triển ở sinh vật", "Bài 37. Sinh sản ở sinh vật", "Bài 38. Các nhân tố ảnh hưởng đến sinh sản ở sinh vật và điều khiển sinh sản ở sinh vật", "Bài 39. Chứng minh thân cây vận chuyển nước và lá cây thoát hơi nước", "Bài 40. Quan sát, mô tả sự sinh trưởng và phát triển ở một số sinh vật"
      ],
      "8": [
        "Bài 1. Sử dụng một số hóa chất, thiết bị cơ bản trong phòng thực hành", "Bài 2. Phản ứng hóa học", "Bài 3. Mol và tỉ khối chất khí", "Bài 4. Dung dịch và nồng độ", "Bài 5. Định luật bảo toàn khối lượng và phương trình hóa học", "Bài 6. Tính theo phương trình hóa học", "Bài 7. Tốc độ phản ứng và chất xúc tác", "Bài 8. Acid", "Bài 9. Base. Thang pH", "Bài 10. Oxide", "Bài 11. Muối", "Bài 12. Phân bón hóa học", "Bài 13. Khối lượng riêng", "Bài 14. Thực hành xác định khối lượng riêng", "Bài 15. Áp suất trên một bề mặt", "Bài 16. Áp suất chất lỏng. Nguyên lí Pascal", "Bài 17. Áp suất khí quyển", "Bài 18. Lực đẩy Archimedes", "Bài 19. Đòn bẩy", "Bài 20. Hiện tượng nhiễm điện do cọ xát", "Bài 21. Dòng điện, nguồn điện", "Bài 22. Mạch điện đơn giản", "Bài 23. Tác dụng của dòng điện", "Bài 24. Cường độ dòng điện và hiệu điện thế", "Bài 25. Thực hành: Đo cường độ dòng điện và hiệu điện thế", "Bài 26. Năng lượng nhiệt và nội năng", "Bài 27. Dẫn nhiệt, đối lưu, bức xạ nhiệt", "Bài 28. Sự nở vì nhiệt", "Bài 29. Thực hành: Đo nhiệt độ", "Bài 30. Khái quát về cơ thể người", "Bài 31. Hệ vận động ở người", "Bài 32. Dinh dưỡng và tiêu hóa ở người", "Bài 33. Máu và hệ tuần hoàn của cơ thể người", "Bài 34. Hệ hô hấp ở người", "Bài 35. Hệ bài tiết ở người", "Bài 36. Điều hòa môi trường trong của cơ thể người", "Bài 37. Hệ thần kinh và các giác quan ở người", "Bài 38. Hệ nội tiết ở người", "Bài 39. Da và điều hòa thân nhiệt ở người", "Bài 40. Sinh sản ở người", "Bài 41. Môi trường và các nhân tố sinh thái", "Bài 42. Quần thể sinh vật", "Bài 43. Quần xã sinh vật", "Bài 44. Hệ sinh thái", "Bài 45. Sinh quyển", "Bài 46. Cân bằng tự nhiên và bảo vệ môi trường"
      ],
      "9": [
        "Bài 1. Nhận biết nội năng", "Bài 2. Động năng. Thế năng", "Bài 3. Năng lượng của vật và sự chuyển hóa năng lượng", "Bài 4. Công và công suất", "Bài 5. Khúc xạ ánh sáng", "Bài 6. Phản xạ toàn phần", "Bài 7. Thấu kính", "Bài 8. Kính lúp. Bài tập thấu kính", "Bài 9. Ánh sáng trắng và ánh sáng màu", "Bài 10. Màu sắc ánh sáng", "Bài 11. Điện trở. Định luật Ohm", "Bài 12. Đoạn mạch nối tiếp và đoạn mạch song song", "Bài 13. Năng lượng của dòng điện và công suất điện", "Bài 14. An toàn điện", "Bài 15. Từ trường của dây dẫn có dòng điện", "Bài 16. Cảm ứng điện từ", "Bài 17. Máy phát điện xoay chiều", "Bài 18. Dòng điện xoay chiều", "Bài 19. Sử dụng năng lượng điện trong gia đình", "Bài 20. Tính chất chung của kim loại", "Bài 21. Dãy hoạt động hóa học", "Bài 22. Giới thiệu về hợp chất hữu cơ", "Bài 23. Alkane", "Bài 24. Ethylic alcohol", "Bài 25. Acetic acid", "Bài 26. Lipid và chất béo", "Bài 27. Glucose và Saccharose", "Bài 28. Protein", "Bài 29. Polymer", "Bài 30. Khai thác tài nguyên từ vỏ Trái Đất", "Bài 31. Sơ lược về hóa học vỏ Trái Đất", "Bài 32. Khai thác đá vôi và đất sét", "Bài 33. Khai thác nhiên liệu hóa thạch", "Bài 34. Nguồn năng lượng tái tạo", "Bài 35. Di truyền học Mendel", "Bài 36. Nucleic acid và gene", "Bài 37. Đột biến gene", "Bài 38. Nhiễm sắc thể và đột biến nhiễm sắc thể", "Bài 39. Di truyền học người", "Bài 40. Ứng dụng di truyền học", "Bài 41. Tiến hóa và sự hình thành loài", "Bài 42. Cơ chế tiến hóa", "Bài 43. Sự phát sinh và phát triển của sinh giới", "Bài 44. Bằng chứng tiến hóa", "Bài 45. Tiến hóa của sinh giới"
      ]
    },
    "Lịch sử & Địa lí": {
      "6": [
        "Lịch sử 6 - Bài 1. Lịch sử và cuộc sống", "Lịch sử 6 - Bài 2. Thời gian trong lịch sử", "Lịch sử 6 - Bài 3. Nguồn gốc loài người", "Lịch sử 6 - Bài 4. Xã hội nguyên thủy", "Lịch sử 6 - Bài 5. Sự chuyển biến từ xã hội nguyên thủy sang xã hội có giai cấp", "Lịch sử 6 - Bài 6. Ai Cập và Lưỡng Hà cổ đại", "Lịch sử 6 - Bài 7. Ấn Độ cổ đại", "Lịch sử 6 - Bài 8. Trung Quốc từ thời cổ đại đến thế kỉ VII", "Lịch sử 6 - Bài 9. Hy Lạp và La Mã cổ đại", "Lịch sử 6 - Bài 10. Các quốc gia cổ đại phương Đông", "Lịch sử 6 - Bài 11. Các quốc gia cổ đại phương Tây", "Lịch sử 6 - Bài 12. Văn hóa cổ đại", "Lịch sử 6 - Bài 13. Giao lưu văn hóa ở Đông Nam Á", "Lịch sử 6 - Bài 14. Nhà nước Văn Lang, Âu Lạc", "Lịch sử 6 - Bài 15. Chính sách cai trị của các triều đại phong kiến phương Bắc", "Lịch sử 6 - Bài 16. Cuộc đấu tranh giành độc lập của nhân dân ta thời Bắc thuộc", "Lịch sử 6 - Bài 17. Cuộc đấu tranh bảo tồn và phát triển văn hóa dân tộc", "Lịch sử 6 - Bài 18. Các cuộc đấu tranh tiêu biểu giành độc lập dân tộc trước thế kỉ X", "Lịch sử 6 - Bài 19. Bước ngoặt lịch sử ở đầu thế kỉ X", "Lịch sử 6 - Bài 20. Vương quốc Phù Nam", "Lịch sử 6 - Bài 21. Vương quốc Chăm-pa", "Địa lí 6 - Bài 1. Hệ thống kinh, vĩ tuyến. Tọa độ địa lí", "Địa lí 6 - Bài 2. Bản đồ. Một số lưới kinh, vĩ tuyến", "Địa lí 6 - Bài 3. Tỉ lệ bản đồ", "Địa lí 6 - Bài 4. Kí hiệu và bảng chú giải bản đồ", "Địa lí 6 - Bài 5. Lược đồ trí nhớ", "Địa lí 6 - Bài 6. Trái Đất trong hệ Mặt Trời", "Địa lí 6 - Bài 7. Chuyển động tự quay quanh trục của Trái Đất", "Địa lí 6 - Bài 8. Chuyển động quanh Mặt Trời của Trái Đất", "Địa lí 6 - Bài 9. Hiện tượng ngày đêm dài ngắn theo mùa", "Địa lí 6 - Bài 10. Cấu tạo của Trái Đất. Các mảng kiến tạo", "Địa lí 6 - Bài 11. Quá trình nội sinh và quá trình ngoại sinh", "Địa lí 6 - Bài 12. Núi lửa và động đất", "Địa lí 6 - Bài 13. Khí quyển. Các khối khí. Khí áp và gió", "Địa lí 6 - Bài 14. Nhiệt độ và mưa. Thời tiết và khí hậu", "Địa lí 6 - Bài 15. Biến đổi khí hậu và ứng phó with biến đổi khí hậu", "Địa lí 6 - Bài 16. Thủy quyển. Vòng tuần hoàn nước. Nước ngầm và băng hà", "Địa lí 6 - Bài 17. Sông và hồ", "Địa lí 6 - Bài 18. Biển và đại dương", "Địa lí 6 - Bài 19. Lớp đất trên Trái Đất", "Địa lí 6 - Bài 20. Sinh vật và sự phân bố các đới thiên nhiên", "Địa lí 6 - Bài 21. Lớp vỏ địa lí. Quy luật thống nhất và hoàn chỉnh", "Địa lí 6 - Bài 22. Dân số và sự phân bố dân cư", "Địa lí 6 - Bài 23. Con người và thiên nhiên"
      ],
      "7": [
        "Lịch sử 7 - Bài 1. Quá trình hình thành và phát triển của chế độ phong kiến Tây Âu", "Lịch sử 7 - Bài 2. Các cuộc phát kiến địa lí", "Lịch sử 7 - Bài 3. Phong trào Văn hóa Phục hưng", "Lịch sử 7 - Bài 4. Trung Quốc từ thế kỉ VII đến thế kỉ XIX", "Lịch sử 7 - Bài 5. Ấn Độ từ thế kỉ IV đến thế kỉ XIX", "Lịch sử 7 - Bài 6. Các quốc gia phong kiến Đông Nam Á", "Lịch sử 7 - Bài 7. Vương quốc Lào", "Lịch sử 7 - Bài 8. Vương quốc Cam-pu-chia", "Lịch sử 7 - Bài 9. Đất nước buổi đầu độc lập (939-967)", "Lịch sử 7 - Bài 10. Đại Việt thời Lý (1009-1225)", "Lịch sử 7 - Bài 11. Nhà Trần thành lập và củng cố quyền lực", "Lịch sử 7 - Bài 12. Cuộc kháng chiến chống quân xâm lược Mông - Nguyên", "Lịch sử 7 - Bài 13. Cuộc kháng chiến chống quân xâm lược Xiêm và Thanh", "Lịch sử 7 - Bài 14. Công cuộc xây dựng và bảo vệ đất nước thời Lê sơ", "Lịch sử 7 - Bài 15. Đại Việt thế kỉ XVI - XVIII", "Lịch sử 7 - Bài 16. Khởi nghĩa Lam Sơn", "Địa lí 7 - Bài 1. Vị trí địa lí, đặc điểm tự nhiên châu Âu", "Địa lí 7 - Bài 2. Đặc điểm dân cư, xã hội châu Âu", "Địa lí 7 - Bài 3. Khai thác, sử dụng và bảo vệ thiên nhiên ở châu Âu", "Địa lí 7 - Bài 4. Liên minh châu Âu", "Địa lí 7 - Bài 5. Vị trí địa lí, đặc điểm tự nhiên châu Á", "Địa lí 7 - Bài 6. Đặc điểm dân cư, xã hội châu Á", "Địa lí 7 - Bài 7. Bản đồ chính trị châu Á. Các khu vực của châu Á", "Địa lí 7 - Bài 8. Thực hành: Tìm hiểu các nền kinh tế lớn và kinh tế mới nổi ở châu Á", "Địa lí 7 - Bài 9. Vị trí địa lí, đặc điểm tự nhiên châu Phi", "Địa lí 7 - Bài 10. Đặc điểm dân cư, xã hội châu Phi", "Địa lí 7 - Bài 11. Phương thức con người khai thác, sử dụng và bảo vệ thiên nhiên ở châu Phi", "Địa lí 7 - Bài 12. Thực hành: Sưu tầm tư liệu về cộng đồng người Việt ở nước ngoài", "Địa lí 7 - Bài 13. Vị trí địa lí, đặc điểm tự nhiên châu Mỹ", "Địa lí 7 - Bài 14. Đặc điểm dân cư, xã hội Bắc Mỹ", "Địa lí 7 - Bài 15. Phương thức con người khai thác tự nhiên bền vững ở Bắc Mỹ", "Địa lí 7 - Bài 16. Đặc điểm dân cư, xã hội Trung và Nam Mỹ", "Địa lí 7 - Bài 17. Phương thức con người khai thác, sử dụng và bảo vệ thiên nhiên ở Trung và Nam Mỹ", "Địa lí 7 - Bài 18. Vị trí địa lí, đặc điểm tự nhiên châu Đại Dương", "Địa lí 7 - Bài 19. Đặc điểm dân cư, xã hội châu Đại Dương", "Địa lí 7 - Bài 20. Vị trí địa lí, đặc điểm tự nhiên châu Nam Cực"
      ],
      "8": [
        "Lịch sử 8 - Bài 1. Cách mạng tư sản Anh và chiến tranh giành độc lập ở Bắc Mỹ", "Lịch sử 8 - Bài 2. Cách mạng tư sản Pháp cuối thế kỉ XVIII", "Lịch sử 8 - Bài 3. Cách mạng công nghiệp", "Lịch sử 8 - Bài 4. Đông Nam Á từ nửa sau thế kỉ XIX đến đầu thế kỉ XX", "Lịch sử 8 - Bài 5. Cuộc xung đột Nam - Bắc triều và Trịnh - Nguyễn", "Lịch sử 8 - Bài 6. Công cuộc khai phá vùng đất phía Nam từ thế kỉ XVI đến thế kỉ XVIII", "Lịch sử 8 - Bài 7. Phong trào khởi nghĩa nông dân ở Đàng Ngoài thế kỉ XVIII", "Lịch sử 8 - Bài 8. Phong trào Tây Sơn", "Lịch sử 8 - Bài 9. Đại Việt thời Nguyễn", "Lịch sử 8 - Bài 10. Sự hình thành chủ nghĩa tư bản ở châu Âu và Bắc Mỹ", "Lịch sử 8 - Bài 11. Các nước Anh, Pháp, Đức, Mỹ từ cuối thế kỉ XIX đến đầu thế kỉ XX", "Lịch sử 8 - Bài 12. Sự phát triển của khoa học, kĩ thuật, văn học, nghệ thuật trong các thế kỉ XVIII - XIX", "Lịch sử 8 - Bài 13. Trung Quốc và Nhật Bản từ nửa sau thế kỉ XIX đến đầu thế kỉ XX", "Lịch sử 8 - Bài 14. Ấn Độ và khu vực Đông Nam Á từ nửa sau thế kỉ XIX đến đầu thế kỉ XX", "Lịch sử 8 - Bài 15. Việt Nam nửa đầu thế kỉ XIX", "Địa lí 8 - Bài 1. Vị trí địa lí và phạm vi lãnh thổ Việt Nam", "Địa lí 8 - Bài 2. Địa hình Việt Nam", "Địa lí 8 - Bài 3. Khoáng sản Việt Nam", "Địa lí 8 - Bài 4. Khí hậu Việt Nam", "Địa lí 8 - Bài 5. Thực hành: Vẽ và phân tích biểu đồ khí hậu", "Địa lí 8 - Bài 6. Thủy văn Việt Nam", "Địa lí 8 - Bài 7. Thực hành: Viết báo cáo về đặc điểm sông ngòi địa phương", "Địa lí 8 - Bài 8. Thổ nhưỡng Việt Nam", "Địa lí 8 - Bài 9. Thực hành: Tìm hiểu đặc điểm lớp phủ thổ nhưỡng ở địa phương", "Địa lí 8 - Bài 10. Sinh vật Việt Nam", "Địa lí 8 - Bài 11. Phạm vi biển đảo Việt Nam", "Địa lí 8 - Bài 12. Môi trường và tài nguyên biển đảo Việt Nam"
      ],
      "9": [
        "Lịch sử 9 - Bài 1. Nước Nga và Liên Xô từ năm 1918 đến năm 1945", "Lịch sử 9 - Bài 2. Châu Âu và nước Mỹ từ năm 1918 đến năm 1945", "Lịch sử 9 - Bài 3. Phong trào giải phóng dân tộc ở các nước Á, Phi, Mỹ La-tinh", "Lịch sử 9 - Bài 4. Chiến tranh thế giới thứ hai (1939-1945)", "Lịch sử 9 - Bài 5. Phong trào dân tộc dân chủ ở Việt Nam (1918-1930)", "Lịch sử 9 - Bài 6. Hoạt động của Nguyễn Ái Quốc ở nước ngoài (1911-1930)", "Lịch sử 9 - Bài 7. Đảng Cộng sản Việt Nam ra đời", "Lịch sử 9 - Bài 8. Cách mạng tháng Tám năm 1945", "Lịch sử 9 - Bài 9. Việt Nam trong những năm đầu sau Cách mạng tháng Tám", "Lịch sử 9 - Bài 10. Khởi đầu cuộc kháng chiến chống thực dân Pháp (1946-1950)", "Lịch sử 9 - Bài 11. Bước phát triển mới của cuộc kháng chiến chống thực dân Pháp (1951-1954)", "Lịch sử 9 - Bài 12. Cuộc kháng chiến chống Mỹ cứu nước (1954-1975)", "Lịch sử 9 - Bài 13. Xây dựng chủ nghĩa xã hội và đấu tranh bảo vệ Tổ quốc (1975-1991)", "Địa lí 9 - Bài 1. Dân tộc và dân số của Việt Nam", "Địa lí 9 - Bài 2. Phân bố dân cư và các loại hình quần cư", "Địa lí 9 - Bài 3. Thực hành: Phân tích vấn đề việc làm ở địa phương", "Địa lí 9 - Bài 4. Nông nghiệp, lâm nghiệp và thủy sản", "Địa lí 9 - Bài 5. Thực hành: Vẽ biểu đồ và phân tích sự thay đổi cơ cấu ngành nông nghiệp", "Địa lí 9 - Bài 6. Công nghiệp", "Địa lí 9 - Bài 7. Thực hành: Tìm hiểu về một số ngành công nghiệp ở địa phương", "Địa lí 9 - Bài 8. Dịch vụ", "Địa lí 9 - Bài 9. Giao thông vận tải và bưu chính viễn thông", "Địa lí 9 - Bài 10. Vùng Trung du và miền núi Bắc Bộ", "Địa lí 9 - Bài 11. Thực hành: Tìm hiểu về vùng Trung du và miền núi Bắc Bộ", "Địa lí 9 - Bài 12. Vùng Đồng bằng sông Hồng", "Địa lí 9 - Bài 13. Thực hành: Tìm hiểu về vùng Đồng bằng sông Hồng", "Địa lí 9 - Bài 14. Vùng Bắc Trung Bộ", "Địa lí 9 - Bài 15. Vùng Duyên hải Nam Trung Bộ", "Địa lí 9 - Bài 16. Vùng Tây Nguyên", "Địa lí 9 - Bài 17. Vùng Đông Nam Bộ", "Địa lí 9 - Bài 18. Vùng Đồng bằng sông Cửu Long", "Địa lí 9 - Bài 19. Phát triển kinh tế biển đảo"
      ]
    },
    "Tin học": {
      "6": [
        "Bài 1. Thông tin và dữ liệu", "Bài 2. Lưu trữ và trao đổi thông tin", "Bài 3. Máy tính trong hoạt động thông tin", "Bài 4. Biểu diễn văn bản, hình ảnh, âm thanh trong máy tính", "Bài 5. Internet", "Bài 6. Mạng thông tin toàn cầu", "Bài 7. Tìm kiếm thông tin trên Internet", "Bài 8. Thư điện tử", "Bài 9. An toàn thông tin trên Internet", "Bài 10. Sơ đồ tư duy", "Bài 11. Định dạng văn bản", "Bài 12. Trình bày thông tin ở dạng bảng", "Bài 13. Thuật toán", "Bài 14. Giải quyết vấn đề", "Bài 15. Làm quen with Scratch", "Bài 16. Cấu trúc tuần tự trong Scratch", "Bài 17. Chương trình đầu tiên của em"
      ],
      "7": [
        "Bài 1. Thiết bị vào - ra", "Bài 2. Phần mềm máy tính", "Bài 3. Quản lý dữ liệu trong máy tính", "Bài 4. Mạng xã hội", "Bài 5. Ứng xử trên mạng", "Bài 6. Làm quen with bảng tính điện tử", "Bài 7. Tính toán tự động trên trang tính", "Bài 8. Sử dụng các hàm có sẵn", "Bài 9. Định dạng trang tính", "Bài 10. Hoàn thiện bảng tính", "Bài 11. Tạo bài trình chiếu", "Bài 12. Định dạng đối tượng trên trang tính", "Bài 13. Thuật toán tìm kiếm", "Bài 14. Thuật toán sắp xếp", "Bài 15. Sử dụng cấu trúc rẽ nhánh trong Scratch", "Bài 16. Sử dụng biến và biểu thức"
      ],
      "8": [
        "Bài 1. Lược sử công cụ tính toán", "Bài 2. Mã hóa thông tin", "Bài 3. Danh sách câu hỏi và trả lời", "Bài 4. Đạo đức và văn hóa trong môi trường số", "Bài 5. Sử dụng địa chỉ ô tính trong công thức", "Bài 6. Sắp xếp và lọc dữ liệu", "Bài 7. Trình bày dữ liệu bằng biểu đồ", "Bài 8a. Làm quen with phần mềm đồ họa", "Bài 8b. Phần mềm chỉnh sửa ảnh", "Bài 9. Cấu trúc lặp trong chương trình", "Bài 10. Sử dụng biến trong chương trình", "Bài 11. Danh sách trong chương trình", "Bài 12. Từ thuật toán đến chương trình", "Bài 13. Thực hành lập trình: Trò chơi toán học"
      ],
      "9": [
        "Bài 1. Thế giới kĩ thuật số", "Bài 2. Khả năng của máy tính", "Bài 3. Một số vấn đề pháp lí về sử dụng dịch vụ Internet", "Bài 4. Giao tiếp an toàn trên Internet", "Bài 5. Tìm hiểu phần mềm mô phỏng", "Bài 6. Thực hành khai thác phần mềm mô phỏng", "Bài 7. Sử dụng phần mềm trình chiếu", "Bài 8. Biên tập video", "Bài 9. Các bước lập chương trình", "Bài 10a. Thực hành: Làm một bài thuyết trình", "Bài 10b. Thực hành: Làm video", "Bài 11. Dự án: Thế giới quanh em"
      ]
    },
    "Công nghệ": {
      "6": ["Bài 1. Nhà ở đối với con người", "Bài 2. Xây dựng nhà ở", "Bài 3. Ngôi nhà thông minh", "Bài 4. Thực phẩm và dinh dưỡng", "Bài 5. Phương pháp bảo quản và chế biến thực phẩm", "Bài 6. Dự án: Bữa ăn kết nối yêu thương", "Bài 7. Trang phục trong đời sống", "Bài 8. Sử dụng và bảo quản trang phục", "Bài 9. Thời trang", "Bài 10. Khái quát về đồ dùng điện trong gia đình", "Bài 11. Đèn điện", "Bài 12. Nồi cơm điện", "Bài 13. Bếp hồng ngoại", "Bài 14. Dự án: Đồ dùng điện tiết kiệm năng lượng"],
      "7": ["Bài 1. Giới thiệu về trồng trọt", "Bài 2. Làm đất và bón phân lót", "Bài 3. Gieo trồng, chăm sóc và phòng trừ sâu, bệnh cho cây trồng", "Bài 4. Thu hoạch sản phẩm trồng trọt", "Bài 5. Nhân giống vô tính cây trồng", "Bài 6. Dự án: Trồng cây trong chậu", "Bài 7. Giới thiệu về chăn nuôi", "Bài 8. Nuôi dưỡng và chăm sóc vật nuôi", "Bài 9. Phòng và trị bệnh cho vật nuôi", "Bài 10. Bảo vệ nguồn lợi thủy sản", "Bài 11. Kĩ thuật nuôi cá trong ao", "Bài 12. Giới thiệu về nuôi thủy sản"],
      "8": ["Bài 1. Tiêu chuẩn trình bày bản vẽ kĩ thuật", "Bài 2. Hình chiếu vuông góc", "Bài 3. Bản vẽ chi tiết", "Bài 4. Bản vẽ lắp", "Bài 5. Bản vẽ nhà", "Bài 6. Vật liệu cơ khí", "Bài 7. Gia công cơ khí bằng tay", "Bài 8. Truyền và biến đổi chuyển động", "Bài 9. Ngành nghề phổ biến trong lĩnh vực cơ khí", "Bài 10. Dự án: Thiết kế và lắp ráp mô hình cánh tay robot", "Bài 11. Đại cương về kĩ thuật điện", "Bài 12. Đại cương về thiết kế kĩ thuật", "Bài 13. Các bước thiết kế kĩ thuật", "Bài 14. Khái quát về hệ thống điện"],
      "9": ["Bài 1. Nghề nghiệp trong lĩnh vực kĩ thuật, công nghệ", "Bài 2. Đặc điểm và yêu cầu của nghề nghiệp", "Bài 3. Đào tạo và thị trường lao động", "Bài 4. Quy trình thiết kế kĩ thuật", "Bài 5. Dự án thiết kế kĩ thuật", "Bài 6. Lắp đặt mạng điện trong nhà", "Bài 7. Thiết kế và lắp đặt mạch điện chiếu sáng", "Bài 8. Dự án: Thiết kế hệ thống điện thông minh cho căn phòng"]
    },
    "Giáo dục công dân": {
      "6": ["Bài 1. Tự hào về truyền thống gia đình, dòng họ", "Bài 2. Yêu thương con người", "Bài 3. Siêng năng, kiên trì", "Bài 4. Tôn trọng sự thật", "Bài 5. Tự lập", "Bài 6. Tự nhận thức bản thân", "Bài 7. Ứng phó with tình huống nguy hiểm", "Bài 8. Tiết kiệm", "Bài 9. Công dân nước Cộng hòa xã hội chủ nghĩa Việt Nam", "Bài 10. Quyền và nghĩa vụ cơ bản của công dân", "Bài 11. Quyền cơ bản của trẻ em", "Bài 12. Thực hiện quyền trẻ em"],
      "7": ["Bài 1. Tự hào về truyền thống quê hương", "Bài 2. Quan tâm, cảm thông và chia sẻ", "Bài 3. Học tập tự giác, tích cực", "Bài 4. Giữ chữ tín", "Bài 5. Bảo tồn di sản văn hóa", "Bài 6. Quản lý tiền", "Bài 7. Ứng phó with tâm lí căng thẳng", "Bài 8. Phòng chống bạo lực học đường", "Bài 9. Phòng chống tệ nạn xã hội", "Bài 10. Tệ nạn xã hội", "Bài 11. Quyền và nghĩa vụ của công dân trong gia đình", "Bài 12. Quyền và nghĩa vụ của công dân về bảo vệ môi trường"],
      "8": ["Bài 1. Tự hào về truyền thống dân tộc Việt Nam", "Bài 2. Tôn trọng sự đa dạng của các dân tộc", "Bài 3. Lao động cần cù, sáng tạo", "Bài 4. Bảo vệ lẽ phải", "Bài 5. Bảo vệ môi trường và tài nguyên thiên nhiên", "Bài 6. Xác định mục tiêu cá nhân", "Bài 7. Phòng, chống bạo lực gia đình", "Bài 8. Lập kế hoạch chi tiêu", "Bài 9. Phòng ngừa tai nạn vũ khí, cháy, nổ và các chất độc hại", "Bài 10. Quyền và nghĩa vụ của công dân về khiếu nại, tố cáo"],
      "9": ["Bài 1. Sống có lí tưởng", "Bài 2. Khoan dung", "Bài 3. Dân chủ và kỉ luật", "Bài 4. Khách quan và công bằng", "Bài 5. Bảo vệ hòa bình", "Bài 6. Quản lí thời gian hiệu quả", "Bài 7. Thích ứng with thay đổi", "Bài 8. Tiêu dùng thông minh", "Bài 9. Quyền và nghĩa vụ lao động của công dân", "Bài 10. Quyền và nghĩa vụ của công dân về hôn nhân"]
    },
    "Tiếng Anh": {
      "6": ["Unit 1. My New School", "Unit 2. My House", "Unit 3. My Friends", "Unit 4. My Neighbourhood", "Unit 5. Natural Wonders of the Viet Nam", "Unit 6. Our Tet Holiday", "Unit 7. Television", "Unit 8. Sports and Games", "Unit 9. Cities of the World", "Unit 10. Our Houses in the Future", "Unit 11. Our Greener World", "Unit 12. Robots"],
      "7": ["Unit 1. Hobbies", "Unit 2. Healthy Living", "Unit 3. Community Service", "Unit 4. Music and Arts", "Unit 5. Vietnamese Food and Drink", "Unit 6. A Visit to a School", "Unit 7. Traffic", "Unit 8. Films", "Unit 9. Festivals around the World", "Unit 10. Energy Sources", "Unit 11. Travelling in the Future", "Unit 12. English-speaking Countries"],
      "8": ["Unit 1. Leisure Time", "Unit 2. Life in the Countryside", "Unit 3. Teenagers", "Unit 4. Ethnic Groups of Viet Nam", "Unit 5. Our Customs and Traditions", "Unit 6. Lifestyles", "Unit 7. Environmental Protection", "Unit 8. Shopping", "Unit 9. Natural Disasters", "Unit 10. Communication in the Future", "Unit 11. Science and Technology", "Unit 12. Life on Other Planets"],
      "9": ["Unit 1. Local Community", "Unit 2. City Life", "Unit 3. Teen Stress and Pressure", "Unit 4. Life in the Past", "Unit 5. Wonders of Viet Nam", "Unit 6. Viet Nam: Then and Now", "Unit 7. Ecosystems", "Unit 8. Tourism", "Unit 9. English in the World", "Unit 10. Space Travel", "Unit 11. Changing Roles in Society", "Unit 12. My Future Career"]
    }
  },
  "Chân trời sáng tạo": {
    "Toán học": {
      "6": ["Bài 1. Tập hợp. Phần tử của tập hợp", "Bài 2. Tập hợp số tự nhiên. Ghi số tự nhiên", "Bài 3. Các phép tính trong tập hợp số tự nhiên", "Bài 4. Lũy thừa with số mũ tự nhiên", "Bài 5. Thứ tự thực hiện các phép tính", "Bài 6. Chia hết và chia có dư", "Bài 7. Dấu hiệu chia hết cho 2, cho 5", "Bài 8. Dấu hiệu chia hết cho 3, cho 9", "Bài 9. Ước và bội", "Bài 10. Số nguyên tố. Hợp số", "Bài 11. Phân tích một số ra thừa số nguyên tố", "Bài 12. Ước chung. Ước chung lớn nhất", "Bài 13. Bội chung. Bội chung nhỏ nhất", "Bài 1. Số nguyên âm và tập hợp các số nguyên", "Bài 2. Thứ tự trong tập hợp các số nguyên", "Bài 3. Phép cộng và phép trừ hai số nguyên", "Bài 4. Phép nhân và phép chia hết hai số nguyên", "Bài 5. Quy tắc dấu ngoặc và quy tắc chuyển vế", "Bài 1. Hình vuông - Tam giác đều - Lục giác đều", "Bài 2. Hình chữ nhật - Hình thoi - Hình bình hành - Hình thang cân", "Bài 3. Chu vi và diện tích của một số hình trong thực tiễn", "Bài 1. Phân số with tử và mẫu là số nguyên", "Bài 2. Tính chất cơ bản của phân số", "Bài 3. So sánh phân số", "Bài 4. Phép cộng và phép trừ phân số", "Bài 5. Phép nhân và phép chia phân số", "Bài 6. Giá trị phân số của một số"],
      "7": ["Bài 1. Tập hợp các số hữu tỉ", "Bài 2. Các phép tính with số hữu tỉ", "Bài 3. Lũy thừa của một số hữu tỉ", "Bài 4. Quy tắc dấu ngoặc và quy tắc chuyển vế", "Bài 5. Số thập phân hữu hạn và số thập phân vô hạn tuần hoàn", "Bài 6. Số vô tỉ. Căn bậc hai số học", "Bài 7. Tập hợp các số thực", "Bài 1. Hình hộp chữ nhật - Hình lập phương", "Bài 2. Diện tích xung quanh và thể tích của hình hộp chữ nhật, hình lập phương", "Bài 3. Hình lăng trụ đứng tam giác - Hình lăng trụ đứng tứ giác", "Bài 4. Diện tích xung quanh và thể tích của hình lăng trụ đứng tam giác, hình lăng trụ đứng tứ giác", "Bài 1. Tỉ lệ thức - Dãy tỉ số bằng nhau", "Bài 2. Đại lượng tỉ lệ thuận", "Bài 3. Đại lượng tỉ lệ nghịch", "Bài 1. Góc và cạnh của một tam giác", "Bài 2. Tam giác bằng nhau", "Bài 3. Tam giác cân", "Bài 4. Đường trung trực của đoạn thẳng", "Bài 5. Đường cao của tam giác"],
      "8": ["Bài 1. Đơn thức và đa thức nhiều biến", "Bài 2. Các phép toán with đa thức nhiều biến", "Bài 3. Hằng đẳng thức đáng nhớ", "Bài 4. Vận dụng hằng đẳng thức vào phân tích đa thức thành nhân tử", "Bài 5. Phân thức đại số", "Bài 1. Định lí Pythagore", "Bài 2. Tứ giác", "Bài 3. Hình thang - Hình thang cân", "Bài 4. Hình bình hành - Hình thoi", "Bài 5. Hình chữ nhật - Hình vuông", "Bài 1. Khái niệm hàm số", "Bài 2. Tọa độ của một điểm và đồ thị của hàm số", "Bài 3. Hàm số bậc nhất y = ax + b", "Bài 4. Hệ số góc của đường thẳng"],
      "9": ["Bài 1. Phương trình quy về phương trình bậc nhất một ẩn", "Bài 2. Phương trình bậc nhất hai ẩn", "Bài 3. Hệ hai phương trình bậc nhất hai ẩn", "Bài 4. Giải hệ phương trình bằng phương pháp thế và cộng đại số", "Bài 1. Căn bậc hai", "Bài 2. Căn bậc ba", "Bài 3. Các tính chất của căn bậc hai", "Bài 1. Tỉ số lượng giác của góc nhọn", "Bài 2. Hệ thức giữa cạnh và góc trong tam giác vuông", "Bài 1. Đường tròn", "Bài 2. Tiếp tuyến của đường tròn", "Bài 3. Vị trí tương đối của hai đường tròn"]
    },
    "Ngữ văn": {
      "6": ["Bài 1. Lắng nghe lịch sử nước mình (Truyền thuyết)", "Bài 2. Miền cổ tích (Truyện cổ tích)", "Bài 3. Vẻ đẹp quê hương (Thơ lục bát)", "Bài 4. Những trải nghiệm trong đời (Truyện đồng thoại)", "Bài 5. Trò chuyện cùng thiên nhiên (Văn bản thông tin)", "Bài 6. Điểm tựa tinh thần (Truyện)", "Bài 7. Gia đình yêu thương (Thơ)", "Bài 8. Những góc nhìn cuộc sống (Nghị luận)"],
      "7": ["Bài 1. Tiếng nói của vạn vật (Thơ bốn chữ, năm chữ)", "Bài 2. Bài học từ thiên nhiên (Ngụ ngôn)", "Bài 3. Những góc nhìn văn chương (Nghị luận văn học)", "Bài 4. Quà tặng của thiên nhiên (Tản văn, tùy bút)", "Bài 5. Từng bước hoàn thiện bản thân (Văn bản thông tin)", "Bài 6. Hành trình tri thức (Nghị luận xã hội)", "Bài 7. Trí tuệ dân gian (Tục ngữ)"],
      "8": ["Bài 1. Những gương mặt thân quen (Thơ sáu chữ, bảy chữ)", "Bài 2. Những bí ẩn của thế giới tự nhiên (Văn bản thông tin)", "Bài 3. Sự sống hiển linh (Truyện lịch sử)", "Bài 4. Sắc thái của tiếng cười (Truyện cười)", "Bài 5. Những tình huống khôi hài (Kịch)", "Bài 6. Tình yêu tổ quốc (Thơ tự do)", "Bài 7. Vẻ đẹp của tri thức (Nghị luận)"],
      "9": ["Bài 1. Thương nhớ quê hương (Thơ)", "Bài 2. Những bài học từ lịch sử (Văn bản nghị luận)", "Bài 3. Những di sản văn hóa (Văn bản thuyết minh)", "Bài 4. Những trải nghiệm trong đời (Truyện)", "Bài 5. Khát vọng công lí (Truyện thơ Nôm)", "Bài 6. Tiếng nói của trái tim (Thơ hiện đại)"]
    },
    "Khoa học tự nhiên": {
        "6": ["Bài 1. Giới thiệu về Khoa học tự nhiên", "Bài 2. Các quy định an toàn trong phòng thực hành", "Bài 3. Đo chiều dài", "Bài 4. Đo khối lượng", "Bài 5. Đo thời gian", "Bài 6. Đo nhiệt độ", "Bài 7. Sự đa dạng của chất", "Bài 8. Các thể của chất và sự chuyển thể", "Bài 13. Từ tế bào đến cơ thể", "Bài 17. Tách chất ra khỏi hỗn hợp", "Bài 22. Phân loại thế giới sống", "Bài 35. Lực và biểu diễn lực", "Bài 36. Tác dụng của lực", "Bài 37. Lực hấp dẫn và trọng lượng"],
        "7": ["Bài 1. Phương pháp và kĩ năng học tập môn KHTN", "Bài 2. Nguyên tử", "Bài 3. Nguyên tố hóa học", "Bài 4. Sơ lược về bảng tuần hoàn", "Bài 5. Phân tử - Đơn chất - Hợp chất", "Bài 8. Tốc độ chuyển động", "Bài 9. Đồ thị quãng đường - thời gian", "Bài 12. Mô tả sóng âm", "Bài 13. Độ to và độ cao của âm", "Bài 18. Quang hợp ở thực vật", "Bài 19. Các nhân tố ảnh hưởng đến quang hợp"],
        "8": ["Bài 1. Biến đổi vật lí và biến đổi hóa học", "Bài 2. Phản ứng hóa học", "Bài 3. Định luật bảo toàn khối lượng", "Bài 4. Phương trình hóa học", "Bài 10. Base - Thang pH", "Bài 11. Oxide", "Bài 14. Khối lượng riêng", "Bài 15. Áp suất chất lỏng", "Bài 24. Cường độ dòng điện và hiệu điện thế"],
        "9": ["Bài 1. Khúc xạ ánh sáng", "Bài 2. Phản xạ toàn phần", "Bài 3. Hiện tượng tán sắc ánh sáng", "Bài 4. Thấu kính", "Bài 5. Kính lúp", "Bài 11. Điện trở. Định luật Ohm", "Bài 15. Năng lượng tái tạo", "Bài 20. Hợp chất hữu cơ và alkane", "Bài 21. Ethylic alcohol", "Bài 25. Di truyền học with con người"]
    },
    "Lịch sử & Địa lí": {
        "6": ["Bài 1. Lịch sử là gì?", "Bài 2. Thời gian trong lịch sử", "Bài 3. Nguồn gốc loài người", "Bài 9. Trung Quốc từ thời cổ đại đến thế kỉ VII", "Bài 1. Bản đồ. Phương hướng trên bản đồ", "Bài 2. Kí hiệu bản đồ", "Bài 3. Tỉ lệ bản đồ"],
        "7": ["Bài 1. Quá trình hình thành và phát triển chế độ phong kiến Tây Âu", "Bài 2. Các cuộc phát kiến địa lí", "Bài 3. Phong trào văn hóa Phục hưng", "Bài 1. Thiên nhiên châu Âu", "Bài 2. Đặc điểm dân cư, xã hội châu Âu", "Bài 5. Thiên nhiên châu Á", "Bài 9. Thiên nhiên châu Phi"],
        "8": ["Bài 1. Các cuộc cách mạng tư sản ở châu Âu và Bắc Mỹ", "Bài 2. Cách mạng Pháp", "Bài 3. Cách mạng Anh", "Bài 4. Cách mạng công nghiệp", "Bài 1. Vị trí địa lí và phạm vi lãnh thổ Việt Nam", "Bài 2. Địa hình Việt Nam", "Bài 3. Khoáng sản Việt Nam"],
        "9": ["Bài 1. Thế giới từ năm 1918 đến năm 1945", "Bài 2. Các nước lớn sau chiến tranh", "Bài 5. Chiến tranh thế giới thứ hai", "Bài 1. Đặc điểm dân cư, dân tộc Việt Nam", "Bài 2. Phân bố dân cư và đô thị hóa", "Bài 4. Nông nghiệp và lâm nghiệp"]
    }
  },
  "Cánh Diều": {
    "Toán học": {
      "6": ["Bài 1. Tập hợp", "Bài 2. Tập hợp các số tự nhiên", "Bài 3. Phép cộng và phép trừ số tự nhiên", "Bài 4. Phép nhân và phép chia số tự nhiên", "Bài 5. Phép tính cộng, trừ, nhân, chia số tự nhiên", "Bài 6. Lũy thừa with số mũ tự nhiên", "Bài 7. Thứ tự thực hiện các phép tính", "Bài 8. Quan hệ chia hết. Tính chất chia hết", "Bài 9. Dấu hiệu chia hết cho 2, 5, 3, 9", "Bài 10. Số nguyên tố. Hợp số", "Bài 1. Hình tam giác đều, hình vuông, hình lục giác đều", "Bài 2. Hình chữ nhật, hình thoi, hình bình hành, hình thang cân"],
      "7": ["Bài 1. Tập hợp các số hữu tỉ", "Bài 2. Cộng, trừ, nhân, chia số hữu tỉ", "Bài 3. Phép tính lũy thừa with số mũ tự nhiên của một số hữu tỉ", "Bài 4. Thứ tự thực hiện các phép tính. Quy tắc dấu ngoặc", "Bài 1. Góc ở vị trí đặc biệt", "Bài 2. Tia phân giác của một góc", "Bài 3. Hai đường thẳng song song", "Bài 1. Biểu đồ hình quạt tròn", "Bài 2. Biểu đồ đoạn thẳng"],
      "8": ["Bài 1. Đơn thức nhiều biến. Đa thức nhiều biến", "Bài 2. Các phép tính with đa thức nhiều biến", "Bài 3. Hằng đẳng thức đáng nhớ", "Bài 4. Phân tích đa thức thành nhân tử", "Bài 1. Định lí Pythagore", "Bài 2. Tứ giác", "Bài 3. Hình thang cân", "Bài 4. Hình bình hành", "Bài 1. Hàm số và đồ thị", "Bài 2. Mặt phẳng tọa độ", "Bài 3. Hàm số bậc nhất"],
      "9": ["Bài 1. Phương trình quy về phương trình bậc nhất một ẩn", "Bài 2. Phương trình bậc nhất hai ẩn", "Bài 3. Hệ hai phương trình bậc nhất hai ẩn", "Bài 4. Giải hệ phương trình bằng phương pháp cộng", "Bài 1. Căn bậc hai", "Bài 2. Căn bậc ba", "Bài 3. Tính chất căn bậc hai", "Bài 1. Tỉ số lượng giác của góc nhọn", "Bài 2. Giải tam giác vuông"]
    },
    "Ngữ văn": {
      "6": ["Bài 1. Truyện truyền thuyết và cổ tích", "Bài 2. Thơ (Lục bát)", "Bài 3. Kí (Hồi kí, du kí)", "Bài 4. Truyện (Truyện đồng thoại)", "Bài 5. Văn bản nghị luận", "Bài 6. Truyện ngắn", "Bài 7. Thơ tự do", "Bài 8. Văn bản thông tin"],
      "7": ["Bài 1. Tiểu thuyết và truyện ngắn", "Bài 2. Thơ (Bốn chữ, năm chữ)", "Bài 3. Thơ (Tự do)", "Bài 4. Ngụ ngôn", "Bài 5. Văn bản thông tin", "Bài 6. Truyện kí", "Bài 7. Thơ Đường luật", "Bài 8. Nghị luận xã hội"],
      "8": ["Bài 1. Truyện ngắn", "Bài 2. Thơ (Sáu chữ, bảy chữ)", "Bài 3. Thơ Đường luật", "Bài 4. Văn bản nghị luận", "Bài 5. Kịch bản văn học", "Bài 6. Truyện lịch sử", "Bài 7. Thơ tự do", "Bài 8. Văn bản thông tin"],
      "9": ["Bài 1. Truyện truyền kì và truyện thơ Nôm", "Bài 2. Thơ (Hiện đại)", "Bài 3. Văn bản nghị luận", "Bài 4. Văn bản thuyết minh", "Bài 5. Văn bản thông tin", "Bài 6. Kịch", "Bài 7. Truyện trinh thám"]
    },
    "Khoa học tự nhiên": {
      "6": ["Bài 1. Giới thiệu về Khoa học tự nhiên", "Bài 2. Một số dụng cụ đo và quy định an toàn", "Bài 3. Đo chiều dài", "Bài 4. Đo khối lượng", "Bài 5. Đo chiều dài, khối lượng, thời gian", "Bài 6. Đo thời gian", "Bài 7. Thang nhiệt độ Celsius. Đo nhiệt độ", "Bài 8. Đo nhiệt độ", "Bài 11. Các thể của chất", "Bài 12. Sự chuyển thể của chất", "Bài 14. Tế bào", "Bài 15. Cấu tạo tế bào"],
      "7": ["Bài 1. Nguyên tử. Sơ lược về bảng tuần hoàn", "Bài 2. Liên kết hóa học", "Bài 3. Sơ lược về bảng tuần hoàn", "Bài 4. Phân tử. Đơn chất. Hợp chất", "Bài 7. Tốc độ", "Bài 8. Đồ thị quãng đường - thời gian", "Bài 10. Âm thanh", "Bài 11. Độ to và độ cao của âm", "Bài 13. Sự trao đổi chất và chuyển hóa năng lượng"],
      "8": ["Bài 1. Biến đổi vật lí và hóa học", "Bài 2. Phản ứng hóa học", "Bài 3. Mol", "Bài 4. Mol và tỉ khối chất khí", "Bài 11. Áp suất", "Bài 12. Áp suất chất lỏng", "Bài 15. Lực đẩy Archimedes", "Bài 16. Sự nổi", "Bài 19. Cơ thể người", "Bài 20. Hệ vận động ở người"],
      "9": ["Bài 1. Công và công suất", "Bài 2. Cơ năng", "Bài 3. Nội năng", "Bài 5. Khúc xạ ánh sáng", "Bài 6. Thấu kính hội tụ", "Bài 10. Kim loại", "Bài 11. Tính chất của kim loại", "Bài 15. Hợp chất hữu cơ", "Bài 20. Di truyền", "Bài 21. Quy luật di truyền"]
    },
    "Lịch sử & Địa lí": {
      "6": ["Bài 1. Lịch sử và cuộc sống", "Bài 2. Thời gian trong lịch sử", "Bài 4. xã hội nguyên thủy", "Bài 1. Vị trí, hình dạng và kích thước Trái Đất", "Bài 2. Bản đồ. Một số lưới kinh vĩ tuyến", "Bài 5. Bản đồ và cách sử dụng bản đồ"],
      "7": ["Bài 1. Sự hình thành và phát triển của chế độ phong kiến Tây Âu", "Bài 2. Các cuộc phát kiến địa lí", "Bài 5. Trung Quốc từ thế kỉ VII đến thế kỉ XIX", "Bài 1. Vị trí địa lí, phạm vi và đặc điểm tự nhiên châu Âu", "Bài 5. Vị trí địa lí và đặc điểm tự nhiên châu Á", "Bài 9. Vị trí và đặc điểm tự nhiên châu Phi"],
      "8": ["Bài 1. Cách mạng tư sản Anh và chiến tranh giành độc lập ở Bắc Mỹ", "Bài 2. Cách mạng Pháp", "Bài 5. Các cuộc cách mạng tư sản ở Đông Nam Á", "Bài 1. Vị trí địa lí và phạm vi lãnh thổ Việt Nam", "Bài 2. Địa hình Việt Nam", "Bài 4. Khí hậu Việt Nam"],
      "9": ["Bài 1. Thế giới từ năm 1918 đến năm 1945", "Bài 2. Các nước lớn sau chiến tranh", "Bài 1. Vị trí địa lí và phạm vi lãnh thổ Việt Nam", "Bài 4. Dân cư và dân tộc Việt Nam", "Bài 5. Đô thị hóa ở Việt Nam"]
    }
  }
};
