/**
 * Context Factory Utilities
 *
 * This module provides standardized factory functions for creating and manipulating
 * context objects in the core engine. It consolidates duplicate context creation
 * patterns and provides a consistent API for context operations.
 */

import type { Zone, ZoneVisibility } from "../engine/zone-operation";
import {
  EntityNotFoundError,
  ValidationFailedError,
} from "../errors/consolidated-errors";
import type { CoreCtx, PlayerState } from "../state/context";
import { isValidContext } from "../state/context";
import type { GameCards } from "../types";
import type { PlayerID } from "../types/core-types";
import { ErrorFormatters, safeExecute } from "./error-utils";
import { validatePlayerId } from "./validation";

/**
 * Options for creating a new context
 */
export interface ContextFactoryOptions<TurnHistory = unknown> {
  /** Array of player IDs in turn order */
  playerOrder?: Array<PlayerID>;
  /** Initial game segment */
  initialSegment?: string;
  /** Initial game phase */
  initialPhase?: string;
  /** Initial game step */
  initialStep?: string;
  /** Card data structure */
  cards: GameCards;
  /** Card zone definitions */
  cardZones?: Record<string, Zone>;
  /** Player state information */
  players: Record<string, PlayerState<TurnHistory>>;
  /** Game identifier */
  gameId?: string;
  /** Match identifier */
  matchId?: string;
  /** Random seed for deterministic operations */
  seed?: number | string;
}

/**
 * Creates a new context object with the provided options
 *
 * @param options - Context creation options
 * @returns A new context object
 * @throws {StateValidationError} If the resulting context is invalid
 */
export function createContext<TurnHistory = unknown>(
  options: ContextFactoryOptions<TurnHistory>,
): CoreCtx {
  return safeExecute("createContext", () => {
    const {
      playerOrder,
      initialSegment,
      initialPhase,
      initialStep,
      cards,
      cardZones,
      players,
      gameId = "default-game-id",
      matchId = "default-match-id",
      seed,
    } = options;

    // If no player order is provided, use the player IDs from the players object
    const derivedPlayerOrder = playerOrder || Object.keys(players);

    const context: CoreCtx = {
      gameId,
      matchId,
      playerOrder: derivedPlayerOrder,
      turnPlayerPos: 0,
      priorityPlayerPos: 0,
      numMoves: 0,
      gameOver: undefined,
      numTurns: 1,
      numTurnMoves: 0,
      currentSegment: initialSegment,
      currentPhase: initialPhase,
      currentStep: initialStep,
      cards,
      cardZones,
      players,
      moveHistory: [],
      seed,
    };

    if (!isValidContext(context)) {
      throw new ValidationFailedError(
        "context",
        "game",
        "structure",
        "valid context structure",
        "invalid structure",
      );
    }

    return context;
  });
}

/**
 * Creates a new context with updated turn player
 *
 * @param ctx - Original context
 * @returns A new context with the next player in turn order as the turn player
 */
export function createContextWithNextTurnPlayer(ctx: CoreCtx): CoreCtx {
  return safeExecute("createContextWithNextTurnPlayer", () => {
    const nextTurnPlayerPos = (ctx.turnPlayerPos + 1) % ctx.playerOrder.length;

    return {
      ...ctx,
      turnPlayerPos: nextTurnPlayerPos,
      playerOrder: [...ctx.playerOrder],
      cards: { ...ctx.cards },
      cardZones: ctx.cardZones ? { ...ctx.cardZones } : undefined,
    };
  });
}

/**
 * Creates a new context with a specific player having priority
 *
 * @param ctx - Original context
 * @param player - Player ID to give priority to
 * @returns A new context with the specified player having priority
 * @throws {PlayerValidationError} If the player ID is invalid
 */
export function createContextWithPriorityPlayer(
  ctx: CoreCtx,
  player: PlayerID,
): CoreCtx {
  return safeExecute("createContextWithPriorityPlayer", () => {
    // Validate player exists in context
    validatePlayerId(ctx, player);

    const priorityPlayerPos = ctx.playerOrder.indexOf(player);
    if (priorityPlayerPos === -1) {
      throw new EntityNotFoundError("player", player, {
        context: "playerOrder validation",
      });
    }

    return {
      ...ctx,
      priorityPlayerPos,
      playerOrder: [...ctx.playerOrder],
      cards: { ...ctx.cards },
      cardZones: ctx.cardZones ? { ...ctx.cardZones } : undefined,
    };
  });
}

/**
 * Creates a new context with a specific turn player
 *
 * @param ctx - Original context
 * @param player - Player ID to set as turn player
 * @returns A new context with the specified player as turn player
 * @throws {PlayerValidationError} If the player ID is invalid
 */
