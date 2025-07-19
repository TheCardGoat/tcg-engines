import type { Move } from "~/game-engine/core-engine/move/move-types";
import type { OnePieceGameState } from "../one-piece-engine-types";

/**
 * End the current phase
 *
 * This move is used to manually end a phase
 */
export const endPhase: Move<OnePieceGameState> = ({ G, coreOps }) => {
  // Use getCtx if needed instead of directly accessing ctx
  // const ctx = coreOps.getCtx();

  // The flow manager will handle phase transitions
  return G;
};
