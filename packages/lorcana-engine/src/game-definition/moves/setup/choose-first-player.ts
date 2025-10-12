import { createMove } from "@tcg/core";
import type {
  LorcanaCardMeta,
  LorcanaGameState,
  LorcanaMoveParams,
} from "../../../types/move-params";

/**
 * Choose Who Goes First Move
 *
 * Rule 3.1.1: First player determined randomly
 *
 * The engine handles:
 * - Setting activePlayer
 * - Initializing turn counter
 * - Transitioning to first phase
 *
 * This move just serves as a trigger point for game start.
 */
export const chooseWhoGoesFirstMove = createMove<
  LorcanaGameState,
  LorcanaMoveParams,
  "chooseWhoGoesFirstMove",
  LorcanaCardMeta
>({
  reducer: (_draft, _context) => {
    // Engine handles activePlayer, turn, and phase transitions
    // No manual state management needed
  },
});
