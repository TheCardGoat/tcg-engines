/**
 * @tcg/core Runtime
 *
 * New runtime architecture per PLAN.md
 *
 * This module implements the boardgame.io-style MatchState = { G, ctx }
 * architecture with:
 * - ctx.zones: First-class zone runtime state
 * - ctx.time: Passive time management (chess + priority clocks)
 * - ctx.priority: TCG priority passing system
 * - _stateID: State versioning for sync
 */

// UI-facing engine contracts
export type {
  EngineActorContext,
  EngineMoveExecutionResult,
  EngineMoveHistoryEntry,
  EngineMoveValidationResult,
  GameEngine,
} from "../engine";

// Types (explicit to avoid re-exporting PlayerId; use root ./types for PlayerId)
export type {
  MatchState,
  TCGCtx,
  CtxStatus,
  CtxPriority,
  ZoneRuntimeState,
  ZoneRuntimeDef,
  PublicZoneSummary,
  ZoneCardIndexEntry,
  TimeContext,
  ClockPauseReason,
  ChessClockContext,
  PriorityClockContext,
  ClockPlayerState,
  ChessClockPlayerState,
  PriorityClockPlayerState,
  DynamicClockPlayerState,
  DynamicClockContext,
  DynamicClockConfig,
  ChessClockConfig,
  PriorityClockConfig,
  TimeControlConfig,
  CtxRandom,
  Role,
  ViewRoleContext,
  CommandEnvelope,
  PacketAnimation,
  MoveInput,
  MoveIntent,
  MoveTargetIntent,
  LogValue,
  EventDataValue,
  EventCause,
  CardFilterRef,
  TriggerMatcher,
  TriggerDescriptor,
  GameEvent,
  PublishedGameEvent,
  LogMessage,
  LogVisibility,
  FilteredMatchView,
  FilteredTCGCtx,
  FilteredZoneRuntimeState,
  FilteredCtxRandom,
  RuntimeValidationResult,
  InitialStatusConfig,
  CreateInitialTCGCtxParams,
} from "./types";
export {
  createInitialTCGCtx,
  isChessClockContext,
  isPriorityClockContext,
  isDynamicClockContext,
  isClockRunning,
} from "./types";
export { DEFAULT_DYNAMIC_CLOCK_CONFIG } from "./time-control";

// Core runtime - explicit exports to avoid duplicate names with flow, game-definition, move-system
export type {
  MatchRuntimeConfig,
  SetupArgs,
  BoardSetupContext,
  MatchRuntimeInit,
  Player,
  MoveDefinition,
  MoveContext,
  MoveRecord,
  RuntimeBoardProjectionContext,
  DeepReadonly,
  RuntimeStateView,
  MoveInputView,
  MoveStateView,
  MoveEnumerationContext,
  MoveValidationContext,
  MoveExecutionContext,
  LogProjectionContext,
  PacketAnimationContext,
  ProjectedLogEntry,
  RuntimeActorRole,
  FrameworkStateSnapshot,
  CardRuntimeReadAPI,
  CardRuntimeAPI,
  FrameworkReadAPI,
  FrameworkWriteAPI,
  RuntimeLifecycleContext,
  RuntimeLifecycleHook,
  RuntimeFlowDefinition,
  RuntimePhaseDefinition,
  ZoneDefinitions,
  ZoneConfig,
  ZoneQueryAPI,
  ZoneMutationAPI,
  TimeOperationsAPI,
  TimeQueryAPI,
  RandomAPI,
  EventAPI,
  QueryAPI,
  CommandResult,
  CommandSuccess,
  CommandFailure,
  RuntimeSnapshot,
} from "./match-runtime";
export { MatchRuntime } from "./match-runtime";

// Private field utilities for field-level privacy
export type { PrivateField } from "./private-field";
export { privateField } from "./private-field";

// Static resources / runtime card resolution
export type {
  CardCatalog,
  CardInstanceRecord,
  CardInstanceRegistry,
  CardsMaps,
  MatchStaticResources,
  StaticResourceRefs,
} from "./static-resources";
export {
  createRecordCardCatalog,
  createRecordCardInstanceRegistry,
  createEmptyMatchStaticResources,
  createMatchStaticResourcesFromCardsMaps,
  createCardsMapsFromStaticResources,
  getStaticResourceRefs,
  validateMatchStaticResources,
} from "./static-resources";
export type {
  BaseCardDefinition,
  BaseCardMeta,
  StaticCard,
  RuntimeCardBase,
  RuntimeCard,
  RuntimeCardWithDefinitionBase,
  RuntimeCardWithDefinition,
  AnyRuntimeCardWithDefinition,
  CardQueryAPI,
  RuntimeCardTargetQuery,
  RuntimeCardDeriveContext,
  RuntimeCardDeriver,
} from "./card-runtime";
export { createCardQueryAPI } from "./card-runtime";
export type {
  DeckEntryInput,
  PlayerDeckInput,
  DeterministicCardInstanceRegistry,
} from "./card-instance-bootstrap";
export { buildDeterministicCardInstanceRegistry } from "./card-instance-bootstrap";
// Zone operations (createZoneOperations omitted to avoid collision with operations/createZoneOperations in main index)
export type { ZoneOperationsAPI, MulliganResult } from "./zone-operations";
export { performMulligan } from "./zone-operations";

