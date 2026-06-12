import { useMemo } from "react";
import type { EngineInteractionView } from "@tcg/protocol";

import { useInteractionView } from "../hooks.ts";
import { asMoveName, type MoveName } from "../types.ts";

/**
 * Detection helpers for dual-mode cards (Command cards with the
 * 【Pilot】 keyword — rule 3-4-6).
 *
 * The protocol projects `playCommand` and `playCommandAsPilot` as two
 * separate actions. When the same `cardId` appears in both actions'
 * source candidates, the player has
 * a real two-way decision. The UI dispatcher reads this signal to
 * inject a "lifted decision" state instead of silently auto-picking.
 *
 * Kept as plain functions (not hooks) so the dispatcher — which runs
 * inside an event callback, not a React render — can call them
 * synchronously from `useCallback` consumers without re-architecting
 * around context dependencies.
 */

const CMD = asMoveName("playCommand");
const PILOT = asMoveName("playCommandAsPilot");

export interface DualModeMatch {
  /** Is the card playable as a Command (effect activation)? */
  readonly commandLegal: boolean;
  /** Is the card playable as a Pilot (pair-as-pilot)? */
  readonly pilotLegal: boolean;
  /** Resolved move names for downstream `pending.start()` plumbing. */
  readonly cmdMove: MoveName;
  readonly pilotMove: MoveName;
}

/**
 * Inspect `moves` for the specific dual-mode signature: the same
 * `cardId` selectable both as `playCommand` and `playCommandAsPilot`.
 * Returns `null` for any other shape so callers fall back to the
 * canonical `pickMoveForCard` flow.
 */
export function findDualModeMatchInInteractionView(
  cardId: string,
  view: EngineInteractionView,
): DualModeMatch | null {
  if (view.status !== "ready") {
    return null;
  }
  const commandLegal = actionHasCardCandidate(view, CMD, cardId);
  const pilotLegal = actionHasCardCandidate(view, PILOT, cardId);
  if (!commandLegal || !pilotLegal) return null;
  return { commandLegal, pilotLegal, cmdMove: CMD, pilotMove: PILOT };
}

/**
 * Hook variant — returns `null` when the card is not in a dual-mode
 * decision state (single mode legal, or neither). Useful from card
 * components that want to render a split-glow only on dual-mode
 * candidates.
 */
export function useDualModeMatch(cardId: string | undefined): DualModeMatch | null {
  const interactionView = useInteractionView();
  return useMemo(() => {
    if (!cardId) return null;
    return findDualModeMatchInInteractionView(cardId, interactionView);
  }, [cardId, interactionView]);
}

function actionHasCardCandidate(
  view: EngineInteractionView,
  actionId: MoveName,
  cardId: string,
): boolean {
  return view.actions.some(
    (action) =>
      action.id === actionId &&
      action.enabled &&
      action.inputs.some(
        (input) =>
          input.kind === "entity-selection" &&
          input.id === "cardId" &&
          input.candidates.some(
            (candidate) => candidate.enabled && candidate.entity.instanceId === cardId,
          ),
      ),
  );
}
