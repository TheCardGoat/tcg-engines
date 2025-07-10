import {
  getCurrentPriorityPlayer,
  getCurrentTurnPlayer,
} from "../../state/context";
import type { PriorityModel } from "./priority-model";

/**
 * APNAP Priority Model (Active Player, Non-Active Player)
 * - Active player gets priority first
 * - Then non-active players get priority in turn order
 * - When priority cycles back to turn player, game advances
 */
export function createAPNAPPriorityModel<G = any>(): PriorityModel<G> {
  return {
    getInitialPriority: (ctx) => {
      // Priority always starts with the turn player
      return getCurrentTurnPlayer(ctx);
    },

    getNextPriority: (state) => {
      const ctx = state.ctx;
      const turnPlayer = getCurrentTurnPlayer(ctx);
      const currentPlayer = getCurrentPriorityPlayer(ctx);

      // If current player is turn player, pass to first non-turn player
      if (currentPlayer === turnPlayer) {
        const nonActivePlayer = ctx.playerOrder.find((p) => p !== turnPlayer);
        return nonActivePlayer || null;
      }

      // Otherwise, check if we're at the last player
      const currentPlayerIdx = ctx.playerOrder.indexOf(currentPlayer);
      const nextPlayerIdx = currentPlayerIdx + 1;

      // If there are more players, go to the next one
      if (
        nextPlayerIdx < ctx.playerOrder.length &&
        ctx.playerOrder[nextPlayerIdx] !== turnPlayer
      ) {
        return ctx.playerOrder[nextPlayerIdx];
      }

      // If we've gone through all non-active players, go back to turn player
      return turnPlayer;
    },

    handlePriorityCompletion: (state, flowController) => {
      // Use flow controller to determine proper advancement
      return flowController.getAutomaticAdvancement(state);
    },
  };
}
