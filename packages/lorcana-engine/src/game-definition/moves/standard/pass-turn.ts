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
  reducer: (_draft, _context) => {
    // Engine handles turn transitions automatically
    // No manual state management needed
  },
});
