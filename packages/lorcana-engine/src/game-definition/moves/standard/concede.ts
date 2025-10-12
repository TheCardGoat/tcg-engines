import { createMove } from "@tcg/core";
import type {
  LorcanaCardMeta,
  LorcanaGameState,
  LorcanaMoveParams,
} from "../../../types/move-params";

/**
 * Concede
 *
 * Rule 1.9.1.2: Player can concede at any time
 *
 * Effects:
 * - Current player loses immediately
 * - Game ends
 * - Other player(s) win
 *
 * The engine handles game end logic automatically.
 */
export const concede = createMove<
  LorcanaGameState,
  LorcanaMoveParams,
  "concede",
  LorcanaCardMeta
>({
  reducer: (draft, context) => {
    // Signal game end via context
    context.endGame?.({
      winner: undefined, // Other players win
      reason: "concede",
      metadata: { concedeBy: context.playerId },
    });
  },
});
