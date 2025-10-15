import { createMove } from "@tcg/core";
import type {
  LorcanaCardMeta,
  LorcanaGameState,
  LorcanaMoveParams,
} from "../../../types/move-params";

/**
 * Pass Turn
 *
 * Rule 4.1.2: Player completes their turn
 *
 * Effects:
 * - End current phase
 * - Pass turn to next player
 * - Reset turn-based trackers
 * - Ready all cards (in beginning phase)
 *
 * The engine handles all turn transition logic automatically.
 */
export const passTurn = createMove<
  LorcanaGameState,
  LorcanaMoveParams,
  "passTurn",
  LorcanaCardMeta
>({
  condition: (state, context) => {
    // Cannot pass turn during setup phases
    const phase = context.flow?.currentPhase;
    if (phase === "chooseFirstPlayer" || phase === "mulligan") {
      return false;
    }

    // Can only pass turn if it's your turn
    if (
      context.flow?.currentPlayer &&
      context.flow.currentPlayer !== context.playerId
    ) {
      return false;
    }

    return true;
  },
  reducer: (_draft, _context) => {
    // Engine handles turn transitions automatically
    // No manual state management needed
  },
});
