import type { PlayerId } from "./branded.ts";

export interface CommandEnvelope {
  commandID: string;
  move: string;
  prevStateID: number;
  actorRole: "player" | "spectator" | "judge";
  args: unknown;
  optimisticHint?: unknown;
  redactInput?: boolean;
}

export interface PublishedGameEvent {
  eventId: string;
  stateID: number;
  timestamp: number;
  type: string;
  payload?: unknown;
  source?: string;
  targets?: string[];
}

export interface GameLogEntry {
  logId: string;
  stateID: number;
  timestamp: number;
  type: string;
  message: string;
  playerId?: PlayerId;
  cardIds?: string[];
  data?: Record<string, unknown>;
  visibleTo?: PlayerId[] | "all";
}

export interface CommandSuccess {
  success: true;
  stateID: number;
  state: unknown;
  patches: unknown[];
  gameEvents: PublishedGameEvent[];
  logEntries: GameLogEntry[];
  processedCommand: CommandEnvelope;
  animations: PacketAnimation[];
  undoable: boolean;
}

export interface CommandFailure {
  success: false;
  error: string;
  errorCode: CommandErrorCode;
  currentStateID: number;
  envelope?: CommandEnvelope;
}

export type CommandResult = CommandSuccess | CommandFailure;

export interface PacketAnimation<TKind extends string = string, TPayload = unknown> {
  id: string;
  kind: TKind;
  payload: TPayload;
}

export type CommandErrorCode =
  | "STALE_STATE"
  | "NOT_ACTIVE_PLAYER"
  | "EFFECT_PENDING"
  | "INSUFFICIENT_RESOURCES"
  | "INVALID_TARGET"
  | "WRONG_PHASE"
  | "UNKNOWN_MOVE"
  | "MOVE_NOT_AVAILABLE"
  | "INVALID_ARGUMENTS"
  | "CANT_UNDO"
  | "GAME_ENDED"
  | "SPECTATOR_NOT_ALLOWED"
  | "VALIDATION_FAILED"
  | "INTERNAL_ERROR";
