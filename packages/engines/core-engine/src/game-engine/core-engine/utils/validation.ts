import { logger } from "~/game-engine/core-engine/utils/logger";
import type { Zone } from "../engine/zone-operation";
import {
  EntityNotFoundError,
  PermissionDeniedError,
  ValidationFailedError,
} from "../errors/consolidated-errors";
import type { CoreCtx } from "../state/context";

/**
 * Validates that a player ID exists in the context
 * @param ctx The context object
 * @param playerId The player ID to validate
 * @throws {EntityNotFoundError} If the player ID is invalid
 */
export function validatePlayerId(ctx: CoreCtx, playerId: string): void {
  if (!ctx.players[playerId]) {
    throw new EntityNotFoundError("player", playerId);
  }
}

/**
 * Validates that a player ID exists in the context
 * @param ctx The context object
 * @param playerId The player ID to validate
 * @returns True if the player ID is valid, false otherwise
 */
export function isValidPlayerId(ctx: CoreCtx, playerId: string): boolean {
  return Boolean(ctx.players[playerId]);
}

/**
 * Validates that a zone ID exists in the context
 * @param ctx The context object
 * @param zoneId The zone ID to validate
 * @throws {EntityNotFoundError} If the zone ID is invalid
 */
export function validateZoneId(ctx: CoreCtx, zoneId: string): void {
  if (!ctx.cardZones?.[zoneId]) {
    throw new EntityNotFoundError("zone", zoneId);
  }
}

/**
 * Validates that a zone ID exists in the context
 * @param ctx The context object
 * @param zoneId The zone ID to validate
 * @returns True if the zone ID is valid, false otherwise
 */
export function isValidZoneId(ctx: CoreCtx, zoneId: string): boolean {
  return Boolean(ctx.cardZones?.[zoneId]);
}

/**
 * Gets and validates a zone from the context
 * @param ctx The context object
 * @param zoneId The zone ID to retrieve
 * @param playerId Optional player ID to filter by
 * @throws {EntityNotFoundError} If the zone is not found
 * @returns The zone object
 */
export function getValidatedZone(
  ctx: CoreCtx,
  zoneId: string,
  playerId?: string,
): Zone {
  const zone =
    ctx.cardZones?.[zoneId] ||
    (playerId
      ? Object.values(ctx.cardZones || {}).find(
          (cardZone) => cardZone.owner === playerId && cardZone.name === zoneId,
        )
      : undefined);

  if (!zone) {
    throw new EntityNotFoundError("zone", zoneId, { playerId });
  }

  return zone;
}

/**
 * Validates that a card instance ID exists for a player
 * @param ctx The context object
 * @param playerId The player ID
 * @param instanceId The card instance ID to validate
 * @throws {EntityNotFoundError} If the card instance ID is invalid
 */
export function validateCardInstanceId(
  ctx: CoreCtx,
  playerId: string,
  instanceId: string,
): void {
  if (!ctx.cards[playerId]?.[instanceId]) {
    throw new EntityNotFoundError("card", instanceId, { playerId });
  }
}

/**
 * Validates that a card instance ID exists for a player
 * @param ctx The context object
 * @param playerId The player ID
 * @param instanceId The card instance ID to validate
 * @returns True if the card instance ID is valid, false otherwise
 */
export function isValidCardInstanceId(
  ctx: CoreCtx,
  playerId: string,
  instanceId: string,
): boolean {
  return Boolean(ctx.cards[playerId]?.[instanceId]);
}

/**
 * Validates that a card instance ID exists in a specific zone
 * @param ctx The context object
 * @param zoneId The zone ID
 * @param instanceId The card instance ID to validate
 * @throws {EntityNotFoundError} If the zone is not found
 * @throws {ValidationFailedError} If the card is not in the zone
 */
export function validateCardInZone(
  ctx: CoreCtx,
  zoneId: string,
  instanceId: string,
): void {
  const zone = ctx.cardZones?.[zoneId];

  if (!zone) {
    throw new EntityNotFoundError("zone", zoneId);
  }

  if (!zone.cards.includes(instanceId)) {
    throw new ValidationFailedError(
      "zone",
      zoneId,
      "cards",
      `to include card ${instanceId}`,
    );
  }
}

/**
 * Validates that a card instance ID exists in a specific zone
 * @param ctx The context object
 * @param zoneId The zone ID
 * @param instanceId The card instance ID to validate
 * @returns True if the card instance ID is in the zone, false otherwise
 */
export function isCardInZone(
  ctx: CoreCtx,
  zoneId: string,
  instanceId: string,
): boolean {
  const zone = ctx.cardZones?.[zoneId];
  return Boolean(zone && zone.cards.includes(instanceId));
}

/**
 * Validates that a player has priority
 * @param ctx The context object
 * @param playerId The player ID to check
 * @throws {ValidationFailedError} If the priority player position is invalid
 * @throws {PermissionDeniedError} If the player does not have priority
 */
export function validatePlayerPriority(ctx: CoreCtx, playerId: string): void {
  if (
    ctx.priorityPlayerPos < 0 ||
    ctx.priorityPlayerPos >= ctx.playerOrder.length
  ) {
    throw new ValidationFailedError(
      "state",
      "game",
      "priorityPlayerPos",
      "valid priority player position",
      ctx.priorityPlayerPos,
    );
  }

  if (ctx.playerOrder[ctx.priorityPlayerPos] !== playerId) {
    throw new PermissionDeniedError(
      playerId,
      "claim priority",
      `current priority belongs to ${ctx.playerOrder[ctx.priorityPlayerPos]}`,
    );
  }
}

/**
 * Validates that a player has priority
 * @param ctx The context object
 * @param playerId The player ID to check
 * @returns True if the player has priority, false otherwise
 */
