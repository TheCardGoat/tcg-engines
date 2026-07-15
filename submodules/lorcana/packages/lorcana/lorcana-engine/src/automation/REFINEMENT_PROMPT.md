# Lorcana AI Strategy Refinement Prompt

Your task is to improve the promoted default Lorcana AI strategy.

## 1. Mental model

The bot is a legal move lister plus a sorter. It does not think like a person or learn by itself. Every turn follows four stages:

1. **Actor resolution** (`actor-resolution.ts`) — determine which player must act right now.
2. **Candidate enumeration** (`planner.ts`) — build every legal action that actor could take, validated against the engine.
3. **Strategy ranking** — a strategy reorders those candidates from "try first" to "try last." A strategy only reorders candidates; it does not create moves.
4. **Execution** (`planner.ts`) — try candidates in sorted order. On failure, try the next. Fall back to `passTurn`, then `concede`.

The source of truth for the current default strategy is `strategy-registry.ts`, which exports `DEFAULT_AUTOMATED_ACTION_STRATEGY_ID` (currently `"deck-aware-lore-race"`).

## 2. Strategy registry

| Strategy ID                          | Info policy                      | Parent                      | Status                 |
| ------------------------------------ | -------------------------------- | --------------------------- | ---------------------- |
| `deck-aware-lore-race`               | oracle (actor deck access)       | —                           | **DEFAULT / promoted** |
| `best-deck-aware-lore-race`          | fair (public zones only)         | `deck-aware-lore-race`      | candidate              |
| `best-deck-aware-oracle-lore-race`   | oracle (full opponent knowledge) | `best-deck-aware-lore-race` | draft                  |
| `board-control-lore-race`            | inherits parent                  | `deck-aware-lore-race`      | candidate              |
| `aggressive-board-control-lore-race` | inherits parent                  | —                           | draft                  |
| `quest-only`                         | n/a                              | —                           | test-only              |
| `challenge-only`                     | n/a                              | —                           | test-only              |

`resolveAutomatedActionStrategyOption()` walks the `parentStrategyId` chain and selects the most specific child strategy matching the actor's `supportedActorColorPairs`, preferring deeper lineage and narrower color-pair specificity.

## 3. File map

Paths are relative to `packages/lorcana/lorcana-engine/src/automation/`.

### Planner and execution

| File                  | Purpose                                                                                    |
| --------------------- | ------------------------------------------------------------------------------------------ |
| `planner.ts`          | Enumerates, validates, and executes candidates; handles fallback/concede                   |
| `actor-resolution.ts` | Resolves current actor from pending effects, bags, mulligan, priority                      |
| `deadlock.ts`         | State fingerprinting; concede after 3 repeated-state observations                          |
| `move-adapter.ts`     | Converts a candidate into a real engine move request                                       |
| `types.ts`            | Shared types: candidates, strategies, traces, diagnostics, search caps, role/strategy tags |
| `decision-trace.ts`   | Builds stable board snapshots and state fingerprints for traces                            |

### Strategy framework

| File                         | Purpose                                                                                                          |
| ---------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `strategy-registry.ts`       | Registry, inheritance, resolution by color pair                                                                  |
| `strategy/composer.ts`       | `summarizeLoreRaceCandidates()`: builds `DetailedCandidateSummary`, sorts by family then intra-family heuristics |
| `strategy/common.ts`         | Compare helpers, `createHeuristic()`, card projection, board queries, family ordering                            |
| `strategy/internal-types.ts` | `LoreRaceHeuristicPreferences`, `DetailedCandidateSummary`, `FamilyEvaluation`                                   |

### Family evaluators (`strategy/families/`)

| File                       | Complexity | Notes                                                                          |
| -------------------------- | ---------- | ------------------------------------------------------------------------------ |
| `challenge.ts`             | highest    | 3 priority modes; lore swing, trade value, meaningful threat                   |
| `resolve.ts`               | high       | Bag + pending-effect resolution; optional resolution policies; benefit scoring |
| `play-card.ts`             | medium     | Complexity scoring, net cost direction, simple development preference          |
| `quest.ts`                 | low        | Ranked by `printedLore` descending                                             |
| `put-ink.ts`               | medium     | Duplicate count, unplayable cards, printed cost direction, lore                |
| `activate-ability.ts`      | low        | Ability complexity scoring                                                     |
| `alter-hand.ts`            | medium     | Three plans: keep-all, structural-mulligan, full-mulligan                      |
| `choose-who-goes-first.ts` | low        | Prefers self-first                                                             |

