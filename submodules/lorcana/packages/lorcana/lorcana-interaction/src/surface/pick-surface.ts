import type {
  ResolutionSelectionContext,
  ResolutionSelectionZone,
  TargetResolutionSelectionContext,
} from "@tcg/lorcana-engine";

import type { InteractionSurface } from "../types/player-interaction-view";

/**
 * Card-target prompt routing rules (preserved verbatim from
 * `lorcana-simulator/src/lib/features/simulator/board/target-selection-modal.ts`):
 *
 * - **Modal + auto-open** when targets live in zones that aren't individually
 *   clickable on the board (deck, inkwell, limbo, discard) or when choosing
 *   players.
 * - **No modal** for `play`- or `hand`-zone targets — both are rendered as
 *   clickable cards on the chooser's own screen, and clicks are routed
 *   through the inline-board path.
 *   (`hand` always refers to the chooser's own hand in Lorcana — you can't
 *   be asked to pick a specific card from an opponent's hand.)
 * - Optional effects merged to target-selection with `originatesFromOptional`
 *   use the same modal rules; Cancel / decline still sends
 *   `resolveOptional: false` via the cancellation payload baked into the
 *   view's `decline-target-prompt` interaction.
 */
const MODAL_TARGET_ZONES: ReadonlySet<ResolutionSelectionZone> = new Set([
  "discard",
  "deck",
  "inkwell",
  "limbo",
]);

export function pickSurface(context: ResolutionSelectionContext): InteractionSurface {
  switch (context.kind) {
    case "choice-selection":
      return "choice-modal";
    case "optional-selection":
      return "optional-banner";
    case "name-card-selection":
      return "name-card-modal";
    case "scry-selection":
      return "scry-overlay";
    case "target-selection":
    case "discard-choice":
      return pickTargetSurface(context);
  }
}

function pickTargetSurface(context: TargetResolutionSelectionContext): InteractionSurface {
  if (context.playerCandidateIds.length > 0) {
    return "modal-player-picker";
  }
  if (context.allowedZones.some((zone) => MODAL_TARGET_ZONES.has(zone))) {
    return "modal-card-picker";
  }
  return "inline-board";
}
