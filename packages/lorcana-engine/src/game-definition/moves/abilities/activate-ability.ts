import { createMove } from "@tcg/core";
import type { LorcanaCardMeta, LorcanaGameState, LorcanaMoveParams } from "../../../types";
import { and, isMainPhase } from "../../../validators";

/**
 * Activate Ability
 *
 * Rule 7: Abilities with costs can be activated
 *
 * Process:
 * 1. Look up the ability from card definition using context.registry.getCard()
 * 2. Verify ability requirements are met (via conditions)
 * 3. Pay the cost (exert, discard, etc.) using operations
 * 4. Execute the effect
 *
 * TODO: Full implementation requires:
 * - Ability definition system: Need to define abilities with costs and effects in card definitions
 * - Cost payment system: Extend LorcanaOperations with ability cost payment (exert, discard, ink)
 * - Effect execution system: Framework for executing ability effects with proper timing
 * - Targeting system: Allow players to select targets for abilities
 * - Validation: Ensure ability can be activated (not already used this turn, costs can be paid, etc.)
 *
 * Example usage once implemented:
 * ```
 * const card = context.registry.getCard(cardId);
 * const ability = card.abilities?.find(a => a.id === abilityId);
 * if (ability) {
 *   ops.payCost(ability.cost);
 *   executeEffect(ability.effect, ability.targets);
 * }
 * ```
 */
export const activateAbility = createMove<
  LorcanaGameState,
  LorcanaMoveParams,
  "activateAbility",
  LorcanaCardMeta
>({
  condition: and(isMainPhase()),
  reducer: (_draft, _context) => {
    // TODO: Implement ability activation logic
    // This would require:
    // 1. Looking up the ability from card definition
    // 2. Paying the cost
    // 3. Executing the effect
  },
});
