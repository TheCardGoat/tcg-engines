import type { GundamMove } from "./types";

/**
 * Implementation of the Gundam Card Game rule to choose first player:
 *
 * 5-2-1-4. Both players determine Player One and Player Two using a method such as rock paper scissors.
 * The winner decides who becomes Player One.
 */
export const chooseFirstPlayer: GundamMove = (
  { G, coreOps },
  targetPlayerId: string,
) => {
  // Set one-time player (the player who goes first)
  coreOps.setOTP(targetPlayerId);

  // Set the priority player to the chosen first player
  coreOps.setPriorityPlayer(targetPlayerId);

  // Also set the turn player for phases that need it
  coreOps.setTurnPlayer(targetPlayerId);

  return G;
};