### Deck-aware strategy and profiles

| File                     | Purpose                                                                                                                                                       |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `deck-aware-strategy.ts` | 5-axis scoring (role, target, opening structure, matchup card adjustment, family bias); contributor tracking; three exported variants (default, fair, oracle) |
| `deck-profile.ts`        | `DeckAwareColorPairProfile` per color pair: family bias, role weights by turn bucket, opening plan, challenge mode, matchup modifiers; per-card overrides     |
| `target-priority.ts`     | Scores targets for play/activate/resolve based on role weights, damage, exert status                                                                          |
| `effect-polarity.ts`     | Classifies effects as beneficial/harmful/mixed/neutral                                                                                                        |

### Strategy data (`strategy-data/`)

| File          | Purpose                                                                                                          |
| ------------- | ---------------------------------------------------------------------------------------------------------------- |
| `types.ts`    | `CardStrategyProfile`, `CardStrategyRule`, `MatchupPlan`, `MatchupSelector`, `StrategyDeckDossier`               |
| `cards.ts`    | `CardStrategyProfile` entries with base adjustments and matchup-specific rules                                   |
| `matchups.ts` | `MatchupPlan` entries with family bias, role weight, and opening plan overrides                                  |
| `fixtures.ts` | `StrategyDeckDossier` entries for the benchmark fixture pool                                                     |
| `index.ts`    | Evaluation engine: `evaluateBestAiCardStrategy()`, `evaluateBestAiMatchupPlans()`, matchup weight report builder |

### Legacy and test strategies

| File                        | Purpose                                                                           |
| --------------------------- | --------------------------------------------------------------------------------- |
| `default-strategy.ts`       | Legacy ranking rules; used by board-control and aggressive-board-control variants |
| `forced-family-strategy.ts` | Test-only quest-only and challenge-only strategies                                |

### Engine tests

| File                        | Purpose                                    |
| --------------------------- | ------------------------------------------ |
| `automated-actions.test.ts` | Engine-level behavior and trace assertions |

### Simulator benchmark harness

Paths relative to `packages/lorcana/lorcana-simulator/src/testing/ai-strategy/`.

| File                            | Purpose                                                                                              |
| ------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `strategy-suite.ts`             | Full lab/benchmark runner, report builder, scorecards, promotion gate, triage digest, run comparison |
| `strategy-iteration.ts`         | Preset configs, candidate manifests, core and full deck ID lists                                     |
| `strategy-trace-analysis.ts`    | Programmatic trace analysis: `summarizeMatchTraceFile()`, `findSignalDiagnosticsInFile()`            |
| `simulate-game.test.ts`         | Entry point for `RUN_STRATEGY_LAB` / `RUN_STRATEGY_BENCHMARK` env vars                               |
| `strategy-smoke.test.ts`        | CI smoke test: curated 16-match suite, no deadlocks                                                  |
| `deck-aware-strategy.test.ts`   | Validates deck-aware heuristic derivation per color pair                                             |
| `deadlock.ts`                   | Deadlock tracker and resolution for simulator matches                                                |
| `configure-strategy-logging.ts` | Logging sinks for trace and runtime capture                                                          |

### Deck fixtures

`packages/lorcana/lorcana-simulator/src/lib/features/simulator-devtools/deck-fixtures/index.ts`

Core 4 (quick/candidate presets): `amber-amethyst-aggressive`, `amber-amethyst-control`, `steel-sapphire-midrange`, `emerald-amethyst-ink`.

Full 8 (promotion preset): adds `steel-sapphire-aggressive`, `amber-steel-goofy-lilo`, `amber-steel-lilo-rapunzel`, `steel-amethyst-basil-genie`.

