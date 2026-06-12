import type {
  CommandEnvelope,
  MatchState,
  PacketAnimation,
  PublishedGameEvent,
  Role,
} from "./types";
import type { NetworkMatchData } from "./network-state";

// =============================================================================
// Protocol Version
// =============================================================================

export const PROTOCOL_VERSION = 5;

// =============================================================================
// Common Envelope
// =============================================================================

export interface ProtocolEnvelope {
  protocolVersion: number;
  matchID: string;
  role?: Role;
  playerID?: string | null;
  credentials?: string;
  timestampMs?: number;
}

// =============================================================================
// Client -> Server Messages
// =============================================================================

export type ClientMessage =
  | UpdateActionMessage
  | SyncRequestMessage
  | AckMessage
  | ChatMessage
  | UndoRequestMessage;

export interface UpdateActionMessage extends ProtocolEnvelope {
  type: "UPDATE_ACTION";
  prevStateID: number;
  command: CommandEnvelope;
}

export interface SyncRequestMessage extends ProtocolEnvelope {
  type: "SYNC_REQUEST";
  lastKnownStateID?: number;
  lastKnownLogSeq?: number;
}

export interface AckMessage extends ProtocolEnvelope {
  type: "ACK";
  acknowledgedStateID: number;
}

export interface ChatMessage extends ProtocolEnvelope {
  type: "CHAT";
  message: string;
}

export interface UndoRequestMessage extends ProtocolEnvelope {
  type: "UNDO_REQUEST";
  prevStateID: number;
  commandID?: string;
}

// =============================================================================
// Server -> Client Messages
// =============================================================================

export type ServerMessage =
  | UpdatePatchMessage
  | UpdateFullMessage
  | SyncFullMessage
  | MatchDataMessage
  | ErrorMessage
  | ChatMessage;

export interface UpdatePatchMessage extends ProtocolEnvelope {
  type: "UPDATE_PATCH";
  prevStateID: number;
  stateID: number;
  canUndo: boolean;
  patchFormat: "immer" | "rfc6902";
  patchOps: unknown[];
  processedCommand: CommandEnvelope;
  animations: PacketAnimation[];
  deltalogDelta?: unknown[];
  gameEventsDelta?: PublishedGameEvent[];
}

export interface UpdateFullMessage extends ProtocolEnvelope {
  type: "UPDATE_FULL";
  stateID: number;
  canUndo: boolean;
  state: MatchState;
  processedCommand: CommandEnvelope;
  animations: PacketAnimation[];
  deltalogDelta?: unknown[];
  gameEventsDelta?: PublishedGameEvent[];
  reason?: "PATCH_DISABLED" | "FILTERING_FALLBACK" | "STALE_STATE";
}

export interface SyncFullMessage extends ProtocolEnvelope {
  type: "SYNC_FULL";
  stateID: number;
  canUndo: boolean;
  state: MatchState;
  deltalogDelta?: unknown[];
  gameEventsDelta?: PublishedGameEvent[];
  matchData?: NetworkMatchData;
}

export interface MatchDataMessage extends ProtocolEnvelope {
  type: "MATCH_DATA";
  data: Record<string, unknown>;
}

export type ErrorCode =
  | "STALE_STATE"
  | "AUTH_FAILED"
  | "INVALID_MOVE"
  | "PATCH_APPLY_FAILED"
  | "FORBIDDEN"
  | "MATCH_NOT_FOUND"
  | "PLAYER_NOT_IN_MATCH"
  | "RATE_LIMITED"
  | "INTERNAL_ERROR"
  | "UNKNOWN";

export interface ErrorMessage extends ProtocolEnvelope {
  type: "ERROR";
  code: ErrorCode;
  message: string;
  currentStateID?: number;
  resyncRequired?: boolean;
  details?: Record<string, unknown>;
}

// =============================================================================
// Message Type Guards
// =============================================================================

export function isUpdateActionMessage(msg: unknown): msg is UpdateActionMessage {
  return (
    typeof msg === "object" && msg !== null && (msg as UpdateActionMessage).type === "UPDATE_ACTION"
  );
}

export function isSyncRequestMessage(msg: unknown): msg is SyncRequestMessage {
  return (
    typeof msg === "object" && msg !== null && (msg as SyncRequestMessage).type === "SYNC_REQUEST"
  );
}

export function isUpdatePatchMessage(msg: unknown): msg is UpdatePatchMessage {
  return (
    typeof msg === "object" && msg !== null && (msg as UpdatePatchMessage).type === "UPDATE_PATCH"
  );
}

export function isUpdateFullMessage(msg: unknown): msg is UpdateFullMessage {
  return (
    typeof msg === "object" && msg !== null && (msg as UpdateFullMessage).type === "UPDATE_FULL"
  );
}

export function isSyncFullMessage(msg: unknown): msg is SyncFullMessage {
  return typeof msg === "object" && msg !== null && (msg as SyncFullMessage).type === "SYNC_FULL";
}

export function isUndoRequestMessage(msg: unknown): msg is UndoRequestMessage {
  return (
    typeof msg === "object" && msg !== null && (msg as UndoRequestMessage).type === "UNDO_REQUEST"
  );
}

export function isErrorMessage(msg: unknown): msg is ErrorMessage {
  return typeof msg === "object" && msg !== null && (msg as ErrorMessage).type === "ERROR";
}

// =============================================================================
// Connection State
// =============================================================================

export type ConnectionState =
  | "CONNECTING"
  | "CONNECTED"
  | "AUTHENTICATING"
  | "SYNCING"
  | "READY"
  | "DISCONNECTED"
  | "RECONNECTING"
  | "ERROR";

// =============================================================================
// Transport Interface
// =============================================================================

export interface Transport {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  send(message: ClientMessage): void;
  onMessage(handler: (message: ServerMessage) => void): void;
  onDisconnect(handler: (reason: string) => void): void;
  onError(handler: (error: Error) => void): void;
  getState(): ConnectionState;
}

// Re-export InMemoryTransport type for engine consumers
export type { InMemoryTransport, InMemoryTransportPair } from "./in-memory-transport";

// =============================================================================
// Validation
// =============================================================================

export interface ProtocolValidationResult {
  valid: boolean;
  error?: string;
  errorCode?: ErrorCode;
}

export function validateProtocolMessage(msg: unknown): ProtocolValidationResult {
  if (typeof msg !== "object" || msg === null) {
    return { valid: false, error: "Message must be an object", errorCode: "UNKNOWN" };
  }

  const typedMsg = msg as ProtocolEnvelope;

  if (typedMsg.protocolVersion !== PROTOCOL_VERSION) {
    return {
      valid: false,
      error: `Invalid protocol version: expected ${PROTOCOL_VERSION}, got ${typedMsg.protocolVersion}`,
      errorCode: "UNKNOWN",
    };
  }

  if (!typedMsg.matchID || typeof typedMsg.matchID !== "string") {
    return { valid: false, error: "Missing or invalid matchID", errorCode: "UNKNOWN" };
  }

  return { valid: true };
}
