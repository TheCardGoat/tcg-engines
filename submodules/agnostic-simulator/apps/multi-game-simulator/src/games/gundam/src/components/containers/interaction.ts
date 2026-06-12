import type { EngineInteractionView } from "@tcg/protocol";

import { asMoveName, type MoveName } from "../../game/index.ts";

export function cardActionIdsFromInteractionView(
  cardId: string,
  view: EngineInteractionView,
): MoveName[] {
  if (view.status !== "ready") {
    return [];
  }
  const actionIds = view.actions
    .filter(
      (action) =>
        action.enabled &&
        action.inputs.some(
          (input) =>
            input.kind === "entity-selection" &&
            input.id === "cardId" &&
            input.candidates.some(
              (candidate) => candidate.enabled && candidate.entity.instanceId === cardId,
            ),
        ),
    )
    .map((action) => asMoveName(action.id));
  return [...new Set(actionIds)];
}

export function pickMoveForCardFromInteractionView(
  cardId: string,
  view: EngineInteractionView,
): MoveName | null {
  const matching = cardActionIdsFromInteractionView(cardId, view);
  if (matching.length === 0) return null;
  const enterBattle = asMoveName("enterBattle");
  return matching.find((move) => move === enterBattle) ?? matching[0]!;
}
