import { createInvalidMove } from "~/game-engine/core-engine/move/move-types";
import { getCurrentTurnPlayer } from "~/game-engine/core-engine/state/context";

import { logger } from "~/game-engine/core-engine/utils/logger";

import type { GundamMove } from "./types";

// **7.5.5.** End of the Main Phase
// **7.5.5-1.** In addition to the actions listed above,
// the active player may declare the end of the main phase during their main phase.
// **7.5.5-2.** When the end of the main phase is
// declared, the turn immediately enters the end phase.

export const endMainPhaseMove: GundamMove = {
  execute: ({ G, coreOps, playerID }) => {
    try {
      const gundamOps = coreOps;
      const ctx = gundamOps.getCtx();

      const currentTurnPlayer = getCurrentTurnPlayer(ctx);
      if (currentTurnPlayer !== playerID && ctx.otp !== playerID) {
        logger.error(`Player ${playerID} cannot pass turn - not their turn`);
        return createInvalidMove(
          "NOT_YOUR_TURN",
          "moves.endMainPhase.errors.notYourTurn",
          { playerId: playerID, currentTurnPlayer },
        );
      }

      // Delegate to FlowManager to handle turn transition
      // This will transition to endOfTurnPhase which will add endOfTurn effects to bag
      // and eventually transition to next player's beginningPhase
      gundamOps.endPhase("endOfTurnPhase");

      return G;
    } catch (error) {
      logger.error(`Unexpected error in passTurnMove: ${error}`);
      return createInvalidMove(
        "UNEXPECTED_ERROR",
        "moves.passTurn.errors.unexpectedError",
        { error: String(error), playerId: playerID },
      );
    }
  },
};
