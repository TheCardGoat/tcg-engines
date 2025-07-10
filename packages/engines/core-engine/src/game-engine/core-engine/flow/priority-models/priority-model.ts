import type { CoreEngineState } from "../../game-configuration";
import type { FlowManager } from "../flow-manager";

/**
 * Interface for different priority models
 * This allows games to define custom priority behavior
 */
export interface PriorityModel<G = any> {
  /**
   * Gets the player who should have initial priority
   * @param ctx Game context
   * @returns Player ID who should get priority first
   */
  getInitialPriority: (ctx: any) => string;

  /**
   * Gets the next player in priority order
   * @param state Current game state
   * @returns Next player ID who should get priority
   */
  getNextPriority: (state: CoreEngineState<G>) => string | null;

  /**
   * Handles what happens when priority passes all the way around
   * @param state Current game state
   * @param flowManager Flow manager instance
   * @returns Advancement information or null if no advancement should occur
   */
  handlePriorityCompletion: (
    state: CoreEngineState<G>,
    flowManager: FlowManager<G>,
  ) => {
    advancementType: "nextStep" | "nextPhase" | "nextTurn" | null;
    nextId?: string;
  };
}
