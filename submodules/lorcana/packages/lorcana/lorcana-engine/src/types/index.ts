/**
 * Lorcana Type Definitions
 *
 * Runtime types for the MatchRuntime architecture.
 */

// Re-export from lorcana-types (card definitions, abilities, etc.)
export type {
  ActivatedAbility,
  AbilityDefinition,
  ActionAbilityDefinition,
  ActionCard,
  ActionSubtype,
  ActivatedAbilityDefinition,
  BaseAbilityDefinition,
  BaseCardProperties,
  CardType,
  CharacterCard,
  Classification,
  DeckStats,
  DeckValidationError,
  DeckValidationResult,
  InkType,
  ItemCard,
  KeywordAbility,
  KeywordAbilityDefinition,
  LocationCard,
  LorcanaCard,
  LorcanaCardDefinition,
  ChoiceEffect,
  OrEffect,
  OptionalEffect,
  // Note: Not exporting LorcanaPhase, PermanentState, TurnMetadata to avoid conflicts
  // Use the runtime versions from ./runtime-state instead
  ReplacementAbilityDefinition,
  SequenceEffect,
  StaticAbilityDefinition,
  TooFewCardsError,
  TooManyCopiesError,
  TooManyInkTypesError,
  TriggeredAbility,
  TriggeredAbilityDefinition,
} from "@tcg/lorcana-types";

export {
  CARD_TYPES,
  CLASSIFICATIONS,
  getFullName,
  getInkTypes,
  INK_COLORS,
  INK_TYPES,
  isActionCard,
  isCardType,
  isCharacterCard,
  isClassification,
  isDreamborn,
  isDualInk,
  isFloodborn,
  isItemCard,
  isLocationCard,
  isStoryborn,
  isValidInkType,
  MAX_COPIES_PER_CARD,
  MAX_INK_TYPES,
  MIN_DECK_SIZE,
} from "@tcg/lorcana-types";

// Branded types from @tcg/lorcana-types
export type { CardInstanceId, GameId, PlayerId, ZoneId } from "@tcg/lorcana-types";

// RUNTIME TYPES (new MatchRuntime architecture)
export type {
  DelayedTriggerTiming,
  DelayedTriggerWindow,
  BagEffectEntry,
  BagState,
  BufferedTriggeredEvent,
  ChallengeState,
  ContinuousEffectInstance,
  ContinuousEffectState,
  ContinuousEffectStat,
  LorcanaCardMeta,
  LorcanaG,
  LorcanaMatchState,
  LorcanaPhase,
  LorcanaStep,
  PendingActionEffect,
  PendingActionEffectContinuation,
  PendingActionEffectKind,
  PendingActionResolutionInput,
  PendingTriggeredEvent,
  PendingTurnTransitionStage,
  PendingTurnTransitionState,
  ReplacementEffectsState,
  ReplacementRegistration,
  ReplacementTriggerContext,
  ReplacementUsageLedger,
  TriggerRegistration,
  TriggerRegistrationAbility,
  TriggerRegistrationLifecycle,
  TriggeredEventCandidate,
  TriggeredAbilitiesState,
  TriggeredAbilitiesUsageLedger,
  StatModifierContinuousEffectInstance,
  MatchState,
  TemporaryGrantedAbilityPayload,
  TemporaryRestrictionPayload,
  TemporaryKeywordPayload,
  TemporaryPlayerRestrictionPayload,
  TemporaryPlayerRestrictionsState,
  TurnMetadata,
} from "./runtime-state";

export { createDefaultCardMeta, createInitialLorcanaG } from "./runtime-state";

export type {
  ChoiceResolutionSelectionContext,
  NameCardResolutionSelectionContext,
  OptionalResolutionSelectionContext,
  ResolutionSelectionContext,
  ResolutionSelectionCurrentSelection,
  ResolutionSelectionDestination,
  ResolutionSelectionDestinationRule,
  ResolutionSelectionKind,
  ResolutionSelectionOption,
  ResolutionSelectionOrigin,
  ResolutionSelectionRevealedCard,
  ResolutionSelectionSubmitField,
  ResolutionSelectionZone,
  ScryResolutionSelectionContext,
  TargetResolutionSelectionContext,
} from "./resolution-selection";

export type {
  LorcanaRuntimeMoveInputs,
  LorcanaRuntimeMoveParams,
  PlayCardCost,
  LorcanaMoveDefinition,
} from "./runtime-move-params";