// Time control
export * from "./time-control";

// View filtering
export * from "./view-filter";

// Network Protocol (Phase 5)
export type {
  ProtocolEnvelope,
  ClientMessage,
  UpdateActionMessage,
  SyncRequestMessage,
  AckMessage,
  ChatMessage,
  ServerMessage,
  UpdatePatchMessage,
  UpdateFullMessage,
  SyncFullMessage,
  MatchDataMessage,
  ErrorMessage,
  ErrorCode,
  ConnectionState,
  Transport,
  ProtocolValidationResult,
} from "./protocol-types";
export {
  PROTOCOL_VERSION,
  isUpdateActionMessage,
  isSyncRequestMessage,
  isUndoRequestMessage,
  isUpdatePatchMessage,
  isUpdateFullMessage,
  isSyncFullMessage,
  isErrorMessage,
  validateProtocolMessage,
} from "./protocol-types";
export type { CompactMatchView, NetworkMatchData, NetworkMatchView } from "./network-state";
export {
  buildZoneDefsFromConfig,
  compactCoreNetworkView,
  normalizeNetworkView,
} from "./network-state";

// WebSocket Transport (Phase 5)
export type { WebSocketTransportConfig, ServerWebSocketConfig } from "./websocket-transport";
export { WebSocketTransport, createWebSocketServer } from "./websocket-transport";

// In-Memory Transport (Phase 5)
export type {
  BrowserTransportConfig,
  BrowserTransportLatencyModel,
  BrowserTransportMode,
  InMemoryTransportPair,
  InMemoryTransportScheduler,
  InMemoryTransportScheduledTask,
  NormalizedBrowserTransportConfig,
} from "./in-memory-transport";
export {
  InMemoryTransport,
  ManualInMemoryTransportScheduler,
  createInMemoryTransportPair,
  normalizeBrowserTransportConfig,
} from "./in-memory-transport";

// Persistence (Phase 6)
export type {
  MatchConfig,
  ReplayStepEntry,
  MatchSnapshot,
  MatchMetadata,
  MatchReplayData,
  ReplayExportOptions,
  AuditLogEntry,
  PersistenceAdapter,
  MatchListFilters,
} from "./persistence";
export { InMemoryPersistence, PersistenceManager } from "./persistence";

// Replay (Phase 6)
export type {
  ReplayState,
  ReplayStep,
  ReplayExport,
  ReplayBuilderConfig,
  ReplayEngineOptions,
  ReplayValidationResult,
} from "./replay";
export { ReplayEngine, ReplayBuilder, ReplayExporter, ReplayValidator } from "./replay";

// Auth (Phase 6)
export type {
  Credentials,
  AuthContext,
  AuthResult,
  AuthErrorCode,
  AccessPolicy,
  AuthProvider,
  AuditEvent,
} from "./auth";
export { SimpleAuthProvider, AuthService, AccessControl, AuditLogger } from "./auth";

// Security (Phase 8)
export type { SecurityPolicy, SecurityCheckResult, RateLimitEntry } from "./security";
export {
  DEFAULT_SECURITY_POLICY,
  InputValidator,
  RateLimiter,
  StateSanitizer,
  SecurityManager,
} from "./security";

// MultiplayerEngine - Server-side game engine
export type {
  EnginePlayer,
  EngineMovePayload,
  EngineMoveResult,
  GameEndResult,
  EngineHistoryEntry,
  MultiplayerEngineOptions,
  MultiplayerGameDefinition,
} from "./multiplayer-engine";
export { MultiplayerEngine } from "./multiplayer-engine";

// Serialization Contract
export {
  SERIALIZATION_FORMAT_VERSION,
  validateSerializedMatchState,
  isSerializationVersionSupported,
  createSerializedMatchState,
  extractSerializedStateMetadata,
  isSerializableEngine,
  getMultiplayerEngineAuthoritativeState,
  loadMultiplayerEngineAuthoritativeState,
  migrateSerializedState,
  registerStateMigration,
} from "./serialization";
export type {
  SerializedMatchState,
  SerializedStateMetadata,
  SerializableEngine,
  RuntimeRestoreConfig,
  StateRestoreResult,
  StateRestoreError,
  RestoreResult,
  StateMigration,
} from "./serialization";
