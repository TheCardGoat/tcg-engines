---
name: "source-command-implement-card"
description: "Identify and implement whatever is missing in the new engine to support a specific Lorcana card, using the legacy implementation only as reference."
---

# source-command-implement-card

Use this skill when the user asks to run the migrated source command `implement-card`.

## Command Template

# Implement Card Command

Your task is to extend [lorcana engine](packages/lorcana/lorcana-engine) by implementing lorcana cards, you should use the legacy card and legacy test to understand the behavior and migrate the legacy card and test to the new engine's format.
Identify and implement whatever is missing in the new engine to support the card: **$ARGUMENTS**

---

## Repository Roots

- **Legacy cards** (optional, for reference only): `../lorcanito/packages/lorcana/lorcana-engine/src/cards` — relative to the repo's parent directory. Skip legacy steps if this repo is not available.
- **New cards**: `packages/lorcana/lorcana-cards/src/cards` — relative to the repo root

---

IMPORTANT: If engine gaps are identified, we must use the card expected behavior as a TDD step to implement the correct engine behavior.

## Workflow

### Step 0 — Locate Files

Find all relevant files for `$ARGUMENTS`:

1. **New card definition** — search `new_cards_root` by card name (fuzzy match on directory and file names).
2. **New card test file** — look for a sibling `.test.ts` or a matching file in a `__tests__` directory.
3. **Legacy card definition** — search `legacy_cards_root` by the same card name.
4. **Legacy card test file** — look for the corresponding spec/test file.

Read all four files before proceeding.

### Step 1 — Understand the Card

From the card text and legacy implementation, determine:

- What the card does mechanically (triggered ability, activated ability, keyword, static effect, etc.)
- What game events, zones, or player interactions it involves
- What the existing tests verify about its behavior
- Edge cases the legacy tests cover
- If Disney Lorcana Rules are unclear, use [lorcana-rules](.agents/skills/lorcana-rules/SKILL.md) agent to clarify rules.

Write a concise plain-English description of the required behavior before touching any code.

### Step 2 — Gap Analysis

Compare what the card needs against what the new engine already provides:

- Identify the **specific capability, API, or interaction model** that is currently missing or incomplete.
- Distinguish between:
  - A missing engine primitive (e.g., no "reveal hand" operation)
  - A missing card-layer hook (e.g., no "on quest" trigger binding)
  - A missing type or data model field
- Do **not** list issues that are already handled.

State the gap in one or two sentences before writing code. The gap MUST be fixe after the test is written.

### Step 3 — Write a Failing Test First (TDD)

Before any implementation:

1. Add a test file (or extend the existing one) for the new card in the new cards package.
2. The test must assert the **observable gameplay behavior** — not internal state.
3. Run the test to confirm it fails for the right reason:
   ```bash
   bun test packages/lorcana/lorcana-cards --filter "<card name>"
   ```
4. If an engine-level test is needed to pin a primitive, add it to the engine package using **mock cards** — never import `@tcg/lorcana-cards` into `@tcg/lorcana-engine`.

### Step 4 — Implement the Change

Fix the gap identified in Step 2:

- Prefer a clean, general primitive over a card-specific hack.
- If the legacy approach is awkward (e.g., imperative mutation, string-based dispatch), design a cleaner API that fits the new engine's patterns.
- Implement only what this card needs; do not speculatively generalize unless a slightly broader primitive materially improves the design.
- If similar patterns already exist use them, don't reinvent the wheel.
- Keep changes narrowly scoped: engine file(s) + card definition + test.

### Step 5 — Make the Test Pass

Iterate until:

```bash
bun test packages/lorcana/lorcana-cards --filter "<card name>"
```

is green. you may proceed to the next card on the list before without running the full suite to check for regressions:

### Step 6 — Deliver the Report

Summarize your work with:

1. **What was missing** — one paragraph describing the engine gap.
2. **The failing test** — the exact test you added in Step 3, with file path.
3. **Implementation changes** — list of files changed and a brief rationale for each.
4. **Design notes** — why the chosen API/design is better than copying the legacy approach directly (if applicable).

---

## Constraints

- **Type safety is mandatory.** Do not use `any` or `unknown` unless `unknown` is genuinely the correct type at a boundary.
- **No backwards-compatibility shims.** Prefer clean breaks over temporary compatibility layers.
- **No engine → cards imports.** If engine tests are needed, use mock cards defined inline in the engine test file.
- **TDD order is enforced.** The failing test must exist before implementation code is written.
- **Follow project conventions:**
  - `import type` for type-only imports
  - Immutable state via Immer
  - Conventional Commits for any commits
  - `bun run format` before finishing

## MANUAL MIGRATION REQUIRED

Migrated from source command `implement-card` into a Codex skill. Invoke it as `$source-command-implement-card` and manually rewrite any slash-command behavior that depended on provider-specific runtime expansion.

Provider argument placeholders like `$ARGUMENTS` or `$1` were preserved as text; rewrite them into natural-language instructions for Codex.

Review unsupported command metadata manually: `name`, `user_invokable`.
