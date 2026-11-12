# Target v11: Bộ chuyển giao context thủ công giữa các chat
# (Manual Context Handoff Kit for ChatGPT Web)
# Sửa theo BÁO CÁO TỔNG HỢP SWARM V8 kiểu Anthropic (diff-only
# V7→V8) — CONSOLIDATED.md, 2026-11-11 11:03, 10/10 Muse reviewer.
# Verdict: HOLD — 0 PASS / 10 HOLD / 0 FAIL, 0 P0. 4 P1 / 11 P2 /
# 11 P3, checklist sửa 26 mục. Kduu chọn "Fix V9 theo 26 mục" 11:03.
# QUYẾT ĐỊNH CHO MỤC MỞ (P2-2): chọn phương án (a) — thêm biến thể
# Prompt D "gộp trộn" (8 block current cũ nhất, mọi tier), KHÔNG thu
# hẹp MERGE chỉ cho đầu vào đồng nhất. Field 8 sửa theo để parent
# được trộn tier.
# HỘI TỤ (theo đề xuất của swarm V8): v9 là fix danh sách ngắn. Sau
# v9 chỉ re-verify đúng chỗ đã sửa bằng grep + chạy lại harness Node
# — KHÔNG mở vòng swarm đầy đủ khác. Trial thật #1 ĐÃ CHẠY 2026-11-11
# 11:40–13:19 (ChatGPT Free, DALAT-TRIP): FAIL / CHƯA READY — (a)–(e)
# ĐẠT, (f) CHƯA ĐỦ; 2 FAIL là test 9 (gấp trùng) và test 17 (từ chối
# sai chuỗi). V10 chỉ sửa đúng 2 lỗi đó (Kduu chọn 13:20). Sau V10 là
# trial #2 (chạy lại test 9 + 17 và các test chưa thử) — trial #2 Part A
# ĐÃ CHẠY 2026-11-11 13:35–14:02, test 9+17 PASS; test form 6/11/12/15
# ĐÃ CHẠY 2026-11-12 07:23–07:26 trên GitHub Pages (11/12/15 PASS,
# 6 FAIL) → V11 là fix test 6 (Kduu chọn 07:30 12/11), KHÔNG phải fix
# test 19 (test 19 vẫn mở, nâng giới hạn đã bị phủ quyết).
# GHI CHÚ VERSION (P2-4, sửa ở fix vòng 1 sau review R1): độ lệch
# version của artifact KHÔNG ổn định — build V8 nằm ở artifact
# version v9, build V9 nằm ở artifact version v11. Khi kiểm chứng,
# đối chiếu theo mtime + nội dung, không theo tên thư mục hay độ lệch
# cố định. Sau mỗi lần catalog version mới lên live, PHẢI xuất lại
# HTML và đối chiếu mtime + nội dung trước khi trích dẫn — catalog
# có thể lag sau file live (vòng review R1 đã chứng minh: export V9
# đầu tiên kéo nhầm build V8 cũ).
# Read-only for reviewers: do NOT edit except through the fix round.
# FIX VÒNG 1 SAU REVIEW R1 (2026-11-11, 3/3 HOLD, 3 P2 + 10 P3): spec sửa theo review-v9-round1/CONSOLIDATED.md. Kit vẫn là V9 — đây là fix trong V9, không phải V10. Vòng R2/R3 review DIFF-ONLY trên đúng các chỗ đã sửa.
# FIX VÒNG 2 SAU REVIEW R2 (2026-11-11, 3/3 HOLD, 0 P2 + 7 P3): spec sửa theo review-v9-round2/CONSOLIDATED.md. Kit vẫn là V9. Vòng R3 review DIFF-ONLY trên đúng các chỗ đã sửa.
# FIX VÒNG 3 SAU REVIEW R3 (2026-11-11, 3/3 HOLD, 1 P2 + 2 P3): spec sửa theo review-v9-round3/CONSOLIDATED.md. Kit vẫn là V9. Đây là fix vòng cuối của vòng review 3 vòng — sau đó DỪNG review text, chạy trial thật trên ChatGPT Free.
# FIX V10 THEO TRIAL #1 (2026-11-11, Kduu chọn 13:20): spec sửa theo trial-2026-11-11/REPORT.md — chỉ 2 lỗi test 9 (gate chống gấp trùng trong Prompt A + form) và test 17 (khung SAO CHÉP NGUYÊN VĂN cho 6 dòng từ chối). Kit lên V10. Sau V10 là trial #2 — đã chạy (xem trên).
# FIX V11 THEO TEST FORM 6 (2026-11-12, Kduu chọn 07:30): spec sửa theo trial-2026-11-11/REPORT.md — chỉ 1 lỗi test 6 (form không bắt trường nội dung để trống). Kit lên V11. Test 19 vẫn mở (không nằm trong V11).

## Tên + cảnh báo trang đầu (giữ từ v3/v4/v5/v6/v7/v8)
Tên kit: "Bộ chuyển giao context thủ công giữa các chat"
(Manual Context Handoff Kit for ChatGPT Web).
Cảnh báo ngay trang đầu, không được rút ngắn:
"Không nén lịch sử của chat hiện tại; không giảm context của request
đang chạy; không thay thế cách ChatGPT tự xử lý context; không tái
tạo proxy hoặc hành vi prefix-cache. Đây chỉ là cách lưu note tóm tắt
và chuyển dữ liệu sang chat mới (cross-chat handoff).
Gmail/Notion chỉ là kho archive thủ công — chúng KHÔNG phải SQLite,
không có runtime decompress / search_context / acp_status, và không
bảo đảm integrity hay khôi phục tự động."

## Ba lớp nội dung — tách rõ, không trộn
(1) Cơ chế thật của billion-context (proxy, tool, SQLite, cắt luồng).
(2) Quy trình thủ công của kit (prompt + copy-paste của người dùng).
(3) Mẹo / heuristic do người viết kit tự đề xuất (ghi rõ là tự đề xuất).
Mọi câu trong kit thuộc đúng một lớp, và lớp (3) luôn ghi "do kit tự
chọn, không phải quy tắc của billion-context".

## What this kit is — read this first
This is a HANDOVER-NOTE routine, not compression. It does not shrink a
chat, does not save tokens, and does not reproduce billion-context.
Folding is ONE-WAY: a summary cannot give back a detail it dropped.
Re-summarizing a summary compounds the loss: R(k) ≈ ρ^k → 0, only
3–13% retained after 4 rounds (paper §4.2) [mô hình / ước tính trong
paper] — SCOPE NOTE (v8): the 3–13% figure is an ANALYTICAL MODEL
of repeated conventional one-shot compaction in paper §4.2, NOT a
measured fidelity rate for this kit's T1/T2/T3 folds. Do NOT derive
Tier-2/Tier-3 retention numbers from it without a dedicated
experiment. ρ (rho) is the per-round retention factor of the paper's
model — this kit does not measure ρ; if the formula is cited, say
so, or drop the formula and keep only the 3–13% model estimate with
its label.
The old chat is the only full text. Keep it. Never delete it.
This manual adaptation has NO independent verification yet — no
end-to-end test of all 4 prompt roles (Prompt D has 3 variants) on a real ChatGPT Free account has
been run. A Free ChatGPT web account pays nothing per token, so
token/cost figures from proxy tests cannot be felt or checked here.
They are quoted below only with their conditions, for context — not
as this kit's payoff.
NEW IN V9: all 26 items of the swarm-V8 checklist are applied. The
two heaviest fixes: (1) the FIRST_FOLD gate now enforces NN==01 in
code (P1-1); (2) Part 2 of an email is scoped by tier — Tier-1 gets
the sanitized raw transcript, Tier-2/3 get a parent list + links,
no raw of their own (P1-2). The T2/T3 validation gate is now
TWO-WAY (P1-4), the source_range gate counts whitespace units
(P2-1), and a mixed-tier Prompt D variant exists (P2-2).

## Purpose
Help a user move a long ChatGPT web conversation into a new chat by
writing one short handover note by hand, in Vietnamese, and checking it.
Free account, web UI only, no API, no proxy, no plugin, no tool injection.
Gmail is the master store. Notion is an optional mirror/index only.

## Non-goals
- Do not install `bili`, do not route traffic through a proxy.
- Do not claim token/cache savings. Do not call manual steps
  `compress`, `decompress`, or `search_context` — they are not those tools.
- Do not use this on sensitive / proprietary code without thinking
  through the Gmail/Notion trust surface. The user emails notes to
  themself by hand; Gmail is NOT connected to ChatGPT in any way.
- Privacy: remove passwords, API keys, login tokens, customer data and
  PII before saving anything to Gmail/Notion (redact BEFORE saving
  raw, not after). NEVER copy internal company docs, NDA source code,
  or any third party's information to Notion/Gmail without permission.
  A segment that cannot be scrubbed line by line is saved with a
  [REDACTED] placeholder (see Storage), never skipped silently and
  never copied raw.
- SOURCE DISTINCTION (v8): there are TWO raw sources.
  ORIGINAL_SOURCE = the original, unredacted text; it lives ONLY in
  the old [ARCHIVE] chat or in a secret store the user controls — it
  is NEVER pasted into ChatGPT and NEVER saved to Gmail/Notion (not
  even into a Gmail DRAFT — see loop step 2, P1-3).
  SANITIZED_RAW_SOURCE = the cleaned copy (secrets replaced by
  [REDACTED] placeholders); it is the ONLY version pasted into
  ChatGPT (Prompts A, B, C) and the ONLY version saved to
  Gmail/Notion. The completeness check runs ONLY against
  SANITIZED_RAW_SOURCE. A [REDACTED] placeholder is a deliberately
  missing segment, not a failed check — it must be handled in the
  restore drill (see drill rule). Never call the sanitized copy
  "full verbatim".

## Source system (lớp 1 — for reference only)
billion-context (ranxianglei/billion-context, npm `billion-context`,
v0.1.213 — GitHub release 07 Nov 2026; npm publish date may differ,
verify before citing) is a local proxy between a coding agent and
the model API. It injects four tools the model calls itself:
`compress`, `decompress`, `search_context`, `acp_status`.
It counts tokens, holds full text in a local SQLite store at
~/.local/share/billion-context/ (sessions/), and rewrites what the
model is sent. Paper: "Model-Driven Incremental Hierarchical
Compression: Training-Free Multi-Generational Context Management for
Long-Lived Coding Agents", preprint v0.2, 2026-09-07.
None of that machinery exists in ChatGPT web Free. This kit copies
only three ideas from it, in weakened manual form: fold old talk into
a short note, keep the user's own words verbatim, and check the note
before trusting it.

### Provenance table — three independent columns (v7, updated in v8/v9)
Every claim about the source below names which column it comes from.
Do NOT mix columns: a paper statement is not a release behavior, and
a master-doc statement is not a v0.1.213 behavior. Every config
number cell in this table carries its evidence label [claim dự án]
(P3-4).

