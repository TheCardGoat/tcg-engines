# Triage pipeline (2026-05-16)

Reproducible pipeline that turned the 1551-row export `bug_reports.md` into the
two top-level worksheets `bug_reports_triage.md` (read-only state per report)
and `bug_reports_pending.md` (per-cluster checkboxes for human follow-up).

## How to re-run

```bash
# 1. parse the markdown table into structured records
python3 .triage/parse.py            # writes .triage/reports.jsonl

# 2. cluster reports by card name + UI keywords
python3 .triage/cluster.py          # writes .triage/clusters.json, tagged.jsonl

# 3. assign engineering state per report (cross-references recent fix commits)
python3 .triage/classify.py         # writes .triage/classified.jsonl

# 4. render the read-only triage summary
python3 .triage/render.py           # writes bug_reports_triage.md

# 5. render the human worksheet for pending reports
python3 .triage/pending.py          # writes bug_reports_pending.md
```

After new fixes land, edit the `FIXES` table at the top of `classify.py` to add
the new (`pattern`, `commit`, `date`) row, then re-run steps 3-5.

## Files

| File | Purpose |
| --- | --- |
| `parse.py` | Markdown-table → JSONL. Handles backslash-escaped pipes/quotes and `<br/>` linebreaks. |
| `cluster.py` | Keyword + alias matcher. Tags each report with `cards`, `mechanics`, `ui_hits`, `category`, `primary_card`. |
| `classify.py` | Assigns one of 19 engineering states by cross-referencing `cards` / `ui_hits` / `description` against a known-fix table. |
| `render.py` | Emits `bug_reports_triage.md` — read-only per-report state with rationale. |
| `pending.py` | Emits `bug_reports_pending.md` — clustered worksheet with checkboxes. |
| `card_names.json` | Card-name lookup harvested from `packages/lorcana/lorcana-cards/src/cards/**`. |
| `reports.jsonl` | Parsed records (one report per line). |
| `tagged.jsonl` | After clustering. |
| `classified.jsonl` | After state assignment. |
| `clusters.json` | Cluster → report-id index. |
| `state_summary.json` | State distribution + cluster grouping. |

## Classifier states

```
fixed-in-engine             — matches a recent engine fix, reported on/before fix date
fixed-in-card               — matches a recent card-text fix
verify-after-fix            — relevant fix shipped before the report; needs verification
covered-by-test             — no engine bug; regression test added
no-bug-confirmed            — investigated, no engine bug reproduced

open-card-bug               — names a known card, no fix yet
ui-investigation-needed     — UI keywords, no card cluster
needs-card-identification   — description names no recognizable card
vague-or-insufficient       — "error", "stuck", "...", etc.

question-or-comment         — rules question / user confusion
non-bug (comment/suggestion)— praise or feature request

out-of-engine-scope (network|replay UI|matchmaking|undo UX|skip-ability UX|
                     client crash|timer|chat UX)
```

## Confidence

The matcher is deterministic and conservative. Cross-checked against the
human-written daily triage doc at
`packages/lorcana/lorcana-engine/docs/daily-feedback-replay-triage-2026-05-15.md`
(22 reports): all 21 in-dataset reports landed in compatible states.
