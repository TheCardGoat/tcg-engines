/**
 * Riftbound Operations
 *
 * Core game operations for manipulating game state.
 */

import type { CardId } from "@tcg/riftbound-types";
import { produce } from "immer";
import type { PlayerId, RiftboundState } from "../types";

/**
 * Draw cards from deck to hand
 *
 * @param state - Current game state
 * @param playerId - Player drawing cards
 * @param count - Number of cards to draw
 * @returns Updated game state
 */
export function drawCards(
  state: RiftboundState,
  playerId: PlayerId,
  count: number,
): RiftboundState {
  return produce(state, (draft) => {
    const playerZones = draft.zones[playerId];
    const cardsToDraw = Math.min(count, playerZones.deck.length);

    for (let i = 0; i < cardsToDraw; i++) {
      const card = playerZones.deck.shift();
      if (card) {
        playerZones.hand.push(card);
      }
    }
  });
}

/**
 * Move a card between zones
 *
 * @param state - Current game state
 * @param playerId - Player who owns the card
 * @param cardId - Card to move
 * @param fromZone - Source zone
 * @param toZone - Destination zone
 * @returns Updated game state
 */
export function moveCard(
  state: RiftboundState,
  playerId: PlayerId,
  cardId: CardId,
  fromZone: keyof RiftboundState["zones"][PlayerId],
  toZone: keyof RiftboundState["zones"][PlayerId],
): RiftboundState {
  return produce(state, (draft) => {
    const playerZones = draft.zones[playerId];
    const fromArray = playerZones[fromZone] as CardId[];
    const toArray = playerZones[toZone] as CardId[];

    const cardIndex = fromArray.indexOf(cardId);
    if (cardIndex !== -1) {
      fromArray.splice(cardIndex, 1);
      toArray.push(cardId);
    }
  });
}

/**
 * Deal damage to a player
 *
 * @param state - Current game state
 * @param playerId - Player receiving damage
 * @param amount - Amount of damage
 * @returns Updated game state
 */
export function dealDamageToPlayer(
  state: RiftboundState,
  playerId: PlayerId,
  amount: number,
): RiftboundState {
  return produce(state, (draft) => {
    const player = draft.players[playerId];
    player.health = Math.max(0, player.health - amount);
  });
}

/**
 * Add resources to a player
 *
 * @param state - Current game state
 * @param playerId - Player receiving resources
 * @param amount - Amount of resources to add
 * @returns Updated game state
 */
export function addResources(
  state: RiftboundState,
  playerId: PlayerId,
  amount: number,
): RiftboundState {
  return produce(state, (draft) => {
    const player = draft.players[playerId];
    player.resources += amount;
  });
}
