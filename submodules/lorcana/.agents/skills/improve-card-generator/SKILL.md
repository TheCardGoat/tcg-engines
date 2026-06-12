---
name: "improve-card-generator"
description: 'Diagnose and fix Lorcana parser/generator gaps in `packages/lorcana/lorcana-cards` when card implementations are blocked by missing parsing coverage, manual-override mismatches, or generation stubs. Use for requests like "fix parser", "improve generator", "unblock missingImplementation cards", or "why is this card unparseable".'
---

# Improve Card Generator

Repair parser and generation coverage in `packages/lorcana/lorcana-cards`.

## Boundary

- Own parser/generator diagnosis and fixes.
- Do not implement final gameplay behavior here unless the change is strictly parser/generator-owned.
- Hand card behavior work back to `lorcana-cards` after unblocking parsing.

## Required Memory Step

1. Read `memory/schema.md`.
2. Read the latest 5 entries in `memory/bank.md`.
3. Reuse existing guardrails before making changes.

## Workflow

1. Resolve the target card/context.

- If card identity is unclear, call `lorcana-find-card` first.

2. Diagnose current blockage with repository-valid checks.

```bash
rg -n "missingImplementation: true|missingTests: true" packages/lorcana/lorcana-cards/src/cards
bun --cwd packages/lorcana/lorcana-cards scripts/diagnose-manual-overrides.ts
bun --cwd packages/lorcana/lorcana-cards scripts/check-manual-override-coverage.ts
```

3. Reproduce parsing failure with minimal direct parser input.

```bash
bun --cwd packages/lorcana/lorcana-cards -e 'import { parseAbilityText } from "./src/parser"; const text = process.argv[1]; console.log(parseAbilityText(text));' "<ABILITY_TEXT>"
```

4. Apply minimal fix in parser/generator code.

- Typical files:
  - `packages/lorcana/lorcana-cards/src/parser/v2/**`
  - `packages/lorcana/lorcana-cards/scripts/generators/parser-validator.ts`
  - `packages/lorcana/lorcana-cards/src/parser/v2/manual-overrides.ts`

5. Verify before handoff.

```bash
bun run --cwd packages/lorcana/lorcana-cards check-types
bun test --cwd packages/lorcana/lorcana-cards
```

6. Return unblock report for `lorcana-cards`.

- Include:
  - Parser/generator root cause
  - What changed
  - Which cards/patterns are now unblocked
  - Any remaining blocked patterns

## Handoff Contract

When done, provide this structure:

```json
{
  "rootCause": "string",
  "changes": ["string"],
  "unblockedCards": ["set-number-card-id"],
  "remainingBlocks": ["string"],
  "verification": {
    "checkTypes": "pass|fail",
    "tests": "pass|fail"
  }
}
```

## Post-Execution Memory Update

Append one entry to `memory/bank.md` using the schema in `memory/schema.md`.

- Always record failures or near-failures.
- Promote repeated failure modes into guardrails.
