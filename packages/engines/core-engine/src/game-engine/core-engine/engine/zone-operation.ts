import type { CoreCtx } from "~/game-engine/core-engine/state/context";
import { debuggers, logger } from "~/game-engine/core-engine/utils/logger";
import {
  LinearCongruentialGenerator,
  shuffleCardZone,
} from "~/game-engine/core-engine/utils/random";
import {
  isCardInZone,
  isValidPlayerId,
  isValidZoneId,
  validateCardInZone,
  validatePlayerId,
  validateZoneId,
  validateZoneNotEmpty,
  validateZoneOwnership,
} from "~/game-engine/core-engine/utils/validation";

export type ZonePosition = "top" | "bottom" | number;
export type ZoneVisibility = "public" | "private" | "secret";
export type PlayerID = string;
export type CardInstanceID = string;

/**
 * Core zone configuration interface
 */
export interface ZoneConfig {
  id: string;
  name: string;
  description?: string;
  visibility: ZoneVisibility;
  ordered: boolean;
  sizeLimit?: number;
  ownerRestricted?: boolean; // If true, only owner can access this zone
  initialCards?: CardInstanceID[];
  // Game-specific properties can be added via this
  metadata?: Record<string, unknown>;
}

export interface Zone {
  id: string;
  name: string;
  owner: PlayerID;
  cards: CardInstanceID[];
  visibility: ZoneVisibility;
  ordered?: boolean;
  sizeLimit?: number;
  ownerRestricted?: boolean;
  metadata?: Record<string, unknown>;
}

export interface ZoneMoveEvent {
  type: "ZONE_MOVE";
  cardID: CardInstanceID;
  fromZone: string;
  toZone: string;
  position?: ZonePosition;
  playerID?: PlayerID;
}

export interface ZoneShuffleEvent {
  type: "ZONE_SHUFFLE";
  zoneID: string;
  playerID?: PlayerID;
  seed?: string; // For deterministic shuffling
}

export interface ZoneSearchEvent {
  type: "ZONE_SEARCH";
  zoneID: string;
  playerID?: PlayerID;
  predicate: (cardID: CardInstanceID) => boolean;
  limit?: number;
}

export interface ZoneCountEvent {
  type: "ZONE_COUNT";
  zoneID: string;
  playerID?: PlayerID;
}

export interface ZonePeekEvent {
  type: "ZONE_PEEK";
  zoneID: string;
  count: number;
  playerID?: PlayerID;
}

/**
 * Union type for all zone events
 */
export type ZoneEvent =
  | ZoneMoveEvent
  | ZoneShuffleEvent
  | ZoneSearchEvent
  | ZoneCountEvent
  | ZonePeekEvent;

/**
 * Error result for zone operations
 */
export interface ZoneOperationError {
  type: "ZONE_OPERATION_ERROR";
  reason: string;
  context?: Record<string, unknown>;
}

/**
 * Type guard to check if a result is a zone operation error
 */
export function isZoneOperationError(
  result: unknown,
): result is ZoneOperationError {
  return (
    typeof result === "object" &&
    result !== null &&
    "type" in result &&
    (result as any).type === "ZONE_OPERATION_ERROR"
  );
}

export function getCardZone(
  ctx: CoreCtx,
  zoneId: string | string[],
  playerId?: string,
): Zone | undefined {
  if (Array.isArray(zoneId)) {
    return Object.values(ctx.cardZones).find((cardZone) =>
      zoneId.includes(cardZone.id),
    );
  }

  return (
    ctx.cardZones[zoneId] ||
    Object.values(ctx.cardZones).find(
      (cardZone) => cardZone.owner === playerId && cardZone.name === zoneId,
    )
  );
}

export function getCardZoneByInstanceId(
  ctx: CoreCtx,
  instanceId: string,
): Zone | undefined {
  return Object.values(ctx.cardZones).find((zone) =>
    zone.cards.includes(instanceId),
  );
}

function moveCardBetweenZones({
  ctx,
  playerId,
  fromZone,
  toZone,
  cardToMove,
  destination,
}: {
  ctx: CoreCtx;
  playerId: string;
  fromZone: Zone;
  toZone: Zone;
  cardToMove: string;
  origin: "start" | "end";
  destination: "start" | "end";
}): CoreCtx {
  // Use the validation utilities to validate zones and card
  try {
    // Validate that both zones exist
    if (!(fromZone && toZone)) {
      logger.warn(
        `One of the zones ('${fromZone?.name}' or '${toZone?.name}') not found in context.`,
      );
      return ctx;
    }

    // Validate zone ownership
    if (fromZone.owner !== playerId || toZone.owner !== playerId) {
      logger.warn(
        `Player ${playerId} does not own one of the zones ('${fromZone.id}' or '${toZone.id}').`,
      );
      return ctx;
    }

    // Validate card is in the source zone
    if (!fromZone.cards.includes(cardToMove)) {
      logger.warn(`Card ${cardToMove} not found in zone: '${fromZone.id}'.`);
      return ctx;
    }
  } catch (error) {
    logger.error(`Error in moveCardBetweenZones: ${error.message}`);
    return ctx;
  }

  const newFromCards = fromZone.cards.filter((id) => id !== cardToMove);
  const newToCards = [...toZone.cards];
  if (destination === "start") {
    newToCards.unshift(cardToMove);
  } else {
    newToCards.push(cardToMove);
  }

  // Sanity check: Card counts should not change during a move
  if (
    newFromCards.length + newToCards.length !==
    fromZone.cards.length + toZone.cards.length
  ) {
    logger.error(
      `Card count mismatch after move: fromZone=${fromZone.cards.length}, toZone=${toZone.cards.length}, movedCard=${cardToMove}`,
    );
    return ctx;
  }

  if (debuggers.zoneOperations) {
    logger.debug(
      `Moving card '${cardToMove}' from zone '${fromZone.id}' to zone '${toZone.id}'`,
    );
  }

  return {
    ...ctx,
    cardZones: {
      ...ctx.cardZones,
      [fromZone.id]: {
        ...fromZone,
        cards: newFromCards,
      },
      [toZone.id]: {
        ...toZone,
        cards: newToCards,
      },
    },
  };
}