## 4. Key concepts

- **Contributor system.** Each scoring adjustment is tracked as an `AutomatedActionCandidateContributor` with `key`, `value`, `source` (`"opening" | "family" | "role" | "target" | "card-profile" | "card-rule" | "generic"`), optional `strategyTags`, and `reason`. Contributors appear in traces and enable post-hoc analysis.

- **5-axis scoring.** `mulligan`, `ink`, `play`, `challenge`, `target` (type `StrategyAxis`). Each axis is a numeric score accumulated additively by `deck-aware-strategy.ts`.

- **Heuristic direction system.** `"asc"` (lower sorts first), `"desc"` (higher sorts first), `"preferTrue"` (true before false). Used by `createHeuristic()` in `strategy/common.ts`.

- **Information policy.** `"fair"` (public zones only) vs `"oracle"` (full opponent deck knowledge). Controls which `MatchupSelector` fields can trigger rules. `getStrategyRuleKnowledgeAccess()` derives access level: `"actor-only"`, `"public-opponent"`, or `"oracle-opponent"`.

- **Turn buckets.** `"opening" | "mid" | "late"` (type `AutomatedActionTurnBucket`). Role weights vary by bucket in `DeckAwareColorPairProfile.roleWeightsByTurnBucket`.

- **12 role tags.** `mulliganKeep`, `inkAvoid`, `earlyPlay`, `latePlay`, `mustAnswerThreat`, `removal`, `sweeper`, `ramp`, `drawEngine`, `tempoThreat`, `evasiveThreat`, `synergyAnchor`.

- **6 strategy tags.** `"core"`, `"engine"`, `"silver-bullet"`, `"situational"`, `"expendable"`, `"dead"`.

- **3 deck archetypes.** `"aggressive" | "midrange" | "control"`.

- **Search caps** (defaults from `types.ts`): `targetPool=8`, `targetCombinationsPerFamily=16`, `choiceIndices=8`, `singerCombinations=16`. Simulation uses expanded caps.

- **4 diagnostic kinds.** `unsupported-shape` (move shape not supported — **signal**), `overflow-skip` (search cap exceeded — **signal**), `validation-reject` (engine rejected candidate — **signal**), `actor-resolution` (informational note about how the actor was resolved — **noise**, one per action, dominates total counts).

- **Board snapshot fields.** `bagCount`, `boardCounts`, `handCounts`, `inkCounts`, `loreTotals`, `pendingEffectCount`, `stateFingerprint`.

## 5. Operating rules

1. Correctness blockers come before heuristic tuning. If actor resolution, chooser ownership, unsupported prompt handling, or deadlock fallback prevents legal progress, fix that first.
2. Tune the current default strategy path in place. Do not create a new strategy ID or candidate manifest unless the work clearly cannot fit the promoted default path.
3. Prefer one small, explainable, typed improvement over a broad rewrite.
4. Do not use `any` or `unknown`.
5. Preserve deterministic seeds.
6. Keep opt-in benchmarks opt-in so normal CI stays fast.
7. Reuse existing trace fields, diagnostics, board snapshots, scorecards, and artifacts.
8. If a game can end by normal rules, it should. If automation is blocked on an unsupported chooser-owned pending item/effect, the trace should show that and the fallback/deadlock path should still terminate cleanly.
9. Do not add card-specific logic inside family evaluators. Use `strategy-data/cards.ts` for card-level rules and `strategy-data/matchups.ts` for matchup-level adjustments.
10. When adding a `CardStrategyProfile` or `MatchupPlan`, the `when` selector determines its knowledge access level. Avoid `opponentDeckSignatures` or `requiresAnyCards` in fair-information strategies.
11. Keep contributor `source` fields accurate. Mislabeled sources break trace analysis.

## 6. Triage-first workflow

Before touching any code, classify the improvement into one of four tracks.

### Step 0 — Triage

