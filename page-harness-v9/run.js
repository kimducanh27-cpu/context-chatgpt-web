// Harness V9 — chạy gate/form JS của trang kit trên Node với DOM shim (V9, nay cover V11).
// Cách chạy: node run.js   (chạy từ thư mục này; đọc index.html live của artifact)
// Không cần trình duyệt. 0 exit = mọi test pass.
"use strict";
const fs = require("fs");
const path = require("path");
const html = fs.readFileSync(
  path.join(process.env.HOME, "workspace/ts-spaces/nen-context-cho-chatgpt-web/index.html"),
  "utf-8"
);
const m = html.match(/<script>([\s\S]*)<\/script>/);
if (!m) { console.error("FAIL: no <script> in index.html"); process.exit(1); }
const src = m[1].replace(/\}\)\(\);\s*$/, "");

// --- DOM shim tối thiểu ---
function makeEl() {
  return { value: "", checked: false, disabled: false, textContent: "",
    addEventListener() {}, setAttribute() {}, getAttribute() { return null; },
    classList: { add() {}, remove() {} } };
}
const IDS = ["f-project","f-nn","f-tier","f-date","f-code","f-cut","f-cut-short-a","f-cut-short-b",
  "f-firstfold","f-existing","f-decided","f-constraints","f-pending","f-facts","f-dropped",
  "f-session","f-version","f-status","f-packet","f-srcurl","f-parents","f-archlink","f-raw",
  "block-out","copy-block","gate-note"];
