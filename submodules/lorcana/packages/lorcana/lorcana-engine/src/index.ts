/**
 * @tcg/lorcana-engine - Disney Lorcana TCG Engine
 *
 * A complete implementation of Disney Lorcana using the @tcg/core MatchRuntime architecture.
 *
 * Key Concepts:
 * - MatchState<G> = { G, ctx } pattern
 * - ctx.framework.zones: First-class zone runtime state
 * - ctx.framework.time: Passive time management
 * - MoveDefinition with validate/execute/available
 * - MatchRuntime for deterministic state transitions
 */

// ============================================================================
// Core Runtime Types (from @tcg/core)
// ============================================================================

export type { LorcanaEngineBase } from "./lorcana-engine-base";

export type {
  CardCatalog,
  CardsMaps,
  CommandFailure,
  DeepReadonly,
  EngineMoveHistoryEntry,
  EngineMoveId,
  EnginePacketUpdate,
  ProtocolError,
  EnginePendingEffectProjection,
  MatchRuntime,
  MatchRuntimeConfig,
  MatchState,
  MatchStaticResources,
  MoveDefinition,
  Player,
  RuntimeFlowDefinition,
  RuntimePhaseDefinition,
  CommandEnvelope,
  CommandResult,
  PublishedGameEvent,
  ZoneConfig,
  ZoneOperationsAPI,
} from "#core";
export {
  createCardsMapsFromStaticResources,
  createEmptyMatchStaticResources,
  createMatchStaticResourcesFromCardsMaps,
  createGameId,
  createPlayerId,
  createRecordCardCatalog,
  createRecordCardInstanceRegistry,
} from "#core";

// ============================================================================
// Runtime Engine
// ============================================================================

export { LorcanaClient, createLorcanaClient } from "./lorcana-client";
export { LorcanaServer, createLorcanaServerGame } from "./lorcana-server";
export {
  AUTOMATED_ACTION_STRATEGIES,
  AGGRESSIVE_BOARD_CONTROL_LORE_RACE_STRATEGY_ID,
  BEST_AI_CARD_PROFILES,
  BEST_AI_DECK_DOSSIERS,
  BOARD_CONTROL_LORE_RACE_STRATEGY_ID,
  BEST_DECK_AWARE_LORE_RACE_STRATEGY_ID,
  BEST_DECK_AWARE_ORACLE_LORE_RACE_STRATEGY_ID,
  CHALLENGE_ONLY_TEST_STRATEGY_ID,
  DECK_AWARE_LORE_RACE_STRATEGY_ID,
  DEFAULT_AUTOMATED_ACTION_STRATEGY_ID,
  aggressiveBoardControlLoreRaceAutomatedActionStrategy,
  bestDeckAwareLoreRaceAutomatedActionStrategy,
  bestDeckAwareOracleLoreRaceAutomatedActionStrategy,
  boardControlLoreRaceAutomatedActionStrategy,
  buildBestAiMatchupWeightReport,
  buildBestAiMatchupWeightReportMarkdown,
  challengeOnlyTestAutomatedActionStrategy,
  computeAutomatedActionStateFingerprint,
  createAutomatedActionBoardSnapshot,
  deckAwareLoreRaceAutomatedActionStrategy,
  defaultLoreRaceAutomatedActionStrategy,
  getAutomatedActionStrategyOption,
  getSafeAutomatedActionStrategyOption,
  legacyLoreRaceAutomatedActionStrategy,
  QUEST_ONLY_TEST_STRATEGY_ID,
  questOnlyTestAutomatedActionStrategy,
} from "./automation";
export type { AutomatedActionCandidateSummary, AutomatedActionStrategyOption } from "./automation";
export type {
  AcceptedMoveRecord,
  EngineLogRecord,
  MoveHistorySourceAuthority,
} from "./history-records";
export {
  createAcceptedMoveRecord,
  createEngineLogRecord,
  createSyntheticProcessedCommand,
} from "./history-records";

export type {
  ChallengePreviewResult,
  PlayCardCostInput,
  PlayCardExecutionOptions,
  PlayCardDestinationInput,
  ResolutionExecutionOptions,
} from "./lorcana-engine-base";

