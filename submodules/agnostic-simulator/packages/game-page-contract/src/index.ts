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
  MatchPageData,
  MatchResolution,
  PracticeConfig,
  PracticeCreatedResponse,
  PracticeTicketResponse,
  RealtimeAccess,
  UserSettings,
  ViewerSeat,
} from "./page-data.js";
export {
  AnimationSpeedSchema,
  CardPreviewModeSchema,
  CyberpunkGameSettingsSchema,
  GameSettingsMapSchema,
  GameVisualSettingsSchema,
  HotkeyModeSchema,
  LorcanaGameSettingsSchema,
  PlayerSettingsSchema,
  SettingsGameSlugSchema,
  UserSettingsSchema as CanonicalUserSettingsSchema,
  settingsForGame,
} from "./settings.js";
export type {
  GameSettings,
  GameSettingsMap,
  GameVisualSettings,
  PlayerSettings,
  SettingsGameSlug,
  UserSettings as CanonicalUserSettings,
} from "./settings.js";

export type {
  AnimationCue,
  ClientMsg,
  GameLogEntry,
  MoveRecord,
  MoveRejectedCode,
  ServerMsg,
} from "./ws.js";

export type {
  ReplayChatMessage,
  ReplayFile,
  ReplayFileVersion,
  ReplayMetadata,
  ReplayStep,
  ReplaySummary,
} from "./replay.js";
export { REPLAY_FILE_VERSION } from "./replay.js";

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
export { createLiveMatchSession } from "./live-match-session.js";

export { decodeDeckFromUrlParam, encodeDeckToUrlParam } from "./deck-codec.js";

export {
  AnimationCueSchema,
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
  MatchPageDataSchema,
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
  ReplayChatMessageSchema,
  ReplayFileSchema,
  ReplayMetadataSchema,
  ReplayStepSchema,
  ReplaySummarySchema,
  ServerMsgSchema,
  SimulatorConnectionDiagnosticSchema,
  UserSettingsSchema,
} from "./schemas.js";
