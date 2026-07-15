import type {
  LorcanaProjectedBagEffect,
  LorcanaProjectedBoardView,
  LorcanaProjectedPendingEffect,
  ResolutionSelectionContext,
} from "@tcg/lorcana-engine";

export type ActivePromptOrigin = "pending-effect" | "bag";

export type ActivePromptEffect = {
  effect: LorcanaProjectedPendingEffect | LorcanaProjectedBagEffect;
  origin: ActivePromptOrigin;
  requestId: string;
  selectionContext: ResolutionSelectionContext;
};

export type PendingPromptQueue = {
  /** Every prompt-bearing effect on the board, in deterministic order. */
  entries: ActivePromptEffect[];
  /** The single prompt the renderer should focus on now. `null` when the queue is empty. */
  active: ActivePromptEffect | null;
  /** Index of `active` within `entries`. `-1` when no prompt is active. */
  activeIndex: number;
};

/**
 * Build the full ordered queue of prompt-bearing effects on the board.
 *
 * Engine ordering (deterministic):
 * 1. Pending effects in `board.pendingEffects` order — these come from
 *    play-card / ability-activation paths and are advanced one at a time.
 * 2. Bag effects in `board.bagEffects` order — triggered abilities waiting
 *    in the bag, surfaced in publish order.
 *
 * Active-prompt selection:
 * - If `board.pendingChoice.requestID` matches an entry, that entry is active.
 *   The engine sets this pointer explicitly for play-card / activated-ability
 *   paths.
 * - Otherwise the first entry in `entries` is active. This matches today's
 *   "first bag effect with a selection context" fallback used for triggered
 *   abilities that surfaced before being dispatched.
 *
 * Multiple simultaneously-pending prompts (e.g. two "when banished" triggers
 * firing at once, each producing a bag effect with a target-selection
 * context) are surfaced as separate `entries`. Renderers can show a
 * "1 of 3 prompts" indicator and let the chooser navigate, or simply
 * resolve the active one and rebuild the view.
 */
export function buildPendingPromptQueue(board: LorcanaProjectedBoardView): PendingPromptQueue {
  const entries: ActivePromptEffect[] = [];

  for (const effect of board.pendingEffects) {
    if (effect.selectionContext) {
      entries.push({
        effect,
        origin: "pending-effect",
        requestId: effect.id,
        selectionContext: effect.selectionContext,
      });
    }
  }
  for (const effect of board.bagEffects) {
    if (effect.selectionContext) {
      entries.push({
        effect,
        origin: "bag",
        requestId: effect.id,
        selectionContext: effect.selectionContext,
      });
    }
  }

  if (entries.length === 0) {
    return { entries, active: null, activeIndex: -1 };
  }

  const explicitId = board.pendingChoice?.requestID;
  if (explicitId) {
    const explicitIndex = entries.findIndex((entry) => entry.requestId === explicitId);
    if (explicitIndex >= 0) {
      return { entries, active: entries[explicitIndex], activeIndex: explicitIndex };
    }
  }

  return { entries, active: entries[0], activeIndex: 0 };
}

/**
 * Convenience: the currently active prompt, or `null` if none. Equivalent
 * to `buildPendingPromptQueue(board).active`. Kept for callers that don't
 * need the full queue.
 */
export function findActivePrompt(board: LorcanaProjectedBoardView): ActivePromptEffect | null {
  return buildPendingPromptQueue(board).active;
}
