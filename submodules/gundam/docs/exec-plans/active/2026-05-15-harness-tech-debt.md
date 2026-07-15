# Harness Tech-Debt Tracker

**Status**: in-progress
**Owner**: harness-improvement
**Started**: 2026-05-15

## Goal

Track latent issues uncovered while building out the agent harness (Phases 1–5).
These don't block the harness work, but if left unattended they erode the
guarantees the harness is supposed to provide.

## Open items

### 1. Pre-existing `vp check` failures on `main`

`pnpm vp check` returns exit 1 locally on a clean checkout:

```
Found 38 errors and 5 warnings in 2198 files
```

CI passes because workspace deps are built first (`packages/*/dist`), and the
linter has different visibility once `.d.ts` files exist. The mismatch means
local agents can't trust `vp check` as a "ready to commit" signal.

**Why it matters**: We want a single command an agent can run pre-PR to be
confident CI will pass. Today: agents either skip the check (false confidence)
or get spurious failures (alarm fatigue).

**Fix options**:

- (preferred) Make `vp check` run after `pnpm -r run build` in `health.sh`'s
  bigger sibling (a `vp pre-pr` script). Document that `vp check` alone is
  not a sufficient gate.
- Audit the 38 errors. If they're real, fix them; if they're false positives
  caused by the dist/source split, add narrow `vp` config to ignore.

### 2. `Date.now()` in match runtime

`packages/engine/src/runtime/match-runtime.ts` and siblings still call
`Date.now()` directly in ~18 places (logs, init, replay buffer, view-filter).
This contradicts the determinism invariant in
[`../../design-docs/core-beliefs.md`](../../design-docs/core-beliefs.md).

**Why it matters**: Replays and snapshot tests are not byte-identical across
runs. Network sync relies on the clock view being the only time source.

**Fix shape**:

- Audit call sites; most are timestamps for human-facing logs and may be OK.
- Convert the rest to take `clockNow` as a parameter (some already do — see
  lines 804, 856 in `match-runtime.ts`).
- Add an invariant-check rule for new code (`tools/harness/check-invariants.mjs`)
  once the existing callsites are reduced.

### 3. `health.sh` is environment-only

It checks tooling/Node/install/built-dists but does not run any check that
would catch broken code. Pairs with item 1: once `vp check` works reliably on
`main`, fold it back into `health.sh`.

## Verification

- `pnpm check:invariants` exits 0 on `main` ✅ (current state)
- `pnpm vp check` exits 0 on a clean checkout (not yet)
- `Date.now()` call count in `packages/engine/src/runtime/**/!(*.test).ts` is monotonically decreasing in CI (future automation)

## Decision log

- **2026-05-15** — Kept `health.sh` scoped to env-only rather than running
  `vp check`, because `vp check` doesn't currently pass on `main` locally.
  Folding it back in is item #1.
- **2026-05-15** — `tools/harness/check-invariants.mjs` enforces only the
  invariants that currently hold (cards→engine ban, deep-import ban).
  Determinism and private-field rules are documented in core-beliefs.md
  but not yet enforced because of pre-existing violations.
- **2026-05-15** — Removed the `no-private-field-leak` computational rule
  from `check-invariants.mjs` after PR #277 review. The line-level grep
  had both false positives (matched type aliases, comments, selector keys
  with `.opponent.hand`) and false negatives (any mention of
  `filterMatchView` on the same line bypassed the check). Private-field
  hygiene is now an inferential criterion in `.claude/skills/review.md`
  (criterion 2). Worth revisiting as a computational rule if AST-based
  scanning becomes cheap to install.
