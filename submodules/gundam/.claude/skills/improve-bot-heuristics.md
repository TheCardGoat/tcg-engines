---
name: improve-bot-heuristics
description: Playbook for iterating on the Gundam bot's candidate-strategy heuristics. Run a baseline self-play bench, inspect family stats and termination distribution to form a targeted hypothesis, encode the hypothesis as a `FamilyPolicy` override, re-bench against the baseline with the same seed base, and keep the change only if win-rate improves and no family regresses. Self-updates after each iteration via the retrospective step.
user-invocable: true
argument-hint: "BASELINE_STRATEGY=<id> CANDIDATE_NAME=<kebab-id> [MATCHES=<n>]"
---

## MANDATORY PREPARATION

Before any code change, run this skill end-to-end and keep its output in context. The whole point is to keep the loop tight: every change must be backed by a bench report, and every regression must be visible in the diff before merge.

Always load:

- `packages/engine/src/automation/shared-policies.ts` — `composeStrategy`, `FamilyPolicy`, `DEFAULT_POLICIES`, `DEFAULT_FAMILY_PRIORITY`.
- `packages/engine/src/automation/candidate-types.ts` — every `GundamBotCandidate` variant the bot might submit.
- `packages/engine/src/automation/types.ts` — `CandidateStrategyContext`, `BotDecisionRecord`.
- The current strategies: `greedy-legal-strategy.ts`, `value-ranked-strategy.ts`, `pass-only-strategy.ts`.

Read the `gundam-rules` skill if the hypothesis touches phase / combat / timing.

---

# Improve the Bot's Heuristics

A "bot heuristic" is a `FamilyPolicy<F>` — a function that takes the slice of legal candidates for a single move family and returns them in the order the planner should try. The strategy is a `composeStrategy(name, { [F]: policyForF, ... })` bundle. The planner submits head-first and falls back to pass / concede on failure.

Improving the bot = picking a family where the default ordering wastes wins, writing a smarter ranker for that family, and proving the change with self-play before merging.

---

## Inputs

- `BASELINE_STRATEGY` — the strategy id to beat. Usually `greedy-legal` or the current best.
- `CANDIDATE_NAME` — kebab-case id for the new strategy file, e.g. `lethal-aware`. Used as the export name and as the strategy id in the registry.
- `MATCHES` — bench match count. Default 100. Use ≥ 200 for borderline win-rate changes.

---

## Step 1 — Capture a baseline

```sh
cd tools/bot-bench
vp run bench -- \
  --p1 ${BASELINE_STRATEGY} \
  --p2 ${BASELINE_STRATEGY} \
  --p1-deck ef-starter --p2-deck seed-aggro \
  --matches ${MATCHES:-100} \
  --label baseline-${BASELINE_STRATEGY} \
  --out reports/baseline-${BASELINE_STRATEGY}.json
```

Read `reports/baseline-${BASELINE_STRATEGY}.json` and note:

- `summary.p1WinRate`, `summary.p2WinRate`, `summary.drawRate`.
- `summary.terminationDistribution` — high `max-actions-exceeded` or `concede-failed` means the bot is stalling.
- `summary.winReasonDistribution` — `"X conceded"` means voluntary concession (often suboptimal); `"DAMAGE"` or `"DECK_OUT"` is a real win/loss.
- `p1.familyStats[*].attempted` / `succeeded` / `failed` / `errorCodes` — failing families are where the strategy emits a bad candidate; the planner falls through and burns turns.

---

## Step 2 — Form a hypothesis from the baseline

Pattern-match the report against these levers:

| Symptom in baseline                                                                                             | Likely lever                                                                                                                                                                                                                                                                   |
| --------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `winReasonDistribution` dominated by `"X conceded"` and `concede-failed` termination > 0                        | Planner exhausts options — investigate which family is failing. Often `resolveEffect` or `declareBlock` for a stuck pending choice.                                                                                                                                            |
| `enterBattle.attempted` high but `winRate` low                                                                  | The attacker order is wrong. `valueRankedStrategy.rankByDamage` is a baseline — beat it with lethal-priority or breach-aware ordering.                                                                                                                                         |
| `deployUnit.attempted` high, `enterBattle.attempted` low, draws high                                            | Bot develops but never trades. Consider rebalancing `DEFAULT_FAMILY_PRIORITY` (lower the deploy priority or raise battle).                                                                                                                                                     |
| `declareBlock.failed > 0` with new `errorCodes` like `"NO_VALID_BLOCKER"`                                       | Block ranker is picking a unit that can't legally block this attack. Filter by `canBlock` derived state before ranking.                                                                                                                                                        |
| `resolveEffect.failed > 0`                                                                                      | A directive prompt isn't being answered correctly — usually a `chooseOne` or `targetSelection`. Override `defaultResolveEffect` for that prompt kind.                                                                                                                          |
| `passTurn.attempted ≈ total_turns × players` but `enterBattle.attempted` is near 0 even with attackers on board | The active player is never recognising a profitable attack — likely a `pendingChoice` or summoning-sickness gate. Look at `play-match.test.ts` for a fixture that demonstrates this.                                                                                           |
| Termination dominated by `concede-failed` AND `passTurn.failed` with `EFFECT_PENDING` errors                    | A pending effect is open but the strategy is emitting non-resolveEffect candidates. Wrap `selectCandidates` to short-circuit: if `parent.pendingChoice !== null`, return only `resolveEffect` candidates. This was the largest defensive win in the May 2026 10-iteration run. |
| `declareBlock.failed` with `MISSING_BLOCKER_KEYWORD` / `CANNOT_BLOCK_DIRECT` ≥ 50% of attempts                  | The enumerator is optimistic — emits any unit. Filter by `definition.keywordEffects` containing `Blocker` in the policy. Also drop self-block (rule 8-3-3) and skip everything when attacker has `<High-Maneuver>` (rule 13-1-6).                                              |
| `chooseFirstPlayer` always pinned to own seat → high concede rate as the going-first player                     | Override `chooseFirstPlayer` to pick the opponent. Going second gives EX Resource + a full draw step on turn 1. Bench (May 2026 run): +10pp on `ef-starter`, +4pp on `gd01-mixed`. This was the single biggest win-rate lever found in 10 iterations.                          |

