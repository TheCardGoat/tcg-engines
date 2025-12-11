import { createMove } from "@tcg/core";
import { useLorcanaOps } from "../../../operations";
import type {
  LorcanaCardMeta,
  LorcanaGameState,
  LorcanaMoveParams,
} from "../../../types";

/**
 * Manual Exert (Debug/Testing)
 *
 * Manually exert a card without conditions.
 *
 * WARNING: This bypasses normal game rules and should only be used for:
 * - Testing
 * - Debugging
 * - Development tools
 *
 * Do NOT use in production game logic.
 */
export const manualExert = createMove<
  LorcanaGameState,
  LorcanaMoveParams,
  "manualExert",
  LorcanaCardMeta
>({
  condition: (_state, context) => {
    // Not available during chooseFirstPlayer phase
    return context.flow?.currentPhase !== "chooseFirstPlayer";
  },
  reducer: (_draft, context) => {
    const { cardId } = context.params;
    const ops = useLorcanaOps(context);
    ops.exertCard(cardId);
  },
});