| Track                          | Symptom                                                                            | Primary files                                                          |
| ------------------------------ | ---------------------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| **A: Correctness**             | Legal-progress failures, deadlocks, actor-resolution bugs, unsupported-shape gaps  | `planner.ts`, `actor-resolution.ts`, `deadlock.ts`                     |
| **B: Family heuristics**       | A family evaluator ranks candidates wrong for a broad class of board states        | `strategy/families/*.ts`, `strategy/composer.ts`, `strategy/common.ts` |
| **C: Strategy data authoring** | A specific card or matchup needs a card profile or matchup plan                    | `strategy-data/cards.ts`, `strategy-data/matchups.ts`                  |
| **D: Deck profile tuning**     | A color pair's default weights, opening plan, or matchup modifier needs adjustment | `deck-profile.ts`                                                      |

### Step 1 — Establish baseline

Run the narrowest useful checks first. The smoke test (`test:strategy`) takes ~30s and generates per-match trace files plus a **triage digest** — a concise "what to work on next" recommendation printed to console. The quick lab (`test:strategy:quick`) takes 5-10 minutes and generates a full benchmark report with scorecards. Start with the smoke test for exploration; use the quick lab for verification.

```bash
# Engine tests first (~1s)
cd packages/lorcana/lorcana-engine && bun test src/automation/automated-actions.test.ts

# Strategy smoke test (~30s) — generates traces + triage digest
cd packages/lorcana/lorcana-simulator && bun run test:strategy

# Quick lab (~5-10 min) — generates benchmark report + triage digest + comparison vs previous run
# Only run this AFTER identifying a weakness from smoke test traces
cd packages/lorcana/lorcana-simulator && bun run test:strategy:quick
```

### Step 2 — Read the triage digest

After any smoke or lab run, check the console output for the **triage digest** — a 3-line summary identifying the top weakness and its track (A/B/C/D). This is the fastest path to knowing what to work on next.

The triage digest is also written to `triage-digest.md` in the artifact root. It classifies weaknesses by priority:

1. Deadlock games → Track A (correctness)
2. Signal diagnostics (unsupported-shape, validation-reject) → Track A
3. Low win-rate matchups (<30%) → Track B/C (family heuristics or card data)
4. Triage category signals → appropriate track

For deeper analysis, read the full artifact suite:

- `triage-digest.md` — concise "what to work on next" recommendation (smoke + lab)
- `benchmark-summary.md` — full report with scorecards and recommendations (smoke + lab)
- `benchmark-summary.json` — machine-readable `StrategyLabReport` (smoke + lab)
- `run-summary.json` — full `StrategySuiteRunSummary` (smoke + lab)
- `previous-run-summary.json` — the prior run's summary, preserved for comparison (auto-created on second+ runs)
- Per-match `strategy-decisions.jsonl` — one `AutomatedActionDecisionTrace` per line (smoke + lab)
- Per-match `game-runtime.jsonl` — engine runtime logs (smoke + lab)

Use `scorecards`, `worstMatchups`, `inspectNext`, diagnostic counts, fallback counts, and deadlock counts to pick one bounded weakness.

**Scanning traces.** Each JSONL file contains hundreds of entries. Use the trace analysis utilities (see Section 14) or one-liners to scan for patterns:

```bash
# Summarize fallbacks, diagnostics, and final lore per match
cat .artifacts/strategy/latest/{match}/strategy-decisions.jsonl | bun -e "
  const lines = (await Bun.stdin.text()).trim().split('\n').map(l => JSON.parse(l));
  const fallbacks = lines.filter(t => t.fallbackTaken).length;
  const totalDiag = lines.reduce((s,t) => s + (t.diagnostics?.length ?? 0), 0);
  const last = lines[lines.length - 1];
  console.log({ actions: lines.length, fallbacks, totalDiag, lore: last?.boardSnapshot?.loreTotals });
"
```

**Normal vs abnormal counts.** Not all fallbacks and diagnostics indicate problems:

- `fallbackTaken: "passTurn"` with 0 candidates is the **normal end-of-turn pattern** — the bot exhausted all legal moves and passed. Expect ~15-25 per game (roughly one per turn per player).
- `diagnostics` with `kind: "actor-resolution"` are informational notes (one per action). They dominate the total count (300-500 per game) and are not a signal of weakness.
- The signal diagnostics are `kind: "unsupported-shape"` (moves dropped before ranking) and `kind: "overflow-skip"` (search caps hit). Focus on these.

