import { createMove } from "@tcg/core";
import { useLorcanaOps } from "../../../operations";
import type { LorcanaCardMeta, LorcanaGameState, LorcanaMoveParams } from "../../../types";
import { and, canQuest, isMainPhase } from "../../../validators";

/**
 * Quest Move
 *
 * Rule 4.3.5: Exert character to gain lore
 *
 * Requirements:
 * - Character is ready (not exerted)
 * - Character is not drying (summoning sickness)
 * - Character has Lore value > 0
 * - Haven't quested with this character this turn
 *
 * Effects:
 * - Exert the character
 * - Add Lore value to player's lore count
 * - Mark character as having quested this turn
 */
export const quest = createMove<LorcanaGameState, LorcanaMoveParams, "quest", LorcanaCardMeta>({
  condition: and(isMainPhase(), (state, context) =>
    canQuest(context.params.cardId)(state, context),
  ),
  reducer: (draft, context) => {
    const { cardId } = context.params;
    const ops = useLorcanaOps(context);

    // Exert the character
    ops.exertCard(cardId);

    // Add lore (simplified - assume 1 lore per quest)
    // In full implementation, would read Lore value from card definition
    ops.addLore(draft, context.playerId, 1);

    // Mark as quested
    context.trackers?.mark(`quested:${cardId}`, context.playerId);
  },
});