| Chủ đề | Paper v0.2 (2026-09-07) | Release v0.1.213 (07/11/2026) | Master (as read 11/11/2026) |
|---|---|---|---|
| Fold trigger | §3.4 phrases the condition as context ~45% of the window AND growth past a step | Config: `compress.nudgeGrowthTokens` default 50,000 [claim dự án]; growth gate = max(20K, 0.45 × step) [claim dự án] → effective floor ≈ 22,500 tokens [claim dự án]; `maxContextLimit` default 75% [claim dự án] | `docs/configuration.md` on master documents the same defaults |
| Pressure layer | — | Separate pressure layer starts at 75% usage [claim dự án]; EMERGENCY layer at 95% usage [claim dự án] (forced nudge at 75%, emergency at 95%) | Same |
| Eligibility | — | Only ELIGIBLE regions are compressed; necessary content is not compressed (eligibility rule) | Same |
| 45% | A "qualification layer" in the paper's description, NOT a day-to-day trigger | The 0.45 factor applies to the growth STEP, not to context usage | Same |
| nudgeGrowthTokens | — | Tag config lists default 50,000 [claim dự án]. NOTE: the author's changelog describes adaptive behavior (5% of context, clamped 6K–50K) — the two framings coexist; cite the config value (50,000) as the default and the adaptive note as the author's changelog claim, not as the config default | Same |
| Config path | — | `docs/configuration.md` returns 404 at tag v0.1.213. Root `CONFIGURATION.md` at the tag is a FULL document (multi-thousand lines, as fetched 2026-11-11) [claim dự án] — CORRECTION: the v6 claim that it is "only a redirect stub" was WRONG. | `docs/configuration.md` exists on master |
| preserveRecentMessages | Hard floor ~5 messages / ~5K tokens [mô hình / ước tính trong paper] | Kernel default 3 in the v0.1.213 config [claim dự án] (changed from 5 in PR #3058); host config default 3 [claim dự án] | Same |
| nudgeModelDecided / requireNudge | — | nudgeModelDecided OFF is cited from the MASTER docs (docs/configuration.md on master), NOT verified at tag v0.1.213 — do NOT present it as a v0.1.213 behavior. requireNudge default at tag v0.1.213: NOT VERIFIED in this document — check CONFIGURATION.md at the tag before citing it. | nudgeModelDecided OFF (master docs) |

Claim status: "trigger gốc là context >45% AND growth >50K" is PARTIAL,
not TRUE and not FALSE — the paper does phrase it as ~45% of the
window, but the release config implements it as a growth-step ratio
(0.45 × step) with a separate 75% pressure layer. Cite both framings
whenever the trigger is mentioned, and always say this is the SOURCE
mechanism, not the kit's trigger.
FULL SOURCE TRIGGER — 3 LAYERS (v8): (1) growth > 50K tokens past
the last fold; (2) memory pressure — forced nudge at 75% usage,
EMERGENCY at 95% usage; (3) eligibility — only eligible regions are
compressed, necessary content is never compressed.

## What the source actually does (corrected)
- "Model decides" — corrected in v6, kept in v7/v8/v9. The config
  distinguishes TWO flags: `nudgeModelDecided` (a side-call asks the
  model whether it should compress when a nudge fires) and
  `requireNudge` (forbids compression unless a nudge fired).
  `nudgeModelDecided` is OFF by default (docs/configuration.md on
  master — NOT verified at the v0.1.213 tag; see provenance table).
  BUT even with the nudge off, the model still decides WHICH
  ranges to fold, has the right to refuse compression ("refusal is a
  quality valve, not a failure", paper §4), and initiated 22% (23/103)
  of compressions with no nudge at all (paper §3.7) — that 23/103 is
  a PROJECT-REPORTED log figure, not an independent test. In this kit
  the USER decides everything: the user marks the stage, searches,
  copies, pastes, and checks. Every step below is written as a user
  action.
- Source fold trigger (see the provenance table above): three layers
  (growth gate + pressure layer 75% / emergency 95% + eligibility).
  First fold is counted from boot content, not from the first
  message. Each round folds ONLY the increment consumed since the
  last compression ("never rewrites the full history"). There is no
  token counter in the ChatGPT web UI, so this kit's trigger is a
  visible stand-in (see Trigger) and is NOT equivalent to the source
  trigger.
- Source protected zone — two layers, do NOT merge them:
  * Kernel-enforced protection: compression calls, the recent zone
    (hard floor ~5 messages / ~5K tokens [mô hình / ước tính trong
    paper] in the paper; kernel default 3 [claim dự án] in the
    v0.1.213 config, changed from 5 in #3058; real raw zone in
    production ~50K tokens [mô hình / ước tính trong paper]), first
    user message (task intent) and last user message. NOTE:
    preserveRecentMessages=3 (host config) [claim dự án] is NOT the
    same as the paper's ~5-message hard floor — do not conflate the
    two numbers.
  * Summary-writing doctrine: keep verbatim SHORT user messages;
    LONG user messages are kept as intent (paraphrase is an explicit
    exception to verbatim KEEP); keep verbatim decisions with
    rationale, exact values, file paths with line numbers, function
    signatures, load-bearing code lines, exact error strings, and
    message refs. This is a writing rule, not an enforced filter.
    It does NOT guarantee every user message in history stays
    verbatim, and Tier 2/3 lose fidelity further.
  This kit keeps the last 3 messages in the new chat, plus the FIRST
  user message (task intent) — Prompt B must carry it.
- Source KEEP classes (paper §4): file paths with line numbers,
  signatures and load-bearing code lines, exact error strings,
  decisions WITH rationale, exact values, goal evolution, message refs.
- Tier-2 in the source: T2 trigger = step x 1.5 by token volume
  (tier2Trigger: 1000 by block count, default OFF) [claim dự án]; in the author's
  own data only 60 of 1,711 blocks were folded again into Tier 2
  (3.5%) [claim dự án], and in the controlled pilot Tier-2+
  occurred 0 times ("No round exercised tier-2+ compression", paper
  §8.1 note i). Tier-2 is a safety valve, not a default schedule.
  Merging to Tier-2 progressively relaxes fidelity (paper §4) —
  Tier-2 must NEVER be used in place of Tier-1/raw for numbers,
  code, or exact quotes. Do NOT attribute fidelity results to the
  controlled pilot: the pilot ran no Tier-2+ rounds, so no pilot
  fidelity figure exists. Tier-3 in the source: "never observed in
  practice" (paper §7) — the kit's Tier-3 is a terminal bookkeeping
  layer, not a measured source behavior.
- Reversal in the source: `decompress` restores from the local
  SQLite store; `decompress-to-file` writes the original to a temp
  file for the agent to read/grep WITHOUT breaking prefix cache or
  swelling the context window. "Restoration verified when
  instructed; models at this scale do not yet reach for it
  unprompted" — spontaneous restoration is 0% (paper §3.7, §8.1,
  §10). There is no decompress-to-file on ChatGPT web.
- Words: distinguish token, message, turn, request. One user turn can
  produce several requests/tool calls; a 50K-token trigger does not
  convert into a fixed number of chat turns.

## Prompt mapping — no tool equivalence
The 4 prompts (Prompt D has 3 variants: Tier-2, Tier-3, and mixed) are MANUAL procedures. Do NOT label them "≈ tool",
"thay cho tool", or "đóng đúng vai trò tool". Call each one
"vai trò thủ công tương tự" at most, and state plainly:
- Prompt A (Viết note) ≈ similar goal to `compress` only; it cannot
  touch message ranges or the request body.
- Prompt B (Mở chat mới) has NO native-tool counterpart. It is a
  packet-loading procedure. `acp_status` (context allocation + which
  ranges can be compressed) has NO counterpart in this kit — it was
  dropped, and that must be stated. Prompt C is manual user
  instructions and has its own paste frame (see Prompt C).
- Prompt C (Mở lại) is the USER finding the original and pasting it.
  It is not `decompress` + `search_context`.
- Prompt D (Gộp Tier-2) is a kit-invented summary-of-summaries step,
  not native tiering (no active/deactivated state, lineage, or
  promotion logic). Prompt D — Gộp trộn (v9) is the same kind of
  kit-invented step for mixed-tier merges.

## Trigger (visible in the web UI)
Fold ONLY when BOTH are true at the same time:
(1) You just closed a clear work stage (a decision made, a bug fixed,
    or a design item done — NEVER fold mid-debug or mid-step), AND
(2) the conversation since the last fold is about 2,500–4,000 words
    total, both directions (user + ChatGPT) — estimate by copying the
    segment into an OFFLINE word counter (a local text editor's word
    count, or `wc -w` on a saved file), or roughly 10–15 turns with
    long outputs [heuristic] (P3-4). NEVER paste a transcript
    containing sensitive data into an online word-count website.
The 2,500–4,000-word rule is a CHECKPOINT HEURISTIC [heuristic], not
a token threshold, and it does NOT convert stably to 50K tokens. It
does NOT predict when ChatGPT Free will cut context — NO evidence
supports that prediction, and no experiment in this kit has measured
the right handoff point on ChatGPT Free. The "10–15 turns" estimate
is a rough proxy for the 2,500–4,000-word segment, NOT derived from
the source median fold (2.6K tokens / 29 messages, paper §6.2
[mô hình / ước tính trong paper]) — do not present the two as the
same measurement.
CONDITIONAL WARNING (replaces the v6 sliding-window claim): do NOT
assume the model still has access to the full history — the interface
may still DISPLAY old messages the model no longer uses, and there is
no official OpenAI documentation confirming the input box locks when
context fills. So: ALWAYS save the raw excerpt BEFORE you need the
handoff (step 2 of the loop), never after.
FALLBACK (v7): if the old chat cannot take Prompt A (input will not
accept the paste, or the history is already cut so the model cannot
see the stage), do NOT force it — open a SEPARATE handoff chat,
paste the saved raw excerpt + metadata (project_id, session_id,
block_id, cut point) there, and run Prompt A in that chat instead.
Folding happens BETWEEN task steps, not mid-step (paper §3.4, §4).
The median fold in the source is 2.6K tokens / 29 messages (§6.2)
[mô hình / ước tính trong paper].

## THE ONE UNIFIED BLOCK TEMPLATE — 18 FIELDS (v8: field 19 DELETED)
Exactly ONE template. It is printed IN FULL, identically, in this
section, in Prompt A, in Prompt D (Tier-2 and Tier-3 variants), and
it is produced by the Part 6b form's shared serializer — one
serializer, so the format cannot drift. "18 fields" means 18 FIELDS,
one field per numbered line; content fields 13–18 may wrap onto
continuation lines, but the field number + name appear once, at the
start of the field. No blank lines inside a block.
If a field has no value, write "(chưa có)" — never leave it blank
silently. Field names are STANDARDIZED everywhere (check every
surface): "Dữ kiện nguyên văn" (never "Dự kiện"), "Việc đang dở"
(never "Đang dang dở").

### Field specifications
Schema fields (12, English names, for Gmail header + Notion table):
1. project_id — string, REQUIRED. Example: MONEO. Uppercase,
   no spaces.
2. session_id — string, REQUIRED. DEFINITION (P3): a session is ONE
   chat thread. A project may have many sessions. Format:
   S-<YYYYMMDD>-<letter>, e.g. S-20261110-A.
3. block_id — string, REQUIRED. Format `CTX-<PROJECT>-<YYYYMMDD>-<NN>`
   (Tier-1), `...-T2-<NN>` (Tier-2), `...-T3-<NN>` (Tier-3).
4. tier — integer 1, 2 or 3, REQUIRED.
5. version — integer ≥ 1, REQUIRED. Starts at 1; a correction is a
   new version, never an edit (see ID issuance below).
6. source_chat_url — string (URL) or "(chưa có)", REQUIRED (may be
   "(chưa có)" if the old chat has no shareable URL).
7. source_range — string, REQUIRED except FIRST_FOLD. Format:
   "15 từ đầu của TIN MỞ ĐẦU → 15 từ đầu của TIN KẾT THÚC".
   ONE canonical definition, used everywhere (see the boundary rules
   below). This is the ONLY place the cut point is recorded.
8. parent_block_ids — list of block codes, REQUIRED. Tier-1: "(chưa
   có)". Tier-2: the 8 Tier-1 codes merged. Tier-3: the 8 Tier-2
   codes merged — NOTE (fix vòng 2 sau review R2, P3-1): under the
   8-oldest rule the packet can never hold 8 Tier-2 blocks — this
   variant is defensive and never fires; if you think you have 8
   Tier-2, the fold log is wrong, stop and check the log — OR, for
   a MIXED merge (v9, P2-2), the 8 oldest
   current codes with each code's tier noted, e.g.
   `CTX-MONEO-20261110-01 [T1], CTX-MONEO-20261110-02 [T1], …,
   CTX-MONEO-20261110-T2-01 [T2]`. Comma-separated, one per line if
   long.
9. status — one of: current / superseded / Hỏng. REQUIRED. A Hỏng
   block NEVER enters the canonical active packet and NEVER enters
   Prompt B — it is quarantined (label CTX-QUARANTINE, see Storage).
10. created_at — datetime, REQUIRED. Format: YYYY-MM-DD HH:MM +07.
11. updated_at — datetime, REQUIRED. Same format; equals created_at
    on first save, updated on every new version.
12. canonical_packet_version — integer, REQUIRED. The version of the
    canonical active packet this block belongs to; increments every
    time the packet changes (new block, merge, archive).
13. original_archive_link — string, REQUIRED. Filled into the Notion
    table / fold log ONLY AFTER the Gmail email has been sent and its
    link retrieved; inside the Gmail email body itself, write
    "(chính là Phần 2 của email này)" instead of a link (a block
    cannot link to the email that contains it before that email
    exists).
Content fields (6, Vietnamese):
14. Quyết định đã chốt (nguyên văn, kèm lý do) — text, REQUIRED
    (write "(chưa có)" if the stage closed with no decision).
15. Ràng buộc / quy tắc — text, REQUIRED ("(chưa có)" if none).
16. Việc đang dở — text, REQUIRED ("(chưa có)" if nothing is open).
17. Dữ kiện nguyên văn — text, REQUIRED ("(chưa có)" if none).
    Content: numbers, file paths, links — verbatim.
18. Đã bỏ đi cố ý — text, REQUIRED ("(chưa có)" if nothing was
    deliberately dropped).

LIMITATION, stated in the kit: this schema has NO equivalent of
effectiveMessageIds (per-message transitive lineage in the source).
The manual stand-in is parent_block_ids + source_range (first/last
15 words). Do not claim full lineage.

### Canonical template (print exactly this — the prompts print the same text)
```
1. project_id: [MONEO]
2. session_id: [S-20261110-A]
3. block_id: [CTX-MONEO-20261110-<NN>]
4. tier: [1]
5. version: [1]
6. source_chat_url: [URL HOẶC CHƯA CÓ]
7. source_range: [15 từ đầu của TIN MỞ ĐẦU → 15 từ đầu của TIN KẾT THÚC]
8. parent_block_ids: [(chưa có)]
9. status: [current]
10. created_at: [2026-11-11 09:00 +07]
11. updated_at: [2026-11-11 09:00 +07]
12. canonical_packet_version: [1]
13. original_archive_link: [(chính là Phần 2 của email này)]
14. Quyết định đã chốt (nguyên văn, kèm lý do): [nguyên văn quyết định + lý do, hoặc (chưa có)]
15. Ràng buộc / quy tắc: [nguyên văn, hoặc (chưa có)]
16. Việc đang dở: [nguyên văn, hoặc (chưa có)]
17. Dữ kiện nguyên văn: [nguyên văn, hoặc (chưa có)]
18. Đã bỏ đi cố ý: [ghi rõ thứ đã bỏ, hoặc (chưa có)]
```
NOTE (v9, P3-3): the canonical template prints
`block_id: [CTX-MONEO-20261110-<NN>]` — fill NN from the fold log.
NEVER copy a literal `-01` into a real block. (The T2/T3 templates
keep `T2-01`/`T3-01` as examples because the first merge of a tier
is legitimately NN==01.)

CHUNK MANIFEST (separate from the 18-field template): the fold log
carries one chunk-manifest row per raw part: part_id (2a, 2b, ...),
source_range of that part, order, word/line count, completeness
status (đủ/thiếu), SPLIT POINT (v9, P3-6 — the exact split position
+ source_range of each sub-chunk, for chunks split by the
long-message exception). The block itself does NOT gain a new field;
the part count is recorded in the email's Part 2 header ("Phần 2: N
phần") and in the chunk manifest.

## Block code + source_range + archive link
Block code format (per project, NN starts at 01):
`CTX-<PROJECT>-<YYYYMMDD>-<NN>` — example: `CTX-MONEO-20261110-01`.
Tier-2 code: `CTX-<PROJECT>-<YYYYMMDD>-T2-<NN>` — example:
`CTX-MONEO-20261110-T2-01`.
Tier-3 code: `CTX-<PROJECT>-<YYYYMMDD>-T3-<NN>`.
A bare code like `B-007` alone is NOT a global identifier. Uniqueness
comes from the (project_id, session_id, block_id, version) tuple in
the Notion index and fold log. NN scope: NN is PER TIER per project
(T1-01, T1-02...; T2-01, T2-02...; T3-01, T3-02...) — a T2-01 does
NOT collide with a T1-01 because the tier is part of the code.
Cross-session uniqueness: the (project_id, session_id, block_id,
version) tuple must be checked ACROSS all sessions of the project,
not only within one session's fold log — two different sessions can
otherwise create the same block_id, and Gmail subject/search and
Prompts B/C/D use the block code alone to find it.

### Boundary rules for source_range (v7/v8, kept in v9)
- ONE CANONICAL DEFINITION: source_range is ALWAYS "first 15
  whitespace units of the OPENING message → first 15 whitespace
  units of the CLOSING message" of the folded segment. The chunk/part
  level uses the SAME definition per part ("first 15 units of the
  part's first message → first 15 units of the part's last
  message"). Prompt A takes BOTH sides, never one side only. There is
  no other definition of source_range anywhere in this kit.
- INCLUSIVE END: the closing message BELONGS to the block being
  folded. The next block starts at the message AFTER the closing
  message.
- INCLUSIVE START: the opening message BELONGS to the block.
- MESSAGE IDENTITY: each boundary is defined by start_message = the
  FIRST message IN the block (inclusive) and end_message = the LAST
  message IN the block (inclusive). The next block starts at the
  message immediately after the previous block's end_message. When
  the UI has no message IDs, use the message's timestamp or its
  ordinal position in the chat, stated inclusive/exclusive.
- NO-OVERLAP / NO-GAP: every message in the chat belongs to exactly
  one block. Copying a message into two blocks is duplication; skipping
  a message is loss — both are errors caught by the completeness
  check.
- BOUNDARY IDENTITY: each boundary records the previous block's code
  and the next block's code (in the fold log row), so a boundary can
  be checked from either side.
- UNIQUENESS ANCHOR: if the 15-unit quote is not unique in the chat
  (repeated opening sentences like "Dưới đây là kết quả..."), append
  a disambiguating anchor: the message's timestamp, or one unique
  phrase from the middle of that message. 15 units are NEVER used as
  a unique ID without a duplicate-handling mechanism.
- COUNTING RULE for Vietnamese: count WHITESPACE-SEPARATED units.
  One unit = one maximal string of non-space characters. A
  multi-syllable Vietnamese word written with spaces counts as
  multiple units (e.g. "quyết định đã chốt" = 4 units). Punctuation
  attached to a unit counts as part of that unit (e.g. "login:" is
  one unit, not two). Count the first 15 units of the message.
- SHORT MESSAGE RULE: if the opening or closing message has FEWER
  than 15 units, use its FULL text as that side's quote and record
  it as a full message (never pad, never borrow units from a
  neighbouring message). A fold whose boundary messages are both
  short still has a valid source_range.
- WORKED EXAMPLE: opening message "Dưới đây là kết quả kiểm tra
  login:" has 8 units (Dưới / đây / là / kết / quả / kiểm / tra /
  login:) — fewer than 15, so the full message is the quote.
  Closing message "Đã chốt: dùng Gmail làm master, prompt B mở chat
  mới." has 11 units — also a full-message quote. source_range =
  "Dưới đây là kết quả kiểm tra login: → Đã chốt: dùng Gmail làm
  master, prompt B mở chat mới."
source_chat_url vs original_archive_link — split:
- source_chat_url: URL of the old [ARCHIVE] chat.
- original_archive_link: filled into the Notion table / fold log
  ONLY AFTER the Gmail email has been sent and its link retrieved;
  inside the Gmail email body itself, write "(chính là Phần 2 của
  email này)" instead of a link.
Fold log (one row per fold, the append-only manifest — see Storage):
project_id | session_id | block_id | version | status
(current/superseded/Hỏng) | ngày | tiêu đề chặng & 1 từ khóa |
điểm biên (15 đơn vị tin đầu → 15 đơn vị tin cuối) | Gmail đúng định
dạng theo tier (Tier-1 đủ 2 phần / Tier-2/3 đúng Part 2 theo tier —
rồi/chưa) | Kiểm tra (đạt/rớt + lỗi nếu có) | Drill khôi phục
(mã block, ngày, chunk counts, chunk sequence, kết quả từng mục đã
kiểm, kết quả Tier-2/3, đạt/rớt + nguyên nhân rớt) | Sự kiện (FOLD /
DUPLICATE_DETECTED / SUPERSEDED / CORRECTION / INVALIDATED — see
Storage).