// CLIENT RUNTIME TYPES
export type {
  LorcanaMoveComposeResult,
  LorcanaMoveRequestExecution,
  LorcanaMoveRequestValidation,
  SetupMoveId,
} from "./runtime-client-types";
export type {
  CardInput,
  LorcanaDynamicCard,
  LorcanaRuntimeCard,
  LorcanaStaticCard,
} from "./card-representation";
export { cardRef } from "./card-representation";
export type {
  LorcanaBoardZoneId,
  LorcanaProjectedBoardView,
  LorcanaProjectedBagEffect,
  LorcanaProjectedCard,
  LorcanaProjectedCardId,
  LorcanaProjectedPendingEffect,
  LorcanaProjectedPendingChoice,
  LorcanaProjectedPlayerBoard,
  LorcanaProjectedTimerView,
  ProjectedKeywordValues,
  ProjectedLorcanaCardDerived,
} from "./projected-board";

// DOMAIN EVENTS
export type {
  CardExertedPayload,
  CardReadiedPayload,
  AllCardsReadiedPayload,
  DamageDealtPayload,
  CardMovedPayload,
  CardBanishedPayload,
  InkChangedPayload,
  LoreChangedPayload,
  QuestCompletedPayload,
  CardsDrawnPayload,
  TurnPassedPayload,
  CardPlayedPayload,
  QuestedPayload,
  ChallengedPayload,
  FirstPlayerChosenPayload,
  HandAlteredPayload,
  CardInkedPayload,
  DeckShuffledPayload,
  ZoneBottomShuffledPayload,
  DynamicAmountEventSnapshot,
  LorcanaDomainEventMap,
  LorcanaDomainEvent,
  LorcanaDomainEventType,
  LorcanaDomainEventPayload,
} from "./domain-events";

export { createLorcanaDomainEvent, emitLorcanaDomainEvent } from "./domain-events";

// LOG MESSAGES
export type {
  FirstPlayerChosenLogValues,
  SetupMulliganCountLogValues,
  SetupMulliganDetailLogValues,
  ScryCountLogValues,
  ScryDetailLogValues,
  LorcanaLogMessageMap,
  LorcanaLogMessageKey,
  LorcanaLogMessage,
  LorcanaParaglideMessageKey,
  LorcanaGameLogEntry,
  LorcanaGameLogEntryCategory,
  LorcanaLogProjection,
  LogTargetId,
  ResolveBagCancelledCause,
  ScryDestinationEntry,
} from "./log-messages";

export {
  createLorcanaLogMessage,
  createLorcanaGameLogEntry,
  createLorcanaLogProjection,
  LORCANA_LOG_TRANSLATION_KEYS,
  LORCANA_LOG_TRANSLATION_VALUE_KEYS,
} from "./log-messages";

// MOVE LOG (new unified type system)
export type {
  LegacyFlatMoveLog,
  MoveLog,
  MoveLogType,
  MoveOutcomes,
  DamageEntry,
  MovedDamageEntry,
} from "./move-log";

export type {
  AutomatedActionAmount,
  AutomatedActionAuthoritativeHints,
  AutomatedActionBoardSnapshot,
  AutomatedActionCandidate,
  AutomatedActionCandidateContributor,
  AutomatedActionCandidateHeuristic,
  AutomatedActionCandidateSummary,
  AutomatedActionCostSelections,
  AutomatedActionDecisionTrace,
  AutomatedActionDecisionTraceExecutionAttempt,
  AutomatedActionDecisionTraceFinalResult,
  AutomatedActionDiagnostic,
  AutomatedActionDiagnosticSink,
  AutomatedActionEffectSupport,
  AutomatedActionEnumerationOptions,
  AutomatedActionEnumerationResult,
  AutomatedActionExecutionAttempt,
  AutomatedActionExecutionOptions,
  AutomatedActionExecutionResult,
  AutomatedActionFamily,
  AutomatedActionFallback,
  AutomatedActionOpponentKnowledgeSource,
  AutomatedActionPlanningContext,
  AutomatedActionResolutionShape,
  AutomatedActionResolutionVariant,
  AutomatedActionSearchCaps,
  AutomatedActionStrategy,
  AutomatedActionStrategyTag,
  AutomatedActionTargetId,
  AutomatedActionTraceHeuristicValue,
  AutomatedActionTraceSink,
  StrategyAxis,
  StrategyInformationPolicy,
} from "../automation/types";

export {
  DEFAULT_AUTOMATED_ACTION_MAX_EXECUTION_FAILURES,
  DEFAULT_AUTOMATED_ACTION_SEARCH_CAPS,
} from "../automation/types";
