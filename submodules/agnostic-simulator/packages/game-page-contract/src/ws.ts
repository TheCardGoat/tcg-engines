import type { GameId, MoveId, PlayerId } from "./ids.js";
import type { JsonPatch } from "./json-patch.js";
import type { GameSnapshot } from "./snapshot.js";

/**
 * Tagged log entry for one in-game event. Tags are namespaced by gameType
 * (e.g. `"lorcana:lore_gained"`, `"gundam:link_attached"`). The page layer
 * forwards entries to the deployable's `MoveLogEntry` renderer untouched.
 */
export interface GameLogEntry {
  /** "<gameType>:<eventName>" — never parsed cross-game. */
  tag: string;
  /** Event payload; opaque to the page layer. */
  data?: unknown;
  /** Wall-clock timestamp at which the event was emitted. */
  ts?: number;
}

/**
 * Animation hint emitted by the engine alongside patches. Optional — the
 * page may render moves without animation if the deployable returns none.
 */
export interface AnimationCue {
  tag: string;
  data?: unknown;
}

export interface MoveRecord {
  stateVersion: number;
  turnNumber: number;
  actorId: PlayerId;
  moveId: MoveId;
  /** Game-specific move arguments. */
  payload?: unknown;
  /** Wall-clock at which the move was accepted. */
  timestamp: number;
}

// ---------- Client → server ----------

export type ClientMsg =
  | {
      type: "join_game";
      gameId: GameId;
      ticket: string;
    }
  | {
      type: "execute_move";
      gameId: GameId;
      /** Required for CAS concurrency control. */
      expectedVersion: number;
      moveId: MoveId;
      payload?: unknown;
      correlationId?: string;
    }
  | {
      type: "leave_game";
      gameId: GameId;
    }
  | {
      type: "send_chat";
      gameId: GameId;
      body: string;
    }
  | {
      type: "heartbeat";
      gameId: GameId;
      lastSeenVersion: number;
    }
  | {
      type: "ping";
    };

// ---------- Server → client ----------

export type MoveRejectedCode = "stale_version" | "illegal_move" | "not_your_turn" | "game_ended";

export type ServerMsg =
  | {
      type: "game_joined";
      gameId: GameId;
      snapshot: GameSnapshot;
      /** Recent moves so the client can backfill its move log. */
      recentHistory: MoveRecord[];
    }
  | {
      type: "move_accepted";
      gameId: GameId;
      stateVersion: number;
      patches: JsonPatch;
      acceptedMove: MoveRecord;
      logs: GameLogEntry[];
      animations?: AnimationCue[];
    }
  | {
      type: "state_update";
      gameId: GameId;
      stateVersion: number;
      patches: JsonPatch;
      logs: GameLogEntry[];
      animations?: AnimationCue[];
    }
  | {
      type: "state_sync";
      gameId: GameId;
      snapshot: GameSnapshot;
    }
  | {
      type: "move_rejected";
      gameId: GameId;
      code: MoveRejectedCode;
      currentVersion: number;
      message?: string;
    }
  | {
      type: "presence";
      gameId: GameId;
      playerId: PlayerId;
      status: "online" | "offline" | "thinking";
    }
  | {
      type: "chat";
      gameId: GameId;
      from: PlayerId;
      body: string;
      ts: number;
    }
  | {
      type: "timeout_notice";
      gameId: GameId;
      playerId: PlayerId;
      remainingMs: number;
    }
  | {
      type: "game_error";
      gameId: GameId;
      message: string;
    }
  | {
      type: "pong";
    };
