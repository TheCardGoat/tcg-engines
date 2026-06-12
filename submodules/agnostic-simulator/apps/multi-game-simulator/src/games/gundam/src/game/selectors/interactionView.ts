import type { EngineInteractionView } from "@tcg/protocol";

export interface ProtocolTargetSelection {
  readonly actionId: string;
  readonly pendingEffectId?: string;
  readonly targetIds: readonly string[];
  readonly minTargets: number;
  readonly maxTargets: number;
}

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
      if (input.kind !== "entity-selection" || input.id !== "cardId") {
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

export function protocolTargetSelection(
  view: EngineInteractionView,
): ProtocolTargetSelection | null {
  if (view.status !== "choosing") {
    return null;
  }
  const action = view.actions.find(
    (candidate) => candidate.id === "resolveEffect" && candidate.enabled,
  );
  const targetInput = action?.inputs.find(
    (input) => input.kind === "entity-selection" && input.id === "targets",
  );
  if (!action || targetInput?.kind !== "entity-selection") {
    return null;
  }
  const pendingEffectInput = action.inputs.find(
    (input) => input.kind === "option-selection" && input.id === "pendingEffectId",
  );
  const pendingEffectId =
    pendingEffectInput?.kind === "option-selection"
      ? pendingEffectInput.options.find((option) => option.enabled)?.id
      : undefined;
  return {
    actionId: action.id,
    pendingEffectId,
    targetIds: targetInput.candidates
      .filter((candidate) => candidate.enabled && candidate.entity.kind === "card")
      .map((candidate) => candidate.entity.instanceId),
    minTargets: targetInput.min,
    maxTargets: targetInput.max,
  };
}

export function interactionViewHasSourceCard(view: EngineInteractionView, cardId: string): boolean {
  return interactionViewSourceCardIds(view).has(cardId);
}