### ID issuance + version procedure — ONE unified procedure (v7/v8, kept in v9)
1. Before saving a new block, open the fold log (the ID ledger) and
   find the project's last NN for the block's tier. Take the NEXT NN.
   NN is NEVER assigned by defaulting to 01.
2. Check that (project_id, session_id, block_id, version) does not
   already exist in the log / Notion index — ACROSS ALL SESSIONS of
   the project, not only the current session. A duplicate means STOP
   and re-issue a new NN.
3. A correction is NEVER an edit: send a NEW email with version
   increased by 1 (monotonic versions only, never reuse a version
   number), move the old email to CTX-ARCHIVED, and add a new fold
   log row with event CORRECTION pointing at the old block code.
4. The same procedure applies to Tier-2 and Tier-3 codes (their own
   NN sequences, T2-01, T2-02... / T3-01, T3-02...).
5. Prompt A must NOT print a hardcoded example block_id ending in
   `-01` — the example is `CTX-<PROJECT>-<YYYYMMDD>-<NN>` and the
   user fills NN from the fold log. A user who copy-pastes a literal
   `-01` example gets a duplicate. The canonical template follows
   the same rule (v9, P3-3).

## The 4 prompts (Prompt D has 3 variants) — full text, copy-paste ready
### Prompt A — Viết note bàn giao cho MỘT chặng đã khép lại
(V6: Prompt A works ONLY on an excerpt the user actually pastes.
V7: full 18-field template printed, not a placeholder. V8: field 19
deleted; FIRST_FOLD ledger check; source-to-capture check input;
sanitized excerpt only; no hardcoded -01 example.
V9: fourth stop rule CHƯA KIỂM TRA NGUỒN (P2-6); paste frame
renamed to cleaned excerpt (P3-7); Tier-3 sub-item identifier (P2-11).
V10: SỔ GẤP input bắt buộc + gate KIỂM TRA TRÙNG (test 9); khung
SAO CHÉP NGUYÊN VĂN cho 6 dòng từ chối (test 17); 4 điểm từ chối cũ
trỏ về khung, không in lại dòng.)
```
Thông tin định danh do người dùng cấp (điền trước khi gửi):
project_id = [MONEO]
session_id = [S-20261110-A]
block_id = [CTX-MONEO-20261110-<NN>]
tier = [1]
version = [1]
source_chat_url = [URL HOẶC CHƯA CÓ]
tên chat cũ = [[ARCHIVE] MONEO 2026-11-10]
điểm cắt của block gần nhất = [trích 15 đơn vị đầu của TIN KẾT THÚC
của block gần nhất; ghi "không xác định được" nếu không tìm thấy]
kiểm tra source-to-capture = [đã kiểm tra — số tin nhắn đã capture:
<N>, anchor đầu: "<...>", anchor cuối: "<...>"]
SỔ GẤP (fold log, bắt buộc — trừ FIRST_FOLD): [dán danh sách block
đã có của dự án, mỗi dòng `mã block | source_range`; nếu đây là lần
gấp đầu thì ghi "FIRST_FOLD — chưa có block nào"]

LẦN GẤP ĐẦU (FIRST_FOLD): nếu đây là lần gấp đầu tiên của dự án
(chưa có block nào), ghi rõ "FIRST_FOLD" vào dòng này và bỏ qua
dòng điểm cắt ở trên — chặng đầu tiên bắt đầu từ tin nhắn đầu tiên
của chat (start_message = FIRST_PROJECT_MESSAGE, inclusive). FIRST_FOLD
chỉ hợp lệ khi fold log xác nhận chưa có block nào của dự án (đối
chiếu ledger, KHÔNG phải tự khai báo) và chỉ với NN==01. Bất kỳ lần
gấp nào sau đó tick FIRST_FOLD thì dừng — không tạo block. (Luật
này được form gate thực thi — xem Form gate: gate phải kiểm
NN==01, không chỉ kiểm ledger trống.)

KHUNG TỪ CHỐI — SAO CHÉP NGUYÊN VĂN (V10, fix test 17):
Khi phải từ chối, sao chép NGUYÊN VĂN đúng một dòng dưới đây — chỉ
thay <lý do> bằng lý do cụ thể, và <mã block cũ> bằng mã block đã
gấp (chỉ dòng ĐÃ GẤP RỒI). KHÔNG thêm/bớt bất kỳ ký tự nào, KHÔNG
thêm tiêu đề (kể cả "FOLD GATE:"), KHÔNG thêm giải thích, KHÔNG đổi
thứ tự từ, KHÔNG gộp nhiều dòng. Dòng trả về CHỈ là dòng đó.
THIẾU NGUỒN | Lý do: <lý do>
KHÔNG XÁC ĐỊNH ĐƯỢC ĐIỂM CẮT | Lý do: <lý do>
CHƯA NÊN GẤP | Lý do: <lý do>
CHƯA KIỂM TRA NGUỒN | Lý do: <lý do>
THIẾU SỔ GẤP | Lý do: <lý do>
ĐÃ GẤP RỒI | Block: <mã block cũ> | Lý do: <lý do>

KIỂM TRA BẢO MẬT (trước khi dán): đoạn trích KHÔNG được chứa mật
khẩu, API key, token đăng nhập, dữ liệu khách hàng hay PII. Thứ nào
không tẩy được thì thay bằng [REDACTED] — bảo toàn ý định, không
bắt buộc giữ nguyên văn dữ liệu phải che. Đoạn trích dán kèm đây là
SANITIZED_RAW_SOURCE (bản đã làm sạch) — bản gốc chưa tẩy
(ORIGINAL_SOURCE) chỉ nằm trong chat cũ hoặc kho bí mật, KHÔNG bao
giờ được dán vào đây và KHÔNG được gọi bản đã che là "nguyên văn
đầy đủ".

ĐOẠN TRÍCH ĐÃ LÀM SẠCH [SANITIZED_RAW_SOURCE] (do người dùng dán
kèm — bắt buộc):
[DÁN TOÀN BỘ ĐOẠN TRÍCH ĐÃ LÀM SẠCH TỪ ĐIỂM CẮT ĐẾN CUỐI CHẶNG
CẦN GẤP VÀO ĐÂY, ĐÃ CHIA THÀNH CÁC PHẦN 2a/2b/2c NẾU DÀI.
Nếu không dán đoạn trích, model PHẢI dừng lại và chỉ trả về đúng
một dòng trong KHUNG TỪ CHỐI ở trên: dòng THIẾU NGUỒN.]

Hãy chỉ đọc ĐOẠN TRÍCH ĐÃ DÁN Ở TRÊN (phần hội thoại PHÁT SINH KỂ
TỪ điểm cắt của block gần nhất đến mốc [TRÍCH CÂU CUỐI CỦA CHẶNG
CẦN GẤP]), và chỉ khi chặng đó đã hoàn thành (TUYỆT ĐỐI KHÔNG tóm
tắt lại các block note bàn giao cũ ở đầu chat và KHÔNG tóm tắt phần
việc đang làm dở sau mốc kết thúc). Nếu không xác định được điểm cắt
của block gần nhất (và đây không phải FIRST_FOLD) thì KHÔNG TẠO
BLOCK — hãy dừng lại và chỉ trả về đúng một dòng trong KHUNG TỪ
CHỐI ở trên: dòng KHÔNG XÁC ĐỊNH ĐƯỢC ĐIỂM CẮT.
Nếu chặng này đang dở giữa chừng (đang debug lỗi chưa ra nguyên nhân
hoặc chưa chốt phương án), hãy dừng lại và chỉ trả về đúng một dòng
trong KHUNG TỪ CHỐI ở trên: dòng CHƯA NÊN GẤP.
Nếu dòng kiểm tra source-to-capture ở trên TRỐNG, hoặc ghi "chưa
kiểm tra", hoặc số tin nhắn / anchor không khớp đoạn trích đã dán,
hãy dừng lại và chỉ trả về đúng một dòng trong KHUNG TỪ CHỐI ở
trên: dòng CHƯA KIỂM TRA NGUỒN.
(Không tạo block. Dòng kiểm tra này là tự khai báo của user — kit
không có cách xác minh độc lập rằng bạn đã đối chiếu theo thứ tự
tin nhắn; đừng điền nếu chưa làm.)
KIỂM TRA TRÙNG (V10, fix test 9): TRƯỚC KHI viết block, đối chiếu
source_range của chặng này (15 đơn vị đầu của tin mở đầu → 15 đơn
vị đầu của tin kết thúc) với từng dòng trong SỔ GẤP đã dán ở trên.
Nếu cả hai phía đều trùng với source_range của một block đã có thì
chặng này ĐÃ GẤP RỒI — hãy dừng lại và chỉ trả về đúng một dòng
trong KHUNG TỪ CHỐI ở trên: dòng ĐÃ GẤP RỒI (điền <mã block cũ> là
mã block đã có đó). Không tạo block. Nếu dòng SỔ GẤP ở trên TRỐNG
(và đây không phải FIRST_FOLD) thì cũng dừng lại và chỉ trả về đúng
một dòng trong KHUNG TỪ CHỐI ở trên: dòng THIẾU SỔ GẤP. Không tạo
block.
Nếu chặng đã khép lại, hãy viết MỘT block Tier-1 cho riêng chặng đó
theo đúng mẫu 18 trường dưới đây. Chỉ dùng thông tin có trong đoạn
trích đã dán. Không bịa. Chỗ nào không chắc thì ghi "không chắc".
Giữ nguyên văn: quyết định đã chốt KÈM lý do, đường dẫn file kèm số
dòng, chữ ký hàm, dòng code quan trọng, câu lỗi chính xác, con số
chính xác, tham chiếu tin nhắn, diễn biến mục tiêu. Tóm tắt ngắn phần
giải thích dài và suy luận. Bỏ phần tán gẫu.

[GHI ĐÈ — AI VIẾT NHÃN NÀY (v8): khi một quyết định, ràng buộc,
việc đang dở, con số, đường dẫn/code, nguồn hoặc phiên bản trong
chặng này THAY ĐỔI một mục đã chốt trong block cũ, hãy ghi rõ
trong đúng trường đó: "[GHI ĐÈ <mã block cũ>] <nội dung mới>".
Không có nhãn ghi đè thì quyết định cũ vẫn thắng. Khi ghi đè một
mục trong block Tier-2, phải ghi kèm sub-item identifier — mã block
Tier-1 nguồn và tên trường mà quyết định đó lấy từ đó. Khi ghi đè
một mục trong block Tier-3 (v9, P2-11), ghi kèm sub-item identifier
— mã block Tier-2 nguồn + tên trường, và mã block Tier-1 gốc nếu
quyết định đó bắt nguồn từ Tier-1. Khi ghi đè mục "Việc đang dở",
phải ghi thêm "(cần user xác nhận ở bước kiểm tra)" — ghi đè trên
việc đang dở KHÔNG tự động mang sang phiên chat mới.]

MẪU 18 TRƯỜNG — điền đúng mẫu này, không rút gọn, không đổi tên
trường, không đổi thứ tự:
1. project_id: [MONEO]
2. session_id: [S-20261110-A]
3. block_id: [CTX-MONEO-20261110-<NN>]
4. tier: [1]
5. version: [1]
6. source_chat_url: [URL HOẶC CHƯA CÓ]
7. source_range: [15 đơn vị đầu của TIN MỞ ĐẦU → 15 đơn vị đầu của TIN KẾT THÚC]
8. parent_block_ids: [(chưa có)]
9. status: [current]
10. created_at: [2026-11-11 09:00 +07]
11. updated_at: [2026-11-11 09:00 +07]
12. canonical_packet_version: [1]
13. original_archive_link: [(chính là Phần 2 của email này)]
14. Quyết định đã chốt (nguyên văn, kèm lý do): [nguyên văn quyết định + lý do, hoặc (chưa có)]
15. Ràng buộc / quy tắc: [nguyên văn, hoặc (chưa có)]
16. Việc đang dở: [nguyên văn, hoặc (chưa có)]
17. Dữ kiện nguyên văn: [nguyên văn, hoặc (chưa có)]
18. Đã bỏ đi cố ý: [ghi rõ thứ đã bỏ, hoặc (chưa có)]
```

### Prompt B — Mở chat mới (header text given in full)
```
Đây là các BLOCK BÀN GIAO đang còn hiệu lực (status = current) của dự
án [MÃ DỰ ÁN], xếp theo thứ tự từ cũ đến mới — tối đa 8 block đang
active (thành phần theo bảng chuyển trạng thái lifecycle: có thể gồm
nhiều Tier-1, Tier-2 và Tier-3 đang current). Đây là GÓI HIỆN TẠI
(canonical active packet) của dự án. Các bản này là TÓM TẮT, không
phải bằng chứng nguyên văn. Chat cũ vẫn còn, tên là [TÊN CHAT CŨ],
ngày [NGÀY].

KIỂM TRA TRẠNG THÁI TRƯỚC KHI DÁN (new in v9, P3-5): chỉ dán block
có status = current. Kiểm tra từng block — block nào status Hỏng thì
LOẠI RA, chuyển email sang nhãn CTX-QUARANTINE, KHÔNG dán vào chat
mới. Không dán block nào có status Hỏng (nhãn CTX-QUARANTINE).

LUẬT XUNG ĐỘT GIỮA CÁC BLOCK (áp cho MỌI loại dữ liệu — không chỉ
quyết định): Nếu hai block mâu thuẫn nhau ở bất kỳ mục nào — quyết
định đã chốt, ràng buộc/quy tắc, việc đang dở, số liệu, đường dẫn/
code, nguồn, hoặc phiên bản — block mới hơn CHỈ thắng khi trong mục
đó có ghi rõ nhãn [GHI ĐÈ <mã block cũ>]; nếu không có nhãn ghi đè,
phải dừng lại và hỏi người dùng xác nhận thay vì tự chọn, và TUYỆT
ĐỐI KHÔNG tự động chọn block mới hơn. (Quy tắc này cũng là luật duy
nhất cho mọi mâu thuẫn: quyết định mới chỉ thay quyết định cũ khi
user xác nhận rõ.)
GHI ĐÈ XUYÊN TIER: khi một quyết định trong block Tier-2 bị ghi đè,
phải ghi kèm sub-item identifier (mã block Tier-1 nguồn + tên
trường). Khi một quyết định trong block Tier-3 bị ghi đè (v9, P2-11),
ghi kèm sub-item identifier — mã block Tier-2 nguồn + tên trường, và
mã block Tier-1 gốc nếu quyết định đó bắt nguồn từ Tier-1. Ghi đè
trên mục "Việc đang dở" không tự động có hiệu lực — người dùng phải
xác nhận ở bước kiểm tra (bước 7) trước khi phiên mới dùng nó.
Block cũ bị ghi đè được đánh dấu superseded bằng một dòng sự kiện
trong fold log, KHÔNG BAO GIỜ bằng cách sửa dòng cũ.

THỨ TỰ ƯU TIÊN (v7) — khi block xung đột với 3 tin nhắn gần nhất dán
kèm dưới đây: (1) chỉ thị mới nhất của user CÓ xác nhận rõ ràng
thắng; (2) quyết định đã chốt trong block current thắng; (3) dữ liệu
lịch sử thua. Nội dung không rõ ràng thì phải hỏi lại. TUYỆT ĐỐI
KHÔNG tự động dùng tin nhắn mới nhất nếu nó chỉ là trao đổi tạm
thời, chưa chốt.

KIỂM TRA BẢO MẬT (v7/v8): trước khi dán tin đầu tiên và 3 tin gần
nhất — và trước khi dán các block — kiểm tra lại xem có mật khẩu,
API key, token, dữ liệu khách hàng hay PII không — có thì thay bằng
[REDACTED] và bảo toàn ý định bằng dạng đã che. Bản dán vào chat
mới là SANITIZED_RAW_SOURCE — bản gốc chưa tẩy không bao giờ được
dán vào đây. Quy tắc nguyên văn KHÔNG thắng quy tắc che thông tin
nhạy cảm. Nếu redaction làm mất một chi tiết cần xác minh, phải trả
NEEDS_SOURCE hoặc ghi rõ phần bị che — không gọi bản đã che là bản
nguyên văn đầy đủ.

QUY TẮC DỪNG VÀ HỎI: nếu câu hỏi của tôi cần con số chính xác, dòng
code cụ thể hoặc câu chữ nguyên văn nằm trong một block đã gấp mà bản
gốc chưa có ở đây, hãy trả về "NEEDS_SOURCE | <block_id> | '<từ khóa>'"
rồi đợi tôi dán bản gốc — tuyệt đối không tự đoán. Bản tóm tắt không
bao giờ được coi là bằng chứng cho dữ liệu nguyên văn.

[ DÁN TOÀN BỘ BLOCK ĐANG CURRENT VÀO ĐÂY ]
[ DÁN NGUYÊN VĂN TIN ĐẦU TIÊN CỦA USER (task intent) VÀO ĐÂY ]
[ DÁN NGUYÊN VĂN 3 TIN NHẮN GẦN NHẤT VÀO ĐÂY ]

CHƯA làm tiếp công việc. Hãy thực hiện bước kiểm tra bàn giao trước:
(1) nhắc lại nguyên văn 2 quyết định đã chốt kèm lý do, (2) nhắc lại
1 con số/đường dẫn/ràng buộc chính xác trong note, và (3) liệt kê mọi
chi tiết mà việc đang dở sẽ cần nhưng hiện KHÔNG có mặt nguyên văn
trong note bằng cú pháp NEEDS_SOURCE | <block_id> | '<từ khóa>'.
Đợi tôi xác nhận rồi mới làm tiếp.
```
Header is the whole block above, including its first lines. Do not
shorten it. The old last line "Tiếp tục công việc từ note trên." is
DELETED.

