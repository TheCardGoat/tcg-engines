/**
 * Gundam Card Game Type Definitions
 *
 * Main entry point for all Gundam engine types.
 * Re-exports from types/ directory and defines engine-specific types.
 *
 * Architecture follows @tcg/core IState pattern:
 * - Game state uses internal/external separation
 * - Card metadata stored in cardMetas (not scattered in state)
 * - Operations layer wraps context.zones, context.cards APIs
 */

import type { CardId, PlayerId } from "@tcg/core";

// ============================================================================
// Re-exports from types/ directory
// ============================================================================

// Branded types
export type { CardId, GameId, PlayerId, ZoneId } from "./types/branded-types";
export {
  createCardId,
  createGameId,
  createPlayerId,
  createZoneId,
} from "./types/branded-types";

// Game state types (IState pattern)
export type {
  GundamCardMeta,
  GundamExternalState,
  GundamGameState,
  GundamPhase,
} from "./types/game-state";
export {
  createDefaultCardMeta,
  createInitialGundamState,
} from "./types/game-state";

// Move enumeration types
export type {
  AvailableMoveInfo,
  MoveParameterOptions,
  MoveParamSchema,
  MoveValidationError,
  ParameterInfo,
  ParamFieldSchema,
} from "./types/move-enumeration";

// ============================================================================
// Engine-Specific Types
// ============================================================================

/**
 * Card Position (Orientation)
 *
 * - active: Vertical/ready (can attack, use abilities)
 * - rested: Horizontal/exhausted (tapped)
 */
export type CardPosition = "active" | "rested";

/**
 * Gundam Move Types
 *
 * Defines all possible player actions in the game.
 * Each move type specifies its required parameters.
 */
export type GundamMoves = {
  playCard: {
    playerId: PlayerId;
    cardId: CardId;
  };

  /** Attack with a unit */
  attack: {
    playerId: PlayerId;
    attackerId: CardId;
    targetId?: CardId; // undefined = direct attack to player
  };

  /** Pass/end current phase */
  pass: {
    playerId: PlayerId;
  };

  /** Concede the game */
  concede: {
    playerId: PlayerId;
  };

  /** Play COMMAND card from hand */
  playCommand: {
    playerId: PlayerId;
    cardId: CardId;
  };

  /** Resolve next effect from stack */
  resolveEffectStack: {
    playerId: PlayerId;
    targets?: CardId[]; // Optional targets for the effect
  };

  /** Execute effect actions (internal, called by resolveEffectStack) */
  executeEffect: {
    playerId: PlayerId;
    effectInstanceId: string;
    targets?: CardId[];
  };

  /** Handle turn start (internal, detects start of turn triggers) */
  handleTurnStart: {
    playerId: PlayerId;
  };

  /** Handle turn end (internal, detects end of turn triggers) */
  handleTurnEnd: {
    playerId: PlayerId;
  };
};
