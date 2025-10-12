import { createMove, type ZoneId } from "@tcg/core";
import type {
  LorcanaCardMeta,
  LorcanaGameState,
  LorcanaMoveParams,
} from "../../../types";

/**
 * Alter Hand Move (Mulligan)
 *
 * Rule 3.1.6: Players may mulligan by putting cards on bottom of deck
 *
 * Process:
 * 1. Put selected cards on bottom of deck
 * 2. Shuffle deck
 * 3. Draw 7 new cards
 */
export const alterHand = createMove<
  LorcanaGameState,
  LorcanaMoveParams,
  "alterHand",
  LorcanaCardMeta
>({
  reducer: (_draft, context) => {
    const { playerId, cardsToMulligan } = context.params;

    // Put selected cards on bottom of deck, then shuffle and draw 7
    context.zones.mulligan({
      hand: "hand" as ZoneId,
      deck: "deck" as ZoneId,
      drawCount: 7,
      playerId,
    });

    // Remove player from pending mulligan list
    context.game.removePendingMulligan(playerId);

    // Switch priority to the next pending player
    const pendingMulligan = context.game.getPendingMulligan();
    if (pendingMulligan.length > 0 && context.flow?.setCurrentPlayer) {
      // Set priority to the next player who needs to mulligan
      context.flow.setCurrentPlayer(pendingMulligan[0]);
    }

    // If all players have completed mulligan, transition to main game
    if (pendingMulligan.length === 0 && context.flow) {
      // End the mulligan phase, which will trigger segment transition
      context.flow.endPhase();
    }
  },
});