### Prompt C — Mở lại một block (user does this, NOT the model)
1. QUY TẮC BẮT BUỘC TRƯỚC KHI HỎI (không đợi model báo NEEDS_SOURCE):
   Bất kỳ khi nào bạn chuẩn bị hỏi hoặc yêu cầu model sửa code, tra
   số liệu, đọc lỗi, hoặc đối chiếu câu chữ cũ mà chi tiết đó không
   nằm nguyên văn ngay trong note, BẠN PHẢI tự tìm đoạn trích trong
   phần SANITIZED_RAW_SOURCE ở Gmail và dán kèm vào câu hỏi ngay
   từ đầu. Tín hiệu NEEDS_SOURCE từ model chỉ là lưới chắn phụ.
2. Tìm bằng mã block hoặc từ khóa trong Gmail — tìm trong CẢ HAI
   nhãn CTX-ACTIVE VÀ CTX-ARCHIVED (v8; v7 chỉ tìm CTX-ACTIVE là
   SAI vì block cha sau khi gộp đã chuyển sang CTX-ARCHIVED). Hoặc
   tìm toàn bộ Gmail theo mã block rồi hiển thị trạng thái. KHÔNG
   BAO GIỜ lọc chỉ CTX-ACTIVE khi mở lại một block nguồn đã
   superseded — Prompt D yêu cầu tra chi tiết nguyên văn về các
   block Tier-1 nguồn trong parent_block_ids, và các block đó đang
   ở CTX-ARCHIVED. Chỉ dán MỘT block. Không biết block nào chứa chi
   tiết thì KHÔNG đoán: mở lại chat cũ và copy chi tiết bằng tay.
3. Chỉ copy đúng đoạn trích nguyên văn chứa từ khóa (tối đa 30–50
   dòng VÀ ~500 từ quanh từ khóa — cái nào tới trước thì dừng,
   TUYỆT ĐỐI KHÔNG dán toàn bộ phần SANITIZED_RAW_SOURCE của
   chặng (một chặng chỉ ~2.500–4.000 từ [heuristic]) vào chat mới),
   kèm khung nhắn:
   'Đây là đoạn trích nguyên văn từ [MÃ BLOCK] cho từ khóa
   [TỪ KHÓA]: <đoạn trích>'.
   (Đoạn trích này là SANITIZED_RAW_SOURCE — bản đã làm sạch.)
4. REDACT TRƯỚC KHI DÁN (v8): đoạn trích dán vào chat mới là
   SANITIZED_RAW_SOURCE — tẩy secret/PII trước khi dán, không chỉ
   trước khi gửi email. Bản gốc chưa tẩy không bao giờ được dán
   vào Prompt C.
This is not `decompress` / `search_context`.

### Prompt D — Gộp 8 block Tier-1 thành 1 block Tier-2 (full text, v7/v8, updated in v9)
Trigger: only when the packet lifecycle says to merge (see Packet
lifecycle) — the merge takes the 8 OLDEST current blocks, which are
Tier-1 in the first merge. "8 block" is a USER-CHOSEN practical
heuristic from the v1 kit to keep the packet manageable — it is NOT
a billion-context rule (the source has no fixed block-count
threshold; Tier-2 touched only 3.5% of blocks, 0 times in the
controlled pilot). The full 18-field template is printed here, not
a placeholder.
```
Thông tin định danh do người dùng cấp (điền trước khi gửi):
project_id = [MONEO]
session_id = [S-20261110-A]
block_id = [CTX-MONEO-20261110-T2-01]
tier = [2]
version = [1]
source_chat_url = [URL HOẶC CHƯA CÓ]
tên chat cũ = [[ARCHIVE] MONEO 2026-11-10]
parent_block_ids = [CTX-MONEO-20261110-01 ... -08]

Gộp 8 block Tier-1 dưới đây thành 1 block Tier-2 theo đúng mẫu 18
trường dưới đây, giữ nguyên văn quyết định kèm lý do và con số chính
xác, bỏ suy luận đã làm. Giữ lại cả 8 block Tier-1, đừng xóa chúng
(chỉ đánh dấu superseded — nhưng CHỈ SAU KHI kiểm tra T2/T3 (xem
dưới) đạt). Ghi rõ block này được gộp từ những mã block nào
(parent_block_ids).
LƯU Ý: Gộp lên Tier-2 là tóm tắt của bản tóm tắt nên chắc chắn làm
giảm thêm độ trung thực (fidelity) so với Tier-1 (paper §4). Chỉ giữ
nguyên các quyết định và ràng buộc còn hiệu lực; khi cần chi tiết
nguyên văn, bắt buộc phải tra về các block Tier-1 nguồn trong trường
parent_block_ids (tìm trong cả CTX-ACTIVE và CTX-ARCHIVED).
KHÔNG dùng Tier-2 thay Tier-1/raw cho số liệu, code hoặc trích dẫn
chính xác.

KIỂM TRA T2/T3 TRƯỚC KHI SUPERSEDE — HAI CHIỀU (v9, P1-4, thay
luật một chiều cũ): (a) mọi mục trong block mới phải khớp một mục
của block cha; (b) mọi mục của 8 block cha phải được liệt kê và đánh
dấu KEPT hoặc DROPPED + lý do (hết hiệu lực / trùng lặp / đã ghi đè
[GHI ĐÈ …]); bất kỳ mục cha nào vắng mặt trong block mới mà không
có lý do drop được ghi thì gate FAIL, giữ parent ở current.

ĐIỂM CHẶN LƯU (v9, P2-8): KHÔNG lưu/gửi email block đã gộp cho tới
khi gate PASS hết mọi mục; nếu một mục rớt thì HỦY/KHÔNG GỬI block
đó, sửa lại rồi chạy lại Prompt D; ghi kết quả gate (PASS từng mục)
vào fold log TRƯỚC KHI lưu.

MẪU 18 TRƯỜNG — điền đúng mẫu này:
1. project_id: [MONEO]
2. session_id: [S-20261110-A]
3. block_id: [CTX-MONEO-20261110-T2-01]
4. tier: [2]
5. version: [1]
6. source_chat_url: [URL HOẶC CHƯA CÓ]
7. source_range: [15 đơn vị đầu của TIN MỞ ĐẦU block cũ nhất → 15 đơn vị đầu của TIN KẾT THÚC block mới nhất trong 8 block]
8. parent_block_ids: [8 mã block Tier-1 đã gộp, cách nhau bằng dấu phẩy]
9. status: [current]
10. created_at: [2026-11-11 09:00 +07]
11. updated_at: [2026-11-11 09:00 +07]
12. canonical_packet_version: [số phiên bản packet sau khi gộp]
13. original_archive_link: [(chính là Phần 2 của email này)]
14. Quyết định đã chốt (nguyên văn, kèm lý do): [chỉ các quyết định còn hiệu lực trong 8 block nguồn, hoặc (chưa có)]
15. Ràng buộc / quy tắc: [nguyên văn, hoặc (chưa có)]
16. Việc đang dở: [chỉ việc còn dở sau khi gộp, hoặc (chưa có)]
17. Dữ kiện nguyên văn: [nguyên văn, hoặc (chưa có)]
18. Đã bỏ đi cố ý: [ghi rõ thứ đã bỏ khi gộp, hoặc (chưa có)]
[ DÁN 8 BLOCK TIER-1 VÀO ĐÂY ]
```

PART 2 CỦA EMAIL TIER-2 — ĐỊNH NGHĨA (v8): một block Tier-2 KHÔNG
có raw transcript riêng của nó. Phần 2 của email Tier-2 là DANH
SÁCH các parent_block_ids cùng với các đường dẫn đến email gốc có
raw transcript. KHÔNG ĐƯỢC ghi Phần 2 là raw nguyên văn nếu không
có bản raw thực sự. Header Phần 2 của email Tier-2 (v9, P2-9):
"PHẦN 2 — DANH SÁCH BLOCK CHA (parent_block_ids + link)".

### Prompt D — Gộp 8 block Tier-2 thành 1 block Tier-3 (full text, v7/v8, updated in v9)
Trigger: only when the packet lifecycle says to merge 8 Tier-2
blocks. NOTE (fix vòng 2 sau review R2, P3-1): under the 8-oldest
rule the packet can never hold 8 Tier-2 blocks — this variant is
defensive and never fires; if you think you have 8 Tier-2, the
fold log is wrong, stop and check the log. "8 block" is a
USER-CHOSEN practical heuristic, not a
billion-context rule. The full 18-field template is printed here,
with tier = 3.
```
Thông tin định danh do người dùng cấp (điền trước khi gửi):
project_id = [MONEO]
session_id = [S-20261110-A]
block_id = [CTX-MONEO-20261110-T3-01]
tier = [3]
version = [1]
source_chat_url = [URL HOẶC CHƯA CÓ]
tên chat cũ = [[ARCHIVE] MONEO 2026-11-10]
parent_block_ids = [CTX-MONEO-20261110-T2-01 ... -08]

Gộp 8 block Tier-2 dưới đây thành 1 block Tier-3 theo đúng mẫu 18
trường dưới đây, giữ nguyên văn quyết định kèm lý do và con số chính
xác, bỏ suy luận đã làm. Giữ lại cả 8 block Tier-2, đừng xóa chúng
(chỉ đánh dấu superseded — nhưng CHỈ SAU KHI kiểm tra T2/T3 đạt).
Ghi rõ block này được gộp từ những mã block nào (parent_block_ids).
LƯU Ý: Tier-3 là tóm tắt của bản tóm tắt của bản tóm tắt nên độ trung
thực thấp hơn Tier-2 nữa (paper §4). Chỉ giữ nguyên các quyết định và
ràng buộc còn hiệu lực; khi cần chi tiết nguyên văn, bắt buộc phải tra
về các block Tier-2 nguồn trong trường parent_block_ids, và từ đó về
Tier-1 (tìm trong cả CTX-ACTIVE và CTX-ARCHIVED). KHÔNG dùng Tier-3
thay Tier-2/Tier-1/raw cho số liệu, code hoặc trích dẫn chính xác.
Tier-3 là TẦNG CUỐI (terminal): không có Tier-4. Khi các block
Tier-3 tích lũy, lifecycle sẽ ARCHIVE block Tier-3 cũ nhất thay vì
gộp tiếp (xem Packet lifecycle). Tier-3 được dán vào Prompt B như
một block current bình thường — không có cú pháp load riêng; keep
rule: chỉ giữ quyết định và ràng buộc còn hiệu lực; drop rule: bỏ
suy luận, bỏ chi tiết đã có ở Tier-2/Tier-1 nguồn.

KIỂM TRA T2/T3 TRƯỚC KHI SUPERSEDE — HAI CHIỀU (v9, P1-4): giống
Prompt D Tier-2 — (a) mọi mục trong block mới phải khớp một mục của
block cha; (b) mọi mục của 8 block cha phải được liệt kê KEPT hoặc
DROPPED + lý do; mục cha vắng mặt không lý do = FAIL, giữ parent ở
current.

ĐIỂM CHẶN LƯU (v9, P2-8): giống Prompt D Tier-2 — KHÔNG lưu/gửi
email block đã gộp cho tới khi gate PASS hết mọi mục; mục rớt thì
HỦY/KHÔNG GỬI block đó, sửa lại rồi chạy lại Prompt D; ghi kết quả
gate vào fold log TRƯỚC KHI lưu.

MẪU 18 TRƯỜNG — điền đúng mẫu này:
1. project_id: [MONEO]
2. session_id: [S-20261110-A]
3. block_id: [CTX-MONEO-20261110-T3-01]
4. tier: [3]
5. version: [1]
6. source_chat_url: [URL HOẶC CHƯA CÓ]
7. source_range: [15 đơn vị đầu của TIN MỞ ĐẦU block Tier-2 cũ nhất → 15 đơn vị đầu của TIN KẾT THÚC block Tier-2 mới nhất trong 8 block]
8. parent_block_ids: [8 mã block Tier-2 đã gộp, cách nhau bằng dấu phẩy]
9. status: [current]
10. created_at: [2026-11-11 09:00 +07]
11. updated_at: [2026-11-11 09:00 +07]
12. canonical_packet_version: [số phiên bản packet sau khi gộp]
13. original_archive_link: [(chính là Phần 2 của email này)]
14. Quyết định đã chốt (nguyên văn, kèm lý do): [chỉ các quyết định còn hiệu lực trong 8 block nguồn, hoặc (chưa có)]
15. Ràng buộc / quy tắc: [nguyên văn, hoặc (chưa có)]
16. Việc đang dở: [chỉ việc còn dở sau khi gộp, hoặc (chưa có)]
17. Dữ kiện nguyên văn: [nguyên văn, hoặc (chưa có)]
18. Đã bỏ đi cố ý: [ghi rõ thứ đã bỏ khi gộp, hoặc (chưa có)]
[ DÁN 8 BLOCK TIER-2 VÀO ĐÂY ]
```

PART 2 CỦA EMAIL TIER-3: giống Tier-2 — danh sách parent_block_ids
+ đường dẫn đến email gốc có raw transcript, không phải raw nguyên
văn. Header Phần 2 của email Tier-3 (v9, P2-9):
"PHẦN 2 — DANH SÁCH BLOCK CHA (parent_block_ids + link)".

