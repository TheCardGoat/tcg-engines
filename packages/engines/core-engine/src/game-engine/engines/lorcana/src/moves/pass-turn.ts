import { createInvalidMove } from "~/game-engine/core-engine/move/move-types";
import { getCurrentTurnPlayer } from "~/game-engine/core-engine/state/context";
import { logger } from "~/game-engine/core-engine/utils/logger";
import type { LorcanaMove } from "./types";
import { toLorcanaCoreOps } from "./types";

// **4.4.1.** To end a turn, there must be no abilities currently waiting to resolve. The active player declares the end of their turn.
// This creates the start of the End of Turn Phase (see 4.1.4).
// **4.4.1.4.** The turn ends for the active player, and the next player begins their turn.

export const passTurnMove: LorcanaMove = {
  execute: ({ G, coreOps, playerID }) => {
    try {
      const lorcanaOps = coreOps;
      const ctx = lorcanaOps.getCtx();

      const currentTurnPlayer = getCurrentTurnPlayer(ctx);
      if (currentTurnPlayer !== playerID && ctx.otp !== playerID) {
        logger.error(`Player ${playerID} cannot pass turn - not their turn`);
        return createInvalidMove(
          "NOT_YOUR_TURN",
          "moves.passTurn.errors.notYourTurn",
          { playerId: playerID, currentTurnPlayer },
        );
      }

      // Rule 4.4.1: There must be no abilities currently waiting to resolve
      // Check if the bag has any pending effects that need to be resolved
      if (G.bag && G.bag.length > 0) {
        logger.error(
          `Cannot pass turn while abilities are waiting to resolve (${G.bag.length} effects in bag)`,
        );

        return createInvalidMove(
          "ABILITIES_PENDING",
          "moves.passTurn.errors.abilitiesPending",
          { pendingEffects: G.bag.length, playerId: playerID },
        );
      }

      // Clear turn actions for the next turn
      // Turn actions like putCardIntoInkwell are limited to once per turn
      G.turnActions = undefined;

      // Delegate to FlowManager to handle turn transition
      // This will transition to endOfTurnPhase which will add endOfTurn effects to bag
      // and eventually transition to next player's beginningPhase
      coreOps.endPhase("endOfTurnPhase");

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
