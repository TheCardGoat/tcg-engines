import type { GameCards } from "~/game-engine/core-engine/types";
import type {
  PlayerID,
  PlayerId,
} from "~/game-engine/core-engine/types/core-types";
import { logger } from "~/game-engine/core-engine/utils/logger";
import {
  validateContextStructure,
  validatePlayerId,
} from "~/game-engine/core-engine/utils/validation";
import type { Zone } from "../engine/zone-operation";
import {
  createContext as createContextFactory,
  createContextWithNextTurnPlayer,
  createContextWithPriorityPlayer,
  createContextWithTurnPlayer,
} from "../utils/context-factory";

export type PlayerState<PlayerTurnHistory = unknown> = {
  id: string;
  name: string;
  lore?: number;
  turnHistory?: PlayerTurnHistory[];
};

export interface CoreCtx<TurnHistory = unknown> {
  playerOrder: Array<PlayerID>;
  turnPlayerPos: number;
  priorityPlayerPos: number;

  gameId: string;
  matchId: string;

  otp?: PlayerID;
  choosingFirstPlayer?: PlayerId;
  pendingMulligan?: Set<PlayerId>;
  pendingChampionSelection?: Set<PlayerId>;

  /**
   * Indicates whether the game is over. Once true, no further moves can be executed.
   */
  gameOver?: boolean;
  winner?: PlayerID;

  /**
   * If true, disables the rule engine and allows manual board state correction.
   * Used for fixing evaluation bugs or player corrections.
   */
  manualMode?: boolean;

  /**
   * Counter for the number of turns that have passed.
   * A turn is incremented when both players have played in a segment.
   * Starts at 0 and does not reset when transitioning segments.
   */
  numTurns: number;

  /**
   * Counter for the total number of successful moves executed in the game.
   */
  numMoves: number;

  /**
   * Counter for the number of moves executed during the current turn.
   * Resets whenever either the turnPlayer or the turn changes.
   */
  numTurnMoves: number;

  currentSegment?: string;
  currentPhase?: string;
  currentStep?: string;

  cards: GameCards;
  cardZones?: Record<string, Zone>;

  moveHistory: GameMoveHistoryEntry[];

  players: {
    [id: PlayerID]: PlayerState<TurnHistory>;
  };

  seed?: string | number;
}

export type GameMoveHistoryEntry = {
  id: string;
  playerId: string;
  timestamp: number;
  type: string;
  data: Record<string, any>;
};

export function isValidContext(context: CoreCtx) {
  // Use the consolidated validation function from validation.ts
  try {
    validateContextStructure(context);
    return true;
  } catch (error) {
    // Re-throw the error to maintain the same behavior
    throw error;
  }
}

/**
 * @deprecated Use createContext from context-factory.ts instead
 */
export function createCtx<TurnHistory = unknown>(options: {
  playerOrder?: Array<PlayerID>;
  initialSegment?: string;
  initialPhase?: string;
  initialStep?: string;
  cards: GameCards;
  cardZones?: Record<string, Zone>;
  players: Record<string, PlayerState<TurnHistory>>;
  gameId?: string;
  matchId?: string;
  seed?: number | string;
}): CoreCtx {
  // Forward to the factory function
  return createContextFactory(options);
}

/**
 * @deprecated Use createContextWithNextTurnPlayer from context-factory.ts instead
 * Legacy function with shallow copying - use for backward compatibility
 */
export function setNextTurnPlayer(ctx: CoreCtx): CoreCtx {
  // Forward to the factory function
  return createContextWithNextTurnPlayer(ctx);
}

/**
 * Enhanced version using immutable context manager
 * Provides deep immutability and change tracking
 */

export function getCurrentTurnPlayer(ctx: CoreCtx): PlayerID | null {
  if (ctx.turnPlayerPos < 0 || ctx.turnPlayerPos >= ctx.playerOrder.length) {
    return null;
  }
  return ctx.playerOrder[ctx.turnPlayerPos];
}

export function getCurrentPriorityPlayer(ctx: CoreCtx): PlayerID | null {
  if (
    ctx.priorityPlayerPos < 0 ||
    ctx.priorityPlayerPos >= ctx.playerOrder.length
  ) {
    return null;
  }
  return ctx.playerOrder[ctx.priorityPlayerPos];
}

export function hasPriorityPlayer(ctx: CoreCtx, playerId: PlayerID): boolean {
  return getCurrentPriorityPlayer(ctx) === playerId;
}

/**
 * @deprecated Use createContextWithPriorityPlayer from context-factory.ts instead
 * Legacy function with shallow copying - use for backward compatibility
 */
export function setPriorityPlayer(ctx: CoreCtx, player: PlayerID): CoreCtx {
  // Forward to the factory function
  return createContextWithPriorityPlayer(ctx, player);
}

/**
 * @deprecated Use createContextWithTurnPlayer from context-factory.ts instead
 * Legacy function with shallow copying - use for backward compatibility
 */
export function setTurnPlayer(ctx: CoreCtx, player: PlayerID): CoreCtx {
  // Forward to the factory function
  return createContextWithTurnPlayer(ctx, player);
}
