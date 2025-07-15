/**
 * Test utilities for working with cards in tests
 *
 * Note: Mock card creation functions have been moved to mock-factories.ts
 * This file contains utilities for manipulating cards in test contexts
 */
import type { CoreCtx } from "../../state/context";
import type { InstanceId, PlayerID, PublicId } from "../../types/core-types";

/**
 * Adds a card to a player's collection in the context
 */
export function addCardToPlayer(
  ctx: CoreCtx,
  playerId: PlayerID,
  instanceId: InstanceId,
  publicId: PublicId,
  properties: Record<string, any> = {},
): CoreCtx {
  // Create a deep copy of the context
  const newCtx = JSON.parse(JSON.stringify(ctx));

  // Ensure player exists
  if (!newCtx.cards[playerId]) {
    newCtx.cards[playerId] = {};
  }

  // Add card to player's collection
  newCtx.cards[playerId][instanceId] = {
    id: instanceId,
    definition: publicId,
    ...properties,
  };

  return newCtx;
}

/**
 * Adds a card to a zone in the context
 */
export function addCardToZone(
  ctx: CoreCtx,
  zoneId: string,
  instanceId: InstanceId,
  playerId?: PlayerID,
): CoreCtx {
  // Create a deep copy of the context
  const newCtx = JSON.parse(JSON.stringify(ctx));

  // Ensure zone exists
  if (!newCtx.cardZones[zoneId]) {
    throw new Error(`Zone ${zoneId} does not exist in context`);
  }

  // Add card to zone
  newCtx.cardZones[zoneId].cards.push(instanceId);

  // If player ID is provided, ensure the card exists in player's collection
  if (playerId && !newCtx.cards[playerId]?.[instanceId]) {
    throw new Error(`Card ${instanceId} does not exist for player ${playerId}`);
  }

  return newCtx;
}

/**
 * Moves a card from one zone to another in the context
 */
export function moveCardBetweenZones(
  ctx: CoreCtx,
  instanceId: InstanceId,
  fromZoneId: string,
  toZoneId: string,
): CoreCtx {
  // Create a deep copy of the context
  const newCtx = JSON.parse(JSON.stringify(ctx));

  // Ensure zones exist
  if (!newCtx.cardZones[fromZoneId]) {
    throw new Error(`Source zone ${fromZoneId} does not exist in context`);
  }

  if (!newCtx.cardZones[toZoneId]) {
    throw new Error(`Target zone ${toZoneId} does not exist in context`);
  }

  // Find card in source zone
  const fromZone = newCtx.cardZones[fromZoneId];
  const cardIndex = fromZone.cards.indexOf(instanceId);

  if (cardIndex === -1) {
    throw new Error(`Card ${instanceId} not found in zone ${fromZoneId}`);
  }

  // Remove card from source zone
  fromZone.cards.splice(cardIndex, 1);

  // Add card to target zone
  newCtx.cardZones[toZoneId].cards.push(instanceId);

  return newCtx;
}

/**
 * Creates a zone in the context
 */
export function createZone(
  ctx: CoreCtx,
  zoneId: string,
  owner: PlayerID,
  visibility: "public" | "private" | "hidden" = "public",
  cards: InstanceId[] = [],
): CoreCtx {
  // Create a deep copy of the context
  const newCtx = JSON.parse(JSON.stringify(ctx));

  // Create zone
  newCtx.cardZones[zoneId] = {
    id: zoneId,
    name: zoneId,
    owner,
    cards: [...cards],
    visibility,
  };

  return newCtx;
}
