import { createMove } from "@tcg/core";
import { useLorcanaOps } from "../../../operations";
import type { LorcanaCardMeta, LorcanaGameState, LorcanaMoveParams } from "../../../types";
import { and, cardInPlay, cardOwnedByPlayer, isMainPhase } from "../../../validators";

/**
 * Move Character to Location
 *
 * Rule 6.5: Characters can move to locations
 *
 * Requirements:
 * - Must be the main phase
 * - Character must be in play
 * - Character must be owned by the current player
 * - Location must be in play
 *
 * Effects:
 * - Character gains location bonuses
 * - Character counts toward location conditions
 */
export const moveCharacterToLocation = createMove<
  LorcanaGameState,
  LorcanaMoveParams,
  "moveCharacterToLocation",
  LorcanaCardMeta
>({
  condition: and(
    isMainPhase(),
    (state, context) => cardInPlay(context.params.characterId)(state, context),
    (state, context) => cardOwnedByPlayer(context.params.characterId)(state, context),
    (state, context) => cardInPlay(context.params.locationId)(state, context),
  ),
  reducer: (_draft, context) => {
    const { characterId, locationId } = context.params;
    const ops = useLorcanaOps(context);

    ops.moveToLocation(characterId, locationId);
  },
});
