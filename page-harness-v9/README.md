# page-harness-v9 — Node harness kiểm gate/form của trang kit (V9, nay cover V11)

## Chạy lại
```bash
cd ~/workspace/billion-context-kit-review/page-harness-v9
node run.js
```
Exit 0 = mọi test pass. Không cần trình duyệt, không cần server.

## Cách nó hoạt động
- `run.js` đọc file live `~/workspace/ts-spaces/nen-context-cho-chatgpt-web/index.html`,
  trích khối `<script>`, chạy nó trong `vm` với DOM shim tối thiểu
  (`getElementById`, `querySelectorAll`, `addEventListener` no-op),
  rồi chạy 35 test gate nối thẳng vào cuối IIFE của trang
  (để test gọi được `gateError`, `render`, `serializeBlock`, `blockText`, `tplVals`).
  Runner còn đưa `htmlText` (toàn bộ HTML live) vào sandbox để test
  nội dung trang (test 24).

## Tests (35)
- FIRST_FOLD: hợp lệ (NN01+T1+ledger trống) → enabled; NN05 (+ledger trống / +ledger có block) → disabled;
  NN01 + Tier-2 → disabled; tick sai (ledger có block) → disabled.
- source_range: thiếu → disabled; "abc → def" → disabled; phía 8 đơn vị + xác nhận → enabled;
  phía 8 đơn vị không xác nhận → disabled; 15/15 đơn vị → enabled.
- Trùng tuple → disabled + nextFreeNN 02.
- Timestamps: created_at/updated_at khớp `^\d{4}-\d{2}-\d{2} \d{2}:\d{2} \+07$`.
- Serializer: tplVals t1/t2/t3/tm đều 18 dòng; t1 block_id `<NN>` (không `-01` hardcode);
  tm có `T3-<NN>` + `KÈM TIER`.
- Part 2 theo tier: T1 → header SANITIZED_RAW_SOURCE + tag `[SANITIZED_RAW_SOURCE]`,
  không còn header "RAW VERBATIM TRANSCRIPT"; số phần tự đếm (raw ngắn → 1 phần,
  raw 600 từ → 2 phần); T2 → danh sách block cha + link, KHÔNG render raw;
  T2 thiếu parents → "(chưa điền parent_block_ids".
- Ledger trống + không FIRST_FOLD → cảnh báo "chưa dán sổ, kiểm tra trùng chưa chạy";
  gate-note Tier-2 nhắc danh sách block cha.
- Form-gate coverage (fix vòng 1, P3-10): source_range không có mũi tên → disabled;
  serializeBlock() ra đúng 18 field theo thứ tự (đủ tên 18 field, fix vòng 2, R2-P7); phía B ngắn + xác nhận phía B → enabled.
- FIRST_FOLD ticked + ledger trống → cảnh báo 'không xác minh được đây đúng là lần gấp đầu' hiện, Copy vẫn enabled (fix vòng 2, R2-P5).
- V10 (test 9 + 17): source_range trùng với source_range ở trường 5 của dòng sổ gấp → Copy disabled, gate báo "đã gấp rồi" + mã block cũ; cut khác sổ gấp → enabled (control); trang chứa khung SAO CHÉP NGUYÊN VĂN + đủ 6 dòng từ chối đúng chuỗi.
- V11 (test 6): trường nội dung (14–18) để trống → Copy disabled, lỗi nêu tên field (test 25 Quyết định, test 26 Dữ kiện nguyên văn); cả 5 trường ghi đúng "(chưa có)" → enabled, output render đúng chữ đó (test 27, control). `reset()` nay điền đủ 5 trường nội dung để các test cũ không rớt vì gate mới.
- V11 fix-up (tách mục 7 Phần 9): trang KHÔNG còn chuỗi gộp "NEEDS_SOURCE test + POSITIVE TEST" (test 28); "POSITIVE TEST" vẫn có mặt trên trang ở tiêu chí (e) riêng (test 29).

## Lịch sử
- Harness V8 bị mất file nên vòng swarm V8 không chạy lại được. Harness này được
  lưu kèm README để chạy lại được ở mọi vòng sau. Khi trang đổi JS, cập nhật test
  ở đây trước rồi mới sửa trang.
- V10: thêm test 22–24 (source_range trùng → disabled; cut khác → enabled;
  khung SAO CHÉP NGUYÊN VĂN + 6 dòng từ chối trên trang); runner đưa `htmlText`
  vào sandbox cho test nội dung. Chạy thử pre-build: 28/30, đúng 2 test rớt là
  22 và 24 (trang cũ chưa có tính năng).
- V11: thêm test 25–27 (trường nội dung trống → disabled + lỗi nêu tên field;
  "(chưa có)" → enabled); `reset()` điền đủ 5 trường nội dung. Chạy thử
  pre-build kỳ vọng: 31/33, đúng 2 test rớt là 25 và 26 (trang cũ chưa có gate).
- V11 fix-up (tách mục 7 Phần 9): thêm test 28–29 (không còn chuỗi gộp
  "NEEDS_SOURCE test + POSITIVE TEST"; "POSITIVE TEST" vẫn ở tiêu chí (e)).
  Chạy thử pre-build kỳ vọng: 34/35, đúng 1 test rớt là 28 (trang cũ còn
  chuỗi gộp).