### Step 3 — Identify the failure mode using traces

Follow the trace reading guide in Section 10. Only change code after you can point to a concrete trace-backed mistake.

### Step 4 — Implement in the correct layer

| Track                      | Where to change                                                        |
| -------------------------- | ---------------------------------------------------------------------- |
| A: Correctness             | `planner.ts`, `actor-resolution.ts`, `deadlock.ts`                     |
| B: Family heuristics       | `strategy/families/*.ts`, `strategy/composer.ts`, `strategy/common.ts` |
| C: Strategy data authoring | `strategy-data/cards.ts`, `strategy-data/matchups.ts` (see Section 7)  |
| D: Deck profile tuning     | `deck-profile.ts` color pair profiles, matchup modifiers               |

Do not add opaque special cases when a typed heuristic, contributor, or rule can explain the behavior cleanly.

### Step 5 — Add focused regression coverage

- Engine-level behavior and trace assertions: `automated-actions.test.ts`.
- Simulator-level real-deck / artifact regressions: `src/testing/ai-strategy/*` when the behavior depends on fixture decks or benchmark reports.
- If you change unsupported prompt handling or fallback behavior, add a regression that proves the trace/diagnostic surface is visible and automation terminates cleanly.

### Step 6 — Compare before vs after

Run the same preset, deck filter, game count, and seeds for before and after. Summarize tactical improvement and any diagnostic/fallback/deadlock regression.

## 7. Strategy data authoring guide

The most common improvement pathway is adding or tuning card-level profiles and matchup plans.

### Adding a `CardStrategyProfile`

Add entries to `strategy-data/cards.ts`:

```ts
{
  definitionId: "card-definition-id",
  label: "Card Name",
  strategyTags: ["core"],        // "core" | "engine" | "silver-bullet" | "situational" | "expendable" | "dead"
  baseAdjust: { ink: -2, mulligan: 2, play: 1 },   // always applied
  baseReason: "Ramp card; never ink, always keep",
  rules: [
    {
      id: "unique-rule-slug",
      label: "Rule description",
      reason: "Why this matters in this matchup",
      strategyTags: ["silver-bullet"],
      when: {                    // MatchupSelector
        actorColorPairs: ["sapphire-steel"],
        opponentArchetypes: ["aggressive"],
      },
      adjust: { ink: -6, mulligan: 5, play: 3 },   // deltas on top of base
      targetPreference: { ... },  // optional target scoring
    },
  ],
}
```

**Knowledge access:** The `when` selector fields determine the rule's knowledge access level. Fields like `actorColorPairs` and `actorArchetypes` are `"actor-only"`. Fields like `opponentColorPairs` and `opponentArchetypes` are `"public-opponent"`. Fields like `opponentDeckSignatures` and `requiresAnyCards` are `"oracle-opponent"`. Fair-information strategies skip oracle rules automatically.

### Adding a `MatchupPlan`

Add entries to `strategy-data/matchups.ts`:

```ts
{
  id: "unique-matchup-slug",
  label: "Plan description",
  reason: "Why this matchup needs special handling",
  strategyTags: ["situational"],
  when: {
    actorColorPairs: ["sapphire-steel"],
    opponentColorPairs: ["amber-steel"],
  },
  familyBias: { quest: 0.8, challenge: 1.2 },      // optional override
  roleWeightsByTurnBucket: { opening: { ramp: 2 } }, // optional override
  openingPlan: { minInkablesToKeep: 3 },             // optional override
}
```

Multiple plans can match for a single matchup and layer additively.

### Verifying strategy data

- `evaluateBestAiCardStrategy()` and `evaluateBestAiMatchupPlans()` resolve rules programmatically.
- The matchup weight report (generated during benchmarks) shows which rules fired and their aggregated weights.
- Contributors in decision traces include `source: "card-rule"` with `ruleId` matching your rule's `id` field.

## 8. Test commands and environment variables

