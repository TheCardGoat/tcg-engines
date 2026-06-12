---
name: triage-player-report
description: Triage and fix a player bug report by validating cards, cross-checking Lorcana rules, then encoding the report as a failing test before implementing a fix.
user_invokable: true
---

# Triage Player Report Command

Your task is to triage and fix a player report passed in as **$ARGUMENTS**.

You must follow this flow exactly, in order:

1. Ingest report source (including Linear links)
2. Understand the user report
3. Validate referenced cards
4. Cross-check official rules
5. Express the report as a failing test
6. Implement the minimal fix
7. Verify with targeted tests (then repo checks)

Do not skip or reorder these phases.

---

## Skills You Must Use

This command is skill-orchestrated. Use these skills directly:

- [lorcana-find-card](.agents/skills/lorcana-find-card/SKILL.md) for deterministic card lookup and path validation
- [lorcana-rules](.agents/skills/lorcana-rules/SKILL.md) for official rules interpretation and implementation constraints
- [lorcana-test-generation](.agents/skills/lorcana-test-generation/SKILL.md) for writing a focused repro test
- [lorcana-cards](.agents/skills/lorcana-cards/SKILL.md) for implementing the card/engine fix after the repro exists

If any skill output conflicts with another, prefer this precedence:
rules interpretation > deterministic card identification > test scaffolding convenience.

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
2. Card validation completed
3. Rules cross-check completed
4. Repro test added and failing confirmed
5. Fix implemented
6. Verification complete

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

If required details are missing, ask only the minimum clarifying questions needed to build a valid test scenario.

Do not edit files in this step.

---

## Step 3 - Validate Card References

Use [lorcana-find-card](.agents/skills/lorcana-find-card/SKILL.md) to resolve all cards in the report.

For each referenced card, capture:

- Canonical card name
- Set/number if available
- Definition path
- Test path (existing or expected)
- Closest similarly implemented cards (for comparison only)

If a card cannot be resolved confidently, stop and request clarification before writing tests.

---

## Step 4 - Cross-Check Lorcana Rules

Use [lorcana-rules](.agents/skills/lorcana-rules/SKILL.md) to validate interaction semantics and timing.

Produce implementation-ready constraints:

- Trigger timing and ownership
- Zone/state transitions
- Costs and legality checks
- Replacement/prevention/conditional interactions
- Any edge cases needed in tests

If the report contradicts official rules, document the mismatch and convert the issue into a "player expectation mismatch" test/UX note instead of an engine bug fix.

---

## Step 5 - Encode the Report as a Failing Test (TDD Gate)

Use [lorcana-test-generation](.agents/skills/lorcana-test-generation/SKILL.md) to write the smallest meaningful repro test that captures the validated behavior.

Requirements:

- Assert observable gameplay behavior only
- Use simulator integration tests for engine + real-card interactions
- Keep setup minimal and deterministic
- Include edge case assertions only if required by Step 3 constraints

Run the targeted test and confirm it fails for the expected reason before implementation.

---

## Step 6 - Implement the Minimal Fix

Only after Step 4 is red, use [lorcana-cards](.agents/skills/lorcana-cards/SKILL.md) to implement the fix.

Rules:

- Prefer clean primitives over compatibility shims
- Fix root cause, not test-specific symptoms
- Respect package boundaries:
  - `@tcg/lorcana-engine` must not import `@tcg/lorcana-cards`
  - Engine tests must use mock cards
  - Engine + real-card behavior belongs in simulator tests
- Keep changes tightly scoped to the validated bug

---

## Step 7 - Verify

1. Re-run the new targeted repro test(s) and confirm green.
2. Run closely related tests for the touched area.
3. If all targeted checks pass, run:

```bash
bun run ci-check
```

Follow project guidance for failures: inspect reported log path and start from the printed tail.

---

## Step 8 - Final Report

Return a concise report with:

1. Triage summary (what the player reported vs what was validated)
2. Card validation results (resolved card IDs/paths)
3. Rules constraints used
4. Failing test path and what it asserted
5. Files changed and rationale
6. Verification commands run and outcomes
7. Any residual risks or follow-up tests suggested

---

## Non-Negotiable Constraints

- Do not implement before the repro test fails.
- Do not use `any` or `unknown` to bypass type safety.
- Do not add backwards-compatibility shims for early-stage architecture.
- Prefer focused checks first; run full `ci-check` after targeted tests are green.