const els = {};
IDS.forEach(id => els[id] = makeEl());
const document = {
  getElementById: id => els[id] || makeEl(),
  querySelectorAll: () => [],
  createElement: () => makeEl(),
  body: { appendChild() {}, removeChild() {} }
};
const navigator = {};
const window = {};
// Hàm runner nhận code test chạy BÊN TRONG IIFE (được nối vào cuối src).
const testCode = `
var __results=(function runTests(){
var results=[];
function t(name,cond,detail){results.push([name,!!cond,detail||""])}
function reset(){
  Object.keys(f).forEach(function(k){if(f[k]){f[k].value="";f[k].checked=false;f[k].disabled=false}});
  f.project.value="MONEO"; f.date.value="20261110"; f.session.value="S-20261110-A";
  f.version.value="1"; f.status.value="current"; f.packet.value="1"; f.tier.value="1";
  f.decided.value="Quyết định A"; f.constraints.value="Quy tắc B"; f.pending.value="Việc C"; f.facts.value="42"; f.dropped.value="Đã bỏ D";
  out.textContent=""; copyBlockBtn.disabled=false;
}
var CUT15="một hai ba bốn năm sáu bảy tám chín mười mười_một mười_hai mười_ba mười_bốn mười_lăm";
var CUT8="Dưới đây là kết quả kiểm tra login:";
function validCut(){f.cut.value=CUT15+" → "+CUT15}
function ff(nn,tier,ledger){reset();f.nn.value=nn;f.tier.value=tier;f.firstfold.checked=true;f.existing.value=ledger||"";render()}

// 1 FIRST_FOLD hợp lệ (NN==01, tier 1, ledger trống) -> enabled
ff("01","1",""); t("FF valid NN01+T1+empty ledger -> enabled", !copyBlockBtn.disabled && gateError()==="" && out.textContent.indexOf("1. project_id")!==-1);
// 2 FIRST_FOLD + NN=05 + ledger trống -> disabled (P1-1)
ff("05","1",""); t("FF + NN05 + empty ledger -> disabled", copyBlockBtn.disabled && gateError().indexOf("NN==01")!==-1, gateError());
// 3 FIRST_FOLD + NN=05 + ledger có block -> disabled (P1-1)
ff("05","1","MONEO | S-20261110-A | CTX-MONEO-20261110-01 | 1"); t("FF + NN05 + ledger has blocks -> disabled", copyBlockBtn.disabled, gateError());
// 4 FIRST_FOLD + NN=01 + tier 2 -> disabled (P1-1 tier check)
ff("01","2",""); t("FF + NN01 + Tier-2 -> disabled", copyBlockBtn.disabled && gateError().indexOf("tier 1")!==-1, gateError());
// 5 FIRST_FOLD tick sai (ledger có block, NN01, T1) -> disabled
ff("01","1","MONEO | S-20261110-A | CTX-MONEO-20261110-01 | 1"); t("FF tick sai (ledger has blocks) -> disabled", copyBlockBtn.disabled && gateError().indexOf("tick sai")!==-1, gateError());
// 6 source_range thiếu -> no render, disabled
reset(); f.nn.value="02"; validCut(); f.cut.value=""; render(); t("source_range missing -> disabled", copyBlockBtn.disabled && out.textContent.indexOf("CHƯA XUẤT BLOCK")!==-1);
// 7 source_range "abc → def" -> disabled (P2-1)
reset(); f.nn.value="02"; f.cut.value="abc → def"; render(); t("source_range 'abc → def' -> disabled", copyBlockBtn.disabled, gateError());
// 8 phía 8 đơn vị + xác nhận -> enabled (P2-1)
reset(); f.nn.value="02"; f.cut.value=CUT8+" → "+CUT15; f.cutShortA.checked=true; render(); t("8-unit side + short-msg confirm -> enabled", !copyBlockBtn.disabled && gateError()==="");
// 9 phía 8 đơn vị KHÔNG xác nhận -> disabled
reset(); f.nn.value="02"; f.cut.value=CUT8+" → "+CUT15; render(); t("8-unit side, no confirm -> disabled", copyBlockBtn.disabled);
// 10 source_range 15/15 đơn vị, không checkbox -> enabled
reset(); f.nn.value="02"; validCut(); render(); t("15/15 units, no checkbox -> enabled", !copyBlockBtn.disabled && gateError()==="");
// 11 trùng tuple -> disabled + nextFreeNN 02
reset(); f.nn.value="01"; f.existing.value="MONEO | S-20261110-A | CTX-MONEO-20261110-01 | 1"; validCut(); render(); t("duplicate tuple -> disabled, next NN 02", copyBlockBtn.disabled && gateError().indexOf("02")!==-1, gateError());
// 12 timestamps regex (P3-8)
reset(); f.nn.value="02"; validCut(); render(); var ser=serializeBlock(); var re=/^\\d{4}-\\d{2}-\\d{2} \\d{2}:\\d{2} \\+07$/; var l10=ser.split("\\n")[9], l11=ser.split("\\n")[10];
t("created_at/updated_at match YYYY-MM-DD HH:MM +07", re.test(l10.split(": ")[1]) && re.test(l11.split(": ")[1]), l10+" | "+l11);
// 13 serializer 18/18 + tplVals <NN> (P3-3)
var b1=blockText(tplVals("t1")); t("tplVals t1 = 18 lines, block_id <NN>", b1.split("\\n").length===18 && b1.split("\\n")[2].indexOf("<NN>")!==-1 && b1.split("\\n")[2].indexOf("-01")===-1, "line3: "+b1.split("\\n")[2]);
var b2=blockText(tplVals("t2")), b3=blockText(tplVals("t3")), bm=blockText(tplVals("tm"));
t("tplVals t2/t3/tm = 18 lines each", b2.split("\\n").length===18 && b3.split("\\n").length===18 && bm.split("\\n").length===18);
t("tplVals tm: T3-<NN> + KÈM TIER", bm.indexOf("T3-<NN>")!==-1 && bm.indexOf("KÈM TIER")!==-1);
// 14 Part 2 Tier-1: header + tag + raw, N tự đếm (P1-2, P2-9, P3-10)
reset(); f.nn.value="02"; validCut(); f.raw.value="đoạn raw ngắn"; render();
t("T1 Part 2 header SANITIZED_RAW_SOURCE + tag", out.textContent.indexOf("PHẦN 2 — SANITIZED_RAW_SOURCE")!==-1 && out.textContent.indexOf("[SANITIZED_RAW_SOURCE]")!==-1 && out.textContent.indexOf("đoạn raw ngắn")!==-1);
t("T1 short raw -> 'Phần 2: 1 phần' (computed, not hardcoded)", out.textContent.indexOf("Phần 2: 1 phần")!==-1);
t("T1 output has no 'RAW VERBATIM TRANSCRIPT' header", out.textContent.indexOf("RAW VERBATIM TRANSCRIPT")===-1);
reset(); f.nn.value="02"; validCut(); f.raw.value=new Array(601).join("từ "); render();
t("T1 600-word raw -> 'Phần 2: 2 phần' (auto-count)", out.textContent.indexOf("Phần 2: 2 phần")!==-1);
// 15 Part 2 Tier-2: parent list, KHÔNG render raw (P1-2)
reset(); f.nn.value="01"; f.tier.value="2"; validCut(); f.parents.value="CTX-MONEO-20261110-01, CTX-MONEO-20261110-02"; f.raw.value="RAW NÀY KHÔNG ĐƯỢC RENDER"; render();
t("T2 Part 2 = parent list + link, no raw", out.textContent.indexOf("PHẦN 2 — DANH SÁCH BLOCK CHA")!==-1 && out.textContent.indexOf("CTX-MONEO-20261110-01")!==-1 && out.textContent.indexOf("RAW NÀY KHÔNG ĐƯỢC RENDER")== -1);
reset(); f.nn.value="01"; f.tier.value="2"; validCut(); render();
t("T2 without parents -> '(chưa điền parent_block_ids'", out.textContent.indexOf("chưa điền parent_block_ids")!==-1);
// 16 ledger trống + KHÔNG FIRST_FOLD -> cảnh báo (P1-1)
reset(); f.nn.value="02"; validCut(); render(); t("empty ledger + not FIRST_FOLD -> warning shown", gateNote.textContent.indexOf("chưa dán sổ, kiểm tra trùng chưa chạy")!==-1, gateNote.textContent);
// 17 gate-note theo tier
reset(); f.nn.value="01"; f.tier.value="2"; validCut(); f.parents.value="CTX-MONEO-20261110-01"; render(); t("gate-note Tier-2 mentions parent list", gateNote.textContent.indexOf("danh sách block cha")!==-1);
// 18 no-arrow source_range -> disabled (P3-10, fix vong 1)
reset(); f.nn.value="02"; f.cut.value="một hai ba bốn năm sáu bảy tám chín mười"; render(); t("source_range no arrow -> disabled", copyBlockBtn.disabled, gateError());
// 19 serializeBlock output is 18 fields in order (P3-10, fix vong 1; strengthened fix vong 2, R2-P7)
reset(); f.nn.value="02"; validCut(); render(); var serLines=serializeBlock().split("\\n"); var serNames=serLines.map(function(l){return (l.split(". ")[1]||"").split(":")[0]}); var want=["project_id","session_id","block_id","tier","version","source_chat_url","source_range","parent_block_ids","status","created_at","updated_at","canonical_packet_version","original_archive_link","Quyết định đã chốt (nguyên văn, kèm lý do)","Ràng buộc / quy tắc","Việc đang dở","Dữ kiện nguyên văn","Đã bỏ đi cố ý"]; t("serializeBlock output = 18 fields in order", serLines.length===18 && JSON.stringify(serNames)===JSON.stringify(want), serNames.join(" | "));
// 20 side-B short message (P3-10, fix vong 1)
reset(); f.nn.value="02"; f.cut.value=CUT15+" → "+CUT8; f.cutShortB.checked=true; render(); t("15-unit side A + 8-unit side B + confirm B -> enabled", !copyBlockBtn.disabled && gateError()==="");
// 21 FIRST_FOLD ticked + empty ledger -> warning shown, Copy stays enabled (P2-2, fix vong 2)
ff("01","1",""); t("FF ticked + empty ledger -> warning shown, Copy stays enabled", !copyBlockBtn.disabled && gateError()==="" && gateNote.textContent.indexOf("không xác minh được đây đúng là lần gấp đầu")!==-1, gateNote.textContent);
// 22 duplicate source_range (ledger 5th field) -> disabled + warning (V10, test 9)
reset(); f.nn.value="09"; f.existing.value="MONEO | S-20261110-A | CTX-MONEO-20261110-01 | 1 | "+CUT15+" → "+CUT15; f.cut.value=CUT15+" → "+CUT15; render(); t("duplicate source_range -> disabled, warns 'đã gấp rồi' + code", copyBlockBtn.disabled && gateError().indexOf("đã gấp rồi")!==-1 && gateError().indexOf("CTX-MONEO-20261110-01")!==-1, gateError());
// 23 same ledger, different cut -> enabled (control)
reset(); f.nn.value="09"; f.existing.value="MONEO | S-20261110-A | CTX-MONEO-20261110-01 | 1 | "+CUT15+" → "+CUT15; f.cut.value=CUT15+" → "+CUT8; f.cutShortB.checked=true; render(); t("different cut vs ledger -> enabled", !copyBlockBtn.disabled && gateError()==="");
// 24 verbatim refusal block on page (V10, test 17)
t("page has SAO CHÉP NGUYÊN VĂN block + 6 refusal lines", htmlText.indexOf("SAO CHÉP NGUYÊN VĂN")!==-1 && htmlText.indexOf("THIẾU NGUỒN | Lý do:")!==-1 && htmlText.indexOf("KHÔNG XÁC ĐỊNH ĐƯỢC ĐIỂM CẮT | Lý do:")!==-1 && htmlText.indexOf("CHƯA NÊN GẤP | Lý do:")!==-1 && htmlText.indexOf("CHƯA KIỂM TRA NGUỒN | Lý do:")!==-1 && htmlText.indexOf("THIẾU SỔ GẤP | Lý do:")!==-1 && htmlText.indexOf("ĐÃ GẤP RỒI | Block:")!==-1);
// 25 content field empty -> disabled, error names field (V11, test 6)
reset(); f.nn.value="02"; validCut(); f.decided.value=""; render(); t("empty 'Quyết định' -> disabled, error names field", copyBlockBtn.disabled && gateError().indexOf("Quyết định")!==-1, gateError());
// 26 another content field empty -> disabled, error names field (V11, test 6)
reset(); f.nn.value="02"; validCut(); f.facts.value=""; render(); t("empty 'Dữ kiện nguyên văn' -> disabled, error names field", copyBlockBtn.disabled && gateError().indexOf("Dữ kiện")!==-1, gateError());
// 27 content fields '(chưa có)' -> enabled, renders literal (V11, test 6)
reset(); f.nn.value="02"; validCut(); f.decided.value="(chưa có)"; f.constraints.value="(chưa có)"; f.pending.value="(chưa có)"; f.facts.value="(chưa có)"; f.dropped.value="(chưa có)"; render(); t("content fields '(chưa có)' -> enabled, renders literal", !copyBlockBtn.disabled && gateError()==="" && out.textContent.indexOf("(chưa có)")!==-1);
// 28 Part 9 item 7 is NEEDS_SOURCE only, not merged with POSITIVE TEST (V11 fix-up)
t("Part 9: no merged 'NEEDS_SOURCE test + POSITIVE TEST' item", htmlText.indexOf("NEEDS_SOURCE test + POSITIVE TEST")===-1);
// 29 POSITIVE TEST still present on the page as its own criterion (e) (V11 fix-up)
t("POSITIVE TEST still on page (trial criterion e)", htmlText.indexOf("POSITIVE TEST")!==-1);
return results;
})();
`;
const wrapped = src + testCode + "\n})();";
const vm = require("vm");
const sandbox = { document, navigator, window, console, setTimeout, Date, process, htmlText: html };
vm.createContext(sandbox);
// Runner nội tuyến: nối code in kết quả trực tiếp vào trong IIFE.
const printer = `
;(function(){
var r=__results;var fail=0;
r.forEach(function(x){if(x[1]){console.log("PASS  "+x[0])}else{fail++;console.log("FAIL  "+x[0]+(x[2]?" — "+x[2]:""))}});
console.log("----");console.log("TOTAL "+r.length+" / PASS "+(r.length-fail)+" / FAIL "+fail);
if(fail>0)process.exitCode=1;
})();
`;
const finalSrc = src + testCode + printer + "\n})();";
vm.runInContext(finalSrc, sandbox);

