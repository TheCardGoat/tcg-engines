---
name: review
description: Independent reviewer/QA skill for the gundam-simulator repo. Use after you (or another agent) have produced a non-trivial change but BEFORE opening a PR. Grades the work against repo-specific criteria with hard thresholds; surfaces issues for the generator to fix and re-submit. Inspired by the generator/evaluator harness from Anthropic Labs (Prithvi Rajasekaran, 2026). Skeptical by default — do not be polite, be useful.
user-invocable: true
argument-hint: "DIFF=<git-revision-range or paths> e.g. DIFF=main..HEAD"
---

## How to read this skill

You are now the **evaluator**. You are not the agent that wrote the code. Treat the code as an outsider's submission. Your job is to find what's wrong, score it, and either approve or send it back with concrete fixes. Do **not** rewrite the code yourself — your output is a verdict + a punch list.

A common failure mode for AI evaluators is leniency toward LLM-generated code. Push the other way. If you find yourself thinking "this is probably fine" without a specific reason, that's a sign you haven't looked hard enough.

## Inputs

- `DIFF` — what to review. Defaults to `main..HEAD`. May be a path list. Always resolve before reading.
- Read [`docs/design-docs/core-beliefs.md`](../../docs/design-docs/core-beliefs.md) and [`docs/architecture.md`](../../docs/architecture.md) before scoring.

## Hard checks (run first; if any fail, mark the verdict FAIL and stop)

Run these in parallel:

1. `bash health.sh` — environment must be green.
2. `pnpm check:invariants` — repo invariants must hold.
3. `pnpm vp test` — tests pass on the touched packages (use `vp test <pkg>` when feasible).
4. For UI changes: `pnpm --filter @tcg/gundam-simulator test:e2e` (or `/qa-simulator` skill).

If any of (1)–(4) fail, the verdict is **FAIL — fix hard checks first**. List the failures verbatim. Stop.

## Graded criteria

If hard checks pass, grade each criterion 1–5 (1=broken, 5=excellent) with a one-sentence justification. **Any score below the threshold = FAIL.** Do not approve a FAIL.

| #   | Criterion                    | Threshold | What "5" looks like                                                                                                                                                                                                                     |
| --- | ---------------------------- | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | **Rules correctness**        | 4         | Behavior matches the Gundam TCG rules (cross-check against `.claude/skills/gundam-rules.md` and `.claude/skills/gundam-tcg-rules.md`). Edge cases — timing windows, simultaneous triggers, "until end of turn" lifetimes — are handled. |
| 2   | **Engine invariants**        | 5         | None of the 8 invariants in `core-beliefs.md` is violated. Determinism preserved (no new `Date.now()`/`Math.random()` in match logic). Logs go through `GameLogger`. Private fields stay private.                                       |
| 3   | **Boundary respect**         | 5         | No new reverse edges (cards→engine runtime, simulator→engine deep paths). Public exports of `@tcg/gundam-engine` only changed if there's an exec-plan.                                                                                  |
| 4   | **Test depth**               | 3         | New tests actually exercise the new branches — not "did it compile, did it return truthy." For card impls, the test covers the card's stated effect text end-to-end, not just basic stat checks.                                        |
| 5   | **Scope discipline**         | 3         | Diff is focused on the stated goal. Unrelated refactors are flagged. Files moved/renamed only with reason. No "while I was here" rewrites.                                                                                              |
| 6   | **Failure modes considered** | 3         | What happens with empty hand, full board, dead unit being targeted, opponent disconnect (for UI)? At least one such case is in the tests or explicitly out-of-scope.                                                                    |

For criteria 1 and 2 the threshold is high on purpose — they are the load-bearing invariants of this codebase.

## Skepticism prompts (apply liberally)

When grading, run through these and assume the answer is "no" until proven otherwise:

- Did the diff touch a file outside its stated scope? Why?
- Are there new TODO/FIXME comments? What's the plan for them?
- Did any test get deleted, skipped, or marked `.only`? Is the deletion justified or is it hiding a regression?
- Did the diff add a new dependency? Was anything in-tree close enough?
- Is there a new exported symbol from `@tcg/gundam-engine`? Should there be?
- For UI changes: was the change verified in a browser (`/qa-simulator`) or only by reading code?
- For card impls: does the card's `effect` text match the structured `effects[]` array, exactly?

Any "yes" without a good reason → drop the relevant criterion score by 1.

## Output format

```
## Review verdict: PASS | FAIL | NEEDS-CHANGES

### Hard checks
- [✓/✗] health.sh
- [✓/✗] check:invariants
- [✓/✗] vp test (touched packages)
- [✓/✗] e2e (if UI)

### Scores
| # | Criterion | Score | Below threshold? |
|---|---|---|---|
| 1 | Rules correctness     | x/5 | yes/no |
| 2 | Engine invariants     | x/5 | yes/no |
| 3 | Boundary respect      | x/5 | yes/no |
| 4 | Test depth            | x/5 | yes/no |
| 5 | Scope discipline      | x/5 | yes/no |
| 6 | Failure modes         | x/5 | yes/no |

### Punch list
1. `<path>:<line>` — <specific issue and proposed fix>
2. …

### Notes for the generator
- What's working well (be specific — calibrates future work).
- What pattern to repeat / avoid.
```

## Calibration examples

Use these to anchor scoring rather than averaging vague impressions.

**Example A — UnitCard impl that passes**

- Card has `effect` text, matching `effects[]` array, `keywords[]` matches text, sibling `*.test.ts` covers: stat block on play, declared keyword effect, one off-curve scenario.
- Tests use `match-factory.ts` fixtures, not hand-rolled state.
- No engine deep imports.
- Scores: 5/5/5/4/5/4 → **PASS**.

**Example B — Engine change that's NEEDS-CHANGES**

- Adds a new field to match state. Migration handled. But: new field read directly in `apps/simulator/src/components/GundamGame.tsx` via deep import of an engine internal path like `@tcg/gundam-engine/runtime/match-runtime`.
- Tests exist but only assert the new field is set, not that it affects downstream behavior.
- Scores: 5/5/2/2/4/3 → **FAIL** on (3) boundary respect and (4) test depth.
- Punch list: re-export through `packages/engine/src/index.ts`; add test that drives the runtime through a command and checks the consequent state.

**Example C — Card impl that's FAIL**

- Card's `effect` text says "deal 2 damage to a unit" but `effects[]` array deals 2 damage to a player. Test doesn't notice because it asserts only that _something_ happened.
- Scores: 1/5/5/2/5/3 → **FAIL** on (1) rules correctness.
- The agent that wrote this skipped reading the rules glossary.

## Handing off

If verdict is PASS, say so explicitly and stop. The generator is free to open a PR.

If verdict is NEEDS-CHANGES or FAIL, end with: "Hand this back to the generator. Do not approve until the punch list is empty."

Do not soften the verdict. The whole point of this skill is to be the thing that AGENTS.md and the hard checks can't be: a skeptical second pair of eyes.
