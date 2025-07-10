import type { Move } from "~/game-engine/core-engine/move/move-types";
import type { OnePieceGameState } from "../one-piece-engine-types";

/**
 * End Phase move for One Piece TCG
 *
 * Player manually ends the current phase
 */
export const endPhase: Move<OnePieceGameState> = ({ G, ctx, coreOps }) => {
  // TODO: Implement proper phase ending mechanism
  // For now, this is a no-op move
  return G;
};
