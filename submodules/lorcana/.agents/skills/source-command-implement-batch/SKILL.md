---
name: "source-command-implement-batch"
description: "Orchestrate concurrent card implementation agents using LEGACY_CARD_MAP.csv as the source of truth. Launches up to 5 agents in parallel, each assigned a non-overlapping row from the tail of the file."
---

# source-command-implement-batch

Use this skill when the user asks to run the migrated source command `implement-batch`.

## Command Template

# Implement Batch Command

Your task is to orchestrate concurrent card implementation by reading `packages/lorcana/lorcana-cards/src/cards/LEGACY_CARD_MAP.csv` as the
**single source of truth** and spinning up sub-agents to implement cards in parallel. The subagents must remove from the file the line they're executing. And you should double-check whether the line was removed.
Your should run in a loop and continue autonomously until all lines of the document have been removed by the process below.

$ARGUMENTS can optionally supply:

- `--tail N` — how many rows from the tail to process (default: 10)
- `--concurrency N` — max parallel agents (default: 5, hard cap: 5)

---

## Step 1 — Parse the Source of Truth

Read `packages/lorcana/lorcana-cards/src/cards/LEGACY_CARD_MAP.csv`.

- Skip lines 1–15 (the instructions block).
- Line 16 is the CSV header: `sort_name,new_card_path,new_test_path,legacy_card_path,legacy_test_path,match_type`
- Collect all data rows (lines 17 onward). Ignore blank lines.

From the collected rows, take the **last N rows** (tail), where N comes from
`--tail` or defaults to 10. Reverse them so index 1 = last row, index 2 =
second-to-last, etc. This is the **work queue**.

---

## Step 2 — Build the Agent Assignments

For each row in the work queue, construct the arguments string that will be
passed to `/implement-card`:

```
<sort_name>
new_card_path: <new_card_path>
new_test_path: <new_test_path>
legacy_card_path: <legacy_card_path>
legacy_test_path: <legacy_test_path>
match_type: <match_type>
```

Skip any row where `match_type` is blank or the `sort_name` looks like a
vanilla card (no abilities — the `/implement-card` agent will also check, but
pre-filtering saves wasted launches).

---

## Step 3 — Launch Agents with a Rolling Window

Maintain a concurrency window of **at most 5 agents** at all times:

1. Launch the first 5 agents in parallel (indices 1–5 from the work queue),
   each running:

   ```
   Execute [/implement-card](.claude/commands/implement-card.md) using the
   paths below. Your assigned offset is <INDEX> (1 = highest priority / last
   row in file). Do not implement any other card — only this one.

   <arguments string from Step 2>
   ```

2. Remove the batched lines from `packages/lorcana/lorcana-cards/src/cards/LEGACY_CARD_MAP.csv`, we use this as a way to signal that those line were already covered.
3. As each agent completes, immediately launch the next unstarted item from
   the queue (keeping the window full until the queue is exhausted).
4. Never launch more than 5 agents concurrently. Never start the next batch
   all at once after one finishes — fill the slot as soon as it opens.

---

## Step 4 — Collect Reports

Each agent must return a report structured as:

```
CARD: <sort_name>
STATUS: implemented | already-done | skipped-vanilla | failed
ENGINE CHANGES: <list of engine files changed, or "none">
SUMMARY: <one paragraph>
```

Accumulate all reports. If an agent returns `failed`, note it but continue
with the remaining queue — do not halt the batch.

---

## Step 5 — Final Summary

After all agents have finished, output a batch summary:

| Card | Status | Engine Changes |
| ---- | ------ | -------------- |
| ...  | ...    | ...            |

Then list any engine changes across agents that may affect shared primitives,
so the next batch can account for them.

Finally, print the **next suggested tail command** to continue the batch:

```
/implement-batch --tail <next_N> --concurrency 5
```

where `next_N` advances past the rows just processed.

---

## Constraints

- **Hard concurrency cap: 5 agents.** Do not exceed this even if `--concurrency` is set higher.
- **No shared file writes between agents.** Each agent owns exactly one card's files. Agents must not delete or overwrite files belonging to another card.
- **Offset assignment is immutable.** Once an agent is assigned a row, do not reassign it. If it fails, record the failure and move on.
- **No full CI run per agent.** Each agent runs only `bun test packages/lorcana/lorcana-cards --filter "<card name>"`. A single `bun run ci-check` is run by you (the orchestrator) only after all agents in the batch have finished.

## MANUAL MIGRATION REQUIRED

Migrated from source command `implement-batch` into a Codex skill. Invoke it as `$source-command-implement-batch` and manually rewrite any slash-command behavior that depended on provider-specific runtime expansion.

Provider argument placeholders like `$ARGUMENTS` or `$1` were preserved as text; rewrite them into natural-language instructions for Codex.

Review unsupported command metadata manually: `name`, `user_invokable`.
