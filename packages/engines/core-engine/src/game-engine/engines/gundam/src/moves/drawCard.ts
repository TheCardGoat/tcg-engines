import type { GundamMove } from "./types";

/**
 * Draw Card Move - Implementation of Rule 6-3-1
 * The active player draws one card from their deck and adds it to their hand.
 * If they draw a card and their deck then has no cards in it, they immediately lose the game.
 */
export const drawCardMove: GundamMove = ({ G, coreOps, playerID }) => {
  const newG = { ...G };
  const currentPlayer = playerID;

  // 7-3-1-1. When they draw a card and their deck then has no cards in it, they immediately lose the game.
  const deck = coreOps.getZone("deck", currentPlayer);
  if (deck.cards.length === 0) {
    // If the deck is empty, the player loses the game
    newG.winner = Object.keys(newG.players).find((id) => id !== currentPlayer);
    return newG;
  }

  coreOps.moveCard({
    playerId: currentPlayer,
    from: "deck",
    to: "hand",
    destination: "end",
  });

  return newG;
};
