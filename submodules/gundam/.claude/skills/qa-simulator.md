---
name: qa-simulator
description: Playwright-driven UI evaluator for apps/simulator. Use after touching anything that could affect the simulator UI (components, store, selectors, game adapter, match-factory, hooks). Boots the production SSR build, drives a real match, asserts user-visible state, and surfaces bugs that pure unit tests miss. This is the local analogue of the evaluator agent in Anthropic Labs' frontend-design harness.
user-invocable: true
argument-hint: "FLOW=<smoke|battle|mobile|all> (default: smoke)"
---

## What this skill does

Generator/evaluator separation: this skill **plays** the simulator as a user, then **grades** what it observed. Do not write production code while in this skill — your job here is to verify, not implement.

## Inputs

- `FLOW` — which Playwright project to run:
  - `smoke` (default) — fast happy-path: load app, start vs-AI match, play through opening hand.
  - `battle` — exercises `apps/simulator/e2e/battle-phase/`.
  - `mobile` — exercises `apps/simulator/e2e/mobile/` (viewport-sensitive bugs).
  - `all` — every project.

## Preconditions

The simulator must have an up-to-date production build, because Playwright tests against SSR output, not the dev server:

```bash
pnpm --filter @tcg/gundam-simulator run build
```

If you skip the build, you'll see stale UI bugs or fresh ones that don't exist.

## Run

```bash
pnpm --filter @tcg/gundam-simulator test:e2e          # all projects
pnpm --filter @tcg/gundam-simulator exec playwright test --project=<FLOW>
```

On failure, traces and screenshots are written to `apps/simulator/playwright-report/`. Read them — don't just retry. CI uploads this artifact when a run fails.

## What to look for beyond the assertions

Playwright assertions catch what's been thought of. You're looking for what's been missed. After the run, audit:

1. **Console errors / warnings** — `page.on("console")` output. Hydration warnings, prop-type mismatches, unhandled promise rejections all matter even if the assertion passed.
2. **Visual regressions on critical surfaces** — the board (`GundamGame.tsx`), hand, log panel, modal stack. If you have screenshots, diff them against `apps/simulator/playwright-report/` baselines. Note any layout shifts, overlapping elements, or off-screen content.
3. **Log panel coherence** — the in-app log is the user-visible projection of `GameLogger`. After each action, the log entry should match the action. A drift here is a `core-beliefs.md` violation.
4. **Clock view** — timer should tick monotonically while it's the controller's turn. Pausing/resuming should match `time-control.ts` behavior.
5. **Bot responsiveness** — vs-AI matches: bot acts within ~2s, bot never makes an illegal move (would surface as a runtime error). Stalls or repeated identical actions = `deadlock` detector failure.

## Grading

Score each dimension 1–5. Below-threshold fails the run.

| #   | Dimension                | Threshold | What "5" looks like                                                                                        |
| --- | ------------------------ | --------- | ---------------------------------------------------------------------------------------------------------- |
| 1   | **Asserted flow passed** | 5         | All Playwright assertions green; no retries needed.                                                        |
| 2   | **No console errors**    | 5         | Zero React errors, zero unhandled rejections during the run. Warnings noted but not blocking.              |
| 3   | **Log/UI coherence**     | 4         | Every user action produced exactly one log entry of the right shape; log order matches user-visible order. |
| 4   | **Visual sanity**        | 4         | Board renders without overlap, off-screen content, or layout shift > 100ms after settle.                   |
| 5   | **Bot behaves**          | 4         | Bot acts in bounded time, no illegal-move errors, no deadlock fingerprint repeat.                          |

For criteria 1 and 2 the threshold is high — these are deterministic and any failure is a regression.

## Output format

```
## QA-simulator verdict: PASS | FAIL

### Run
- FLOW: <smoke|battle|mobile|all>
- Build was fresh: yes/no
- Wall-clock: <time>

### Findings
| # | Dimension | Score | Notes |
|---|---|---|---|
| 1 | Asserted flow passed | x/5 | … |
| 2 | No console errors    | x/5 | … |
| 3 | Log/UI coherence     | x/5 | … |
| 4 | Visual sanity        | x/5 | … |
| 5 | Bot behaves          | x/5 | … |

### Bugs surfaced (specific, with repro)
1. <path/component> — <symptom> — <how to reproduce> — <suspected cause>
2. …

### Was the build fresh?
- If no, the verdict is provisional. Rebuild and re-run before approving.
```

## Calibration

- **PASS** = a real user could play a match without hitting any of the findings.
- **FAIL** = at least one finding is a regression a user would notice in the first 60s.
- **Provisional PASS** = run was on stale build. Don't approve; re-run.

If you can't run Playwright (sandbox restriction, missing browser binary), say so explicitly. Do **not** approve based on reading code alone. Code-only review belongs in the `/review` skill, not here.
