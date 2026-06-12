export type {
  CandidateStrategy,
  CandidateStrategyContext,
  AutomatedActionOutcome,
  BotDecisionAttempt,
  BotDecisionRecord,
  BotDecisionSink,
  TakeAutomatedActionWithFallbackResult,
} from "./types.ts";

export { takeAutomatedActionWithFallback } from "./planner.ts";

export type {
  PlayMatchAction,
  PlayMatchOptions,
  PlayMatchOutcome,
  PlayMatchTermination,
} from "./play-match.ts";
export { playMatch } from "./play-match.ts";

export type { GundamBotCandidate, GundamBotCandidateFamily } from "./candidate-types.ts";
export { candidateToCommand, commandToCandidate } from "./candidate-types.ts";

export type {
  GundamCandidateSearchCaps,
  EnumerateCandidatesOptions,
} from "./candidate-enumerator.ts";
export {
  enumerateGundamBotCandidates,
  DEFAULT_GUNDAM_CANDIDATE_SEARCH_CAPS,
} from "./candidate-enumerator.ts";

export { greedyLegalStrategy } from "./greedy-legal-strategy.ts";
export { passOnlyStrategy } from "./pass-only-strategy.ts";
export { valueRankedStrategy, rankByDamage, rankByStatTotal } from "./value-ranked-strategy.ts";
export { tempoStrategy } from "./tempo-strategy.ts";

export type {
  FamilyPolicy,
  FamilyPolicyContext,
  SharedPolicies,
  ComposeStrategyOptions,
} from "./shared-policies.ts";
export {
  DEFAULT_POLICIES,
  DEFAULT_FAMILY_PRIORITY,
  composeStrategy,
  vetoFamily,
} from "./shared-policies.ts";

export type { MoveBinding, SelectTargetBinding, SelectTargetStep } from "./move-binding.ts";
export {
  MOVE_BINDINGS,
  getMoveBinding,
  seedPrimaryCardInput,
  selectTargetInputBinding,
} from "./move-binding.ts";

export type { DeadlockDetector } from "./deadlock.ts";
export { createDeadlockDetector, fingerprint } from "./deadlock.ts";