### Prompt D — Gộp trộn 8 block current cũ nhất (mọi tier) thành 1 block Tier-3 (NEW in v9, P2-2)
Trigger: only when the packet lifecycle says to merge a MIXED set —
states (7,1,0) — the only reachable mixed state: the 8 OLDEST current blocks are
not all the same tier. "8 block" is a USER-CHOSEN practical
heuristic, not a billion-context rule. The full 18-field template
is printed here, with tier = 3 (destination tier = highest parent
tier + 1).
```
Thông tin định danh do người dùng cấp (điền trước khi gửi):
project_id = [MONEO]
session_id = [S-20261110-A]
block_id = [CTX-MONEO-20261110-T3-<NN>]
tier = [3]
version = [1]
source_chat_url = [URL HOẶC CHƯA CÓ]
tên chat cũ = [[ARCHIVE] MONEO 2026-11-10]
parent_block_ids = [8 mã block current cũ nhất, KÈM TIER TỪNG MÃ,
ví dụ: CTX-MONEO-20261110-01 [T1], …, CTX-MONEO-20261110-T2-01 [T2]]

Gộp 8 block current cũ nhất dưới đây (trộn tier) thành 1 block
Tier-3 theo đúng mẫu 18 trường dưới đây, giữ nguyên văn quyết định
kèm lý do và con số chính xác, bỏ suy luận đã làm. Giữ lại cả 8
block cha, đừng xóa chúng (chỉ đánh dấu superseded — nhưng CHỈ SAU
KHI kiểm tra T2/T3 đạt). Ghi rõ block này được gộp từ những mã
block nào, kèm tier từng mã (parent_block_ids).
LƯU Ý: Tier-3 là tóm tắt của bản tóm tắt của bản tóm tắt nên độ
trung thực thấp hơn Tier-2 nữa (paper §4). Chỉ giữ nguyên các quyết
định và ràng buộc còn hiệu lực; khi cần chi tiết nguyên văn, bắt
buộc phải tra về các block cha trong trường parent_block_ids, rồi
theo đó về Tier-1 (tìm trong cả CTX-ACTIVE và CTX-ARCHIVED). KHÔNG
dùng Tier-3 thay Tier-2/Tier-1/raw cho số liệu, code hoặc trích dẫn
chính xác. Tier-3 là TẦNG CUỐI (terminal): không có Tier-4.

KIỂM TRA T2/T3 TRƯỚC KHI SUPERSEDE — HAI CHIỀU (P1-4): (a) mọi mục
trong block mới phải khớp một mục của block cha; (b) mọi mục của 8
block cha phải được liệt kê KEPT hoặc DROPPED + lý do; mục cha vắng
mặt không lý do = FAIL, giữ parent ở current. (Gate đối chiếu đủ 8
cha, kể cả block Tier-2 trong tập trộn.)

ĐIỂM CHẶN LƯU (P2-8): KHÔNG lưu/gửi email block đã gộp cho tới khi
gate PASS hết mọi mục; mục rớt thì HỦY/KHÔNG GỬI block đó, sửa lại
rồi chạy lại Prompt D; ghi kết quả gate vào fold log TRƯỚC KHI lưu.

MẪU 18 TRƯỜNG — điền đúng mẫu này:
1. project_id: [MONEO]
2. session_id: [S-20261110-A]
3. block_id: [CTX-MONEO-20261110-T3-<NN>]
4. tier: [3]
5. version: [1]
6. source_chat_url: [URL HOẶC CHƯA CÓ]
7. source_range: [15 đơn vị đầu của TIN MỞ ĐẦU block cha cũ nhất → 15 đơn vị đầu của TIN KẾT THÚC block cha mới nhất trong 8 block]
8. parent_block_ids: [8 mã block cha đã gộp, KÈM TIER TỪNG MÃ, cách nhau bằng dấu phẩy]
9. status: [current]
10. created_at: [2026-11-11 09:00 +07]
11. updated_at: [2026-11-11 09:00 +07]
12. canonical_packet_version: [số phiên bản packet sau khi gộp]
13. original_archive_link: [(chính là Phần 2 của email này)]
14. Quyết định đã chốt (nguyên văn, kèm lý do): [chỉ các quyết định còn hiệu lực trong 8 block nguồn, hoặc (chưa có)]
15. Ràng buộc / quy tắc: [nguyên văn, hoặc (chưa có)]
16. Việc đang dở: [chỉ việc còn dở sau khi gộp, hoặc (chưa có)]
17. Dữ kiện nguyên văn: [nguyên văn, hoặc (chưa có)]
18. Đã bỏ đi cố ý: [ghi rõ thứ đã bỏ khi gộp, hoặc (chưa có)]
[ DÁN 8 BLOCK CURRENT CŨ NHẤT (MỌI TIER) VÀO ĐÂY ]
```

PART 2 CỦA EMAIL TIER-3 GỘP TRỘN: giống Tier-2/3 — danh sách
parent_block_ids (kèm tier) + đường dẫn đến email gốc có raw
transcript, không phải raw nguyên văn. Header: "PHẦN 2 — DANH SÁCH
BLOCK CHA (parent_block_ids + link)".

## Packet lifecycle — state-transition table (v7/v8, kept in v9)
The v6 lifecycle was arithmetically broken: after the first merge
the packet held 1 T2 + 7 T1 = 8 blocks, and the next fold needed 8
Tier-1 blocks to merge but only 7 remained. This version defines
every state and every transition, so the packet can never get stuck.
CLARIFICATION (v8): COUNT = current blocks of ANY tier. The merge
input is always the 8 OLDEST current blocks, regardless of tier mix.

### Invariants (both must hold at all times)
(I1) COUNT: the canonical active packet is NEVER more than 8 current
blocks.
(I2) SIZE: the canonical active packet is NEVER more than ~6,000
words in total [heuristic] — counted over all current blocks
plus the first user message plus the last 3 messages in Prompt B,
estimated with the offline word counter. Tier-2/3 merging does NOT
by itself guarantee the packet is small enough — the word cap is
checked explicitly, every fold.

### Fold rule
A fold adds ONE new Tier-1 block. Before adding it:
- If current count < 8 AND the packet would stay ≤ ~6,000 words
  after adding, add the Tier-1 block. Done.
- Otherwise (count = 8) run MERGE first (below), then re-check both
  invariants, then add the Tier-1 block. If count < 8, use the
  WORD-CAP OVERFLOW rule below instead.
- WORD-CAP OVERFLOW AT COUNT < 8 (fix vòng 1 sau review R1, P2-1):
  if count < 8 and the packet is already over (or would go over)
  the ~6,000-word cap, MERGE cannot run (it needs exactly 8
  blocks) — do NOT call it. Instead: (a) if a Tier-3 current block
  exists, ARCHIVE the oldest Tier-3, then re-check the cap; (b) if
  no Tier-3 exists and the packet is not yet over but would go
  over, do NOT add — the new block MUST be trimmed first (trim
  starting from the LOWEST keep-priority — (4) rationale first,
  then (3) numbers / paths, then (2) in-progress work; never drop
  (1) decisions + constraints unless nothing else remains) until
  the packet fits; (c) if the packet is already over the cap and
  no Tier-3 exists to archive, archive the oldest current block
  regardless of tier (it stays retrievable via Prompt C) until the
  packet fits, then trim the new block per (b) to the remaining
  headroom and add it (fix vòng 3 sau review R3, R3-P2). Never add
  a block that pushes
  the packet over the cap; never call MERGE with fewer than 8
  blocks.

### MERGE(state) — one deterministic step
Take the 8 OLDEST current blocks (oldest first):
- If all 8 are the same tier k and k < 3: merge them into ONE block
  of tier k+1 (parents = the 8 block codes) using Prompt D Tier-2
  (k=1) or Prompt D Tier-3 (k=2). The k=2 variant is defensive:
  under the 8-oldest selection rule the packet can never hold 8
  Tier-2 blocks, so this merge never fires; keep the prompt for
  completeness only (fix vòng 2 sau review R2, P3-1). The 8 parents
  become superseded —
  ONLY AFTER the two-way T2/T3 validation gate passes (see Prompt
  D) AND the save gate passes (do not save/send the merged block
  until the gate passes all items — v9, P1-4/P2-8). Count falls by 7.
- If the 8 are MIXED tiers and the highest tier among them is 2: merge them into ONE block of tier (highest tier + 1) (parents =
  the 8 block codes, each with its tier noted) using Prompt D — Gộp
  trộn (v9, P2-2). Same two-way gate + save gate. Count falls by 7.
- If the highest tier among the 8 is 3: DO NOT merge (Tier-3 is
  terminal, no Tier-4 exists). ARCHIVE the oldest Tier-3 block
  instead: move its Gmail email to CTX-ARCHIVED, set its status to
  superseded, remove it from the packet. It stays in Gmail and stays
  retrievable with Prompt C. Count falls by 1. Then re-check the
  invariants (and MERGE again if still at 8).

### State-transition table
Notation: (T1, T2, T3) = counts of current blocks per tier.
"→" is one MERGE step (or an archive step where noted), then the new
Tier-1 is added.

| State before fold | Action | State after fold |
|---|---|---|
| (8, 0, 0) | Merge 8 T1 → 1 T2; add T1 | (1, 1, 0) |
| (7, 1, 0) | Merge mixed (7 T1 + 1 T2) → 1 T3 (Prompt D — Gộp trộn); add T1 | (1, 0, 1) |
| (7, 0, 1) | Highest tier 3 → archive oldest T3; count 7; add T1 | (8, 0, 0) |
| Any state with count < 8 | Add T1 directly — trừ khi vượt word cap, xem rule WORD-CAP OVERFLOW ở trên | count + 1 |

UNREACHABLE states (kept for reference only — do NOT follow these
rows): (6, 2, 0), (1, 7, 0), (0, 8, 0), (0, 7, 1), (0, 0, 8),
(1, 1, 6). Under the 8-oldest rule the packet can never hold ≥2
Tier-2 or ≥2 Tier-3 blocks, so these states never occur; if the fold
log shows one of them, the log is wrong — stop and check the log
before folding. Their arithmetic was correct; only reachability was
wrong (fix vòng 1 sau review R1, P3-1).
Every REACHABLE state is covered: the reachable count-8 states are
(8, 0, 0), (7, 1, 0), (7, 0, 1) plus the count<8 row, and each row
gives exactly one action. If a state is not in the table, it is
UNREACHABLE — and reaching it means the fold log is wrong; stop and
check the log before folding.
Word-cap overflow (I2): if the packet would exceed ~6,000 words even
though count ≤ 8, run MERGE on the oldest 8 (same table) to shrink
it — only when count is exactly 8. If count < 8, use the WORD-CAP
OVERFLOW rule above (archive the oldest Tier-3 if one exists; if
the packet is already over and no Tier-3 exists, archive the
oldest current block regardless of tier; otherwise trim the new
block starting from the LOWEST keep-priority). If it is still over
the cap after every mergeable merge, ARCHIVE the oldest Tier-3
blocks — or, if no Tier-3 exists, the oldest current block
regardless of tier — until it fits (fix vòng 3 sau review R3,
R3-P3). Priority for what
STAYS in the packet: (1) decisions + constraints, (2) in-progress
work, (3) numbers / paths, (4) rationale. Anything that leaves the
packet stays in the Gmail raw archive only, retrievable with
NEEDS_SOURCE / Prompt C. Prompt B pastes the packet as-is; it never
has to trim, because both ceilings are enforced at fold time.

## Per-stage handoff loop — every step is a USER action
(Renamed in v7: it runs per stage, not per day.)
1. User chats normally until the Trigger above is true (stage closed
   AND segment ~2,500–4,000 words).
2. RAW FIRST (P0-2 in v6): BEFORE folding, the user copies the raw
   excerpt of the stage — from the last block's cut point to the end
   of the closed stage — out of the old chat and saves it locally.
   REDACT FIRST (v9, P1-3): save ONLY the SANITIZED_RAW_SOURCE
   (secrets/PII already replaced by [REDACTED]) into the Gmail draft
   or a text file. The unredacted original (ORIGINAL_SOURCE) stays
   in the old chat ONLY — it is NEVER put into a Gmail draft, because
   a Gmail draft IS Gmail. This is the source Prompt A will work on.
   The model is NOT assumed to still see the history: on ChatGPT
   Free the head may already be cut.
2b. SOURCE-TO-CAPTURE VERIFICATION (v8): BEFORE running Prompt A,
   verify the raw excerpt saved in step 2 against the OLD CHAT
   itself. Pin the start and end to SPECIFIC messages in the old
   chat (start_message and end_message, inclusive, with timestamps
   or ordinal positions). Compare the raw capture with the old chat
   IN MESSAGE ORDER — not just word/line totals (totals cannot catch
   a gap in the middle). Record both verbatim anchors (first 15
   units of the opening message, first 15 units of the closing
   message) AND the captured message count. If continuity cannot be
   confirmed — a message in the middle is missing, or the count does
   not match — STOP and return THIẾU NGUỒN; re-copy the excerpt.
   Only after this check passes may the excerpt be chunked (step 3).
   TWO DISTINCT CHECKS, never merged: (check 1) old chat → raw
   capture (this step); (check 2) raw capture → chunk chain (the
   completeness check in Storage). HONESTY NOTE (v9, P2-6): the
   check line you paste into Prompt A is YOUR self-declaration —
   the kit has no independent way to verify that you actually
   compared in message order. Do not fill it in if you have not
   done it.
3. User marks the stage (quotes its first and last sentence), checks
   the fold log for the next block code (ID issuance — never default
   to 01), CHUNKS the raw excerpt, and pastes Prompt A WITH THE RAW
   EXCERPT in the SAME chat — WITH the fold log pasted into Prompt
   A's SỔ GẤP input (block codes + source_ranges, V10 test 9).
   Prompt A checks the new stage against the pasted fold log BEFORE
   creating a block.
   CHUNKING — DEFINED HERE (v9, P3-1): a long raw transcript is
   split into numbered parts — Phần 2a, 2b, 2c... — each at most 500
   words AND at most 50 lines [heuristic]: whichever limit is hit
   first splits the part. Chunks split AT MESSAGE BOUNDARIES: a
   chunk never cuts a message in half (except via the fallback ladder below, which splits one message into sub-chunks of the SAME part — see P2-3); each chunk carries its message
   sequence numbers (e.g. "tin 12–18") and its own anchor (first 15
   units → last 15 units of that part). Each part has its own
   source_range (first 15 units → last 15 units of that part). The
   email's Part 2 header records the part count ("Phần 2: N phần",
   counted by the form — never hardcoded) and the fold log carries
   the chunk manifest (part_id, source_range, order, counts, split
   point, completeness status).
   LONG-MESSAGE FALLBACK LADDER (v9, P2-5 — resolves the remaining
   deadlock): a single message longer than the limits is split in
   this order: (a) BETWEEN code blocks / paragraphs, if any exist;
   (b) a single code fence over the limit → split AT LINE BOUNDARIES
   inside the fence (record the line range of each sub-chunk); (c)
   a single paragraph over the limit → split at SENTENCE boundaries;
   (d) a single sentence over the limit → cutting MID-SENTENCE is
   allowed as a LAST RESORT — record the exact split point +
   source_range of each sub-chunk in the manifest (explicit
   exception to the exception). "Never cut mid-sentence" is NOT an
   absolute rule — an absolute ban re-creates the deadlock.
   The chat gets LONGER by this message — folding here does NOT
   shrink this chat. If the model answers CHƯA NÊN GẤP, KHÔNG XÁC
   ĐỊNH ĐƯỢC ĐIỂM CẮT, THIẾU NGUỒN, CHƯA KIỂM TRA NGUỒN, THIẾU SỔ
   GẤP, or ĐÃ GẤP RỒI (V10, test 9), stop: do not create a block.
   A refusal in a DIFFERENT format (paraphrased, extra title or
   explanation) does NOT count as the refusal (V10, test 17) —
   re-send Prompt A and record the paraphrase attempt in the fold
   log as a failed gate attempt. If source_range is missing or invalid,
   the form MUST NOT render or copy a block (see Form gate below) —
   "(chưa có)" is NOT a valid cut point. FALLBACK: if the old chat
   cannot take Prompt A, run Prompt A in a separate handoff chat
   with the saved raw excerpt + metadata (see Trigger).
4. CHECK (mandatory): user compares the note's decisions and numbers
   against the raw excerpt (step 2) and the old chat before saving.
   If one decision or number is wrong, re-fold that range. Do not
   save an unchecked note. The note's 18-field template must match
   the unified template exactly — a missing or renamed field means
   re-run Prompt A. Verify the new block's source_range against the
   fold log — it must NOT match any existing block's source_range
   (V10, test 9). If the model returned a refusal, it must match its
   KHUNG TỪ CHỐI line EXACTLY (verbatim, no extra text) — a
   paraphrased refusal does not count; re-send Prompt A (V10,
   test 17). Never fold before the original is saved (step 2,
   not step 5).
5. User saves to Gmail (master store, see below): the email holds TWO
   parts — (1) the summary block (18-field template), (2) a Part 2
   SCOPED BY TIER (v9, P1-2):
   - Tier-1: Part 2 = the SANITIZED_RAW_SOURCE of the folded stage,
     under the header "PHẦN 2 — SANITIZED_RAW_SOURCE (bản đã làm
     sạch; [REDACTED] = đoạn cố ý thiếu, không phải nguyên văn đầy
     đủ)" (v9, P2-9). NEVER call it "RAW VERBATIM TRANSCRIPT" or
     "nguyên văn đầy đủ" — the sanitized copy is not full verbatim.
   - Tier-2/3: Part 2 = the list of parent_block_ids + links to the
     original emails that hold the raw transcripts, under the header
     "PHẦN 2 — DANH SÁCH BLOCK CHA (parent_block_ids + link)". A
     Tier-2/3 block has NO raw transcript of its own — do NOT write
     Part 2 as raw verbatim.
   LABEL STEP (v7): after sending, assign the label CTX-ACTIVE to
   the email, search Gmail by block code, and verify the version and
   status. The fold is COMPLETE only when the exact email is found
   with the right label. When Prompt D merges blocks, move the 8
   parent emails to CTX-ARCHIVED.
   If the stage contains a secret that cannot be scrubbed, replace
   ONLY that part in Part 2 with:
   [REDACTED — XEM TRỰC TIẾP TẠI CHAT CŨ [ARCHIVE] <tên chat>
   <ngày>, DƯỚI CÂU Mốc: '<...>']
   so the email stays valid without leaking data. Write one fold-log
   row + chunk-manifest rows.
