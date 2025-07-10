/**
 * Concede move for Alpha Clash TCG
 *
 * Allows a player to concede the game, ending it immediately
 */

import { logger } from "~/game-engine/core-engine/utils/logger";
import type { AlphaClashMove } from "./types";

export const concede: AlphaClashMove = ({ G, playerID, coreOps }) => {
  if (!playerID) {
    logger.warn("Concede: No player ID provided");
    return G; // Return unchanged state for invalid move
  }

  logger.info(`Player ${playerID} is conceding the game`);

  // Find the opponent (winner)
  const players = coreOps.getPlayers();
  const winner = players.find((id) => id !== playerID);

  // Mark the game as ended and set the winner
  const newGameState = {
    ...G,
    gameEnded: true,
    winner,
  };

  return newGameState;
};
