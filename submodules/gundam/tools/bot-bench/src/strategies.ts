/**
 * Strategy registry — every engine-exported `CandidateStrategy` plus any
 * locally-defined experimental variants. The bench CLI accepts strategy ids
 * from this map; `propose.ts` and the `/improve-bot` skill use the same ids
 * to refer to baselines and candidates.
 *
 * Adding a new experimental strategy:
 *   1. Define it via `composeStrategy(...)` (or as a vendored module) below.
 *   2. Register it in `REGISTERED_STRATEGIES` with a stable kebab-case id.
 *   3. Re-run the bench against the baseline.
 *
 * Strategies are registered by id rather than by reference so they can be
 * round-tripped through CLI args and report JSON.
 */

import {
  greedyLegalStrategy,
  passOnlyStrategy,
  tempoStrategy,
  valueRankedStrategy,
  type CandidateStrategy,
} from "@tcg/gundam-engine";

import {
  iter01FilterBlockers,
  iter02PendingPriority,
  iter03SkipSelfBlock,
  iter04SkipHighManeuver,
  iter05RankLethal,
  iter06GoSecond,
  iter07AttackPriority,
  iter08DeployCurve,
  iter09MulliganLowCurve,
  iter10StackBest,
  iterProduction,
} from "./experiments.ts";

export type BenchStrategyId =
  | "greedy-legal"
  | "pass-only"
  | "value-ranked"
  | "iter-01-filter-blockers"
  | "iter-02-pending-priority"
  | "iter-03-skip-self-block"
  | "iter-04-skip-high-maneuver"
  | "iter-05-rank-lethal"
  | "iter-06-go-second"
  | "iter-07-attack-priority"
  | "iter-08-deploy-curve"
  | "iter-09-mulligan-low-curve"
  | "iter-10-stack-best"
  | "iter-production"
  | "tempo";

export const REGISTERED_STRATEGIES: Readonly<Record<BenchStrategyId, CandidateStrategy>> = {
  "greedy-legal": greedyLegalStrategy,
  "pass-only": passOnlyStrategy,
  "value-ranked": valueRankedStrategy,
  "iter-01-filter-blockers": iter01FilterBlockers,
  "iter-02-pending-priority": iter02PendingPriority,
  "iter-03-skip-self-block": iter03SkipSelfBlock,
  "iter-04-skip-high-maneuver": iter04SkipHighManeuver,
  "iter-05-rank-lethal": iter05RankLethal,
  "iter-06-go-second": iter06GoSecond,
  "iter-07-attack-priority": iter07AttackPriority,
  "iter-08-deploy-curve": iter08DeployCurve,
  "iter-09-mulligan-low-curve": iter09MulliganLowCurve,
  "iter-10-stack-best": iter10StackBest,
  "iter-production": iterProduction,
  tempo: tempoStrategy,
};

export function listStrategies(): readonly BenchStrategyId[] {
  return Object.keys(REGISTERED_STRATEGIES) as readonly BenchStrategyId[];
}
