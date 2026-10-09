# Heuristics A/B bench — experiments, results, decisions

Durable record of the 2026-09-27 heuristic improvement campaign for the
Cyberpunk tactical bot. One JSONL row per experiment in
[journal.jsonl](./journal.jsonl); this file is the narrative summary. The
verbatim bench output for every run is archived under
[raw/](./raw/) (`<date>-<experiment>.json`, one file per journal row).

## Methodology

Tool: `tools/ai-runner/src/heuristics-ab.ts` (+ `heuristics-ab.worker.ts`),
committed as `529d0252`.

- Paired design: both seat orders reuse one seed over the authored bot-lab
  pool (45 pairings), so deck shuffles are identical and only the first
  player flips.
- Metrics: `pairedImprovement = (aSweeps - bSweeps) / pairs` (primary) and
  raw A win rate (secondary).
- Noise floor, measured with an identical-strategy null run: **±0.044 at 180
  pairs, ~±0.022 at 540 pairs**. Only deltas clearing that are decisions.
- Hard bar: any `stuck` / `illegal` / `repeatedState` failure disqualifies a
  variant regardless of win rate.
- Caveat: the shared working tree carried a concurrent agent's in-flight
  refactor, so absolute numbers include that WIP; paired deltas still isolate
  the seat under test.

## Shipped (commit `4c6016488e`, automation revision v7)

| Lesson | What it does | Evidence |
| --- | --- | --- |
| `safe-steal` | Steal-only prompt when the rival has no ready blocker; 0-power units never steal | +0.106 paired / +5.3% raw at 1,080 games |
| `remove-targets` | Weakest-sufficient attacker per defender; combat outranks developing | null alone, kept for set synergy |
| `gear-power` | +60 for steal-breakpoint or strict-top attach; stacking penalty | null alone, kept for set synergy |
| `legend-gear` | No plain-power gear on face-up non-[GO SOLO] legends | neutral; rules-correctness fix |

**Combined: +0.207 paired / 60.4% raw at 1,080 games** — roughly twice the
sum of the individual marginals. Judge heuristic *sets* by the combined
configuration: the removal and steal mandates interact (double-attack combat
turns neither produces alone).

## Rejected with evidence

- **Authored-curve-first precedence** (curve narrows before combat policies):
  −0.050 at 1,080. Combat overriding authored lines inside the curve window
  is winning games.
- **Keeping `passPhase` inside the mandates** (as a soft exit): −0.054 at
  1,080. The mandates' value *is* forcing attacks the search declines. The
  curve-veto problem is instead solved by the empty-set pass fallback in
  `decide()` (`passPhaseAction`), which costs nothing measurable.
- **Ability-aware scoring** (Masterful vs Sharp): −0.017.
- **Depth-4 search budget**: +0.028 but 2 `repeatedState` failures —
  disqualified. Breadth-only increase: exactly 0.000. Depth-3 search is
  saturated on both axes.
- **Search-model blockers** (useBlocker via minimax instead of greedy
  thresholds): −0.022; greedy blocking already matches search quality.
- **Hidden-reply pessimism tuning**: structurally inert — the offset only
  seeds minimax values that real lines always dominate (verified: 360 games
  byte-identical with the knob at 0.5, and at 0 the probe game is unchanged).
- **Deny-steal threshold 1**: void — authored profiles already resolve
  `blockDirectStealsAtLeast` to 1.
- **Gig-steal target selection**: already optimal (value × 2 + gig-plan
  synergy); do not revisit.

## Where future gains likely live

Every knob that re-ranks existing candidates or re-models known replies
measures zero. The mandate win came from *forcing lines the search
undervalues* — softening that forcing is what the two −0.05 experiments
showed. Promising directions are structural, not parametric: multi-turn
candidate generation (the depth-3 horizon is also where the depth-4
`repeatedState` risk appeared), opponent modeling beyond the flat hidden-reply
term, or a richer board evaluation.

## Reproducing

```bash
cd submodules/cyberpunk
bun tools/ai-runner/src/heuristics-ab.ts \
  --b-off safe-steal --pairs 45 --seeds 12 --workers 6   # single-lesson A/B
bun tools/ai-runner/src/heuristics-ab.ts \
  --a-config "maxDepth=4,maxNodes=128" --pairs 45 --seeds 4 --workers 6
bun tools/ai-runner/src/heuristics-ab.ts \
  --a-poverride "blockDirectStealsAtLeast=1" --pairs 45 --seeds 4 --workers 6
```

`--a-config/--b-config` spread key=value pairs into `createTacticalStrategy`
options per seat; `--a-poverride/--b-poverride` merge key=value pairs over the
resolved authored deck profile per seat. Always calibrate with an
identical-strategy null run before trusting a delta.

## Recording convention

Every experiment appends one `journal.jsonl` row (arms, metrics, failures,
decision, rationale) and copies its raw summary JSON into `raw/` named
`<date>-<experiment>.json`, in the same commit as any code the decision
keeps. Keep-reject decisions without a row are treated as not made.
