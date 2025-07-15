// Lobby engine core exports

export type {
  EventBus,
  EventHandler,
  LobbyEvent,
} from "./lobby-engine/event-bus";
// Event bus
export { LightweightEventBus } from "./lobby-engine/event-bus";
export { createLobbyEngine } from "./lobby-engine/lobby-engine";
// Lobby engine types
export type {
  CombinedLobbyState,
  EventType,
  LobbyContext,
  LobbyEngine,
  LobbyOptions,
  LobbyPlayer,
  LobbyState,
  PairingType,
  Plugin as LobbyEnginePlugin,
  StatusType,
} from "./lobby-engine/lobby-engine-types";
// Lobby message types
export type {
  LobbyCreatedMessage,
  LobbyCreateMessage,
  LobbyFailedMessage,
  LobbyForceSyncMessage,
  LobbyJoinMessage,
  LobbyLeaveMessage,
  LobbyMessage,
  LobbyMessageHandler,
  LobbyMessageType,
  LobbyPlayerJoinedMessage,
  LobbyPlayerLeftMessage,
  LobbyPlayerReadyMessage,
  LobbyReadyMessage,
  LobbyStatusMessage,
} from "./lobby-engine/lobby-messages-type";

// Side effects adapter
export type {
  SideEffectsAdapter,
  TransportMessage,
} from "./lobby-engine/side-effects-adapter";

// Shared utilities
export { exhaustiveCheck } from "./shared/exhaustiveCheck";
export type { EngineLogger } from "./shared/logger";