6. User opens a NEW chat and pastes Prompt B (header + ALL current
   blocks in time order + first user message verbatim + last
   3 messages verbatim — AFTER the Prompt B privacy check and the
   status check in the prompt itself). User keeps the old chat,
   renames it `[ARCHIVE] <project> <date>`, and never deletes it.
   The old chat IS the full text; Gmail/Notion hold a summary plus
   a pasted raw copy.
7. CHECK the new chat (per-item fidelity check): the user lists EVERY
   item in the note — every decision + its reason, every number, every
   code line / file path, every source — and verifies EACH one against
   the old [ARCHIVE] chat (not just the note). Ask one detail
   deliberately NOT in the note — the new chat must answer
   NEEDS_SOURCE. POSITIVE TEST (v8): also ask ONE detail that IS in
   the note — the new chat must NOT answer NEEDS_SOURCE and must
   answer it correctly. A model that always answers NEEDS_SOURCE
   fails the positive test. A fluent answer proves NOTHING by itself.
   If it gets one decision or detail wrong, stop and re-fold. If two
   folds in a row fail the check, STOP using the kit.
8. Only when a detail is missing: user does Prompt C by hand (max one
   block, excerpt only, 30–50 lines AND ~500 words — whichever comes
   first). Only when the packet lifecycle says so: user does Prompt D
   before the next fold (see Packet lifecycle) — homogeneous merge
   via Prompt D Tier-2/Tier-3, mixed merge via Prompt D — Gộp trộn
   (v9, P2-2) — runs the TWO-WAY T2/T3 validation gate (P1-4) and
   the SAVE GATE (P2-8: do not save/send the merged block until the
   gate passes all items; a failed item means DISCARD the block,
   fix, re-run Prompt D; record the gate result in the fold log
   BEFORE saving), then marks the 8 parent blocks superseded
   (Gmail → CTX-ARCHIVED, Notion status accordingly).
9. RESTORE DRILL (every 5 folds, or monthly if sooner) — FULL check
   (v8, format fixed in v9, P2-3): chunk counts, chunk sequence,
   restored decisions, all details, and Tier-2/3 blocks must also
   pass the drill. HOW TO PICK THE BLOCK (v9, P3-2 — formula, not
   vague "wrapping"): NN_target = ((ngày − 1) mod N) + 1, where N = the total number of Tier-1 blocks EVER CREATED for the project (including superseded ones — their Gmail saves under CTX-ARCHIVED are drillable) and ngày = the current day-of-month. If N = 0 (no fold yet) there is no drill (fix vòng 1, P3-7). Only Tier-1 blocks are picked by this NN
   (drilling a Tier-2/3 is a separate part of the same drill, not
   picked by this NN). If the NN_target block was never drilled,
   take it; otherwise take the oldest never-drilled Tier-1 block;
   if every block has been drilled, take the oldest by drill date.
   Worked example: N=11, day=25 → NN = ((25−1) mod 11) + 1 =
   (24 mod 11) + 1 = 2 + 1 = 3.
   DRILL WITHOUT THE OLD CHAT (v8): if the old chat is cut or gone,
   the drill runs against the SANITIZED_RAW_SOURCE saved in Gmail —
   NOT against the old chat. A drill that requires the old chat is
   circular. Log in the fold log: block code, date, chunk counts,
   chunk sequence, per-item results (list every failed item if any),
   Tier-2/3 result, pass/fail, and the cause if it failed. A failed
   drill means the archive is not trusted until the cause is found
   and fixed. LIMITATION, stated plainly: a drill checks the sampled
   block(s) — it does NOT prove the whole archive is safe.

## THE FORM GATE (P0-1 in v6, implementation note in v7, updated in v8/v9, V11)
The Part 6b form on the kit page is the PRIMARY place a block is
assembled by hand (v8: downgraded from "the ONLY place" — blocks can
also be assembled by hand from the printed template when the form is
unavailable, with the same gate rules applied by the user at step 4),
so it enforces the same rule as Prompt A:
- If source_range is empty or invalid, the form MUST NOT render the
  block and the Copy button MUST be disabled. "(chưa có)" in the
  source_range field is NOT a valid cut point and must trigger the
  same block.
- SOURCE_RANGE FORMAT CHECK (v9, P2-1): the gate counts
  WHITESPACE-SEPARATED units on each side of "→" and requires each
  side to have ≥15 units — EXCEPT a side with its own "full short
  message" confirmation checkbox ticked (that side is the full text
  of a message shorter than 15 units, per the SHORT MESSAGE RULE).
  Do NOT require exactly 15 units — the worked example (8-unit
  opening, 11-unit closing) would be blocked by an exact-15 rule.
  `"abc → def"` (3 units / 3 units, no confirmation) MUST disable
  Copy.
- FIRST_FOLD: the form has an explicit "Lần gấp đầu (FIRST_FOLD)"
  checkbox. Only when it is checked may source_range be "không áp
  dụng — lần gấp đầu"; every later fold requires a valid cut point.
  LEDGER CHECK (v8): FIRST_FOLD is only valid when the fold-log
  ledger confirms no block exists yet for the project — the form
  checks the ledger; a FIRST_FOLD tick when a block already exists
  disables Copy.
  NN==01 CHECK (v9, P1-1): in `gateError()`, the firstfold branch
  MUST ALSO check `nnVal()==="01"` (and `tier==1`). FIRST_FOLD +
  NN≠01 → Copy DISABLED, even with an empty ledger. If the ledger
  is empty and FIRST_FOLD is NOT ticked, the form MUST warn: "chưa
  dán sổ, kiểm tra trùng chưa chạy" (the ledger check cannot run in
  a vacuum). If the ledger is empty and FIRST_FOLD IS ticked, the form MUST show a warning (not a block): "chưa dán sổ — không xác minh được đây đúng là lần gấp đầu; chỉ tiếp tục nếu bạn chắc chắn chưa từng gấp cho dự án này" (fix vòng 1 sau review R1, P2-2 — an empty ledger is also the state of a true first fold, so the gate cannot tell it apart from a repeat fold whose ledger was never pasted; ticking FIRST_FOLD in a vacuum would create a duplicate block_id NN==01).
- PART 2 BY TIER (v9, P1-2): the form's tier selector drives the
  Part 2 output. Tier 1 → header "PHẦN 2 —
  SANITIZED_RAW_SOURCE (bản đã làm sạch; [REDACTED] = đoạn cố ý
  thiếu, không phải nguyên văn đầy đủ)" + the pasted raw. Tier 2/3
  → header "PHẦN 2 — DANH SÁCH BLOCK CHA (parent_block_ids +
  link)" + the parent list + links; NO raw header is rendered. The
  gate-note "email chưa đủ 2 phần thì lần gấp chưa xong" follows
  the tier (a correct Tier-2 email with a parent list is COMPLETE).
- The form's output is produced by the shared serializer — the same
  code that prints the template in the prompts — so its format is
  byte-identical to the prompts'. The serializer is the single source
  of the template text on the page. Timestamps (v9, P3-8): the
  serializer generates created_at/updated_at from the date + the
  current time + " +07" (e.g. `2026-11-11 10:42 +07`), matching the
  field spec format `YYYY-MM-DD HH:MM +07` — never date-only.
  Default block_id in `tplVals()` is `[CTX-MONEO-20261110-<NN>]`
  (v9, P3-3), never a literal `-01`.
- PART COUNT (v9, P3-10): the form counts the words/lines of the
  pasted raw and computes N for the Part 2 header itself. It NEVER
  hardcodes "Phần 2: 1 phần (2a)". If it cannot count, it prints
  "Phần 2: ___ phần — ĐIỀN ĐÚNG N TỪ MANIFEST" (blank, must be
  filled), never a false "1 phần".
- ID LEDGER CHECK (v7): before Copy is enabled, the form checks
  the entered (project_id, session_id, block_id, version) against
  the fold-log ledger the user keeps on the page; a duplicate
  disables Copy and shows the next free NN.
- DUPLICATE source_range CHECK (V10, test 9): a ledger row MAY carry
  the block's source_range as a 5th field —
  `project | session | code | tier | <cut A> → <cut B>` (rows without
  the 5th field still work — they only feed the code-tuple check
  above). If the entered source_range matches a ledger row's
  source_range EXACTLY as a whole string (compared after trimming
  whitespace), Copy is DISABLED and the gate shows: "source_range
  trùng với block <code> — chặng này đã gấp rồi, không tạo block
  mới". Only a full-string match blocks (matching one anchor alone
  does not).
- CONTENT FIELDS (V11, test 6): the five content fields — 14 Quyết
  định đã chốt, 15 Ràng buộc / quy tắc, 16 Việc đang dở, 17 Dữ kiện
  nguyên văn, 18 Đã bỏ đi cố ý — must each be NON-EMPTY after
  trimming. If any one is empty, the form MUST NOT render the block
  and Copy MUST be disabled, with an error that names the field, e.g.
  "⛔ CHƯA XUẤT BLOCK — trường <nhãn field> đang trống. Ghi nội
  dung vào, hoặc ghi đúng '(chưa có)' nếu chặng này thật sự không
  có <nhãn field>." Writing the literal text "(chưa có)" in a
  content field is an explicit intentional value and passes the gate.
  The serializer keeps its "(chưa có)" fallback for safety (it still
  writes "(chưa có)" for an empty value rather than a blank), but
  the gate blocks before render, so that fallback is never reached
  from the form. Scope: the 5 content fields only — metadata fields
  keep their own "(chưa có)" handling (see test 6).
- TESTS the form must pass (run them on the page): FIRST_FOLD valid
  (NN==01, tier 1, ledger empty) → block renders, Copy enabled;
  FIRST_FOLD ticked wrongly (a block already exists) → Copy
  disabled; FIRST_FOLD + NN≠01 + ledger empty → Copy disabled
  (v9, P1-1); ledger empty and NOT FIRST_FOLD → warning shown
  (v9, P1-1); FIRST_FOLD ticked + ledger empty → warning shown,
  Copy stays enabled (not a block) (fix vòng 2 sau review R2,
  P2-2); source_range missing → no render, Copy disabled;
  source_range in the wrong format → no render, Copy disabled;
  source_range "abc → def" → Copy disabled (v9, P2-1); 8-unit side
  + short-message confirmation → enabled (v9, P2-1); duplicate
  block code → Copy disabled with the next free NN shown; duplicate
  source_range (ledger 5th field) → Copy disabled, warning names the
  existing block code (V10, test 9); content field (14–18) left empty
  → no render, Copy disabled, error names the field (V11, test 6);
  content field with the literal text "(chưa có)" → renders, Copy
  enabled (V11, test 6); all 18
  fields present in the output, in order, with the standardized
  field names; created_at/updated_at match
  `^\d{4}-\d{2}-\d{2} \d{2}:\d{2} \+07$` (v9, P3-8); Part 2 header
  follows the tier (Tier-1 sanitized raw / Tier-2/3 parent list)
  (v9, P1-2/P2-9).
- HONESTY RULE: if the form code is ever removed or broken, the kit
  must say "form gate specified but not implemented" — never claim
  enforcement without the code.

## Storage — one master store
- MASTER: Gmail. Two labels: `CTX-ACTIVE` (blocks in current use, to
  paste into a new session) and `CTX-ARCHIVED` (folded into Tier-2 or
  superseded, kept only for Reopen lookup). A third label,
  `CTX-QUARANTINE` (v8), holds blocks with status Hỏng — a Hỏng
  block NEVER enters the canonical active packet and NEVER enters
  Prompt B. One fold = one email to yourself, sent by hand.
  Subject (version in the subject so Gmail does not merge versions
  into one thread):
  `[CTX] [Project] CTX-<PROJECT>-<YYYYMMDD>-<NN>-v<VERSION>` —
  example: `[CTX] [MONEO] CTX-MONEO-20261110-01-v1`.
  Body is (1) the block (18-field template) + (2) the Part 2 SCOPED
  BY TIER (v9, P1-2/P2-9):
  - Tier-1: "PHẦN 2 — SANITIZED_RAW_SOURCE (bản đã làm sạch;
    [REDACTED] = đoạn cố ý thiếu, không phải nguyên văn đầy đủ)" +
    the sanitized raw transcript of the folded stage.
  - Tier-2/3: "PHẦN 2 — DANH SÁCH BLOCK CHA (parent_block_ids +
    link)" + the parent list + links to the original emails.
  Search by block code. Gmail is an archive WITH AN APPEND-ONLY
  CONVENTION — it is NOT an immutable store: emails can still be
  deleted, moved, duplicated, or threaded wrongly. Keep a backup and
  check periodically; keep the canonical packet separate and save
  revisions. When a block is corrected, send a NEW email with the
  version increased (monotonic versions only, never reuse a version
  number) and move the old one to CTX-ARCHIVED — the version suffix
  in the subject REDUCES THE RISK of Gmail's Conversation View
  merging them; this needs real Gmail testing, it is not proven.
- APPEND-ONLY LOG, WITH EVENTS (v7): the fold log IS the append-only
  manifest: rows are only added, never edited in place. A mistake is
  corrected by a NEW row, never by editing or deleting an old one.
  Event types (one per row): FOLD (a new block created),
  DUPLICATE_DETECTED (two folds covered the same range — the
  duplicate email stays, marked by this event row, and only the
  checked one stays current), SUPERSEDED (a block was merged or
  replaced), CORRECTION (a new version of a block), INVALIDATED (a
  block is withdrawn — the email is NOT deleted, the row says why).
  The old failure-table instruction "delete the duplicate email,
  keep the checked one, fix the log row" is DELETED — it contradicted
  append-only.
- FOLD LOG HOME + FORMAT (v8): the fold log lives in ONE defined
  place — a single file `fold-log.md` in the project folder (or, if
  the user prefers, the first sheet of one spreadsheet, or one
  dedicated Notion page — pick ONE and state it in the log's header;
  never keep it in two places). Format: one row per event, columns
  exactly as listed in "Block code + source_range + archive link"
  above, PLUS the chunk-manifest columns: part_id, part
  source_range, order, word/line counts, SPLIT POINT (v9, P3-6 —
  the exact split position + source_range of each sub-chunk),
  completeness status. The fold log is the ID ledger (NN lookup),
  the chunk-manifest home, and the drill log home. A user with only
  Gmail and no fold-log file has NO place to look up NN or record a
  manifest — the log file is mandatory, not optional.
- CHUNKING: the chunking rules are DEFINED IN LOOP STEP 3 (v9,
  P3-1) and applied at Prompt A send time. This section states only
  the manifest format and the completeness check — it does NOT
  re-define chunking. (The v8 text that located the definition here
  was wrong; the definition now lives where it is used.)
  COMPLETENESS CHECK — REDESIGNED BY MESSAGE BOUNDARIES (v9,
  P2-10): the check in Storage below is CHECK 2 ONLY (raw capture →
  chunk chain). CHECK 1 (old chat → raw capture) is step 2b of the
  loop and must pass first. The criterion is MESSAGE COVERAGE, not
  sentence uniqueness: every message of the segment must appear in
  exactly ONE PART (2a/2b/…), in order, verified by the part's message
  sequence numbers + per-part anchors. 'Chunk' here means PART, not
  sub-chunk: a message split by the long-message ladder lives in
  several SUB-CHUNKS of the SAME part, and that is NOT a duplicate.
  Sub-chunks of one part must TILE the split message exactly (line
  ranges contiguous, source_ranges in order, no gap/overlap),
  recorded in the SPLIT POINT column of the manifest (fix vòng 1
  sau review R1, P2-3). A sentence may LEGITIMATELY
  repeat across different messages (repeated bash commands, log
  lines, code) — repeated sentences are allowed when they belong to
  different messages. The old criterion "every sentence exactly
  once, in order" is DELETED — it is wrong for technical text.
  A gap (a message in no chunk) or a duplicate (a message in two
  chunks) means the email is not sent yet. If an offline
  text-compare tool is available, use exact string comparison (e.g.
  `diff`) as a SUPPORT check, not as the criterion. Do NOT claim a
  full-string check was done only because the word/line totals match.
  The check runs against SANITIZED_RAW_SOURCE only — a [REDACTED]
  placeholder is a deliberately missing segment, not a failed check.