export type {
  PlayCardDisabledReason,
  PlayCardDisabledReasonCode,
} from "./play-card-disabled-reason";
export {
  KNOWN_PLAY_CARD_DISABLED_REASON_CODES,
  assertNeverPlayCardDisabledReason,
} from "./play-card-disabled-reason";

export type {
  AvailableMove,
  AvailableMoveId,
  MoveOption,
  MoveOptionTarget,
  MoveOptionAbility,
  MoveOptionSelectableCost,
  MoveOptionSelectableCostKind,
  EffectTargetInfo,
} from "./available-moves";
export type {
  LorcanaEngineDeckEntry,
  LorcanaEnginePlayerInfo,
  LorcanaEngineInit,
} from "./lorcana-server";

// ============================================================================
// Production Serialization Helpers
// ============================================================================

export {
  getLorcanaServerAuthoritativeState,
  getLorcanaServerAuthoritativeSnapshot,
  loadLorcanaServerAuthoritativeState,
  loadLorcanaServerAuthoritativeSnapshot,
} from "./serialization";
export type {
  LorcanaServerAuthoritativeSnapshot,
  LorcanaUndoStackEntrySnapshot,
} from "./serialization";

// ============================================================================
// Runtime Game Definition
// ============================================================================

export { lorcanaRuntimeConfig } from "./runtime-game";

// ============================================================================
// Zone Configurations
// ============================================================================

export {
  getZoneConfig,
  isLorcanaZoneId,
  isPrivateZone,
  isPublicZone,
  isSecretZone,
  lorcanaRuntimeZones,
} from "./zones";

export type { LorcanaZoneId } from "./zones";

// ============================================================================
// Runtime Moves
// ============================================================================

export {
  alterHand,
  challenge,
  chooseWhoGoesFirst,
  concede,
  lorcanaRuntimeMoves,
  passTurn,
  playCard,
  putCardIntoInkwell,
  quest,
} from "./runtime-moves";

// ============================================================================
// Move Metadata Registry
// ============================================================================

export {
  LORCANA_MOVE_REGISTRY,
  formatMoveLog,
  getMoveHotkey,
  getMoveLabel,
  getMoveMetadata,
} from "./move-metadata-registry";

export type { CardNameLookup, MoveMetadata } from "./move-metadata-registry";

// ============================================================================
// Card Utilities
// ============================================================================

export {
  canInk,
  canQuest,
  cardHasName,
  getAllKeywords,
  getAmpersandNames,
  getCardNameVariants,
  getLoreValue,
  getMoveCost,
  getShiftCost,
  getShiftTargetName,
  getStrength,
  getTotalKeyword,
  getWillpower,
  hasAmpersandName,
  hasBodyguard,
  hasMayEnterPlayExertedOption,
  hasEvasive,
  hasKeyword,
  hasReckless,
  hasRush,
  hasSameName,
  hasShift,
  hasVanish,
  hasWard,
  isAction,
  isCharacter,
  isItem,
  isLocation,
  isSong,
} from "./card-utils";

// ============================================================================
// Targeting DSL
// ============================================================================

export * from "./targeting";

// ============================================================================
// Time Control
// ============================================================================

export {
  checkTimeout,
  settleClocks,
  getActivePlayerDecisionMs,
  resetPlayerTimeAfterSkip,
  DEFAULT_DYNAMIC_CLOCK_CONFIG,
} from "./core/runtime/time-control";
export type { ChessClockContext, DynamicClockContext } from "#core";

export { deriveClockView, formatClockTime } from "./core/runtime/clock-view";
export type { ClockSnapshot, ClockView, DeriveClockViewOptions } from "./core/runtime/clock-view";

export {
  createInMemoryTransportPair,
  type InMemoryTransport,
  type InMemoryTransportPair,
  type Transport,
  type ClientMessage,
  type ServerMessage,
  type ConnectionState,
  type ErrorCode,
} from "#core";

// ============================================================================
// Types
// ============================================================================

export * from "./types";

export type { LorcanaCardDerived } from "./types/projected-board";