export function shuffleZone(ctx: CoreCtx, zoneId: string) {
  const zone = getCardZone(ctx, zoneId);

  if (!zone) {
    logger.warn(`[shuffeZone] Zone ${zoneId} not found in context.`);
    return ctx;
  }

  const lcg = new LinearCongruentialGenerator(ctx.seed);
  const next = lcg.next();

  return {
    ...ctx,
    seed: next,
    cardZones: {
      ...ctx.cardZones,
      [zoneId]: {
        ...ctx.cardZones[zoneId],
        cards: shuffleCardZone(ctx.cardZones[zoneId].cards, lcg.seed),
      },
    },
  };
}

export function moveCardByInstanceId({
  ctx,
  instanceId,
  playerId,
  to,
  from,
  destination = "end",
}: {
  ctx: CoreCtx;
  instanceId: string;
  playerId: string;
  to?: string;
  from?: string; // Optional constraint - card must be in this zone
  origin?: "start" | "end"; // ignored, since we use instanceId
  destination?: "start" | "end";
}): CoreCtx | ZoneOperationError {
  // Validate player ID
  if (!isValidPlayerId(ctx, playerId)) {
    return {
      type: "ZONE_OPERATION_ERROR",
      reason: "INVALID_PLAYER",
      context: {
        playerId,
        instanceId,
      },
    };
  }

  const fromZone = getCardZoneByInstanceId(ctx, instanceId);
  const toZone = getCardZone(ctx, to, playerId);

  // Validate from constraint if provided
  if (from && fromZone) {
    const zoneMatches = fromZone.id === from || fromZone.name === from;
    const ownershipMatches = fromZone.owner === playerId;

    if (!(zoneMatches && ownershipMatches)) {
      return {
        type: "ZONE_OPERATION_ERROR",
        reason: "CARD_NOT_IN_EXPECTED_ZONE",
        context: {
          instanceId,
          expectedZone: from,
          actualZone: fromZone.id || fromZone.name,
          actualOwner: fromZone.owner,
          expectedOwner: playerId,
          playerId,
        },
      };
    }
  }

  // Handle case where card doesn't exist but from constraint is provided
  if (from && !fromZone) {
    return {
      type: "ZONE_OPERATION_ERROR",
      reason: "CARD_NOT_IN_EXPECTED_ZONE",
      context: {
        instanceId,
        expectedZone: from,
        actualZone: undefined,
        playerId,
      },
    };
  }

  // Validate both zones exist
  if (!(fromZone && toZone)) {
    return {
      type: "ZONE_OPERATION_ERROR",
      reason: "ZONE_NOT_FOUND",
      context: {
        fromZone: fromZone?.name,
        toZone: to,
        instanceId,
        playerId,
      },
    };
  }

  return moveCardBetweenZones({
    ctx,
    playerId,
    fromZone,
    toZone,
    cardToMove: instanceId,
    origin: "start", // not used in this context
    destination,
  });
}

export function move({
  ctx,
  playerId,
  from,
  to,
  origin = "start",
  destination = "end",
}: {
  ctx: CoreCtx;
  playerId: string;
  from?: string;
  to?: string;
  origin?: "start" | "end";
  destination?: "start" | "end";
}): CoreCtx {
  let fromZone;
  let toZone;

  try {
    // Validate player ID
    if (!isValidPlayerId(ctx, playerId)) {
      logger.warn(`Invalid player ID: ${playerId}`);
      return ctx;
    }

    fromZone = getCardZone(ctx, from, playerId);
    toZone = getCardZone(ctx, to, playerId);

    // Validate zones exist
    if (!(fromZone && toZone)) {
      logger.warn(
        `One of the zones ('${from}' or '${to}') not found in context.`,
      );
      return ctx;
    }

    // Validate zone ownership
    if (fromZone.owner !== playerId) {
      logger.warn(`Player ${playerId} does not own zone '${fromZone.id}'.`);
      return ctx;
    }

    if (toZone.owner !== playerId) {
      logger.warn(`Player ${playerId} does not own zone '${toZone.id}'.`);
      return ctx;
    }

    // Validate source zone is not empty
    if (fromZone.cards.length === 0) {
      logger.warn(`Cannot move card from empty zone: '${fromZone.id}'.`);
      return ctx;
    }
  } catch (error) {
    logger.error(`Error in move operation: ${error.message}`);
    return ctx;
  }

  // If we got here, fromZone and toZone should be defined
  if (!(fromZone && toZone)) {
    return ctx;
  }

  const cardToMove =
    origin === "start"
      ? fromZone.cards[0]
      : fromZone.cards[fromZone.cards.length - 1];

  if (!cardToMove) {
    return ctx;
  }

  return moveCardBetweenZones({
    ctx,
    playerId,
    fromZone,
    toZone,
    cardToMove,
    origin,
    destination,
  });
}
