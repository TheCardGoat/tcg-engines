import type { EngineInteractionView } from "@tcg/protocol";

import {
  asMoveName,
  findDualModeMatchInInteractionView,
  type ProtocolTargetSelection,
  type SubmitOutcome,
} from "../../game/index.ts";
import type { EngineAdapter } from "../../game/adapter.ts";
import type { PendingMoveControls } from "../../game/hooks.ts";
import type { DualModeContextValue } from "../ui/dual-mode-context.tsx";
import type { PendingEffectSelectionContextValue } from "../ui/pending-effect-selection-context.tsx";
import { pickMoveForCardFromInteractionView } from "./interaction.ts";

export interface DispatchCardActionContext {
  readonly adapter: EngineAdapter;
  readonly pending: PendingMoveControls;
  readonly interactionView: EngineInteractionView;
  readonly targetSelection: ProtocolTargetSelection | null;
  readonly report: (outcome: SubmitOutcome | null) => void;
  readonly pendingEffectSelection?: PendingEffectSelectionContextValue;
  /**
   * Dual-mode decision controller. When the clicked card has BOTH
   * `playCommand` and `playCommandAsPilot` available (rule 3-4-6), the
   * dispatcher hands off to this controller — `dual.begin(...)` lifts
   * the card and the user picks a half. With only one mode legal we
   * silently auto-route to the canonical move (zero extra taps).
   */
  readonly dual?: DualModeContextValue;
}

/**
 * Resolve a click on a card to one of three actions, in priority
 * order. Shared by `SelfHandZoneContainer` and the play-zone click
 * wiring so the rules for "what happens when you tap a card" stay
 * the same regardless of which zone the card lives in.
 *
 *   1. Engine has a `targetSelection` pending choice and the clicked
 *      card is legal — stage it for the resolver's Confirm button.
 *      Edge-case renders without the selection provider fall back to
 *      the legacy direct-submit path.
 *   2. A locally-collecting pending move is on a `selectTarget` step
 *      and the card is in the step's candidate set — provide it
 *      (with multi-select toggle-on-reclick semantics).
 *   3. Otherwise — pick the canonical move for the card (e.g.
 *      `enterBattle` for a battle-area unit, `deployUnit` for a hand
 *      card) and start the pending flow.
 *
 * No-op when the card has no id or none of the above apply.
 */
export function dispatchCardAction(ctx: DispatchCardActionContext, cardId: string): void {
  const {
    adapter,
    pending,
    interactionView,
    targetSelection,
    report,
    dual,
    pendingEffectSelection,
  } = ctx;

  // Priority 0: dual-mode card already lifted — clicking the same
  // card again (or anywhere on it) is a no-op; the user must pick a
  // half via the overlay or press Esc to cancel. Clicking a different
  // card cancels the lift and proceeds with that card normally.
  if (dual?.pending) {
    if (dual.pending.cardId === cardId) return;
    dual.cancel();
  }

  // Priority 1: target a server-driven pending choice.
  if (targetSelection?.targetIds.includes(cardId)) {
    if (
      pendingEffectSelection &&
      pendingEffectSelection.activeEffectId === targetSelection.pendingEffectId
    ) {
      pendingEffectSelection.selectTarget(cardId);
      return;
    }
    report(
      adapter.submit(asMoveName("resolveEffect"), {
        pendingEffectId: targetSelection.pendingEffectId,
        targets: [cardId],
      }),
    );
    return;
  }

  // Priority 2: feed a locally-pending selectTarget step.
  if (pending.state.status === "collecting") {
    const step = pending.state.steps[0];
    if (step?.kind === "selectTarget" && step.candidateIds.includes(cardId)) {
      pending.provideTarget(step, cardId);
      return;
    }
  }

  // Priority 2.5: dual-mode Command card with [Pilot] effect (rule
  // 3-4-6). When BOTH modes are legal, hand off to the lift-and-pick
  // flow. When only one mode is legal, the match returns null and we
  // fall through to priority 3 — which auto-picks the single matching
  // move (zero extra taps).
  if (dual && !dual.pending) {
    const match = findDualModeMatchInInteractionView(cardId, interactionView);
    if (match) {
      dual.begin({
        cardId,
        cmdMove: match.cmdMove,
        pilotMove: match.pilotMove,
      });
      return;
    }
  }

  // Priority 3: start a new pending move for this card.
  const move = pickMoveForCardFromInteractionView(cardId, interactionView);
  if (!move) return;
  pending.startForCard(move, cardId);
}
