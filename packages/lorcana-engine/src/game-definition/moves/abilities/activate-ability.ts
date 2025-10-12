import { createMove } from "@tcg/core";
import type {
  LorcanaCardMeta,
  LorcanaGameState,
  LorcanaMoveParams,
} from "../../../types/move-params";
import { and, isMainPhase } from "../../../validators";

/**
 * Activate Ability
 *
 * Rule 7: Abilities with costs can be activated
 *
 * Process:
 * 1. Look up the ability from card definition
 * 2. Verify ability requirements are met
 * 3. Pay the cost (exert, discard, etc.)
 * 4. Execute the effect
 *
 * TODO: Full implementation requires:
 * - Card definition system with ability definitions
 * - Cost payment system
 * - Effect execution system
 * - Targeting system
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
