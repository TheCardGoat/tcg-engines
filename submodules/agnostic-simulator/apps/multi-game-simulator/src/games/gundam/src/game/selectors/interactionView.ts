import type { EngineInteractionView } from "@tcg/protocol";

export function interactionViewSourceCardIds(view: EngineInteractionView): ReadonlySet<string> {
  const ids = new Set<string>();
  if (view.status !== "ready") {
    return ids;
  }
  for (const action of view.actions) {
    if (!action.enabled) {
      continue;
    }
    for (const input of action.inputs) {
      if (input.kind !== "entity-selection" || input.role !== "source") {
        continue;
      }
      for (const candidate of input.candidates) {
        if (candidate.enabled && candidate.entity.kind === "card") {
          ids.add(candidate.entity.instanceId);
        }
      }
    }
  }
  return ids;
}

export function interactionViewHasSourceCard(view: EngineInteractionView, cardId: string): boolean {
  return interactionViewSourceCardIds(view).has(cardId);
}
