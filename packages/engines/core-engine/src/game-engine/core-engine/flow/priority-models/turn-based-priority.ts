import { getCurrentTurnPlayer } from "../../state/context";
import { getNextPlayerInTurnOrder } from "../flow-manager";
import type { PriorityModel } from "./priority-model";

/**
 * Turn-Based Priority Model (like Magic: The Gathering)
 * - Active player gets priority first
 * - Priority passes around the table in turn order
 * - When priority cycles back to turn player with no actions taken, game advances
 */
export function createTurnBasedPriorityModel<G = any>(): PriorityModel<G> {
  return {
    getInitialPriority: (ctx) => {
      // Priority always starts with the turn player
      return getCurrentTurnPlayer(ctx);
    },

    getNextPriority: (state) => {
      // Get next player in turn order
      return getNextPlayerInTurnOrder(state);
    },

    handlePriorityCompletion: (state, flowManager) => {
      // Use flow manager to determine proper advancement
      return flowManager.getAutomaticAdvancement(state);
    },
  };
}
