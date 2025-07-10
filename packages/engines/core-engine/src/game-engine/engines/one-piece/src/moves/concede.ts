import type { Move } from "~/game-engine/core-engine/move/move-types";
import type { OnePieceGameState } from "../one-piece-engine-types";

/**
 * Concede move for One Piece TCG
 *
 * Player forfeits the game, making the opponent the winner
 */
export const concede: Move<OnePieceGameState> = ({
  G,
  ctx,
  playerID,
  coreOps,
}) => {
  coreOps.concede(playerID);

  return G;
};
