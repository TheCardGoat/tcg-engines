---
name: improve-card-generator
description: Diagnose and repair Lorcana card parser or generation gaps in packages/lorcana/lorcana-cards. Use when generation marks cards missingImplementation, parser validation fails, or generated card output is incorrect.
---

# Improve Card Generator

Own parser and generator behavior in `packages/lorcana/lorcana-cards`. Hand
gameplay behavior back to `lorcana-cards` once generation is unblocked.

## Workflow

1. Resolve the exact card or failing generation output. Use
   `lorcana-find-card` when identity is unclear.
2. Read the current implementation before choosing an architecture:
   - `scripts/generate-cards.ts`
   - `scripts/generators/parser-validator.ts`
   - `scripts/generators/file-generator.ts`
   - `src/parser/`
3. Reproduce the smallest failing parser, validator, or generator case. Prefer
   an existing nearby test over a full regeneration.
4. Add a failing test for the missing text pattern or output invariant.
5. Make the smallest type-safe parser/generator change. Do not move gameplay
   semantics into generation code.
6. Run the focused test and package typecheck.
7. Regenerate only when the fix changes generated output, then inspect every
   generated diff for unrelated churn.

## Commands

From the Lorcana workspace:

```bash
rg -n "missingImplementation: true" packages/lorcana/lorcana-cards/src/cards
bun test --cwd packages/lorcana/lorcana-cards <focused-test-file>
bun run --cwd packages/lorcana/lorcana-cards check-types
bun run --cwd packages/lorcana/lorcana-cards generate-cards:all --skip-fetch
```

The generation command is repository-wide for this package. The current script
does not promise per-set, per-card, `--dry-run`, or `--force` modes. Do not
invent those flags.

## Handoff

Report the root cause, changed parser/generator files, affected cards, exact
checks run, and any remaining unsupported pattern. A generated card still
marked `missingImplementation` remains blocked.