- BACKUP — full procedure (v7, updated in v8/v9): back up the WHOLE
  raw archive, not just the fold log — every Gmail email with its
  raw chunks plus the manifest. HOW: (1) export all CTX-ACTIVE
  and CTX-ARCHIVED emails into one backup folder — by saving each
  email as a file by hand per fold (the per-fold method), or by
  periodic Google Takeout (NOTE: Takeout cannot be used for
  per-fold periodic backup — use it only for periodic full
  snapshots); (2) the backup artifact has a FIXED structure:
  `backup-<YYYYMMDD>/manifest.md` (the fold log + chunk manifest,
  copied verbatim), `backup-<YYYYMMDD>/emails/` (one file per email,
  named `<block_id>-v<version>.eml` or `.txt`),
  `backup-<YYYYMMDD>/blocks/` (one file per block, the 18-field
  template); (3) the manifest lists every email, every block version,
  and every chunk, so the backup can be audited; (4) RESTORE: if
  Gmail is unreachable, the backup folder IS the archive — blocks
  are read from `blocks/`, raw text from `emails/`; (5) AFTER a
  restore, verify by CONTENT, not just counts: for every chunk,
  compare its full text against the manifest's recorded source range;
  block counts AND chunk counts must match the manifest exactly, and
  every chunk's text must match. Counting chunks alone does NOT prove
  the content was not changed. NOTE: the manifest records only the
  first/last 15 units of each chunk — that alone cannot detect
  content damage INSIDE a chunk; the content check after restore
  compares the chunk's full text against the backup copy in
  `emails/`, not against the 15-unit anchors. The restore drill
  referenced here is the FULL check (loop step 9, v9 format — chunk
  counts, chunk sequence, per-item results, Tier-2/3).
  CANONICAL SOURCE WHEN THE THREE PLACES DISAGREE (v8): Gmail wins
  for raw CONTENT, the fold log wins for ID / version / lineage (it
  is the append-only manifest), Notion is advisory only and must be
  corrected to match the other two.
- CANONICAL ACTIVE PACKET + APPEND-ONLY MANIFEST:
  the canonical active packet is the set of all current (CTX-ACTIVE)
  blocks of a project, in time order — exactly what Prompt B pastes,
  and never more than 8 blocks and never more than ~6,000 words
  [heuristic] (see Packet lifecycle).
  SCALE NOTE: 20+ blocks (or hundreds) have NO real scale test.
  Do NOT claim Gmail/Notion will certainly break, and do NOT claim
  they will certainly hold — the kit has no evidence either way.
  Maintaining three places by hand (Gmail + Notion + fold log) will
  drift out of sync at 20+ blocks — the canonical-source rule above
  is what resolves drift; it does not prevent it.
- OPTIONAL MIRROR: Notion page "Hộp context" + inventory database
  with these columns (all of them, no fewer) — FULL SCHEMA (v7,
  updated in v8/v9):
  project_id (text, part of unique key), session_id (text, part of
  unique key), block_id (text, part of unique key), tier (number 1–3),
  version (number ≥ 1, part of unique key), source_chat_url (URL or
  text), source_range (text), parent_block_ids (multi-select / text
  list), status (select: current / superseded / Hỏng — only these),
  created_at (date), updated_at (date), canonical_packet_version
  (number), original_archive_link (URL — the SPECIFIC Gmail message
  link, identified by message ID; if the message ID is unavailable,
  use block code + version + exact email subject, which together
  identify exactly one email),
  part_count (number), part_ids (text list — the chunk manifest
  part_ids for this block, e.g. "2a, 2b, 2c"), split_points (text
  list — v9, P3-6: the split position + source_range of each
  sub-chunk).
  UNIQUE CONSTRAINT: (project_id, session_id, block_id, version) —
  a duplicate is rejected, never silently merged; the duplicate rule
  is the same ID issuance procedure as the fold log.
  CONTENT: a Notion row holds the metadata AND the full 18-field
  block text (in the page body of the row), so the row alone is
  enough to paste into Prompt B.
  ROW–PAGE RELATION: one database row per block version; the row's
  page body holds that version's 18-field text; older versions keep
  their own rows (status superseded).
  CANONICAL VERSION: the highest version with status current for a
  given block_id.
  STATUS UPDATES: status changes only by adding a new row version or
  by an event row in the fold log (SUPERSEDED / INVALIDATED); never
  edit a row's status in place without a matching fold-log event.
  If Gmail and Notion differ, GMAIL WINS. A user with only Gmail has
  no index; a user with only Notion has no master copy — start with
  Gmail alone. Gmail needs no new account; it is NOT "already
  connected" to ChatGPT.
  PAGE RENDERING RULE: the Notion — mirror content must be printed
  in full, inline, directly below the Gmail — master content. NO
  hidden tabs, NO JS/CSS tab switching that hides content from the
  exported file. (V3 lost the whole Notion tab in the PDF export.)
- Anti-confusion rules: when a Tier-2 block is created, mark its
  Tier-1 parents superseded (move their Gmail to CTX-ARCHIVED, set
  Notion status accordingly, record parent_block_ids on the Tier-2
  row) so old decisions are never pasted back over new ones. Check for
  duplicate blocks by source_range in the fold log before saving.
  Every block also gets one index line (code, date, stage title,
  ONE keyword) so it can be found without knowing the code — the kit
  does not promise retrieval of a long packet without it.

## Failure table — what to do when it breaks
| What happened | What it means | Fix |
|---|---|---|
| Block note còn thiếu/trống một trong 18 trường | Template broken | Re-run Prompt A with the full template; do not hand-edit a field into existence |
| Source_range missing or invalid | No valid cut point | Form MUST NOT render/copy a block. If a block was created by hand with "(chưa có)" source_range, stop — re-establish the cut point from the fold log, or return KHÔNG XÁC ĐỊNH ĐƯỢC ĐIỂM CẮT |
| FIRST_FOLD ticked nhưng NN ≠ 01 (hoặc tier ≠ 1) (v9, P1-1) | The gate's NN==01 check caught it | Form blocks Copy. Re-issue the block with NN==01, tier 1 |
| FIRST_FOLD ticked nhưng fold log đã có block (v9, P1-1) | Not a first fold | Copy disabled. Use the next NN from the ledger |
| Ledger trống mà không tick FIRST_FOLD (v9, P1-1) | The ledger check ran in a vacuum | Form warns "chưa dán sổ, kiểm tra trùng chưa chạy". Paste the ledger before saving |
| source_range "abc → def" hoặc một phía < 15 đơn vị mà không có xác nhận tin nhắn ngắn (v9, P2-1) | The unit-count gate caught it | Gate blocks Copy. Count whitespace units per side; tick the per-side "full short message" confirmation ONLY if that side is the full text of a message shorter than 15 units |
| Raw chưa tẩy nằm trong Gmail draft (v9, P1-3) | ORIGINAL_SOURCE leaked into Gmail | Delete the draft, redact, re-save SANITIZED_RAW_SOURCE |
| Dòng source-to-capture trống / "chưa kiểm tra" / số tin nhắn không khớp (v9, P2-6) | The check was not done | Prompt A returns CHƯA KIỂM TRA NGUỒN, no block. Do the check; do not fill the line in |
| Gửi lại Prompt A cho chặng đã gấp (V10, test 9) | No duplicate check ran | Prompt A returns ĐÃ GẤP RỒI with the old block code, no block. Do not save; the ledger is the second line of defense — check the fold log before re-sending |
| Prompt A chạy mà không dán sổ gấp (V10, test 9) | The duplicate gate cannot run | Prompt A returns THIẾU SỔ GẤP, no block. Paste the fold log (block codes + source_ranges) and re-run |
| Model trả lời từ chối sai format — diễn đạt lại, thêm tiêu đề/giải thích (V10, test 17) | The refusal is not verbatim | Does NOT count as the refusal. Re-send Prompt A; record the paraphrase attempt in the fold log as a failed gate attempt |
| Packet vượt word cap với count < 8 (fix vòng 1, P2-1) | Word-cap overflow without a merge | Do NOT call MERGE (it needs exactly 8 blocks). Archive the oldest Tier-3 if one exists; if the packet is already over and no Tier-3 exists, archive the oldest current block regardless of tier until it fits, then trim the new block per (b) to the remaining headroom and add it (fix vòng 2, R2-P3; fix vòng 3, R3-P2); otherwise trim the new block starting from the LOWEST keep-priority — (4) rationale first, then (3) numbers / paths, then (2) in-progress work; never drop (1) decisions + constraints unless nothing else remains — until the packet fits (fix vòng 2, R2-P4). Never add a block that pushes the packet over the cap |
| Email thiếu Phần 2 đúng theo tier (v9, P1-2) | Part 2 scoped wrong | Tier-1: Part 2 must be SANITIZED_RAW_SOURCE. Tier-2/3: Part 2 must be the parent list + links — if a Tier-2/3 email carries raw, re-do Part 2 as the parent list |
| Block đã gộp được lưu/gửi trước khi gate PASS (v9, P2-8) | The save gate was skipped | DISCARD the block (do not send), fix, re-run Prompt D; record the gate result in the fold log BEFORE saving |
| Mục cha vắng mặt trong block đã gộp mà không có lý do drop (v9, P1-4) | The two-way gate failed | Gate FAIL. Keep parents current; list the item as DROPPED + reason or add it back |
| Block Hỏng nằm trong packet hoặc được dán vào Prompt B (v9, P3-5) | The Prompt B status check was skipped | Exclude it, move its email to CTX-QUARANTINE, do not paste it |
| Một block bị ghi đè mà không có nhãn [GHI ĐÈ] | Conflict rule broken | Ask the user to confirm; if confirmed, add the label + sub-item identifier (Tier-2: T1 source + field; Tier-3: T2 source + field + T1 origin) |
| Gmail đủ 2 phần theo tier và check đầy đủ nhưng restore drill vẫn fail | Archive not trusted | Find the cause (chunk sequence, per-item result) and fix it before trusting the archive |
| Không biết block nào có chi tiết cần tìm | Retrieval hit its limit | Do NOT guess. Open the old chat and copy the detail by hand |
| Phần raw có trùng lặp / lỗi nội dung (v9, P2-10, fix vòng 1 P2-3) | Message-boundary error | A MESSAGE in two chunks of DIFFERENT parts, or in no chunk, is an error → re-chunk. A message split into sub-chunks of the SAME part is NOT an error (see the tiling rule in Storage). A repeated SENTENCE across different messages is ALLOWED (technical text repeats legitimately) |
| Mục đã qua cấp Tier-1 biết rõ nhưng model trả NEEDS_SOURCE | The note lost a detail | Check Prompt B's handover-check; re-fold the range if needed |
| Thiếu dữ liệu nhạy cảm trong phần raw vì [REDACTED] | Deliberate gap, not a failure | The drill handles it per the drill rule: re-check the original in the old chat, or mark the item as unverifiable |

## Numbers — claims about the source, with conditions
EVERY number here must carry its evidence type:
[claim dự án] (project claim, no independent test), [test độc lập]
(independent hands-on test), [desk review] (reviewed the text but
did not run it), [heuristic] (kit-invented), [mô hình / ước tính
trong paper] (the paper's own model/estimate of a number, not a
measurement — v8). v9: every number in this section carries its
label INLINE at its point of use (P3-4) — the inline labels are the
ones that count, not a list elsewhere.
- `60/1,711 (3.5%)` [claim dự án] (P3-11 — it is an OBSERVED rate
  from the author's data, NOT a model estimate; it was mis-bucketed
  under [mô hình / ước tính trong paper] in v8).
- `~200K tokens` [heuristic] — KIT INFERENCE, NOT Ishank's words
  (P3-9; see the Ishank bullet below).
- `~5 messages / ~5K tokens` [mô hình / ước tính trong paper]
  (paper hard floor); `kernel default 3` [claim dự án];
  `≈22,500 tokens` [claim dự án]; `~50K token` raw zone
  [mô hình / ước tính trong paper]; `10–15 turns` [heuristic]
  (P3-4).
- 69%→27%: TRUE — verified directly in review R1 (2026-11-11, muse-02 read benchmarks/third-party-1500/README.md on master: title "Independent Third-Party Evaluation of Billion Context (v0.1.202)"; MAB table full AR 69.00%, bc AR 27.00% at ~197k; "lossy semantic compression drops verbatim needle QA (AR) from 69.0% to 27.0%"). "The 69% → 27% exact-sentence recall figure is the repo's own benchmark (AR task, ~197K tokens), [claim dự án]. Caveat: README is on master, not a pinned tag; the version label v0.1.202 is the README's own title. Reviewer #1 (ChatGPT) disagreed and graded PARTIAL (their read was "exactly one claim"). The 1.48M scale belongs to the TTL task, 18.58% Recall@10, not the AR sentence experiment. Copy Example 1 verbatim is the intended test path, not an independent verification of the benchmark's own run.
  "1.6K ký tự/block" vs "185 token/fold": TWO different measures
  from paper §6.2 [mô hình / ước tính trong paper] — 1.6K chars is
  the median SUMMARY BLOCK SIZE, 185 tokens is the median OUTPUT
  TOKENS per fold. They do not convert into each other, and the
  comparison is only valid as "two different measures", not as
  "two sides of one output".
- Ishank test (Medium article, 9 Nov 2026, v0.1.213):
  multi-request Gemini session, 41 requests [test độc lập],
  final prompt 2.9× smaller (13,431 vs 38,816 tokens) [test độc
  lập], total input only 12.5% less (663,321 vs 758,108 tokens)
  [test độc lập], 2 folds (fold 1: 27,853 → 9,396; fold 2: 26,778 →
  12,046) [test độc lập], 7 summary blocks [test độc lập], hard
  quiz 4/8 vs full history 6/8 [test độc lập], cost $0.067 vs
  $0.039 (PERFECT-CACHE ESTIMATE, not measured) [test độc lập].
  Uncached cost: $0.205 (folded) vs $0.234 (full history) [test
  độc lập]. Ishank's context config: `modelContextLimit: 40000`,
  `maxContextLimit: "60%"` (NOT the 75% default),
  `nudgeGrowthTokens: 8000` [test độc lập]. Ishank's quote:
  "With default settings (50K growth gate, nudge at 75% of the
  window) my session would never have folded" [test độc lập].
  KIT INFERENCE [heuristic] (P3-9): a default fold could wait
  until ~200K tokens — this is the KIT's inference from Ishank's
  config, NOT Ishank's words. 11 user turns in the session, only
  2 folds [test độc lập]. Full history ALSO scored only 6/8, with
  different misses (line 195 instead of 126, wrong CLI test file)
  [test độc lập] — VERIFIED from the DEV cross-post (see below).
  DEV cross-post (VERIFIED 2026-11-11 ~09:55 +07): Ishank's
  article DOES exist on DEV —
  https://dev.to/ishank-dev/billion-context-hands-on-compressing-coding-agent-history-to-fit-a-small-context-window-9pb,
  published 2026-11-09T12:13:31Z, ending "Originally published on
  Medium: https://medium.com/@ishank.iandroid/billion-context-hands-on-compressing-coding-agent-history-to-fit-a-small-context-window-7cdbac4bf6b8"
  [test độc lập]. The claim in v3–v7 that it was NOT cross-posted
  to DEV was FALSE and is corrected here.
