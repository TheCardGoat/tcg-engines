import type { EngineInteractionView } from "@tcg/protocol";

export interface ProtocolTargetSelectionGroup {
  readonly inputId: string;
  readonly targetIds: readonly string[];
  readonly minTargets: number;
  readonly maxTargets: number;
}

export interface ProtocolTargetSelection {
  readonly actionId: string;
  readonly pendingEffectId?: string;
  readonly targetGroups: readonly ProtocolTargetSelectionGroup[];
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

export function protocolTargetSelection(
  view: EngineInteractionView,
): ProtocolTargetSelection | null {
  if (view.status !== "choosing") {
    return null;
  }
  const action = view.actions.find(
    (candidate) => candidate.id === "resolveEffect" && candidate.enabled,
  );
  if (!action) {
    return null;
  }

  const directTargetInput = action.inputs.find(
    (input) => input.kind === "entity-selection" && input.id === "targets",
  );
  const groupedTargetInputs = action.inputs
    .flatMap((input) => {
      if (input.kind !== "entity-selection") return [];
      const match = /^targetGroups\.(\d+)$/.exec(input.id);
      return match ? [{ groupIndex: Number(match[1]), input }] : [];
    })
    .sort((left, right) => left.groupIndex - right.groupIndex)
    .map(({ input }) => input);
  const targetInputs =
    groupedTargetInputs.length > 0
      ? groupedTargetInputs
      : directTargetInput?.kind === "entity-selection"
        ? [directTargetInput]
        : [];
  if (targetInputs.length === 0) return null;

  const pendingEffectInput = action.inputs.find(
    (input) => input.kind === "option-selection" && input.id === "pendingEffectId",
  );
  const pendingEffectId =
    pendingEffectInput?.kind === "option-selection"
      ? pendingEffectInput.options.find((option) => option.enabled)?.id
      : undefined;
  const targetGroups = targetInputs.map((input) => ({
    inputId: input.id,
    targetIds: input.candidates
      .filter((candidate) => candidate.enabled && candidate.entity.kind === "card")
      .map((candidate) => candidate.entity.instanceId),
    minTargets: input.min,
    maxTargets: input.max,
  }));

  return {
    actionId: action.id,
    pendingEffectId,
    targetGroups,
    targetIds: [...new Set(targetGroups.flatMap((group) => group.targetIds))],
    minTargets: targetGroups.reduce((sum, group) => sum + group.minTargets, 0),
    maxTargets: targetGroups.reduce((sum, group) => sum + group.maxTargets, 0),
  };
}

export function interactionViewHasSourceCard(view: EngineInteractionView, cardId: string): boolean {
  return interactionViewSourceCardIds(view).has(cardId);
}
