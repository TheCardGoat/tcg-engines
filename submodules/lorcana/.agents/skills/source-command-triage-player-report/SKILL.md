---
name: "source-command-triage-player-report"
description: "Triage and fix a player bug report by validating cards, cross-checking Lorcana rules, then encoding the report as a failing test before implementing a fix."
---

# source-command-triage-player-report

Use this skill when the user asks to run the migrated source command `triage-player-report`.

## Command Template

# Triage Player Report Command

Your task is to triage and fix a player report passed in as **$ARGUMENTS**.

You must follow this flow exactly, in order:

1. Ingest report source (including Linear links)
2. Understand the user report
3. Pull replay evidence (when a `gameId` / `turn` is present)
4. Validate referenced cards
5. Cross-check official rules
6. Express the report as a failing test
7. Implement the minimal fix
8. Verify with targeted tests (then repo checks)

Do not skip or reorder these phases.

---

## Skills You Must Use

This command is skill-orchestrated. Use these skills directly:

- [replay-debugging](.agents/skills/replay-debugging/SKILL.md) for downloading and inspecting the actual turn from production when the report includes a `gameId` and `turn`
- [lorcana-find-card](.agents/skills/lorcana-find-card/SKILL.md) for deterministic card lookup and path validation
- [lorcana-rules](.agents/skills/lorcana-rules/SKILL.md) for official rules interpretation and implementation constraints
- [lorcana-test-generation](.agents/skills/lorcana-test-generation/SKILL.md) for writing a focused repro test
- [lorcana-cards](.agents/skills/lorcana-cards/SKILL.md) for implementing the card/engine fix after the repro exists

If any skill output conflicts with another, prefer this precedence:
real replay evidence > rules interpretation > deterministic card identification > test scaffolding convenience.

---

## Step 1 - Ingest Report Source (Linear-Aware, No Code Yet)

If **$ARGUMENTS** contains a Linear issue URL (for example, `https://linear.app/.../issue/...`):

- Use the Linear MCP tools to fetch the issue details before triage.
- Extract and normalize:
  - Issue title
  - Description
  - Comments/context from reporters
  - Acceptance criteria (if present)
- Use this fetched issue content as the canonical report input.

If **$ARGUMENTS** is not a Linear URL, treat the raw arguments as the report input.

When a Linear issue is used, you must keep the issue updated as progress is made. Post concise progress updates after each major stage:

1. Triage brief completed
2. Replay evidence pulled (or skipped, with reason)
3. Card validation completed
4. Rules cross-check completed
5. Repro test added and failing confirmed
6. Fix implemented
7. Verification complete

Also post a final closing update with:

- Root cause summary
- Test path(s)
- Fix summary
- Verification outcomes

---

## Step 2 - Understand the Report (No Code Yet)

Parse **$ARGUMENTS** and produce a concise triage brief:

- Reported behavior
- Expected behavior
- Current observed behavior
- Repro conditions (turn state, zones, timing, players)
- Candidate cards/interactions mentioned
- **Replay handle**, if present: extract `gameId` and `turn` from a `Context:` line, an explicit "replayId" mention, or any URL of the form `/play/replays/<id>` / `/v1/play/replays/<id>/data`. Player reports from the in-app form typically include `Context: gameId: <id>, platform: ..., players: ..., turn: <n>`.

If required details are missing, ask only the minimum clarifying questions needed to build a valid test scenario. If the report names a specific in-game moment but provides no `gameId`, ask once whether a replay id is available — it makes the rest of triage dramatically more accurate.

Do not edit files in this step.

---

## Step 3 - Pull Replay Evidence (When Available)

If the triage brief from Step 2 captured a `gameId` and a `turn`, use the [replay-debugging](.agents/skills/replay-debugging/SKILL.md) skill to download the actual turn from production. This grounds the rest of triage in real engine output rather than the player's recollection.

Run the CLI from the repo root:

```bash
bun packages/tools/replay-cli/src/cli.ts --replay-id <gameId> --turn <turn>
```

Capture the three sections it prints:

- **`--- CARDS INVOLVED ---`** — definition id → card name → on-disk file path for every card that appeared in the turn's patches, logs, or move inputs. Treat this as a **touched-card shortlist**, not an exhaustive list of cards in scope. Cards merely sitting in the pre-turn state are intentionally omitted (see the `replay-debugging` skill's notes), so a passive **static modifier**, **continuous ability**, or **legality effect** that is the actual root cause may not appear here. If the report names a card that isn't on this list, search the `--- INITIAL STATE ---` blob for the card's name or instance id before concluding the player misidentified the moment — the bug may be coming from a quiet card already in play.
- **`--- INITIAL STATE (before turn N) ---`** — the reconstructed `MatchState` immediately before the turn started. Search this for the relevant zones (inkwell counts, play-zone instances, hand of the active player) by `cardInstanceId` rather than reading the whole blob.
- **`--- STEPS ---`** — the per-step trace inside the turn: `move` (id + input), `logs`, `patches`. Walk these in order to identify the exact step where the bug surfaced (missing patch, wrong patch value, log shows trigger fired but no resulting patch, etc.).

Use the evidence to refine your triage brief:

- Confirm or correct candidate cards (a card the player named might not actually be on the involved list — challenge that assumption with evidence).
- Pinpoint the suspect step number for use in the failing test (Step 6).
- Note the actor of each suspect step — `actorId` is the player id, not necessarily the turn player; in a triggered-ability resolution it can be the opponent.

Failure modes — handle and continue:

- **Exit 1, "replay not found"**: the gameId is unknown to prod (expired from Redis without S3 persistence, or a typo). Note this in the triage brief and proceed to Step 4 using only the text report. Do not block on it.
- **Exit 1, "No steps found for turn N"**: the CLI prints which turns _are_ available. If the player likely meant a different turn (off-by-one is common), re-run with the corrected number; otherwise note and continue.
- **Exit 2 (bad input)**: re-derive `gameId`/`turn` from the report and try once more.
- **Network error / 30s timeout**: log it, proceed without replay evidence.

If no `gameId` was found in Step 2 and the user has not provided one, **skip this step entirely** and proceed to Step 4. Do not fabricate a replay id.

When a Linear issue is being tracked (Step 1), include a one-line replay summary in the next progress update: cards involved, suspect step number, and a one-sentence observation (e.g., "Step 47 patches `lore.<player>` by +2 but the questing character has lore=3 — patch value is wrong").

Do not edit any files in this step. The output of this step is purely informational for the rest of triage.

---

## Step 4 - Validate Card References

Use [lorcana-find-card](.agents/skills/lorcana-find-card/SKILL.md) to resolve all cards in the report.

For each referenced card, capture:

- Canonical card name
- Set/number if available
- Definition path
- Test path (existing or expected)
- Closest similarly implemented cards (for comparison only)

If Step 3 produced replay evidence, **prefer the file paths it printed for cards on the touched list** — they're already exact, and they correctly disambiguate promo variants (`pN-NNN-...-promo.ts`) from regular cards that share a card number in the same set. Use `lorcana-find-card` to enrich those entries (test paths, similar-card comparisons) rather than to re-resolve the path.

For any card the report names that the touched list does **not** include, do not skip it — resolve it via `lorcana-find-card` like usual. Continuous static abilities, legality modifiers, and persistent triggers can be the actual root cause without appearing in any of the turn's patches/logs/inputs. Where possible, confirm the card was in play at turn start by searching the `--- INITIAL STATE ---` blob for its instance id or name.

If a card cannot be resolved confidently, stop and request clarification before writing tests.

---

## Step 5 - Cross-Check Lorcana Rules

Use [lorcana-rules](.agents/skills/lorcana-rules/SKILL.md) to validate interaction semantics and timing.

Produce implementation-ready constraints:

- Trigger timing and ownership
- Zone/state transitions
- Costs and legality checks
- Replacement/prevention/conditional interactions
- Any edge cases needed in tests

If Step 3 produced replay evidence, ground each constraint against what the trace actually shows: which trigger fired (or didn't), what the patch did (or didn't) change, who the actor was. A rules constraint that contradicts the trace is a much stronger signal of an engine bug than the same constraint cited from the report alone.

If the report contradicts official rules, document the mismatch and convert the issue into a "player expectation mismatch" test/UX note instead of an engine bug fix.

---

## Step 6 - Encode the Report as a Failing Test (TDD Gate)

Use [lorcana-test-generation](.agents/skills/lorcana-test-generation/SKILL.md) to write the smallest meaningful repro test that captures the validated behavior.

Requirements:

- Assert observable gameplay behavior only
- Use simulator integration tests for engine + real-card interactions
- Keep setup minimal and deterministic
- Include edge case assertions only if required by Step 5 constraints
- When replay evidence is available, model the test on the suspect step's `move` input and the cards from `--- CARDS INVOLVED ---`. Use the `--- INITIAL STATE ---` snippet as a sanity check on your fixture (zones, ink counts, characters in play) — not as a literal copy.

Run the targeted test and confirm it fails for the expected reason before implementation.

---

## Step 7 - Implement the Minimal Fix

Only after Step 6 is red, use [lorcana-cards](.agents/skills/lorcana-cards/SKILL.md) to implement the fix.

Rules:

- Prefer clean primitives over compatibility shims
- Fix root cause, not test-specific symptoms
- Respect package boundaries:
  - `@tcg/lorcana-engine` must not import `@tcg/lorcana-cards`
  - Engine tests must use mock cards
  - Engine + real-card behavior belongs in simulator tests
- Keep changes tightly scoped to the validated bug

---

## Step 8 - Verify

1. Re-run the new targeted repro test(s) and confirm green.
2. Run closely related tests for the touched area.
3. If all targeted checks pass, run:

```bash
bun run ci-check
```

Follow project guidance for failures: inspect reported log path and start from the printed tail.

---

## Step 9 - Final Report

Return a concise report with:

1. Triage summary (what the player reported vs what was validated)
2. Replay evidence summary (gameId, turn, suspect step, key observation) — or "no replay available" if Step 3 was skipped
3. Card validation results (resolved card IDs/paths)
4. Rules constraints used
5. Failing test path and what it asserted
6. Files changed and rationale
7. Verification commands run and outcomes
8. Any residual risks or follow-up tests suggested

---

## Non-Negotiable Constraints

- Do not implement before the repro test fails.
- Do not use `any` or `unknown` to bypass type safety.
- Do not add backwards-compatibility shims for early-stage architecture.
- Prefer focused checks first; run full `ci-check` after targeted tests are green.
- Do not block triage on a missing or expired replay; proceed text-only and note the gap.

## MANUAL MIGRATION REQUIRED

Migrated from source command `triage-player-report` into a Codex skill. Invoke it as `$source-command-triage-player-report` and manually rewrite any slash-command behavior that depended on provider-specific runtime expansion.

Provider argument placeholders like `$ARGUMENTS` or `$1` were preserved as text; rewrite them into natural-language instructions for Codex.

Review unsupported command metadata manually: `name`, `user_invokable`.
