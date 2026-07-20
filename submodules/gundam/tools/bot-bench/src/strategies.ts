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
  combatAwareStrategy,
  greedyLegalStrategy,
  passOnlyStrategy,
  strategicStrategy,
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
  iter11PrepareCombat,
  iter12DirectPressure,
  iter13Strategic,
  iter14EffectiveCombat,
  iter15SelectiveBlock,
  iter16CombatAware,
  iter17LastShieldDefense,
  iter18BoardPreservingBlock,
  iter19AggressiveShieldBlock,
  iter20CommandImpact,
  iter21DevelopBeforeCommand,
  iter22SelectiveCommand,
  iter23CommandVsPilot,
  iter24TempoAwareCommand,
  iter25ThreatAwareTarget,
  iter26BlockerBaitOrder,
  iterProduction,
} from "./experiments.ts";

export type BenchStrategyId =
  | "combat-aware"
  | "greedy-legal"
  | "pass-only"
  | "strategic"
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
  | "iter-11-prepare-combat"
  | "iter-12-direct-pressure"
  | "iter-13-strategic"
  | "iter-14-effective-combat"
  | "iter-15-selective-block"
  | "iter-16-combat-aware"
  | "iter-17-last-shield-defense"
  | "iter-18-board-preserving-block"
  | "iter-19-aggressive-shield-block"
  | "iter-20-command-impact"
  | "iter-21-develop-before-command"
  | "iter-22-selective-command"
  | "iter-23-command-vs-pilot"
  | "iter-24-tempo-aware-command"
  | "iter-25-threat-aware-target"
  | "iter-26-blocker-bait-order"
  | "iter-production"
  | "tempo";

export const REGISTERED_STRATEGIES: Readonly<Record<BenchStrategyId, CandidateStrategy>> = {
  "combat-aware": combatAwareStrategy,
  "greedy-legal": greedyLegalStrategy,
  "pass-only": passOnlyStrategy,
  strategic: strategicStrategy,
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
  "iter-11-prepare-combat": iter11PrepareCombat,
  "iter-12-direct-pressure": iter12DirectPressure,
  "iter-13-strategic": iter13Strategic,
  "iter-14-effective-combat": iter14EffectiveCombat,
  "iter-15-selective-block": iter15SelectiveBlock,
  "iter-16-combat-aware": iter16CombatAware,
  "iter-17-last-shield-defense": iter17LastShieldDefense,
  "iter-18-board-preserving-block": iter18BoardPreservingBlock,
  "iter-19-aggressive-shield-block": iter19AggressiveShieldBlock,
  "iter-20-command-impact": iter20CommandImpact,
  "iter-21-develop-before-command": iter21DevelopBeforeCommand,
  "iter-22-selective-command": iter22SelectiveCommand,
  "iter-23-command-vs-pilot": iter23CommandVsPilot,
  "iter-24-tempo-aware-command": iter24TempoAwareCommand,
  "iter-25-threat-aware-target": iter25ThreatAwareTarget,
  "iter-26-blocker-bait-order": iter26BlockerBaitOrder,
  "iter-production": iterProduction,
  tempo: tempoStrategy,
};

export function listStrategies(): readonly BenchStrategyId[] {
  return Object.keys(REGISTERED_STRATEGIES) as readonly BenchStrategyId[];
}
