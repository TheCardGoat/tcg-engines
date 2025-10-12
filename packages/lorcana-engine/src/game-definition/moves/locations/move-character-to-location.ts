import { createMove } from "@tcg/core";
import { useLorcanaOps } from "../../../operations";
import type {
  LorcanaCardMeta,
  LorcanaGameState,
  LorcanaMoveParams,
} from "../../../types/move-params";
import { and, cardInPlay, isMainPhase } from "../../../validators";

/**
 * Move Character to Location
 *
 * Rule 6.5: Characters can move to locations
 *
 * Requirements:
 * - Character must be in play
 * - Location must be in play
 * - Location must have available slots
 * - Character must meet location requirements
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
    (state, context) => cardInPlay(context.params.locationId)(state, context),
  ),
  reducer: (_draft, context) => {
    const { characterId, locationId } = context.params;
    const ops = useLorcanaOps(context);

    ops.moveToLocation(characterId, locationId);
  },
});
