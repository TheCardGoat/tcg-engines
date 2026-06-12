export * from "./types/index.ts";
export {
  createMatchState,
  createInitialGameState,
  createEmptyPlayerState,
  populatePlayerBoard,
  chooseFirstPlayer,
  applyOpeningHand,
  getOpponentId,
} from "./state/initial-state.ts";
export type { CreateMatchStateOptions } from "./state/initial-state.ts";
export { SeededRNG, seedFromString, nextRandom, createRandomAPI } from "./state/rng.ts";
export {
  setCardRegistry,
  clearCardRegistry,
  getCardRegistry,
  getDefinition,
  tryGetDefinition,
  overrideDefinition,
  clearDefinitionOverride,
  getInstance,
  tryGetInstance,
  getDefinitionFor,
  defOf,
  tryDefOf,
  getEffectiveActivePlayerId,
} from "./state/index.ts";
export {
  processCommand,
  validateCommand,
  enumerateMoves,
  registerMove,
  registerMoves,
  getMoveRegistry,
} from "./command/index.ts";
export { allMoves, MOVE_IDS, type MoveId } from "./moves/index.ts";
export {
  computeEffectiveCost,
  computeEffectiveCostDetails,
  type EffectiveCostDetails,
  type EffectiveCostModifierDetail,
} from "./moves/compute-effective-cost.ts";
export { createOperations } from "./operations/index.ts";
export type {
  Operations,
  ZoneOperations,
  CardOperations,
  GameOperations,
  GigOperations,
  EventOperations,
  LogOperations,
} from "./operations/index.ts";
export {
  resolveTarget,
  evaluateCondition,
  resolveNumericValue,
  type ResolutionContext,
} from "./effects/index.ts";
export {
  resolveEffect,
  effectHandlers,
  type EffectHandlerResult,
} from "./effects/handlers/index.ts";
export {
  filterMatchView,
  type FilteredMatchView,
  type FilteredCardView,
  type FilteredPlayerView,
} from "./view/filter.ts";
export {
  buildPlayerPrompt,
  type PlayerPrompt,
  type PlayerPromptStatus,
  type AvailableMove,
  type MoveInputSpec,
  type ChoicePrompt,
} from "./view/player-prompt.ts";
export { startTurn, checkWinConditions } from "./flow/index.ts";
export {
  getEffectivePower,
  getEffectivePower as computeEffectivePower,
  getEffectiveKeywords,
  getEffectiveRules,
  getStreetCredForPlayer,
  getGigCount,
  recomputeActiveEffects,
} from "./active-effects/index.ts";
export { matchTriggers, type TriggerMatch } from "./triggers/index.ts";
export { LocalEngine } from "./transport/local-engine.ts";

