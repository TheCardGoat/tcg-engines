import type { GameCards } from "~/game-engine/core-engine/types";
import type { PlayerId } from "~/game-engine/engines/lorcana/src/lorcana-engine-types";
import { logger } from "../../../shared/logger";
import { LogLevel } from "../../types/log-types";
import { LogCollector } from "../../utils/log-collector";
import type { Zone } from "../engine/zone-operation";

export type PlayerID = string;
export type InstanceId = string;

export type PlayerState<State = unknown, PlayerTurnHistory = unknown> = {
  id: string;
  name: string;
  turnHistory?: PlayerTurnHistory[];
} & State;

/**
 * This is the object containing all context-related state for a specific game.
 * It is available as ctx and represents both the state and some utility functions.
 */
export interface CoreCtx<State = unknown, TurnHistory = unknown> {
  // Base engine state
  seed: string;
  _random: { seed: string }; // Legacy for compatibility
  numTurns: number;
  numMoves: number;
  seenCards: Map<string, Set<string>>; // PlayerID -> Set of card IDs that this player has seen
  currentSegment?: string;
  currentPhase?: string; // Current phase in the game flow
  currentStep?: string; // Current step within the current phase
  currentTurn?: number; // Current turn number
  pendingMulligan?: Set<PlayerID>; // Players who haven't made their mulligan decision
  pendingChampionSelection?: Set<PlayerID>; // Players who haven't selected champions
  playerOrder: PlayerID[]; // Order of players in the game
  turnPlayerPos: number; // Position of the current turn player in playerOrder
  priorityPlayerPos: number; // Position of the current priority player in playerOrder
  otp?: PlayerID; // One-time player (first player of the game)
  gameOver?: { winner?: PlayerID; reason?: string; customData?: unknown }; // Game over state
  cardZones: Record<string, CardZone>; // All card zones in the game
  turnData?: Record<string, unknown>; // Additional turn-specific data
  configuration?: Record<string, unknown>; // Game specific configuration

  // Additional properties found being used in the codebase
  gameId?: string;
  matchId?: string;
  numTurnMoves?: number;
  moveHistory?: GameMoveHistoryEntry[];
  cards?: Record<string, Record<string, string>>;
  players?: Record<string, PlayerState<State, TurnHistory>>;
  choosingFirstPlayer?: string;
  logCollector?: LogCollector;
}

/**
 * Standard card zone representation in the Core Engine
 */
export interface CardZone {
  id: string; // Unique identifier for this zone instance (usually playerId-zoneName)
  name: string; // Name of the zone (e.g., 'hand', 'deck')
  owner: PlayerID; // Owner of the zone
  cards: string[]; // Card instance IDs in this zone
  visibility: "public" | "private" | "secret"; // Who can see the cards in this zone
  ordered: boolean; // Whether card order matters in this zone
  metadata?: Record<string, unknown>; // Additional zone metadata
}

export type GameMoveHistoryEntry = {
  id: string;
  playerId: string;
  timestamp: number;
  type: string;
  data: Record<string, any>;
};

function isValidContext(context: CoreCtx, logCollector: LogCollector) {
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
    logCollector.log(
      LogLevel.DEVELOPER,
      `Invalid playerOrder: ${context.playerOrder} in context`,
    );
    throw new Error("playerOrder must be a non-empty array.");
  }

  // check that every ctx.players  in ctx.playerOrder
  for (const playerId of context.playerOrder) {
    if (!context.players[playerId]) {
      logCollector.log(
        LogLevel.DEVELOPER,
        `Player ${playerId} not found in players list.`,
      );
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
  logCollector,
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
  logCollector?: LogCollector;
}): CoreCtx {
  // Create a default LogCollector if one wasn't provided
  const logger = logCollector || new LogCollector();

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
    cardZones: cardZones || {},
    players,
    moveHistory: [],
    seed:
      typeof seed === "number"
        ? seed.toString()
        : seed || Math.random().toString(),
    _random: {
      seed:
        typeof seed === "number"
          ? seed.toString()
          : seed || Math.random().toString(),
    },
    seenCards: new Map(),
    logCollector: logger,
  };

  if (!isValidContext(context, logger)) {
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

export function getCurrentTurnPlayer(ctx: CoreCtx): PlayerID | undefined {
  if (!ctx.playerOrder || ctx.playerOrder.length === 0) {
    return undefined;
  }
  return ctx.playerOrder[ctx.turnPlayerPos];
}

export function getCurrentPriorityPlayer(ctx: CoreCtx): PlayerID | undefined {
  if (!ctx.playerOrder || ctx.playerOrder.length === 0) {
    return undefined;
  }
  return ctx.playerOrder[ctx.priorityPlayerPos];
}

export function hasPriorityPlayer(ctx: CoreCtx, playerId: string): boolean {
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