export function createContextWithTurnPlayer(
  ctx: CoreCtx,
  player: PlayerID,
): CoreCtx {
  return safeExecute("createContextWithTurnPlayer", () => {
    // Validate player exists in context
    validatePlayerId(ctx, player);

    const turnPlayerPos = ctx.playerOrder.indexOf(player);
    if (turnPlayerPos === -1) {
      throw new EntityNotFoundError("player", player, {
        context: "playerOrder validation",
      });
    }

    return {
      ...ctx,
      turnPlayerPos,
      playerOrder: [...ctx.playerOrder],
      cards: { ...ctx.cards },
      cardZones: ctx.cardZones ? { ...ctx.cardZones } : undefined,
    };
  });
}

/**
 * Creates a new context with updated game phase information
 *
 * @param ctx - Original context
 * @param segment - New segment value (optional)
 * @param phase - New phase value (optional)
 * @param step - New step value (optional)
 * @returns A new context with updated phase information
 */
export function createContextWithPhase(
  ctx: CoreCtx,
  segment?: string,
  phase?: string,
  step?: string,
): CoreCtx {
  return safeExecute("createContextWithPhase", () => {
    return {
      ...ctx,
      currentSegment: segment ?? ctx.currentSegment,
      currentPhase: phase ?? ctx.currentPhase,
      currentStep: step ?? ctx.currentStep,
      playerOrder: [...ctx.playerOrder],
      cards: { ...ctx.cards },
      cardZones: ctx.cardZones ? { ...ctx.cardZones } : undefined,
    };
  });
}

/**
 * Creates a new context with an added move history entry
 *
 * @param ctx - Original context
 * @param playerId - Player who made the move
 * @param moveType - Type of move
 * @param moveData - Move data
 * @returns A new context with the move added to history
 */
export function createContextWithMoveHistory(
  ctx: CoreCtx,
  playerId: PlayerID,
  moveType: string,
  moveData: Record<string, any>,
): CoreCtx {
  return safeExecute("createContextWithMoveHistory", () => {
    // Validate player exists in context
    validatePlayerId(ctx, playerId);

    const moveEntry = {
      id: `move-${ctx.numMoves ?? 0 + 1}`,
      playerId,
      timestamp: Date.now(),
      type: moveType,
      data: moveData,
    };

    return {
      ...ctx,
      numMoves: (ctx.numMoves ?? 0) + 1,
      numTurnMoves: ctx.numTurnMoves + 1,
      moveHistory: [...ctx.moveHistory, moveEntry],
      playerOrder: [...ctx.playerOrder],
      cards: { ...ctx.cards },
      cardZones: ctx.cardZones ? { ...ctx.cardZones } : undefined,
    };
  });
}

/**
 * Creates a new context with game over state
 *
 * @param ctx - Original context
 * @param winner - ID of winning player (optional)
 * @param gameOverData - Additional game over data (optional)
 * @returns A new context with game over state
 */
export function createContextWithGameOver(
  ctx: CoreCtx,
  winner?: PlayerID,
  gameOverData?: unknown,
): CoreCtx {
  return safeExecute("createContextWithGameOver", () => {
    // If winner is provided, validate it exists in context
    if (winner) {
      validatePlayerId(ctx, winner);
    }

    return {
      ...ctx,
      gameOver: (gameOverData ?? true) as boolean | object,
      winner,
      playerOrder: [...ctx.playerOrder],
      cards: { ...ctx.cards },
      cardZones: ctx.cardZones ? { ...ctx.cardZones } : undefined,
    };
  });
}

/**
 * Creates a test context with minimal required fields
 * Useful for unit testing
 *
 * @param overrides - Fields to override in the test context
 * @returns A minimal test context
 */
export function createTestContext(overrides: Partial<CoreCtx> = {}): CoreCtx {
  const defaultPlayers = {
    player1: { id: "player1", name: "Player 1" },
    player2: { id: "player2", name: "Player 2" },
  };

  const defaultCards = {
    player1: {},
    player2: {},
  };

  const defaultZones = {
    "player1-hand": {
      id: "player1-hand",
      name: "hand",
      owner: "player1",
      cards: [],
      visibility: "private" as ZoneVisibility,
    },
    "player2-hand": {
      id: "player2-hand",
      name: "hand",
      owner: "player2",
      cards: [],
      visibility: "private" as ZoneVisibility,
    },
  };

  const baseContext: CoreCtx = {
    gameId: "test-game",
    matchId: "test-match",
    playerOrder: ["player1", "player2"],
    turnPlayerPos: 0,
    priorityPlayerPos: 0,
    numTurns: 1,
    numMoves: 0,
    numTurnMoves: 0,
    moveHistory: [],
    players: defaultPlayers,
    cards: defaultCards,
    cardZones: defaultZones,
  };

  return {
    ...baseContext,
    ...overrides,
  };
}