export function hasPlayerPriority(ctx: CoreCtx, playerId: string): boolean {
  if (
    ctx.priorityPlayerPos < 0 ||
    ctx.priorityPlayerPos >= ctx.playerOrder.length
  ) {
    return false;
  }
  return ctx.playerOrder[ctx.priorityPlayerPos] === playerId;
}

/**
 * Validates that a player is the current turn player
 * @param ctx The context object
 * @param playerId The player ID to check
 * @throws {ValidationFailedError} If the turn player position is invalid
 * @throws {PermissionDeniedError} If the player is not the turn player
 */
export function validatePlayerTurn(ctx: CoreCtx, playerId: string): void {
  if (ctx.turnPlayerPos < 0 || ctx.turnPlayerPos >= ctx.playerOrder.length) {
    throw new ValidationFailedError(
      "state",
      "game",
      "turnPlayerPos",
      "valid turn player position",
      ctx.turnPlayerPos,
    );
  }

  if (ctx.playerOrder[ctx.turnPlayerPos] !== playerId) {
    throw new PermissionDeniedError(
      playerId,
      "take turn",
      `current turn belongs to ${ctx.playerOrder[ctx.turnPlayerPos]}`,
    );
  }
}

/**
 * Validates that a player is the current turn player
 * @param ctx The context object
 * @param playerId The player ID to check
 * @returns True if the player is the turn player, false otherwise
 */
export function isPlayerTurn(ctx: CoreCtx, playerId: string): boolean {
  if (ctx.turnPlayerPos < 0 || ctx.turnPlayerPos >= ctx.playerOrder.length) {
    return false;
  }
  return ctx.playerOrder[ctx.turnPlayerPos] === playerId;
}

/**
 * Validates the player order in the context
 * @param ctx The context object
 * @throws {ValidationFailedError} If the player order is invalid
 * @throws {EntityNotFoundError} If a player in the player order doesn't exist
 */
export function validatePlayerOrder(ctx: CoreCtx): void {
  if (!Array.isArray(ctx.playerOrder) || ctx.playerOrder.length === 0) {
    logger.error(`Invalid playerOrder: ${ctx.playerOrder} in context`, ctx);
    throw new ValidationFailedError(
      "state",
      "game",
      "playerOrder",
      "non-empty array",
      String(ctx.playerOrder),
    );
  }

  // Check that every player in playerOrder exists in ctx.players
  for (const playerId of ctx.playerOrder) {
    if (!ctx.players[playerId]) {
      logger.error(`Player ${playerId} not found in players list.`, ctx);
      throw new EntityNotFoundError("player", playerId);
    }
  }
}

/**
 * Validates that a zone belongs to a player
 * @param zone The zone to validate
 * @param playerId The player ID to check
 * @throws {PermissionDeniedError} If the zone does not belong to the player
 */
export function validateZoneOwnership(zone: Zone, playerId: string): void {
  if (zone.owner !== playerId) {
    throw new PermissionDeniedError(
      playerId,
      "access zone",
      `zone ${zone.id} belongs to player ${zone.owner}`,
    );
  }
}

/**
 * Validates that a zone is not empty
 * @param zone The zone to validate
 * @throws {ValidationFailedError} If the zone is empty
 */
export function validateZoneNotEmpty(zone: Zone): void {
  if (zone.cards.length === 0) {
    throw new ValidationFailedError(
      "zone",
      zone.id,
      "cards.length",
      "greater than 0",
      0,
    );
  }
}

/**
 * Validates the entire context structure
 * @param context The context to validate
 * @throws {ValidationFailedError} If any validation check fails
 * @throws {EntityNotFoundError} If a required entity is not found
 */
export function validateContextStructure(context: CoreCtx): void {
  // Check player IDs match
  for (const playerId in context.cards) {
    if (context.players[playerId]?.id !== playerId) {
      throw new ValidationFailedError(
        "player",
        playerId,
        "id",
        playerId,
        context.players[playerId]?.id || "undefined",
      );
    }
  }

  // Check for duplicate card instance IDs
  for (const playerId in context.cards) {
    const playerCards = context.cards[playerId];
    const cardIds = new Set<string>();

    for (const cardId in playerCards) {
      if (cardIds.has(cardId)) {
        throw new ValidationFailedError(
          "player",
          playerId,
          "cards",
          "unique card instance IDs",
          `duplicate ID: ${cardId}`,
        );
      }

      cardIds.add(cardId);
    }
  }

  // Validate player order
  validatePlayerOrder(context);

  // Validate zones
  for (const zoneId in context.cardZones || {}) {
    const zone = context.cardZones[zoneId];

    if (zone.id !== zoneId) {
      throw new ValidationFailedError("zone", zoneId, "id", zoneId, zone.id);
    }

    if (!context.players[zone.owner]) {
      throw new EntityNotFoundError("player", zone.owner, {
        context: "zone owner validation",
      });
    }

    if (!Array.isArray(zone?.cards)) {
      throw new ValidationFailedError(
        "zone",
        zoneId,
        "cards",
        "array",
        typeof zone?.cards,
      );
    }

    // Check if all cards in the zone are valid instance IDs
    for (const cardId of zone.cards) {
      if (typeof cardId !== "string" || cardId.trim() === "") {
        throw new ValidationFailedError(
          "zone",
          zoneId,
          "cards",
          "valid card IDs",
          String(cardId),
        );
      }

      // This check might be too strict if cards can be in zones without being in context.cards
      // Consider making this optional or configurable
      if (!context.cards[zone.owner]?.[cardId]) {
        throw new EntityNotFoundError("card", cardId, {
          playerId: zone.owner,
          zoneId,
        });
      }
    }
  }
}
