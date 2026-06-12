import type { InteractionAction } from "@tcg/protocol";
import type { MatchState } from "@tcg/cyberpunk-engine";
import { entityInput, optionInput } from "./interactionInputs";

export function choiceModalActionFromInteractionView(
  actions: readonly InteractionAction[],
  matchState: MatchState,
  opts: { includeSpatialTargets?: boolean } = {},
): InteractionAction | null {
  for (const action of actions) {
    if (optionInput(action, "effectId")) {
      return action;
    }
    switch (action.id) {
      case "resolveSearchDeck":
        return action;
      case "resolveTrigger":
        return optionInput(action, "triggerId")?.required === true ? action : null;
      case "resolveEffectTarget": {
        const targetInput = entityInput(action, "targetIds", "card");
        if (!targetInput) {
          return null;
        }
        // Single-target card choices are usually handled inline by Card.tsx
        // (the player clicks the card directly).  Only surface the modal when
        // the target is NOT on the field — field cards already have their own
        // clickable affordance, but hand / other zones do not.
        const ids = targetInput.candidates.map((candidate) => candidate.entity.instanceId);
        const visibleCardZones = ["field", "legendArea"];
        const allTargetsAreVisible =
          ids.length > 0 &&
          ids.every((id) => visibleCardZones.includes(matchState.G.cardIndex[id]?.zone ?? ""));
        return allTargetsAreVisible && !opts.includeSpatialTargets ? null : action;
      }
      case "resolveDiscardFromHand":
      case "resolveCardToMove":
        return opts.includeSpatialTargets ? action : null;
      case "resolveStealGigs":
        // Gig dice are visible and selectable in the center row; keep this as
        // a board-spatial interaction instead of covering the board with a modal.
        return null;
      default:
        break;
    }
  }
  return null;
}
