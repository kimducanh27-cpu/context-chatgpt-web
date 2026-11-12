# DIFF — Fix nhỏ trong V11: tách mục 7 Phần 9 (NEEDS_SOURCE riêng, POSITIVE TEST riêng)

Date: 2026-11-12 ~07:49 +07. Kduu chọn "Tách lại thành 2 mục riêng".
Source: re-test V11 trên GitHub Pages 2026-11-12 07:35–07:47 (REPORT.md, mục
"V11 — Fix test 6"). Lệch phát hiện thêm khi build V11: danh sách 20 test
nghiệm thu Phần 9 trên trang gộp NEEDS_SOURCE + POSITIVE TEST chung vào
mục 7 — không nằm trong DIFF V11, do builder tự gộp "để không mất test".
Nội dung hai kiểm tra vẫn còn đủ (trong mục 7 và tách riêng ở tiêu chí
(c)/(e) của trial); chỉ cấu trúc sai so với spec. Fix này CHỈ tách mục 7,
không đổi gì khác. Kit vẫn là V11 — KHÔNG lên V12; spec TARGET.md KHÔNG
đổi (spec §20.2 vốn đã đúng: test 7 = NEEDS_SOURCE; POSITIVE TEST là tiêu
chí (e) của trial, không phải một trong 20 test).

## Mục tiêu

- Phần 9 có đúng 20 mục, khớp spec §20.2 từng mục một.
- Mục 7 = NEEDS_SOURCE test, chỉ một kiểm tra, theo đúng spec test 7:
  hỏi một chi tiết chính xác KHÔNG có trong note mà không có raw → chat
  mới trả NEEDS_SOURCE, không đoán. Giữ phong cách tiếng Việt của trang,
  dạng: "NEEDS_SOURCE test: hỏi một chi tiết chính xác KHÔNG có trong
  note mà không có raw → chat mới trả NEEDS_SOURCE, không đoán."
- Xóa khỏi mục 7 hai phần thuộc POSITIVE TEST: "hỏi một chi tiết CÓ trong
  note → chat mới phải trả lời đúng, KHÔNG được trả NEEDS_SOURCE" và
  "model lúc nào cũng trả NEEDS_SOURCE thì FAIL" — hai câu này thuộc
  tiêu chí (e), không thuộc mục 7.
- POSITIVE TEST PHẢI CÒN trên trang ở vị trí riêng của nó: tiêu chí (e)
  trong tiêu chí pass/fail của trial ("POSITIVE TEST pass — một chi tiết
  CÓ trong note được trả lời đúng, không phải NEEDS_SOURCE") và prose
  bước 7 Phần 6 ("POSITIVE TEST (mới ở V8)"). Kiểm tra hai chỗ này vẫn
  còn sau khi sửa — KHÔNG được xóa POSITIVE TEST khỏi trang.
- KHÔNG đánh số lại danh sách (mục 8 vẫn là Prompt C, … mục 20 vẫn là
  drill-pick). KHÔNG thêm mục mới vào danh sách 20. KHÔNG đổi hero tag
  "BẢN V11". Thêm một dòng ngắn vào ghi chú V11 trên trang: "Fix nhỏ
  trong V11 (12/11): tách mục 7 Phần 9 — NEEDS_SOURCE riêng, POSITIVE
  TEST ở tiêu chí (e)."

## Harness (parent sửa xong, tổng 35 test)

- Test 28: trang KHÔNG còn chuỗi gộp "NEEDS_SOURCE test + POSITIVE TEST".
- Test 29: "POSITIVE TEST" vẫn có mặt trên trang (tiêu chí (e)).
- Kiểm bằng: `node --check run.js` OK; trích testCode rồi parse bằng
  `new Function` OK.

Kiểm chứng (bắt buộc, báo lại kết quả):
- Grep trên trang: "NEEDS_SOURCE test + POSITIVE TEST" = 0 lần;
  "POSITIVE TEST" còn ≥1 lần (tiêu chí (e)); đếm mục Phần 9 = 20.
- CHẠY HARNESS GỐC page-harness-v9/run.js đúng như nó đang có — KHÔNG
  copy sang /tmp, KHÔNG vá gì thêm (kỳ vọng TOTAL 35 / PASS 35 / FAIL 0,
  exit 0; pre-build kỳ vọng 34/35, đúng 1 test rớt là 28).
- Sau build: re-export + đẩy lên GitHub Pages + kiểm lại danh sách Phần 9
  trên trang live là việc của parent (không thuộc build này).

KHÔNG sửa TARGET.md. KHÔNG sửa run.js / README.md của harness (file của
parent — parent đã sửa xong). Không đổi slug, không đổi tên hiển thị.
