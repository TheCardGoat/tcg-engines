import type { GameCards } from "~/game-engine/core-engine/types";
import { logger } from "~/game-engine/core-engine/utils/logger";
import type { PlayerId } from "~/game-engine/engines/lorcana/src/lorcana-engine-types";
import type { Zone } from "../engine/zone-operation";

export type PlayerID = string;
export type InstanceId = string;

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

  gameOver?: unknown;
  winner?: PlayerID;
  manualMode?: boolean;

  numTurns: number;
  numMoves?: number;
  numTurnMoves: number;

  currentSegment?: string;
  currentTurn?: string;
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

function isValidContext(context: CoreCtx) {
  // check if there's cards with the same instance id
  for (const playerId in context.cards) {
    const playerCards = context.cards[playerId];
    const cardIds = new Set<string>();

    if (context.players[playerId].id !== playerId) {
      throw new Error(`Player ${playerId} not found in players list.`);
    }

    for (const cardId in playerCards) {
      if (cardIds.has(cardId)) {
        throw new Error(`Duplicate card instance ID found: ${cardId}`);
      }

      cardIds.add(cardId);
    }
  }

  // check if playerOrder is valid
  if (!Array.isArray(context.playerOrder) || context.playerOrder.length === 0) {
    logger.error(
      `Invalid playerOrder: ${context.playerOrder} in context`,
      context,
    );
    throw new Error("playerOrder must be a non-empty array.");
  }

  // check that every ctx.players  in ctx.playerOrder
  for (const playerId of context.playerOrder) {
    if (!context.players[playerId]) {
      logger.error(`Player ${playerId} not found in players list.`, context);
      throw new Error(`Player ${playerId} not found in context.`);
    }
  }

  // check that zones are valid
  for (const zoneId in context.cardZones || {}) {
    const zone = context.cardZones[zoneId];

    if (zone.id !== zoneId) {
      throw new Error(`Zone ID mismatch: expected ${zoneId}, got ${zone.id}`);
    }

    if (!context.players[zone.owner]) {
      throw new Error(`Zone owner ${zone.owner} not found in players.`);
    }

    if (!Array.isArray(zone?.cards)) {
      throw new Error(`Invalid zone configuration for zone: ${zoneId}`);
    }

    // Check if all cards in the zone are valid instance IDs
    for (const cardId of zone.cards) {
      if (typeof cardId !== "string" || cardId.trim() === "") {
        throw new Error(`Invalid card ID in zone ${zoneId}: ${cardId}`);
      }

      if (!context.cards[cardId]) {
        throw new Error(`Card ID ${cardId} not found in game cards.`);
      }
    }
  }

  return true;
}

export function createCtx<TurnHistory = unknown>({
  playerOrder,
  initialSegment,
  initialPhase,
  initialStep,
  cards,
  cardZones,
  players,
  seed,
  gameId = "default-game-id",
  matchId = "default-match-id",
}: {
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
  const context: CoreCtx = {
    gameId,
    matchId,
    playerOrder: playerOrder || [],
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
    throw new Error("Invalid context.");
  }

  return context;
}

/**
 * Legacy function with shallow copying - use for backward compatibility
 * For new code, prefer using ImmutableContextManager directly
 */
export function setNextTurnPlayer(ctx: CoreCtx): CoreCtx {
  const nextTurnPlayerPos = (ctx.turnPlayerPos + 1) % ctx.playerOrder.length;

  // Deep copy arrays and objects to prevent mutations
  return {
    ...ctx,
    turnPlayerPos: nextTurnPlayerPos,
    playerOrder: [...ctx.playerOrder],
    cards: deepCopyCards(ctx.cards),
    cardZones: ctx.cardZones ? deepCopyZones(ctx.cardZones) : ctx.cardZones,
  };
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
 * Legacy function with shallow copying - use for backward compatibility
 * For new code, prefer using ImmutableContextManager directly
 */
export function setPriorityPlayer(ctx: CoreCtx, player: PlayerID): CoreCtx {
  const priorityPlayerPos = ctx.playerOrder.indexOf(player);
  if (priorityPlayerPos === -1) {
    throw new Error(`Player ${player} is not in the player order.`);
  }

  // Deep copy arrays and objects to prevent mutations
  return {
    ...ctx,
    priorityPlayerPos: priorityPlayerPos,
    playerOrder: [...ctx.playerOrder],
    cards: deepCopyCards(ctx.cards),
    cardZones: ctx.cardZones ? deepCopyZones(ctx.cardZones) : ctx.cardZones,
  };
}

/**
 * Legacy function with shallow copying - use for backward compatibility
 * For new code, prefer using ImmutableContextManager directly
 */
export function setTurnPlayer(ctx: CoreCtx, player: PlayerID): CoreCtx {
  const turnPlayerPos = ctx.playerOrder.indexOf(player);
  if (turnPlayerPos === -1) {
    throw new Error(`Player ${player} is not in the player order.`);
  }

  // Deep copy arrays and objects to prevent mutations
  return {
    ...ctx,
    turnPlayerPos: turnPlayerPos,
    playerOrder: [...ctx.playerOrder],
    cards: deepCopyCards(ctx.cards),
    cardZones: ctx.cardZones ? deepCopyZones(ctx.cardZones) : ctx.cardZones,
  };
}

// Deep copy helper functions for backward compatibility

function deepCopyCards(cards: GameCards): GameCards {
  const copiedCards: GameCards = {};
  for (const [playerId, playerCards] of Object.entries(cards)) {
    copiedCards[playerId] = { ...playerCards };
  }
  return copiedCards;
}

function deepCopyZones(zones: Record<string, Zone>): Record<string, Zone> {
  const copiedZones: Record<string, Zone> = {};
  for (const [zoneId, zone] of Object.entries(zones)) {
    copiedZones[zoneId] = {
      ...zone,
      cards: [...zone.cards],
      metadata: { ...zone.metadata },
    };
  }
  return copiedZones;
}
