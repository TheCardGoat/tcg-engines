import type { GundamMove } from "./types";

/**
 * Implementation of the Gundam Card Game mulligan rule:
 *
 * 5-2-1-6. Starting with Player One, each player decides if they will redraw their hand one time.
 * Players are not required to redraw if they do not wish to.
 *
 * 5-2-1-6-1. If you decide to redraw, return your entire hand to the bottom of your deck
 * and draw five new cards, which will become your new starting hand. Then, shuffle your deck.
 */
export const redrawHandMove: GundamMove = (
  { G, coreOps, playerID, ctx },
  redrawHand: boolean,
) => {
  const currentPlayer = playerID;

  // Check if player has already made their mulligan decision
  if (!ctx.pendingMulligan?.has(currentPlayer)) {
    // Player has already made their decision, ignore this move
    return G;
  }

  // Track that this player has made their mulligan decision using core operation
  coreOps.playerHasMulliganed(currentPlayer);

  // If player chose to redraw their hand
  if (redrawHand) {
    // Get all cards from player's hand
    const handZone = coreOps.getZone("hand", currentPlayer);
    const cardsToMove = [...handZone.cards];

    // Step 1: Move all cards from hand to bottom of deck
    for (const cardId of cardsToMove) {
      coreOps.moveCard({
        playerId: currentPlayer,
        instanceId: cardId,
        from: "hand",
        to: "deck",
        destination: "end",
      });
    }

    // Step 2: Draw 5 new cards from the top of the deck
    const cardsInDeck = coreOps.getZone("deck", currentPlayer).cards.length;
    const cardsToDraw = 5;
    const numToDraw = Math.min(cardsToDraw, cardsInDeck);

    for (let i = 0; i < numToDraw; i++) {
      coreOps.moveCard({
        playerId: currentPlayer,
        from: "deck",
        to: "hand",
        destination: "end",
      });
    }

    // Step 3: Shuffle the deck (after redraw is complete)
    coreOps.shuffleZone("deck", currentPlayer);
  }

  // Pass priority to the next player who hasn't made their mulligan decision
  coreOps.passPriority();

  return G;
};
