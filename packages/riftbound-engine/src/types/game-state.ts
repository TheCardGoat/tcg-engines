/**
 * Riftbound Game State Types
 *
 * Core state types for the Riftbound tabletop simulator.
 * Includes card metadata, battlefield state, and resource pools.
 */

import type { Domain, DomainPower } from "./moves";

// Re-export Domain types for convenience
export type { Domain, DomainPower } from "./moves";

/**
 * Player identifier type
 * Using string for simplicity in the tabletop simulator
 */
export type PlayerId = string;

/**
 * Card identifier type
 * Using string for simplicity in the tabletop simulator
 */
export type CardId = string;

/**
 * Game phase type - follows Riftbound turn structure
 */
export type GamePhase =
  | "setup"
  | "awaken"
  | "beginning"
  | "channel"
  | "draw"
  | "action"
  | "ending"
  | "cleanup";

/**
 * Game status type
 */
export type GameStatus = "setup" | "playing" | "finished";

/**
 * Combat role for units in combat
 */
export type CombatRole = "attacker" | "defender" | null;

/**
 * Card metadata for Riftbound cards
 *
 * Tracks dynamic state like damage, exhaustion, and combat roles.
 * This is stored separately from the card definition.
 */
export interface RiftboundCardMeta {
  /** Damage counters on the card */
  damage: number;

  /** Whether the card has a buff counter */
  buffed: boolean;

  /** Whether the card is stunned */
  stunned: boolean;

  /** Whether the card is exhausted (tapped) */
  exhausted: boolean;

  /** Combat role during combat (attacker/defender) */
  combatRole: CombatRole;

  /** Whether the card is hidden (facedown) */
  hidden: boolean;

  /** Battlefield ID where the card is hidden (if hidden) */
  hiddenAt?: CardId;

  /** Domain of the card (for runes) */
  domain?: Domain;
}

/**
 * Default card metadata values
 */
export const DEFAULT_CARD_META: RiftboundCardMeta = {
  damage: 0,
  buffed: false,
  stunned: false,
  exhausted: false,
  combatRole: null,
  hidden: false,
};

/**
 * Rune pool state - tracks available energy and power
 */
export interface RunePool {
  /** Available energy (numeric resource) */
  energy: number;

  /** Available power by domain */
  power: DomainPower;
}

/**
 * Default rune pool values
 */
export const DEFAULT_RUNE_POOL: RunePool = {
  energy: 0,
  power: {},
};

/**
 * Battlefield state - tracks control and contested status
 */
export interface BattlefieldState {
  /** Battlefield card ID */
  id: CardId;

  /** Player who controls this battlefield (null if uncontrolled) */
  controller: PlayerId | null;

  /** Whether the battlefield is contested */
  contested: boolean;

  /** Player who contested the battlefield (if contested) */
  contestedBy?: PlayerId;
}

/**
 * Player state
 */
export interface PlayerState {
  /** Player identifier */
  readonly id: PlayerId;

  /** Victory points */
  victoryPoints: number;
}

/**
 * Turn state
 */
export interface TurnState {
  /** Current turn number (1-indexed) */
  readonly number: number;

  /** Active player ID */
  readonly activePlayer: PlayerId;

  /** Current phase */
  readonly phase: GamePhase;
}

/**
 * Complete Riftbound game state
 *
 * This is the game-specific state that moves operate on.
 * Zone state and card metadata are managed by the core engine.
 */
export interface RiftboundGameState {
  /** Unique game identifier */
  readonly gameId: string;

  /** Player states indexed by player ID */
  readonly players: Record<string, PlayerState>;

  /** Victory score needed to win (8 for 1v1) */
  readonly victoryScore: number;

  /** Battlefield states indexed by battlefield card ID */
  readonly battlefields: Record<string, BattlefieldState>;

  /** Rune pools indexed by player ID */
  readonly runePools: Record<string, RunePool>;

  /** Battlefields conquered this turn (for scoring restrictions) */
  readonly conqueredThisTurn: Record<string, CardId[]>;

  /** Battlefields scored this turn (max once per battlefield per turn) */
  readonly scoredThisTurn: Record<string, CardId[]>;

  /** Turn state */
  readonly turn: TurnState;

  /** Game status */
  readonly status: GameStatus;

  /** Winner player ID (if game is finished) */
  readonly winner?: PlayerId;
}

/**
 * Type alias for backward compatibility
 * @deprecated Use RiftboundGameState instead
 */
export type RiftboundState = RiftboundGameState;

/**
 * Create initial player state
 */
export function createPlayerState(playerId: PlayerId): PlayerState {
  return {
    id: playerId,
    victoryPoints: 0,
  };
}

/**
 * Create initial battlefield state
 */
export function createBattlefieldState(
  battlefieldId: CardId,
): BattlefieldState {
  return {
    id: battlefieldId,
    controller: null,
    contested: false,
  };
}

/**
 * Create initial rune pool
 */
export function createRunePool(): RunePool {
  return { ...DEFAULT_RUNE_POOL };
}