All scripts run from `packages/lorcana/lorcana-simulator`.

### npm scripts

| Script                            | What it does                                                | Timeout |
| --------------------------------- | ----------------------------------------------------------- | ------- |
| `bun run test:strategy`           | Smoke test: curated 16-match suite                          | 3 min   |
| `bun run test:strategy:quick`     | Lab with quick preset: 4 decks, 20 mirror games             | 5 min   |
| `bun run test:strategy:candidate` | Lab with candidate preset: 8 decks, 2 mirror + 2 cross-deck | 15 min  |
| `bun run test:strategy:promotion` | Lab with promotion preset: 8 decks, 5 mirror + 5 cross-deck | 30 min  |
| `bun run test:strategy:benchmark` | Full benchmark: 100 games per pair                          | 10 min  |

### Environment variables

| Variable                              | Values                            | Default                                        |
| ------------------------------------- | --------------------------------- | ---------------------------------------------- |
| `RUN_STRATEGY_LAB`                    | `1` to enable                     | off                                            |
| `RUN_STRATEGY_BENCHMARK`              | `1` to enable                     | off                                            |
| `STRATEGY_PRESET`                     | `quick`, `candidate`, `promotion` | none                                           |
| `STRATEGY_GAME_COUNT`                 | integer                           | 20 (lab), 100 (benchmark)                      |
| `STRATEGY_DECKS`                      | comma-separated deck IDs          | all fixture decks for the preset               |
| `STRATEGY_STRATEGIES`                 | comma-separated strategy IDs      | all registered non-test strategies             |
| `STRATEGY_MATCH_MODE`                 | `mirror`, `cross-deck`, `both`    | `mirror` (quick), `both` (candidate/promotion) |
| `RUN_STRATEGY_BATCH_BENCHMARK`        | `1` to enable                     | off                                            |
| `RUN_STRATEGY_HEAD_TO_HEAD_BENCHMARK` | `1` to enable                     | off                                            |

**Important:** Mirror mode requires at least 2 strategies to produce pairings. If you filter to a single strategy with `STRATEGY_STRATEGIES`, the lab will generate 0 matches and the test will fail. Use `STRATEGY_MATCH_MODE=cross-deck` with a single strategy, or provide at least 2 strategies.

### Focused runs

```bash
# Run quick lab for one deck (all strategies)
cd packages/lorcana/lorcana-simulator
STRATEGY_DECKS=amber-amethyst-aggressive bun run test:strategy:quick

# Run candidate lab comparing two strategies
STRATEGY_STRATEGIES=deck-aware-lore-race,best-deck-aware-lore-race bun run test:strategy:candidate

# Run head-to-head with custom game count
RUN_STRATEGY_HEAD_TO_HEAD_BENCHMARK=1 STRATEGY_GAME_COUNT=50 bun run test:strategy
```

## 9. Scoring system and promotion gate

### Blended score formula

From `strategy-suite.ts`:

```
mirrorScore       = mirrorWins / mirrorGames
crossDeckScore    = crossDeckWins / crossDeckGames
deadlockFallback  = (deadlockGames + fallbackCount) / games
diagnosticPenalty = totalDiagnostics / games

blendedScore = 0.5 × mirrorScore
             + 0.3 × crossDeckScore
             − 0.1 × deadlockFallback
             − 0.1 × diagnosticPenalty
```

### Promotion gate criteria

A candidate passes the promotion gate when **all** conditions hold:

1. `blendedScore` improved by at least **0.02** over baseline.
2. `mirrorScore` did not regress by more than **0.01**.
3. `totalDeadlockGames` did not increase.
4. `fallbackCount` did not increase by more than **5%** (rounded up).
5. `totalDiagnostics` did not increase by more than **5%** (rounded up).

## 10. Trace reading guide

**Quick trace analysis.** Before reading raw JSONL, use the programmatic trace analysis utilities in `strategy-trace-analysis.ts` (see Section 14). These handle the common patterns and filter out noise.

Each line in `strategy-decisions.jsonl` is an `AutomatedActionDecisionTrace`. Check fields in this order:

1. **`actorId`** — who was acting.
2. **`boardSnapshot.loreTotals`** — who is winning. `boardCounts` for board pressure.
3. **`orderedCandidates`** — for each entry, check `family`, `heuristics[]`, `contributors[]`, `matchedRuleIds[]`.
4. **`selectedCandidate`** — compare `stableKey` against what you expected the bot to pick.
5. **`executionAttempts`** — `success`, `error`, `errorCode` on each attempt.
6. **`diagnostics`** — `unsupported-shape` means a move was dropped before ranking. `overflow-skip` means search caps were hit.
7. **`fallbackTaken`** — if present, all candidates failed.
8. **`blocked`** — even fallback failed.

### Correlating trace data to source files

| Trace field                                        | Maps to                                                            |
| -------------------------------------------------- | ------------------------------------------------------------------ |
| `contributors[].source === "card-rule"` + `ruleId` | `CardStrategyRule.id` in `strategy-data/cards.ts`                  |
| `contributors[].source === "card-profile"`         | `CardStrategyProfile.baseAdjust` in `strategy-data/cards.ts`       |
| `contributors[].source === "role"`                 | Role weight evaluation in `deck-aware-strategy.ts`                 |
| `contributors[].source === "family"`               | Family bias from `DeckAwareColorPairProfile` in `deck-profile.ts`  |
| `contributors[].source === "opening"`              | Opening plan evaluation in `deck-aware-strategy.ts`                |
| `contributors[].source === "target"`               | Target scoring in `target-priority.ts`                             |
| `heuristics[].key`                                 | Heuristic names defined in `strategy/composer.ts`                  |
| `matchedRuleIds`                                   | Cross-references `CardStrategyRule.id` in `strategy-data/cards.ts` |
| `diagnostics[].kind`                               | Diagnostic origin in `planner.ts` (enumeration phase)              |

### Common failure patterns

- **Expected move not in `orderedCandidates`**: check `diagnostics` for `unsupported-shape` or `overflow-skip`. The move may not have been enumerated.
- **Expected move ranked too low**: check its `contributors` and `heuristics` vs the winner's. A missing card rule or wrong axis weight is the likely cause (Track C or D).
- **Move enumerated but rejected**: check `executionAttempts[].errorCode`. A validation failure means the candidate was technically illegal despite passing initial checks (Track A).
- **Fallback taken with candidates available**: check `executionAttempts` on the top candidates. Multiple execution failures trigger fallback after 3 attempts.

## 11. Artifact structure

All artifacts live under `packages/lorcana/lorcana-simulator/.artifacts/strategy/latest/`.

**Smoke test** artifacts (per-match traces only, no summary reports):

```
.artifacts/strategy/latest/
├── {deck-a}-vs-{deck-b}-{label}/
│   ├── strategy-decisions.jsonl   # One AutomatedActionDecisionTrace per line
│   └── game-runtime.jsonl         # Engine runtime logs
```

**Lab/benchmark** artifacts (per-match traces + summary reports):

```
.artifacts/strategy/latest/presets/{quick,candidate,promotion}/
├── run-summary.json              # StrategySuiteRunSummary
├── benchmark-summary.json        # StrategyLabReport (scorecards, worst matchups, triage)
├── benchmark-summary.md          # Human-readable report
├── matchup-weight-report.json    # Which card/matchup rules fired and their weights
├── matchup-weight-report.md      # Human-readable weight report
└── {match-id}/
    ├── strategy-decisions.jsonl
    └── game-runtime.jsonl
```

## 12. Deliverables

For each improvement iteration, provide:

1. The code changes.
2. The specific weakness or correctness gap found, with its triage track (A/B/C/D).
3. The trace or benchmark evidence that identified it (quote the relevant trace fields or scorecard metrics).
4. The specific change that addressed it and which file/layer it touched.
5. Before/after benchmark or strategy-lab results on the same preset and seeds.
6. Focused tests covering the new behavior.
7. A short note describing the next most valuable follow-up iteration.

## 13. Acceptance criteria