// Fixture-driven engine — exported so prototype apps (e.g. the simulator)
// can bootstrap a real MatchState using the same idioms as engine tests.
// Production game sessions should use LocalEngine + a server transport.
// `registerMatchers` lives in the testing/ subdir and is not re-exported
// here — vitest matchers are test-only.
export {
  CyberpunkTestEngine,
  P1,
  P2,
  PlayerHandle,
  ServerView,
  MoveFailedError,
  type CardRef,
} from "./testing/test-engine.ts";
export { createTestMatchState } from "./testing/test-state.ts";
export {
  createMockUnit,
  createMockProgram,
  createMockGear,
  createMockLegend,
} from "./testing/card-mocks.ts";
export type {
  PlayerFixture,
  FixtureCardEntry,
  FixtureCardState,
  GigFixtureEntry,
  TestEngineOptions,
} from "./testing/test-fixtures.ts";
export type { Transport, TransportMessage } from "./transport/types.ts";
export { InMemoryTransport } from "./transport/in-memory-transport.ts";
export {
  ReplayBuilder,
  ReplayEngine,
  ReplayExporter,
  UnifiedReplayBuilder,
  UnifiedReplayEngine,
  UnifiedReplayExporter,
} from "./replay/index.ts";
export type {
  MatchReplayData,
  CommandLogEntry,
  UnifiedReplayCommand,
  UnifiedReplaySnapshot,
  UnifiedReplayData,
  UnifiedReplayEngineOptions,
  UnifiedCreateRuntimeFn,
} from "./replay/index.ts";
export { buildAnimationScript, ANIMATION_DURATIONS_MS } from "./animation/index.ts";
export type {
  AnimationScript,
  AnimationStep,
  AnimationStepKind,
  CardAttachStep,
  CardEnterStep,
  CardExitReason,
  CardExitStep,
  CardLandStep,
  CardMoveStep,
  CombatStep,
  EffectTargetSpec,
  EffectTargetStep,
  GigMoveStep,
  LegendRevealStep,
  PhaseChangeStep,
  ResourceFloatStep,
  ResourceKind,
} from "./animation/index.ts";
export type { GameLogEntry } from "./logging/index.ts";
export {
  type PrivateField,
  privateField,
  stripPrivateFields,
  type MoveLog,
  type MoveLogBase,
  type MoveLogType,
  type PlayCardLog,
  type SellCardLog,
  type CallLegendLog,
  type AttackUnitLog,
  type AttackRivalLog,
  type UseBlockerLog,
  type PassPhaseLog,
  type GainGigLog,
  type MulliganLog,
  type KeepHandLog,
  type ResolveCardToPlayLog,
  type ResolveCardToMoveLog,
  type ResolveDiscardFromHandLog,
  type ResolveStealGigsLog,
  type ConcedeLog,
  type ActivateAbilityLog,
  type SearchDeckLog,
  type ResolveSearchDeckLog,
  type TurnStartedLog,
  type TurnEndedLog,
  type GameEndedLog,
  type GenericActionLog,
} from "./logging/index.ts";
export { formatActionLog, enMessages } from "./logging/index.ts";
export {
  CYBERPUNK_ENGINE_RUNTIME,
  type CyberpunkEngineRuntimeFingerprint,
} from "./runtime-fingerprint.ts";

// AI automation (player-boundary safe).
export {
  AIPlayer,
  type AIPlayerOptions,
  type AIStrategy,
  type ChoiceResolver,
  type ChoiceResolverMap,
  type DecisionContext,
  type MoveDecision,
  type StepResult,
  type StepResultActed,
  type StepResultIdle,
  type StepResultStuck,
  type StepResultIllegal,
  type TurnResult,
  buildDecisionContext,
  defaultChoiceResolvers,
  searchDeckResolver,
  chooseTargetResolver,
  chooseEffectResolver,
  chooseGigsToStealResolver,
  chooseCardToPlayResolver,
  chooseCardToMoveResolver,
  defaultStrategy,
  firstLegalStrategy,
  randomStrategy,
  passOnlyStrategy,
  attackUnitOnlyStrategy,
  callLegendOnlyStrategy,
  greedyStrategy,
  createGreedyStrategy,
  DEFAULT_GREEDY_WEIGHTS,
  type GreedyWeights,
  AUTOMATED_ACTION_STRATEGIES,
  DEFAULT_AUTOMATED_ACTION_STRATEGY_ID,
  getAutomatedActionStrategyOption,
  getSafeAutomatedActionStrategyOption,
  type AutomatedActionStrategyOption,
  monteCarloStrategy,
  monteCarloGreedyStrategy,
  createMonteCarloStrategy,
  type MonteCarloOptions,
  mctsStrategy,
  mctsGreedyStrategy,
  createMctsStrategy,
  type MctsOptions,
  decisionFromMove,
  type ArgPicker,
  runAutoMatch,
  type RunAutoMatchOptions,
  type AutoMatchResult,
  type AutoMatchLogEntry,
  assertNever,
} from "./automation/index.ts";
