import type { Move } from "~/game-engine/core-engine/move/move-types";
import type { OnePieceGameState } from "../one-piece-engine-types";

/**
 * Mulligan move for One Piece TCG
 *
 * Based on One Piece rules:
 * - Each player may redraw their hand one time
 * - If you decide to redraw, return your entire hand to the bottom of your deck
 * - Draw 5 new cards, which will become your new starting hand
 * - Then, shuffle your deck
 */
export const mulligan: Move<OnePieceGameState> = (
  { G, coreOps, playerID },
  redraw: boolean,
) => {
  // Use getCtx if needed instead of directly accessing ctx
  // const ctx = coreOps.getCtx();

  if (redraw) {
    // Return entire hand to bottom of deck
    const handZone = coreOps.getZone("hand", playerID);
    const handCards = [...handZone.cards]; // Copy to avoid mutation during iteration

    for (const instanceId of handCards) {
      coreOps.moveCard({
        playerId: playerID,
        instanceId,
        from: "hand",
        to: "deck",
        destination: "start",
      });
    }

    // Shuffle deck
    coreOps.shuffleZone("deck", playerID);

    // Draw 5 new cards
    for (let i = 0; i < 5; i++) {
      const deckZone = coreOps.getZone("deck", playerID);
      if (deckZone.cards.length > 0) {
        coreOps.moveCard({
          playerId: playerID,
          from: "deck",
          to: "hand",
          destination: "end",
        });
      }
    }
  }

  // Remove player from pending mulligan
  coreOps.playerHasMulliganed(playerID);

  return G;
};
