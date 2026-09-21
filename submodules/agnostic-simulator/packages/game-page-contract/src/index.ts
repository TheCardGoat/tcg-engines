export { GAME_TYPES } from "./ids.js";
export {
  MatchSessionSchema,
  liveGameFromSession,
  sessionGameId,
  acceptSession,
} from "./session.js";
export type { MatchSession } from "./session.js";
export type {
  GameType,
  MatchId,
  GameId,
  PlayerId,
  InstanceId,
  PublicCardId,
  MoveId,
} from "./ids.js";

export type { CardsMaps } from "./cards.js";
export type { JsonPatch, JsonPatchOp } from "./json-patch.js";

export type {
  MatchInfo,
  MatchStatus,
  MatchType,
  Participant,
  ParticipantVisualSettings,
} from "./match.js";

export type { ClockSnapshot, GameSnapshot } from "./snapshot.js";

export type {
  LiveMatchBootstrapV1,
  LiveMatchCapabilities,
  LiveMatchHistory,
  LiveMatchPresence,
  MatchResolution,
  PracticeConfig,
  PracticeCreatedResponse,
  PracticeTicketResponse,
  RealtimeAccess,
  ReplayAccess,
  ResolvedMatchViewer,
  ScopedRealtimeAccess,
  SpectatorAccess,
  UserSettings,
  ViewerPermissions,
  ViewerProjectedGameState,
  ViewerSeat,
} from "./page-data.js";
export {
  AnimationSpeedSchema,
  CardPreviewModeSchema,
  CyberpunkGameSettingsSchema,
  DEFAULT_FAB_PRIORITY_MODE,
  DEFAULT_FAB_COUNTDOWN_SPEED,
  DEFAULT_FAB_AUTO_SELECT_SINGLETON_TARGETS,
  FAB_COUNTDOWN_SPEED_MS,
  FAB_COUNTDOWN_SPEED_STORAGE_KEY,
  FAB_AUTO_SELECT_SINGLETON_TARGETS_STORAGE_KEY,
  FAB_PRIORITY_MODE_STORAGE_KEY,
  FabCountdownSpeedSchema,
  FabPriorityModeSchema,
  GameSettingsMapSchema,
  GameVisualSettingsSchema,
  GundamGameSettingsSchema,
  HotkeyModeSchema,
  LorcanaGameSettingsSchema,
  PlayerSettingsSchema,
  SettingsGameSlugSchema,
  UserSettingsSchema as CanonicalUserSettingsSchema,
  settingsForGame,
} from "./settings.js";
export type {
  FabCountdownSpeed,
  FabPriorityMode,
  GameSettings,
  GameSettingsMap,
  GameVisualSettings,
  PlayerSettings,
  SettingsGameSlug,
  UserSettings as CanonicalUserSettings,
} from "./settings.js";

export type { ClientMsg, GameLogEntry, MoveRecord, MoveRejectedCode, ServerMsg } from "./ws.js";

export type {
  ReplayCheckpoint,
  ReplayFile,
  ReplayFileVersion,
  ReplayMetadata,
  ReplayStep,
  ReplaySummary,
  ReplayPlaybackV1,
  ReplayAvailability,
  ReplayCloudSaveStatus,
  ReplayTrust,
} from "./replay.js";
export { REPLAY_FILE_VERSION } from "./replay.js";
export {
  applyReplayPatch,
  materializeReplayFrameAtCursor,
  materializeReplayStateAtCursor,
} from "./replay-materializer.js";
export {
  clientAuthorityPushedVersionOffset,
  describeLiveMatchServerFeedback,
  initialClientAuthorityLastPushedVersion,
  MATCH_RELOAD_FEEDBACK,
  resolveClientAuthorityStaleRejection,
  shouldAutoSyncFromServerCode,
  shouldToastClientAuthorityRejection,
} from "./live-match-recovery.js";
export type { ClientAuthorityStaleResolution } from "./live-match-recovery.js";

export type {
  SimulatorDebugExportDomainEventV1,
  SimulatorDebugExportBuildMetadata,
  SimulatorDebugExportEnvironment,
  SimulatorDebugExportMoveV1,
  SimulatorDebugExportRangeRequest,
  SimulatorDebugReplayAuditStep,
  SimulatorDebugExportV1,
  SimulatorDebugExportWarningV1,
} from "./debug-export.js";
export {
  SIMULATOR_DEBUG_EXPORT_VERSION,
  SimulatorDebugExportRangeError,
  SimulatorDebugExportDomainEventV1Schema,
  SimulatorDebugExportMoveV1Schema,
  SimulatorDebugExportV1Schema,
  SimulatorDebugExportWarningV1Schema,
  buildSimulatorDebugExportFromReplay,
  stringifySimulatorDebugExport,
} from "./debug-export.js";

export type {
  ConnectionDiagnosticEvent,
  ConnectionEndpointDiagnostic,
  PlayerPresenceDiagnostic,
  SimulatorConnectionDiagnostic,
  SimulatorConnectionDiagnosticInput,
  SimulatorConnectionStatus,
} from "./connection-diagnostic.js";
export {
  buildSimulatorConnectionDiagnostic,
  redactsSimulatorConnectionDiagnostic,
  SIMULATOR_CONNECTION_DIAGNOSTIC_VERSION,
  stringifySimulatorConnectionDiagnostic,
} from "./connection-diagnostic.js";

