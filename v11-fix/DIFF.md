# DIFF — Fix V11 theo lỗi test 6 form (trường nội dung để trống)

Date: 2026-11-12 ~07:30 +07. Kduu chọn "Sửa form: chặn Copy khi trường nội dung trống".
Source: test form 6/11/12/15 chạy 2026-11-12 07:23–07:26 trên GitHub Pages
(kit V10 live tại https://kimducanh27-cpu.github.io/context-chatgpt-web/nen-context-cho-chatgpt-web.html,
repo kimducanh27-cpu/context-chatgpt-web, commit 7da18c4), báo cáo đầy đủ tại
`trial-2026-11-11/REPORT.md` (mục "Test form 6/11/12/15 — ĐÃ CHẠY trên GitHub Pages").
Kết quả: 11 PASS, 12 PASS (cả 4 trường hợp), 15 PASS; 6 FAIL. V11 chỉ sửa đúng
lỗi test 6 này, không mở thêm vòng review, không trộn finding khác.
Test 19 KHÔNG nằm trong V11 (nâng giới hạn đã bị Kduu phủ quyết 07:06 12/11;
còn nén Tier-3 hoặc nạp bằng tham chiếu — chờ Kduu chọn riêng).

## V11 — Test 6: form phải bắt trường nội dung để trống

Trial evidence: để trống duy nhất trường "Quyết định đã chốt" (mọi trường
khác đã điền, NN=02, source_range hợp lệ, FIRST_FOLD không tick, sổ trống)
→ form KHÔNG bắt lỗi: block vẫn render, dòng 14 trong output là
"14. Quyết định đã chốt (nguyên văn, kèm lý do): (chưa có)", nút Copy BẬT.
Nguyên nhân gốc: serializer của form tự ghi "(chưa có)" cho field trống, và
form gate không có luật nào về trường nội dung trống — chỉ source_range là
bắt buộc phải hợp lệ. Test 6 trong spec viết: "A field missing from the
block text is caught before copy." — form không làm điều đó với trường nội
dung.

Quyết định thiết kế (ghi vào spec, giữ nguyên quy ước "(chưa có)"):
- Quy ước template KHÔNG đổi: field nào không có giá trị thì trong BLOCK
  viết "(chưa có)" — không bao giờ để trống (TARGET.md dòng ~289; field
  14–18 đều REQUIRED với "(chưa có)" nếu không có).
- Nhưng FORM không được tự điền "(chưa có)" thay người dùng: field để
  trống trong form nghĩa là "chưa điền", không phải "không có". Người dùng
  muốn nói "chặng này thật sự không có" thì TỰ GHI đúng chữ "(chưa có)"
  vào field — đó là giá trị có chủ đích, gate cho qua, output render đúng
  chữ đó như hiện tại.
- Phạm vi: chỉ 5 trường nội dung (14 Quyết định đã chốt, 15 Ràng buộc /
  quy tắc, 16 Việc đang dở, 17 Dữ kiện nguyên văn, 18 Đã bỏ đi cố ý).
  Các field metadata (project_id, session_id, source_chat_url,
  parent_block_ids, …) giữ cách xử lý "(chưa có)" riêng của chúng,
  không nằm trong gate này.

Fix (spec + page + harness):
1. Spec TARGET.md (parent sửa xong): test 6 viết lại chính xác (mục §20.2);
   form gate thêm bullet CONTENT FIELDS (V11) + 2 dòng vào danh sách
   "TESTS the form must pass"; ghi chú V11 ở đầu file, trial plan và
   "Reviews so far"; thêm "One-sentence most important correction (v11)".
   Spec nay là v11, 1.826 dòng (kiểm bằng wc sau khi sửa).
2. Page (builder): trong JS của form Part 6b, gate (hàm `gateError()` /
   `render()`) thêm luật: với mỗi trường nội dung 14–18, nếu giá trị sau
   khi trim là rỗng → KHÔNG render block, Copy DISABLED, lỗi PHẢI nêu
   tên field, dạng: "⛔ CHƯA XUẤT BLOCK — trường <nhãn field> đang
   trống. Ghi nội dung vào, hoặc ghi đúng '(chưa có)' nếu chặng này thật
   sự không có <nhãn field>." Nhãn field là nhãn hiển thị của form
   ("Quyết định đã chốt", "Dữ kiện nguyên văn", …). Giá trị đúng chữ
   "(chưa có)" (sau trim) thì cho qua. Serializer GIỮ fallback "(chưa
   có)" cho an toàn (vẫn ghi "(chưa có)" thay vì để trống nếu bằng cách
   nào đó được gọi với field rỗng), nhưng gate chặn trước render nên
   fallback này không bao giờ chạm tới từ form.
3. Page: mục test 6 trong danh sách acceptance / danh sách TESTS của
   form gate trên trang viết lại theo đúng định nghĩa mới của test 6
   trong spec (không giữ câu cũ "A field missing from the block text
   is caught before copy." một mình — phải có đủ nghĩa: trống sau trim
   → chặn; "(chưa có)" đúng chữ → cho qua; phạm vi 5 trường nội dung).
   Thêm ghi chú V11 trên trang (dạng như ghi chú V10 "fix theo trial
   #1: test 9 và test 17"): "V11 — fix test 6 theo test form trên
   GitHub Pages 12/11: trường nội dung để trống thì chặn Copy, ghi
   đúng '(chưa có)' mới được coi là không có."
4. Harness (parent sửa xong): `reset()` nay điền đủ 5 trường nội dung
   (để các test cũ không rớt vì gate mới); thêm test 25 (Quyết định
   trống → disabled + lỗi nêu "Quyết định"), test 26 (Dữ kiện nguyên
   văn trống → disabled + lỗi nêu "Dữ kiện"), test 27 (cả 5 trường ghi
   "(chưa có)" → enabled + render đúng chữ, control). Tổng 33 test.
   Kiểm bằng: `node --check run.js` OK; trích testCode trong template
   literal rồi parse bằng `new Function` → OK (10.289 byte) — KHÔNG
   chỉ dựa vào node --check (bài học R3-P1: code trong template
   literal bị lỗi thì node --check không thấy).

Kiểm chứng (bắt buộc, báo lại kết quả):
- Grep trên trang cho "CONTENT FIELDS" / "trường <nhãn field> đang trống"
  / ghi chú V11; node --check cho JS của trang.
- CHẠY HARNESS GỐC page-harness-v9/run.js đúng như nó đang có — KHÔNG
  copy sang /tmp, KHÔNG vá gì thêm — và báo kết quả (kỳ vọng TOTAL 33 /
  PASS 33 / FAIL 0, exit 0). Chạy thử pre-build kỳ vọng: 31/33, đúng 2
  test rớt là 25 và 26 (trang cũ chưa có gate).
- Sau build: re-export + đẩy file mới lên GitHub Pages + chạy lại test 6
  và hồi quy 11/12/15 trên trang live là việc của parent (không thuộc
  build này).

KHÔNG sửa TARGET.md. KHÔNG sửa run.js / README.md của harness (file của
parent — parent đã sửa xong). Không đổi slug, không đổi tên hiển thị.
Đây là bản V11 — không trộn finding ngoài lỗi test 6 form.
