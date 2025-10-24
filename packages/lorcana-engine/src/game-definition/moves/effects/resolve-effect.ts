import { createMove } from "@tcg/core";
import type {
  LorcanaCardMeta,
  LorcanaGameState,
  LorcanaMoveParams,
} from "../../../types/move-params";

/**
 * Resolve Effect
 *
 * Generic effect resolution move for handling ongoing effects.
 *
 * Process:
 * 1. Execute the effect logic
 * 2. Remove the effect from the effects list
 * 3. Clean up any associated state
 */
export const resolveEffect = createMove<
  LorcanaGameState,
  LorcanaMoveParams,
  "resolveEffect",
  LorcanaCardMeta
>({
  condition: (state, _context) => {
    // Only available when there are effects to resolve
    return state.effects && state.effects.length > 0;
  },
  reducer: (draft, context) => {
    const { effectId } = context.params;
    draft.effects = draft.effects.filter((e) => e.id !== effectId);
  },
});
