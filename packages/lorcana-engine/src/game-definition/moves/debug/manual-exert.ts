import { createMove } from "@tcg/core";
import { useLorcanaOps } from "../../../operations";
import type {
  LorcanaCardMeta,
  LorcanaGameState,
  LorcanaMoveParams,
} from "../../../types/move-params";

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
  reducer: (_draft, context) => {
    const { cardId } = context.params;
    const ops = useLorcanaOps(context);
    ops.exertCard(cardId);
  },
});
