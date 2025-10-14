import { createMove } from "@tcg/core";
import type {
  LorcanaCardMeta,
  LorcanaGameState,
  LorcanaMoveParams,
} from "../../../types/move-params";

/**
 * Resolve Bag Effect
 *
 * Rule 8.7: Bag system for triggered effects
 *
 * The "bag" is a queue of triggered effects that need to be resolved.
 * This move removes a resolved effect from the bag.
 *
 * Process:
 * 1. Execute the effect logic
 * 2. Remove the bag entry
 * 3. Allow next effect in bag to be processed
 */
export const resolveBag = createMove<
  LorcanaGameState,
  LorcanaMoveParams,
  "resolveBag",
  LorcanaCardMeta
>({
  condition: (state, _context) => {
    // Only available when there are bags to resolve
    return state.bag && state.bag.length > 0;
  },
  reducer: (draft, context) => {
    const { bagId } = context.params;
    draft.bag = draft.bag.filter((b) => b.id !== bagId);
  },
});