1. Targeted engine tests pass (`bun test src/automation/automated-actions.test.ts`).
2. Strategy smoke test passes (`bun run test:strategy`).
3. The chosen opt-in strategy lab / benchmark run completes successfully.
4. The post-change result is measurably better, or the lack of improvement is explained with trace-backed evidence.
5. No promotion gate regression: deadlock games, fallback count, and diagnostic count did not worsen beyond thresholds.
6. New `CardStrategyProfile` or `MatchupPlan` entries have unique IDs and appear in the matchup weight report.
7. Automation never silently stalls on chooser-owned pending effects; unsupported prompt shapes remain visible in diagnostics/traces, and fallback/deadlock termination stays clean.

## 14. Refinement tooling

### Triage digest

Every smoke and lab run now produces a **triage digest** — a concise summary identifying the top weakness and its track.

**Console output** (printed automatically after smoke and lab runs):

```
Triage: Track A — Signal diagnostics present
  3 signal diagnostic(s) (unsupported-shape or validation-reject)
  Inspect: .artifacts/strategy/latest/{match}/strategy-decisions.jsonl
  deadlocks=0 | signal-diag=3 | questionable=5
```

**Artifact**: `triage-digest.md` in the artifact root.

**Programmatic**: `buildTriageDigest(report)` in `strategy-suite.ts` takes a `StrategyLabReport` and returns a `StrategyTriageDigest` object.

### Run comparison

The lab test automatically compares against the previous run when `previous-run-summary.json` exists in the artifact root. On each run, the current `run-summary.json` is preserved as `previous-run-summary.json` before the new one is written.

**Console output** (printed after lab runs when a previous run exists):

```
Comparison: 16 games (before) vs 16 games (after)
  Improved: Signal diagnostics: -2, Questionable decisions: -3
  Regressed: Concede fallbacks: +1
```

**Programmatic**: `compareStrategyRuns(before, after)` in `strategy-suite.ts`. Also `loadPreviousRunSummary(artifactRoot)` to load the previous summary.

**Markdown**: `buildRunComparisonMarkdown(comparison)` produces a structured delta report.

### Trace analysis utilities

`strategy-trace-analysis.ts` provides reusable helpers for common trace analysis patterns.

**`summarizeMatchTraceFile(path)`** — reads a `strategy-decisions.jsonl` file and returns:

- `actions`: total trace entries
- `abnormalFallbacks`: fallbacks that are NOT normal end-of-turn passes (the signal)
- `concedeFallbacks`: concede-type fallbacks
- `signalDiagnostics`: unsupported-shape + validation-reject count
- `questionableDecisions`: challenge-over-quest patterns
- `topFamilies`: count of selected actions by family
- `finalLore`: lore totals from the last trace entry

**`findSignalDiagnosticsInFile(path)`** — extracts only the signal diagnostics (unsupported-shape, overflow-skip, validation-reject) with their turn and move numbers.

Example usage from a script or test:

```ts
import { summarizeMatchTraceFile, findSignalDiagnosticsInFile } from "./strategy-trace-analysis.js";

const summary = summarizeMatchTraceFile(
  ".artifacts/strategy/latest/{match}/strategy-decisions.jsonl",
);
console.log(summary);

const signals = findSignalDiagnosticsInFile(
  ".artifacts/strategy/latest/{match}/strategy-decisions.jsonl",
);
for (const signal of signals) {
  console.log(
    `Turn ${signal.turnNumber}, move ${signal.moveNumber}: ${signal.kind} — ${signal.detail}`,
  );
}
```

### File map (refinement tooling)

| File                             | Purpose                                                                                                                  |
| -------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `strategy-trace-analysis.ts`     | `summarizeMatchTraceFile()`, `findSignalDiagnosticsInFile()`                                                             |
| `strategy-suite.ts` (triage)     | `buildTriageDigest()`, `buildTriageDigestMarkdown()`, `buildTriageDigestConsoleOutput()`                                 |
| `strategy-suite.ts` (comparison) | `compareStrategyRuns()`, `buildRunComparisonMarkdown()`, `buildRunComparisonConsoleOutput()`, `loadPreviousRunSummary()` |
