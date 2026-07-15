// Core Types
export type {
  PlayerId,
  MatchState,
  TCGCtx,
  CtxStatus,
  TimeContext,
  ClockPauseReason,
  ChessClockContext,
  PriorityClockContext,
  DynamicClockContext,
  ClockPlayerState,
  ChessClockPlayerState,
  PriorityClockPlayerState,
  DynamicClockPlayerState,
  ChessClockConfig,
  PriorityClockConfig,
  DynamicClockConfig,
  TimeControlConfig,
  CtxRandom,
} from "./types/index.ts";

export type {
  DeepReadonly,
  MoveValidationErrorEnvelope,
  MoveValidationResult,
  CardReadAPI,
  CardRuntimeAPI,
  ZoneQueryAPI,
  ZoneMutationAPI,
  ZoneOperationsAPI,
  TimeQueryAPI,
  TimeOperationsAPI,
  RandomAPI,
  GameEndResult,
  EventAPI,
  GameEvent,
  UndoAPI,
  LogEntry,
  MoveLogEntry,
  StatusAPI,
  FrameworkStateSnapshot,
  FrameworkReadAPI,
  FrameworkWriteAPI,
  MoveStepOption,
  MoveProcedureContext,
  MoveEnumerationContext,
  MoveValidationContext,
  MoveExecutionContext,
  MoveDefinition,
  MoveRecord,
} from "./types/index.ts";

export type {
  LifecycleHook,
  LifecycleContext,
  TransitionCheckResult,
  FlowDefinition,
  GameSegmentDefinition,
  TurnDefinition,
  PhaseDefinition,
  StepDefinition,
} from "./types/index.ts";

export type {
  CommandEnvelope,
  CommandSuccess,
  CommandFailure,
  CommandResult,
  CommandErrorCode,
  PublishedGameEvent,
  GameLogEntry,
  PacketAnimation,
} from "./types/index.ts";

export type { RuntimeCard, BaseCardMeta, CardsMaps } from "./types/index.ts";

export type { ZoneVisibility, ZoneConfig, ZoneRef, ZoneRuntimeState } from "./types/index.ts";
export type {
  CoreAbility,
  TriggerQueueEntry,
  PendingChoice,
  LimitRecord,
} from "./types/abilities.ts";

export type {
  TargetEvaluationContext,
  RelativeOwner,
  Comparison,
  EntityRef,
  SelectionBounds,
  AttributePredicate,
  BaseTargetFilter,
  TargetResult,
  CoreTargetExpression,
  GameTargetRegistry,
  TargetProjectionResult,
} from "./types/index.ts";

export type { CoreCondition, ConditionPredicateAdapter } from "./types/index.ts";

export type {
  EffectExecutionStatus,
  EffectExecutionResult,
  EffectRuntime,
  PrimitiveValue,
  CoreTargetRef,
  CoreZoneRef,
  CoreDuration,
  CoreChoicePrompt,
  NumericClamp,
  CorePrimitiveAction,
  CoreEffectNode,
  PrimitivePatch,
  PrimitiveRuntime,
  GameEffectRegistry,
} from "./types/index.ts";

// Runtime
export { seedFromString, nextRandom, createRandomAPI } from "./runtime/random.ts";
export type { PRNGState, RandomAPIState } from "./runtime/random.ts";

export {
  makeZoneKey,
  parseZoneKey,
  createEmptyZoneState,
  initializeZoneState,
  getCardsInZone,
  getCardCount,
  getTopCard,
  getBottomCard,
  getCardZone,
  getCardOwner,
  getCardController,
  isOrdered,
  moveCardInState,
  removeCardFromState,
  assertZoneConfigured,
  getZoneVisibility,
  stripZoneStateForViewer,
  ensureSummary,
  syncSummary,
  removeCardFromCurrentZone,
  addCardToZone,
} from "./runtime/zones.ts";

export { ReplayBuilder, ReplayEngine, ReplayExporter } from "./runtime/replay.ts";
export type {
  ReplayCommand,
  ReplaySnapshot,
  ReplayData,
  ReplayEngineOptions,
  CreateRuntimeFn,
} from "./runtime/replay.ts";

// Targeting runtime
export {
  resolveRelativeOwner,
  compareValues,
  evaluateAttributePredicate,
  normalizeBounds,
  evaluateCoreTargetExpression,
  buildTargetResult,
  buildTargetProjection,
} from "./runtime/targeting.ts";

// Conditions runtime
export {
  evaluateCoreCondition,
  evaluateNumericCondition,
  evaluateStringCondition,
} from "./runtime/conditions.ts";

// Effects runtime
export {
  resolvePrimitiveValue,
  runSequence,
  runParallel,
  runConditional,
  runRepeat,
  suspendForChoice,
  runEffectNode,
} from "./runtime/effects.ts";

// Abilities runtime
export {
  sortTriggerQueue,
  removeTriggerById,
  isLimitConsumed,
  consumeLimit,
  clearLimitsForTurn,
  clearAllLimits,
  isSelectableBinding,
  buildBindingChoice,
  buildOptionalChoice,
  buildChooseChoice,
} from "./runtime/abilities.ts";
