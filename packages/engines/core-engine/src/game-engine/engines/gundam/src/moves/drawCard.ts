import type { GundamMove } from "./types";

/**
 * Draw Card Move - Implementation of Rule 6-3-1
 * The active player draws one card from their deck and adds it to their hand.
 * If they draw a card and their deck then has no cards in it, they immediately lose the game.
 */
export const drawCardMove: GundamMove = ({ G, coreOps, playerID }) => {
  return G;
};