export type {
  LiveMatchSession,
  LiveMatchSessionConfig,
  LiveMatchSessionState,
  NormalizedPresenceChange,
} from "./live-match-session.js";
export { createLiveMatchSession, LIVE_MATCH_HEARTBEAT_INTERVAL_MS } from "./live-match-session.js";
export {
  canEmitLiveMatchWrite,
  canEmitLiveMatchWriteFromHandle,
  describeLiveMatchWriteGate,
  LIVE_MATCH_OLDER_BOARD_FEEDBACK,
  LIVE_MATCH_SYNCING_BOARD_COPY,
  shouldShowLiveBoardSyncing,
} from "./live-match-write.js";
export type { LiveMatchWriteGate, LiveMatchWriteGateReason } from "./live-match-write.js";
export type {
  CompletedHeartbeatProbe,
  HeartbeatProbeFields,
  HeartbeatProbeTracker,
} from "./heartbeat-probe.js";
export {
  createHeartbeatProbeId,
  createHeartbeatProbeTracker,
  MAX_HEARTBEAT_ROUND_TRIP_MS,
  MAX_QUEUED_HEARTBEAT_PROBES,
} from "./heartbeat-probe.js";

export { decodeDeckFromUrlParam, encodeDeckToUrlParam } from "./deck-codec.js";
export type {
  DeckDocument,
  DeckDocumentCardV2,
  DeckDocumentDecodeOptions,
  DeckDocumentDecodeResult,
  DeckDocumentDiagnostic,
  DeckDocumentEncodeResult,
  DeckDocumentEntryV1,
  DeckDocumentEntryV2,
  DeckDocumentFlatEntry,
  DeckDocumentJsonObject,
  DeckDocumentJsonValue,
  DeckDocumentPrintingAllocationV2,
  DeckDocumentSectionV1,
  DeckDocumentV1,
  DeckDocumentV2,
} from "./deck-document.js";
export {
  DECK_DOCUMENT_SCHEMA_VERSION,
  DECK_DOCUMENT_SUPPORTED_SCHEMA_VERSIONS,
  DECK_DOCUMENT_V1_SCHEMA_VERSION,
  decodeDeckDocumentFromUrlParam,
  encodeDeckDocumentToUrlParam,
  parseDeckDocument,
} from "./deck-document.js";
export {
  decodeDeckDocumentFromJson,
  encodeDeckDocumentToCanonicalJson,
} from "./deck-document-json.js";
export type {
  DeckLegalityCardIdentityV1,
  DeckLegalityPolicySourceV1,
  DeckLegalityReportParseResult,
  DeckLegalityReportV1,
  DeckLegalityUnresolvedExceptionV1,
  DeckLegalityViolationV1,
} from "./deck-legality-report.js";
export {
  DECK_LEGALITY_REPORT_SCHEMA_VERSION,
  decodeDeckLegalityReportFromJson,
  encodeDeckLegalityReportToJson,
  parseDeckLegalityReport,
} from "./deck-legality-report.js";

export {
  CardsMapsSchema,
  ClientMsgSchema,
  ConnectionDiagnosticEventSchema,
  ConnectionEndpointDiagnosticSchema,
  ClockSnapshotSchema,
  GameLogEntrySchema,
  GameSnapshotSchema,
  GameTypeSchema,
  JsonPatchOpSchema,
  JsonPatchSchema,
  MatchInfoSchema,
  LiveMatchBootstrapV1Schema,
  LiveMatchCapabilitiesSchema,
  LiveMatchHistorySchema,
  LiveMatchPresenceSchema,
  MatchResolutionSchema,
  MatchStatusSchema,
  MatchTypeSchema,
  MoveRecordSchema,
  MoveRejectedCodeSchema,
  ParticipantSchema,
  ParticipantVisualSettingsSchema,
  PlayerPresenceDiagnosticSchema,
  PracticeBotSchema,
  PracticeConfigSchema,
  PracticeCreatedResponseSchema,
  PracticeRequestSchema,
  PracticeTicketResponseSchema,
  RealtimeAccessSchema,
  ReplayAccessSchema,
  ResolvedMatchViewerSchema,
  ScopedRealtimeAccessSchema,
  SpectatorAccessSchema,
  ReplayCheckpointSchema,
  ReplayFileSchema,
  ReplayMetadataSchema,
  ReplayStepSchema,
  ReplaySummarySchema,
  ReplayPlaybackV1Schema,
  ReplayAvailabilitySchema,
  ReplayTrustSchema,
  ServerMsgSchema,
  SimulatorConnectionDiagnosticSchema,
  UserSettingsSchema,
  ViewerPermissionsSchema,
  ViewerProjectedGameStateSchema,
} from "./schemas.js";
export { MatchPreparationSchema, type MatchPreparation } from "./preparation.js";

export * from "@tcg/protocol/presentation";

export { replayStepPosition } from "./replay.js";
export type { ReplayReversal } from "./replay.js";
