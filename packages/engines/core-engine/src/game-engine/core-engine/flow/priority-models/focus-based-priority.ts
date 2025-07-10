import type { CoreEngineState } from "../../game-configuration";
import { getCurrentTurnPlayer } from "../../state/context";
import type { PriorityModel } from "./priority-model";

/**
 * Focus-Based Priority Model (like Riftbound)
 * - Players gain "focus" which gives them priority
 * - Focus can shift based on game-specific rules
 * - Game can define custom rules for determining next focus player
 */
export function createFocusBasedPriorityModel<G = any>(
  // Game-specific function to determine next focus player
  determineNextFocusPlayer: (state: CoreEngineState<G>) => string | null,
): PriorityModel<G> {
  return {
    getInitialPriority: (ctx) => {
      // Focus starts with turn player by default
      return getCurrentTurnPlayer(ctx);
    },

    getNextPriority: (state) => {
      // Use the provided function to determine who gets focus next
      return determineNextFocusPlayer(state);
    },

    handlePriorityCompletion: (state, flowController) => {
      // Use flow controller to determine proper advancement
      return flowController.getAutomaticAdvancement(state);
    },
  };
}