- Freedzhost (freedzhost.cloud, published 20/10/2026, updated
  03/11/2026): second independent hands-on test — NEGATIVE under
  ~100K tokens [test độc lập]. Claude parallel read of 40 files:
  $0.19 direct vs $0.62 via proxy (3.3× more) [test độc lập]; Kimi:
  132s vs 102s, 13% more data, no compression in 31 requests
  [test độc lập]; OpenFox: 15 vs 13 files [test độc lập]. Single
  run, no raw log, predates v0.1.213, and the live site returns
  HTTP 502 for some callers (full text is readable via the
  2026-11-04 crawl/cache).
- "5× fewer tokens" [claim dự án] — the project's own modelled
  best case for million-token windows (5.3× in the paper at 1M)
  [mô hình / ước tính trong paper]; on 200K windows the paper
  predicts 1.2–1.8× [mô hình / ước tính trong paper]; the
  controlled pilot showed 31–54% fewer tokens [claim dự án]. The
  viral 509-request dashboard image is the maker's own README FAQ
  screenshot, not independent evidence.

## The kit in numbers (a real trial must measure THIS)
- **Rounds so far (v9):** v1 FAIL (egm review + 1 external review),
  v2 (weak), v3 FAIL (2 external reviews), v4 (1 external review),
  v5 (3 external reviews), v6 FAIL (swarm v6: 12 FAIL / 17 HOLD /
  0 PASS, no PASS, 0/10 DeepSeek — channel dead: qodercli not
  logged in), v7 (13-item fix, 14 acceptance tests), v8 (swarm V8
  HOLD: 0 PASS / 10 HOLD / 0 FAIL, 0 P0, 4 P1 / 11 P2 / 11 P3,
  26-item fix checklist — fixed in v9), v9 (3-round review loop:
  3/3 HOLD every round, 0 P0; fix rounds 1–3), v10 (this version —
  fixes trial #1 tests 9 + 17).
- **Reviews so far:** egm review (FAIL), 2 external reviews (FAIL/
  HOLD), 5 ChatGPT reviewers (all FAIL; #4 verdict-only, #5
  dropped), swarm V6 (FAIL), swarm V8 (HOLD, 10/10, 0 P0).
- **Disagreements between reviewers and this document:** the 23/103
  figure (this doc: count as [claim dự án] on the model's side
  because the model still decides ranges and can refuse) vs
  reviewer #1's "0% spontaneous decompress means the model does
  NOT decide restores" (which is a different number — restoration,
  not compression). "scope of the 45% claim" — this doc says
  PARTIAL (paper phrases ~45% of the window; release implements
  0.45 × step + 75% pressure layer).
- **Phone trial:** trial #1 RAN 2026-11-11 11:40–13:19 (ChatGPT Free,
  DALAT-TRIP, 9 block T1 + 1 block T2): FAIL / CHƯA READY — (a)–(e)
  ĐẠT, (f) CHƯA ĐỦ (T3 chưa thử); 2 FAIL: test 9 (gấp trùng), test 17
  (từ chối sai chuỗi). Trial #2 planned after v10 (re-run tests 9 +
  17 and the untested 6/11/12 via the form).

## Plan — trial + acceptance tests
### READINESS CHECK (before any real use)
If you cannot supply all of the following, do not use the kit yet:
- A defined project_id and session_id, with a named chat owner
  (who owns the Gmail labels).
- A defined source_chat_url (or a stated reason for "(chưa có)").
- A defined final chat state (who will check each fold).

### 20 acceptance tests
A test counts as passed only when the step below it is reproduced
exactly.
1. Stage closed test: a Prompt A call on a CLOSED stage returns a
   valid block with valid source_range.
2. Open-ended-chunk test (NEUTRAL, unprompted — fix vòng 1, P3-6): during normal work in the new chat, with NO direct question about the handover, the chat restates 2 decisions + 1 number on its own, without hunting.
3. Handover-check test (PROMPTED — fix vòng 1, P3-6): the user asks directly "hiện có gì?" — the new chat lists 2 decisions + 1 exact number, and returns NEEDS_SOURCE for anything missing instead of guessing.
4. Versioning and correction test: v1 of a block is read back
   correctly; a correction is saved as v2 and wins over v1.
5. Version number as a number, not a timestamp (v2 not "v20261110").
6. Content-field test (rewritten in v11, test 6): in the Part 6b form,
   a content field (fields 14–18: Quyết định đã chốt, Ràng buộc /
   quy tắc, Việc đang dở, Dữ kiện nguyên văn, Đã bỏ đi cố ý) left
   EMPTY (after trimming) blocks Copy — no render, Copy disabled,
   error names the field. Writing the literal text "(chưa có)" in a
   content field is an explicit intentional value ("this stage
   genuinely has none") and does NOT block. In Prompt A output the
   same convention applies: a field with no value is written as
   "(chưa có)" — never left blank (template rule) — but the form
   must NOT fill "(chưa có)" for the user; an empty form field means
   "not filled yet", not "none". Scope: the 5 content fields only —
   metadata fields (project_id, session_id, source_chat_url,
   parent_block_ids, …) keep their own "(chưa có)" handling and are
   not covered by this gate.
7. NEEDS_SOURCE test: ask a detail that is NOT in the note — the
   new chat answers NEEDS_SOURCE and does not guess.
8. Prompt C uses only CTX-ACTIVE and CTX-ARCHIVED, and returns a
   specific excerpt, not the whole raw transcript (30–50 lines AND
   ~500 words — whichever comes first).
9. Duplicate-fold test (rewritten in v10, test 9): re-send Prompt A
    for an already-folded stage WITH the fold log pasted into the
    SỔ GẤP input → the model returns exactly
    `ĐÃ GẤP RỒI | Block: <mã block cũ> | Lý do: ...` and creates no
    block. Sending it WITHOUT the fold log pasted (and not
    FIRST_FOLD) → the model returns exactly
    `THIẾU SỔ GẤP | Lý do: ...` and creates no block.
10. A duplicate block code is caught by the ID ledger; the second
    block gets the next free NN. The ledger stays the second line of
    defense (v10): the form also blocks a duplicate source_range
    (ledger 5th field) with the existing block code named.
11. A missing or invalid source_range blocks Copy (form) and
    triggers the right error. "abc → def" → Copy disabled
    (v9, P2-1); an 8-unit side with the short-message confirmation
    → enabled (v9, P2-1).
12. FIRST_FOLD ledger test: FIRST_FOLD ticked wrongly (a block
    already exists) → Copy disabled. FIRST_FOLD + NN≠01 + ledger
    empty → Copy disabled (v9, P1-1). Ledger empty and NOT
    FIRST_FOLD → warning "chưa dán sổ, kiểm tra trùng chưa chạy"
    (v9, P1-1). FIRST_FOLD ticked + ledger empty → warning shown, Copy stays enabled (warning only — the user proceeds on their own confirmation) (fix vòng 1 sau review R1, P2-2; reworded fix vòng 2 sau review R2, P2-2).
13. The need for a word-count tool for the TRIGGER is met by the
    Trigger's offline word counter (fix vòng 1, P3-3): paste the segment into a LOCAL word
    counter (offline editor / `wc -w` on a saved file) — NOT an
    online word-count website.
14. Full-chat test: the new chat answers a question that needs the
    first user message (task intent) correctly.
15. The full 18-field template prints identically in this spec, in
    Prompt A, in Prompt D (both variants + the mixed variant), and
    in the Part 6b form's output.
16. The prompt must include the `source-to-capture verification`
    before creating a block; if the old chat cannot take Prompt A,
    the separate handoff chat fallback is used instead.
17. CHƯA KIỂM TRA NGUỒN test (rewritten in v10, test 17): Prompt A
    contains the KHUNG TỪ CHỐI — SAO CHÉP NGUYÊN VĂN block with all
    6 refusal lines. Prompt A with an empty source-to-capture line,
    or one that says "chưa kiểm tra", or a message count / anchor
    mismatch → returns exactly `CHƯA KIỂM TRA NGUỒN | Lý do: <lý do>`
    (verbatim — that line only, no title, no explanation) and creates
    no block. A paraphrased refusal is recorded as a failed gate
    attempt and Prompt A is re-sent.
18. Mixed-tier merge test (new in v9, P2-2): state (7,1,0) — the 8
    oldest current blocks (7 T1 + 1 T2) merge via Prompt D — Gộp
    trộn into 1 T3; field 8 lists the 8 codes with their tiers; the
    two-way gate passes on all 8 parents; count becomes (1,0,1)
    after the new T1 is added.
19. Word-cap overflow test (new in fix vòng 1, P2-1): a packet at count < 8 (e.g. 5 Tier-1 blocks) that would exceed ~6,000 words after adding the new block — MERGE is NOT called; the oldest Tier-3 is archived if one exists, otherwise the new block is trimmed starting from the LOWEST keep-priority until the packet fits; a packet already over the cap with no Tier-3 is fixed by archiving the oldest current block regardless of tier until it fits (fix vòng 3 sau review R3, R3-P3); the packet never exceeds the cap.
20. Drill-pick test (new in fix vòng 1, P3-7): N=11, day=25 → NN_target = 3; if NN_target was already drilled, the oldest never-drilled Tier-1 is picked; N=0 → no drill runs.
The kit is READY FOR USE only after all 3 tiers of acceptance pass:
T1 — the new chat works without the old chat (per-item fidelity check
+ positive test); T2 — hold the checks for a merged Tier-2; T3 —
hold the checks for a merged Tier-3. Each tier isolates a different
risk: T1 tests the note content and the handover, T2 tests the merge
gate and Part 2 format, T3 tests terminal-tier handling and the
archive path.

### Trial plan (first trial — DONE 2026-11-11, verdict FAIL / CHƯA READY — see trial-2026-11-11/REPORT.md)
1. Run the kit through the loop on a real ChatGPT Free chat until
   the packet reaches 8 blocks.
2. Run the restore drill (loop step 9, FULL check) on that trial.
3. Log evidence — not opinions.
4. Log the result in the fold log.
5. Run acceptance tests 1–18.
6. Log the drill in the fold log with the FULL format (v9, P2-3):
   block code, date, chunk counts, chunk sequence, per-item results
   (list every failed item if any), Tier-2/3 result, pass/fail, and
   the cause if it failed.
Trial PASS criteria (all must hold):
(a) per-item fidelity check passes for every item in the note
    (every decision, number, code line, file path, source);
(b) NEEDS_SOURCE is answered correctly when the detail is not in
    the note;
(c) the restore drill passes with the FULL check;
(d) a correction saved as v2 is read back correctly;
(e) POSITIVE test: a detail that IS in the note is answered
    correctly (the new chat must NOT answer NEEDS_SOURCE);
(f) handover-check passes for all 3 tiers T1/T2/T3.
v9 RE-VERIFY NOTE (per the swarm-V8 convergence recommendation):
after this fix, re-verify ONLY the changed spots with grep + the
Node harness (FIRST_FOLD + NN≠01 → disabled; "abc → def" →
disabled; Part 2 by tier) — no new full swarm round. The next step
after v9 was the real trial, not V10 — trial #1 ran 2026-11-11 and
returned FAIL (tests 9 + 17); V10 fixes those two (Kduu chose
13:20), and the next step after V10 is trial #2.

### Trial plan (second trial — re-trial after V10)
1. Re-run acceptance tests 9 and 17 on a real ChatGPT Free chat:
   test 9 with the fold log pasted (expect `ĐÃ GẤP RỒI` exactly) and
   without it (expect `THIẾU SỔ GẤP` exactly); test 17 with an
   empty/"chưa kiểm tra" verification line (expect
   `CHƯA KIỂM TRA NGUỒN` exactly, verbatim).
2. Run the form tests that trial #1 could not run (tests 6, 11, 12)
   through the kit page's Part 6b form in the browser.
3. If quota allows, fold toward state (7,1,0) for the mixed-tier
   merge (test 18) and Tier-3 handover (criterion (f)).
4. Log evidence — not opinions — in the fold log and in
   trial-2026-11-11/REPORT.md (append trial #2).

Trial #2 Part A (2026-11-11 13:35–14:02): tests 9+17 re-run PASS on
the first reply, no re-send. Form tests 6/11/12/15 ran 2026-11-12
07:23–07:26 on GitHub Pages (kit page pushed to
kimducanh27-cpu/context-chatgpt-web, commit 7da18c4, Pages live at
https://kimducanh27-cpu.github.io/context-chatgpt-web/nen-context-cho-chatgpt-web.html):
11 PASS, 12 PASS (all 4 sub-cases), 15 PASS; 6 FAIL (empty content
field not caught by the form) → V11 fix (Kduu chose 07:30, scope =
form gate for empty content fields only; test 19 still open).

### Stop rule
If two folds in a row fail the per-item fidelity check, STOP using
the kit. If a security-sensitive segment appears in the raw, STOP
and redact before saving. If a correction is needed, send a new
email with the version increased; never edit the old email.

### The kit fails when...
- The new chat hallucinates a decision that was never made (the
  per-item fidelity check must catch it).
- A block is saved without its raw transcript (Part 2 missing or
  wrong for the tier).
- The fold log and Gmail disagree and nobody notices (the
  canonical-source rule resolves it — Gmail wins for content, the
  fold log wins for ID/version/lineage).

## Reviews so far
- egm review (v1): FAIL — 7 Blockers, 11 Majors, 6 Nits.
- External review #1 (Google Doc): FAIL — reviewed v1 claims only
  (kit text placeholder was empty).
- External review #2: HOLD — 1 P0, 8 P1, 5 P2, 3 P3.
- External review #3: FAIL — 3 P0s on Prompt A itself.
- V3 adversarial review (Google Doc): FAIL — 9 findings.
- Gmail draft #2 (Independent Hard Review — Kit V3): FAIL/HOLD.
- HARD REVIEW V5 (Gmail draft #3): FAIL — 2 P0 / 6 P1 / 3 P2 /
  4 P3.
- ChatGPT reviewers #1–#4 (V6): all FAIL. #1: 2 P0 / 5 P1 / 7 P2 /
  6 P3. #2: 3 P0 / 6 P1. #3: 4 P0 / 6 P1 / 6 P2 / 2 P3. #4:
  FAIL verdict-only (supplement dropped by Kduu). #5 dropped.
- Swarm V6 (2026-11-11 10:13): FAIL — 12 FAIL / 17 HOLD / 0 PASS,
  29 reviewers, 6 P0 / 10 P1 / 12 P2 / 10 P3.
- Swarm V8 (2026-11-11 11:03): HOLD — 0 PASS / 10 HOLD / 0 FAIL,
  0 P0, 10/10 Muse reviewers, 4 P1 / 11 P2 / 11 P3, 26-item fix
  checklist — FIXED IN V9.
- Trial #1 (2026-11-11 11:40–13:19, ChatGPT Free, DALAT-TRIP):
  FAIL / CHƯA READY — (a)–(e) ĐẠT, (f) CHƯA ĐỦ; 2 FAIL: test 9
  (gấp trùng), test 17 (từ chối sai chuỗi); NOT TESTED: 6/11/12
  (form), 18/19 + T3 (quota). Full report:
  trial-2026-11-11/REPORT.md — FIXED IN THIS V10.
- Trial #2 Part A (2026-11-11 13:35–14:02): tests 9+17 re-run PASS.
  Form tests on GitHub Pages (2026-11-12 07:23–07:26): 11/12/15
  PASS, 6 FAIL (empty content field not caught) — FIXED IN V11.

## One-sentence most important correction (v9)
Khóa gate FIRST_FOLD bằng NN==01 và khóa Part 2 theo tier — hai
cổng v8 tuyên bố đã đóng nhưng code vẫn để lọt đúng trường hợp nguy
hiểm nhất (block đầu sai mã; block gộp Tier-2/3 kẹt hoặc làm sai
ngay từ lần đầu tiên).

## One-sentence most important correction (v10)
Model không tự biết chặng đã gấp — Prompt A phải cầm sổ gấp trên tay
mới kiểm tra trùng được; và một dòng từ chối chỉ có giá trị khi model
sao chép nó nguyên văn, không diễn đạt lại.

## One-sentence most important correction (v11)
Form không được tự điền "(chưa có)" thay người dùng — trường nội dung
để trống nghĩa là "chưa điền", chỉ khi người dùng tự ghi "(chưa có)"
mới nghĩa là "chặng này thật sự không có"; test 6 bắt đúng chỗ đó.
