/**
 * Riftbound Game State Types
 *
 * Core state types for the Riftbound game engine.
 */

import type { CardId } from "@tcg/riftbound-types";

/**
 * Player identifier type
 */
export type PlayerId = string;

/**
 * Game phase type
 */
export type GamePhase =
  | "setup"
  | "draw"
  | "main"
  | "combat"
  | "end"
  | "cleanup";

/**
 * Game status type
 */
export type GameStatus = "setup" | "playing" | "finished";

/**
 * Player state
 */
export interface PlayerState {
  readonly id: PlayerId;
  readonly health: number;
  readonly resources: number;
}

/**
 * Player zones - card locations for a single player
 */
export interface PlayerZones {
  readonly hand: CardId[];
  readonly deck: CardId[];
  readonly field: CardId[];
  readonly discard: CardId[];
}

/**
 * Turn state
 */
export interface TurnState {
  readonly number: number;
  readonly activePlayer: PlayerId;
  readonly phase: GamePhase;
}

/**
 * Complete game state
 */
export interface RiftboundState {
  readonly gameId: string;
  readonly players: Record<PlayerId, PlayerState>;
  readonly zones: Record<PlayerId, PlayerZones>;
  readonly turn: TurnState;
  readonly status: GameStatus;
  readonly winner?: PlayerId;
}