State the hypothesis in one sentence before writing code:

> "Bot concedes on turn 4 because `declareBlock` heads-first picks the cheapest unit, which then dies but the attacker's `<Breach>` still wipes a shield. Override `declareBlock` to prefer units whose HP ≥ attacker AP."

A vague hypothesis ("be smarter at battles") produces a vague change. A specific hypothesis names the family, the input signal, and the output ordering.

---

## Step 3 — Encode the hypothesis as a `FamilyPolicy`

Create `packages/engine/src/automation/${CANDIDATE_NAME}-strategy.ts`. Layout mirrors `value-ranked-strategy.ts`:

1. Import `composeStrategy`, `FamilyPolicy`, `FamilyPolicyContext` from `./shared-policies.ts`.
2. Write the policy function(s). The argument type is `FamilyPolicyContext<F>`; the return is `readonly Extract<GundamBotCandidate, { family: F }>[]`.
3. Export the strategy via `composeStrategy("${CANDIDATE_NAME}", { ${family}: policy })`.

### Style rules (enforced via lint)

- **Pure functions.** No I/O, no mutable globals, no `Math.random()`. Reproducibility is the contract — same input must yield the same output.
- **No `as` casts at the policy boundary.** The `Extract<...>` types flow through `composeStrategy`; if you need a cast, you're escaping the typed API and a future refactor will break silently.
- **Read state via `ctx.parent.view`, not `ctx.parent.state.G`.** The view is the projected, viewer-filtered shape the UI also reads; the raw `G` skips visibility rules and couples the bot to private state it shouldn't see.
- **Build a per-call lookup map for batch ranking** (see `indexDefinitions` in `value-ranked-strategy.ts`). O(n) per rank call is fine; O(n²) over candidate × board cards is not.
- **Tiebreak by enumerator index, not by random.** The bench is deterministic per seed; a random tiebreak would mask regressions.

### Register the new strategy

Add it to two places:

1. `packages/engine/src/automation/index.ts` — re-export `${CANDIDATE_NAME}Strategy`.
2. `packages/engine/src/index.ts` — re-export from `./automation/${CANDIDATE_NAME}-strategy.ts`.
3. `tools/bot-bench/src/strategies.ts` — add the id to `BenchStrategyId` and `REGISTERED_STRATEGIES`.
4. `apps/simulator/src/game/match-factory.ts` — only if the UI should also expose the new strategy as a vs-AI option. Optional for experimental strategies; required before merge if the goal is a player-facing default.

---

## Step 4 — Bench the candidate against the baseline

Run twice — once with the candidate as P1, once as P2 — so a first-player bias doesn't masquerade as a strategy win.

```sh
vp run bench -- \
  --p1 ${CANDIDATE_NAME} --p2 ${BASELINE_STRATEGY} \
  --p1-deck ef-starter --p2-deck seed-aggro \
  --matches ${MATCHES:-100} \
  --label cand-${CANDIDATE_NAME}-as-p1 \
  --out reports/cand-${CANDIDATE_NAME}-as-p1.json

vp run bench -- \
  --p1 ${BASELINE_STRATEGY} --p2 ${CANDIDATE_NAME} \
  --p1-deck ef-starter --p2-deck seed-aggro \
  --matches ${MATCHES:-100} \
  --label cand-${CANDIDATE_NAME}-as-p2 \
  --out reports/cand-${CANDIDATE_NAME}-as-p2.json
```

Then diff:

```sh
vp run diff -- \
  --baseline reports/baseline-${BASELINE_STRATEGY}.json \
  --candidate reports/cand-${CANDIDATE_NAME}-as-p1.json \
  --for p1 \
  --out reports/diff-${CANDIDATE_NAME}-as-p1.json

vp run diff -- \
  --baseline reports/baseline-${BASELINE_STRATEGY}.json \
  --candidate reports/cand-${CANDIDATE_NAME}-as-p2.json \
  --for p2 \
  --out reports/diff-${CANDIDATE_NAME}-as-p2.json
```

Read both diffs. The verdict line at the bottom is a useful glance, but the keep/revert call comes from the per-family stats:

- **Keep** the change when, in BOTH seat arrangements:
  - `winRateDelta > +0.05` (at least 5 percentage points better)
  - No family's `successRateDelta < -0.10` unless the family went from rarely-attempted to often-attempted (i.e. the bot is now picking that family on purpose and failing some of the time, not failing more of the same attempts).
  - `terminationDelta["concede-failed"] ≤ 0` and `terminationDelta["max-actions-exceeded"] ≤ 0`.

- **Revert** otherwise. A change that wins as P1 but loses as P2 is a first-player exploit, not a real improvement — it'll regress the moment the matchup flips. Note the regression family in the retrospective.

---

## Step 5 — Add automated tests

Tests guard against future regressions and document the intent. Mirror `packages/engine/src/automation/value-ranked-strategy.test.ts`:

1. A **unit test** for each new family policy: build a synthetic candidate list (deterministic mock board) and assert the ranker returns the expected order.
2. A **smoke test via `playMatch`**: run one self-play match and assert the candidate strategy submits the family at least once. This catches "policy was correct but never reached" bugs (priority misconfigured, family blocked by a `vetoFamily` upstream).
3. A **parity test** if the new strategy claims to be `>= baseline`: assert that the candidate wins ≥ baseline over a fixed 20-match suite. Hard-coded seeds keep this stable across reruns.

```sh
vp test packages/engine --run
```

All tests must pass — including the existing strategy/play-match tests, which the new export interacts with through the registry.

---

## Step 6 — Run repo gates

```sh
vp check
```

Type-checks the new file plus the registry edits. The `_familyMoveNameParity` witness in `candidate-types.ts` doubles as a guard against adding a family discriminator that the engine doesn't know — if it fails, the new policy referenced a family that doesn't exist.

---

## Step 7 — Retrospective (self-update this skill)

Answer each question. For any answer that reveals a new pattern, edge case, or constraint, **edit this skill file directly**.

1. Was the hypothesis from Step 2 confirmed by the diff? If not, what signal did the report carry that should have predicted the negative result? → add it to the Step 2 table.
2. Did a new error code appear in `familyStats.errorCodes` that wasn't documented above? → add the code + likely root cause.
3. Was there a typed candidate field on `GundamBotCandidate` that mattered for ranking but wasn't covered by `value-ranked-strategy.ts`? → flag it in Step 3 with a sketch of how to read it from the candidate.
4. Did the bench require a new sample deck to surface the hypothesis? → register it in `apps/simulator/src/data/sample-decks/` and add the id to `BenchDeckId` in `tools/bot-bench/src/runtime.ts`.
5. Did the diff CLI miss a signal you had to compute by hand? → add the missing field to `BenchDiff` in `tools/bot-bench/src/diff.ts`, then mention the new field here.
6. Was the change kept or reverted? Either way, log the strategy id + verdict in the PR description.
7. Did the candidate over-fit to one deck? Always run the bench on at least TWO decks of different curve shapes (e.g. `ef-starter` = short games, `gd01-mixed` = long games). The May 2026 run revealed that `deploy-curve`, `rank-lethal`, and `mulligan-low-curve` all looked positive on `ef-starter` but regressed −6 to −8pp on `gd01-mixed`. The keeper rule **"net-positive on every tested matchup"** filters these out before they ship.

### Known-good levers (from prior runs)

These survived the bench loop and are now in `packages/engine/src/automation/tempo-strategy.ts`. Re-use them as the starting line for the next iteration:

- `chooseFirstPlayer` → opponent (go second)
- `declareBlock` → filter to `<Blocker>` keyword + skip self-block + skip when attacker has `<High-Maneuver>`
- Pending-choice short-circuit on `selectCandidates`

**After editing, commit the updated skill** with message: `docs(skills): update improve-bot-heuristics after ${CANDIDATE_NAME}`.

---

## Step 8 — Make a PR

- **Branch**: `feat/bot-${CANDIDATE_NAME}` (e.g. `feat/bot-lethal-aware`)
- **Commit message**: `feat(bot): add ${CANDIDATE_NAME} candidate strategy (${WIN_RATE_DELTA})`
- **PR description** must include:
  - The Step 2 hypothesis (one sentence).
  - Win-rate delta as P1 and as P2 vs the baseline.
  - The family whose ranker changed and the input signal it now reads.
  - Link to the saved bench reports (`tools/bot-bench/reports/*.json` — commit only the diff JSON, not the full reports unless they're under ~100KB).
  - A note on any kept-but-marginal trade-offs (e.g. "loses 3pp draw-rate but wins 6pp by damage").
