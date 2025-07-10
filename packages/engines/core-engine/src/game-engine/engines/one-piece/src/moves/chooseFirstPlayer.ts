import type { Move } from "~/game-engine/core-engine/move/move-types";
import type { OnePieceGameState } from "../one-piece-engine-types";

/**
 * Choose First Player move for One Piece TCG
 *
 * Based on One Piece rules:
 * - Both players determine Player One and Player Two using a method such as rock paper scissors
 * - The winner decides who becomes Player One
 */
export const chooseFirstPlayer: Move<OnePieceGameState> = (
  { G, coreOps },
  targetPlayerId: string,
) => {
  coreOps.setOTP(targetPlayerId);
  return G;
};
