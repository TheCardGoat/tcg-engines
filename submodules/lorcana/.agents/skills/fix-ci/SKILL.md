---
name: fix-ci
description: Run CI checks, triage lint/type/test failures, apply fixes in bounded batches, and verify until `bun run ci-check` is green.
allowed-tools: Bash
---

# Fix CI

Use this skill when CI is failing at the monorepo level and you need to make focused fixes quickly while keeping changes scoped and verified.

## Scope

- You are working in the `the-card-goat-online` repository.
- CI command is `bun run ci-check` (runs format, lint, type-check, tests, build).
- Keep fixes inside the repository only.
- Do not edit generated artifacts, lockfiles, or `node_modules`.

## Step 1: Reproduce Failures

From the repository root:

```bash
bun run ci-check
```

If this passes, no changes are required.

## Step 2: Parse Failures

Classify output into:

- `format`: formatter/reporting issues
- `lint`: pattern `path/to/file.ts:line:col lint/rule-name ...`
- `type`: pattern `path/to/file.ts(line,col): error TSxxxx: ...`
- `test`: pattern `FAIL path/to/test.ts` or failing assertion traces

Group by file first, then by package.

## Step 3: Decide Fix Strategy

- 1–3 simple, isolated errors in a file: fix directly in main context.
- 4+ errors in a single file: pause, isolate, then apply a focused file-level fix batch.
- 10+ errors across one package: validate and fix at package level first.
- Test failures with behavioral regressions: reproduce with targeted package checks before broad edits.

If the same file repeatedly appears and no safe fix is obvious, document it as blocked and continue with the next item.

## Step 4: Apply Fixes

For each targeted file/package:

1. Inspect the exact error context and surrounding code.
2. Implement the smallest correct fix (no suppressions unless absolutely necessary).
3. Re-run targeted checks.

### Targeted Commands

Package-wide validation (preferred):

```bash
bunx turbo lint check-types test --filter=@tcg/<package>
```

If package checks are noisy, run narrower checks in sequence:

```bash
bunx turbo lint --filter=@tcg/<package>
bunx turbo check-types --filter=@tcg/<package>
bunx turbo test --filter=@tcg/<package>
```

## Step 5: Verification Loop

After each batch:

1. Re-run the same targeted command.
2. Re-run full `bun run ci-check` after local convergence.
3. Stop once the repo is clean or no further safe progress is possible after repeated attempts.

If an issue remains after 3 correction attempts for the same scope, mark it as blocked and move on.

## Step 6: Final Summary

Report:

- **Fixed**
  - `file or package: error-type - what was changed`
- **Blocked**
  - `file or package: reason + suggested workaround`
- **Next verification commands**
  - `bun run ci-check`
  - package-level commands used during triage

## Constraints

- Prefer precise code fixes over rule/file disables.
- Never introduce `any` just to satisfy a type check.
- Preserve package boundaries when possible.
- Do not modify files outside the affected package/file scope unless required.
