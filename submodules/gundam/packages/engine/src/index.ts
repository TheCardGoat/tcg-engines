// ── Types ──────────────────────────────────────────────────────────────────────
export * from "./types/index.ts";

// ── Runtime ───────────────────────────────────────────────────────────────────
export { MatchRuntime } from "./runtime/match-runtime.ts";
export type {
  SetupArgs,
  BoardSetupContext,
  BoardProjectionContext,
  PacketAnimationContext,
} from "./runtime/match-runtime.ts";
export { initializeMatchState } from "./runtime/match-runtime.init.ts";
export {
  resolveFlowTransitions,
  advancePhase,
  advanceTurn,
  getValidMovesForPhase,
} from "./runtime/match-runtime.flow.ts";
export { validateCommand } from "./runtime/match-runtime.validation.ts";
export { createZoneOperations, makeZoneKey } from "./runtime/zone-operations.ts";
export { createCardReadAPI, createCardRuntimeAPI } from "./runtime/card-runtime.ts";
export { filterMatchView } from "./runtime/view-filter.ts";
export { createStaticResources } from "./runtime/static-resources.ts";
export type { Player, MatchStaticResources } from "./runtime/static-resources.ts";
export { createRandomAPI, seedFromString, nextRandom } from "./runtime/random.ts";
export type { PRNGState } from "./runtime/random.ts";
export { deriveClockView, formatClockTime } from "./runtime/clock-view.ts";
export type { ClockSnapshot, ClockView, DeriveClockViewOptions } from "./runtime/clock-view.ts";
export {
  DEFAULT_DYNAMIC_CLOCK_CONFIG,
  checkTimeout,
  pauseClock,
  resetPlayerTimeAfterSkip,
  resumeClock,
  settleClocks,
  updateClockForWaitingState,
} from "./runtime/time-control.ts";

// ── TargetDSL & Effect Resolution ─────────────────────────────────────────────
export { evaluateTargetFilter, evaluateCondition, countMatching } from "./runtime/target-dsl.ts";
export type { TargetResolutionContext } from "./runtime/target-dsl.ts";
export {
  resolveEffect,
  resolveCardEffect,
  checkPreconditions,
  enumerateTargetsForAction,
} from "./runtime/effect-resolver.ts";
export type { ResolvedAction, EffectResolution } from "./runtime/effect-resolver.ts";

// ── Replay & Logs ─────────────────────────────────────────────────────────────
export { ReplayBuilder, ReplayEngine, ReplayExporter } from "./runtime/replay.ts";
export type { ReplayData, ReplayCommand, ReplaySnapshot } from "./runtime/replay.ts";
export { GameLogger, createLogProjection } from "./runtime/match-runtime.logs.ts";
export type { GameLogProjection } from "./runtime/match-runtime.logs.ts";
export { privateField, stripPrivateFields } from "./runtime/private-field.ts";
export type { PrivateField } from "./runtime/private-field.ts";
export {
  serializeState,
  deserializeState,
  computeStateDelta,
  applyStateDelta,
} from "./runtime/match-runtime.serialization.ts";
export type { SerializedMatchState, StateDelta } from "./runtime/match-runtime.serialization.ts";

// ── Engine Layer ──────────────────────────────────────────────────────────────
export type { GameEngine, TransportAwareEngine, AuthorityMode } from "./engine/contracts.ts";
export { ServerEngine } from "./engine/server-engine.ts";
export { ClientEngine } from "./engine/client-engine.ts";
export { LocalEngine } from "./engine/local-engine.ts";
export { InMemoryTransport } from "./engine/in-memory-transport.ts";

// ── Automation ────────────────────────────────────────────────────────────────
export type {
  CandidateStrategy,
  CandidateStrategyContext,
  AutomatedActionOutcome,
  BotDecisionAttempt,
  BotDecisionRecord,
  BotDecisionSink,
  TakeAutomatedActionWithFallbackResult,
} from "./automation/types.ts";
export { takeAutomatedActionWithFallback } from "./automation/planner.ts";
export type {
  PlayMatchAction,
  PlayMatchOptions,
  PlayMatchOutcome,
  PlayMatchTermination,
} from "./automation/play-match.ts";
export { playMatch } from "./automation/play-match.ts";
export type { GundamBotCandidate, GundamBotCandidateFamily } from "./automation/candidate-types.ts";
export { candidateToCommand, commandToCandidate } from "./automation/candidate-types.ts";
export type {
  GundamCandidateSearchCaps,
  EnumerateCandidatesOptions,
} from "./automation/candidate-enumerator.ts";
export {
  enumerateGundamBotCandidates,
  DEFAULT_GUNDAM_CANDIDATE_SEARCH_CAPS,
} from "./automation/candidate-enumerator.ts";
export { greedyLegalStrategy } from "./automation/greedy-legal-strategy.ts";
export { passOnlyStrategy } from "./automation/pass-only-strategy.ts";
export {
  valueRankedStrategy,
  rankByDamage,
  rankByStatTotal,
} from "./automation/value-ranked-strategy.ts";
export { tempoStrategy } from "./automation/tempo-strategy.ts";
export { createDeadlockDetector, fingerprint } from "./automation/deadlock.ts";
export type { DeadlockDetector } from "./automation/deadlock.ts";
export type {
  FamilyPolicy,
  FamilyPolicyContext,
  SharedPolicies,
  ComposeStrategyOptions,
} from "./automation/shared-policies.ts";
export {
  DEFAULT_POLICIES,
  DEFAULT_FAMILY_PRIORITY,
  composeStrategy,
  vetoFamily,
} from "./automation/shared-policies.ts";

// ── UI API ────────────────────────────────────────────────────────────────────
// Curated surface for UI / web-client consumers. See packages/engine/docs
// for a walkthrough of how these fit together. Each export here is stable
// and expected to remain backwards-compatible across minor versions.
export {
  enumerateAvailableMoves,
  enumerateAvailableMovesDetailed,
  type AvailableMove,
} from "./runtime/match-runtime.queries.ts";
export { getMoveProcedure } from "./runtime/match-runtime.procedure.ts";
export type {
  MoveStepOption,
  MoveProcedureContext,
  MoveValidationResult,
} from "./types/move-types.ts";
export type { CommandErrorCode } from "./types/command.ts";
export type { GundamMoveName } from "./gundam/moves/move-name.ts";
export {
  GUNDAM_MOVE_NAMES,
  getGundamMoveDefinition,
  isGundamMoveName,
} from "./gundam/moves/move-name.ts";
export { assertNever } from "./utils/assert-never.ts";

// Move-input binding — single source of truth shared between UI click-paths
// and bot candidate enumeration. Re-exported here so simulator code never
// has to dig into `@tcg/gundam-engine/automation/...` for the helpers.
export type {
  MoveBinding,
  SelectTargetBinding,
  SelectTargetStep,
} from "./automation/move-binding.ts";
export {
  MOVE_BINDINGS,
  getMoveBinding,
  seedPrimaryCardInput,
  selectTargetInputBinding,
} from "./automation/move-binding.ts";

// ── Deck Lists ────────────────────────────────────────────────────────────────
export * from "./deck/index.ts";

// ── Gundam Game Module ────────────────────────────────────────────────────────
export * from "./gundam/index.ts";
