import type { GameId, MoveId, PlayerId } from "./ids.js";
import type { JsonPatch } from "./json-patch.js";
import type { GameSnapshot } from "./snapshot.js";
import type { AnimationPlanV2 } from "@tcg/protocol";

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
  /**
   * Stored state-chain version the log was produced at, when the source
   * record carries one. Games whose log feeds dedupe or order by state
   * version (e.g. gundam) read this; absent for legacy emitters.
   */
  stateVersion?: number;
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
      stateVersion?: number;
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
      snapshot?: GameSnapshot;
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
      animationPlan: AnimationPlanV2 | null;
    }
  | {
      type: "state_update";
      gameId: GameId;
      stateVersion: number;
      patches: JsonPatch;
      logs: GameLogEntry[];
      animationPlan: AnimationPlanV2 | null;
    }
  | {
      type: "state_sync";
      gameId: GameId;
      snapshot: GameSnapshot;
      animationPlan: null;
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
