import type { CommandEnvelope, CommandResult } from "./command.ts";
import type { FilteredMatchView } from "./projection.ts";
import type { PublishedGameEvent, GameLogEntry } from "./game-events.ts";
import type { PacketAnimation } from "./animation.ts";
import type { GundamMoveLog } from "./move-log.ts";

// ── Client → Server ──────────────────────────────────────────────────────────

export type ClientMessage =
  | { type: "command"; envelope: CommandEnvelope; prevStateID: number }
  | { type: "syncRequest" }
  | { type: "undo"; prevStateID: number }
  | { type: "ping" };

// ── Server → Client ──────────────────────────────────────────────────────────

export type ServerMessage =
  | {
      type: "commandResult";
      result: CommandResult;
      commandID: string;
    }
  | {
      type: "stateSync";
      view: FilteredMatchView;
      stateID: number;
    }
  | {
      type: "statePatch";
      stateID: number;
      view: FilteredMatchView;
      gameEvents: PublishedGameEvent[];
      logEntries: GameLogEntry[];
      moveLogs: GundamMoveLog[];
      animations: PacketAnimation[];
      processedCommand: CommandEnvelope;
      canUndo: boolean;
    }
  | {
      type: "error";
      code: string;
      message: string;
      resyncRequired: boolean;
      currentStateID: number;
    }
  | { type: "pong" };

// ── Transport interface ──────────────────────────────────────────────────────

export type TransportMessage = ClientMessage | ServerMessage;

export interface Transport {
  send: (message: TransportMessage) => void;
  onMessage: (handler: (message: TransportMessage) => void) => () => void;
  close: () => void;
}
