import type { EngineInteractionView, InteractionAction, InteractionInput } from "@tcg/protocol";

type EntitySelectionInput = Extract<InteractionInput, { kind: "entity-selection" }>;
type OptionSelectionInput = Extract<InteractionInput, { kind: "option-selection" }>;

export function interactionActionIsAvailable(
  view: EngineInteractionView,
  actionId: string,
): boolean {
  return (
    view.status === "ready" &&
    view.actions.some((action) => action.id === actionId && action.enabled)
  );
}

export function interactionViewHasAttackers(view: EngineInteractionView): boolean {
  return (
    enabledEntityInput(view, "attackRival", "attackerId")?.candidates.some(
      (candidate) => candidate.enabled,
    ) === true || hasEnabledPair(view, "attackUnit", "attackerId", "defenderId")
  );
}

export function interactionViewHasAttacker(
  view: EngineInteractionView,
  attackerId: string,
): boolean {
  return (
    interactionViewCanAttackRival(view, attackerId) ||
    interactionViewHasAttackUnitAttacker(view, attackerId)
  );
}

export function interactionViewHasAttackUnitAttacker(
  view: EngineInteractionView,
  attackerId: string,
): boolean {
  return entityInputHasCandidate(view, "attackUnit", "attackerId", attackerId);
}

export function interactionViewCanFightTarget(
  view: EngineInteractionView,
  attackerId: string,
  defenderId: string,
): boolean {
  return (
    entityInputHasCandidate(view, "attackUnit", "attackerId", attackerId) &&
    entityInputHasCandidate(view, "attackUnit", "defenderId", defenderId)
  );
}

export function interactionViewCanAttackRival(
  view: EngineInteractionView,
  attackerId: string,
): boolean {
  return entityInputHasCandidate(view, "attackRival", "attackerId", attackerId);
}

export function interactionViewActionHasCandidate(
  view: EngineInteractionView,
  actionId: string,
  inputId: string,
  instanceId: string,
): boolean {
  return entityInputHasCandidate(view, actionId, inputId, instanceId);
}

export function interactionViewActionIdsForCandidate(
  view: EngineInteractionView,
  inputId: string,
  instanceId: string,
): string[] {
  if (view.status !== "ready") {
    return [];
  }
  return view.actions
    .filter(
      (action) =>
        action.enabled &&
        action.inputs.some(
          (input) =>
            input.kind === "entity-selection" &&
            input.id === inputId &&
            input.candidates.some(
              (candidate) => candidate.enabled && candidate.entity.instanceId === instanceId,
            ),
        ),
    )
    .map((action) => action.id);
}

export function interactionViewAttachTargets(
  view: EngineInteractionView,
  cardId: string,
): string[] {
  if (!entityInputHasCandidate(view, "playCard", "cardId", cardId)) {
    return [];
  }
  return (
    enabledEntityInput(view, "playCard", "attachToId")
      ?.candidates.filter((candidate) => candidate.enabled)
      .map((candidate) => candidate.entity.instanceId) ?? []
  );
}

export function interactionViewAbilityIndexForCard(
  view: EngineInteractionView,
  cardId: string,
): number | null {
  if (!entityInputHasCandidate(view, "activateAbility", "cardId", cardId)) {
    return null;
  }
  const abilityInput = enabledOptionInput(view, "activateAbility", "abilityIndex");
  const option = abilityInput?.options.find(
    (candidate) => candidate.enabled && candidate.text.params?.cardId === cardId,
  );
  if (!option) {
    return null;
  }
  const abilityIndex = Number(option.id);
  return Number.isInteger(abilityIndex) ? abilityIndex : null;
}

function hasEnabledPair(
  view: EngineInteractionView,
  actionId: string,
  fromInputId: string,
  toInputId: string,
): boolean {
  const fromInput = enabledEntityInput(view, actionId, fromInputId);
  const toInput = enabledEntityInput(view, actionId, toInputId);
  return Boolean(
    fromInput?.candidates.some((candidate) => candidate.enabled) &&
    toInput?.candidates.some((candidate) => candidate.enabled),
  );
}

function entityInputHasCandidate(
  view: EngineInteractionView,
  actionId: string,
  inputId: string,
  instanceId: string,
): boolean {
  return (
    enabledEntityInput(view, actionId, inputId)?.candidates.some(
      (candidate) => candidate.enabled && candidate.entity.instanceId === instanceId,
    ) === true
  );
}

function enabledEntityInput(
  view: EngineInteractionView,
  actionId: string,
  inputId: string,
): EntitySelectionInput | undefined {
  const action = enabledAction(view, actionId);
  return action?.inputs.find(
    (input): input is EntitySelectionInput =>
      input.kind === "entity-selection" && input.id === inputId,
  );
}

function enabledOptionInput(
  view: EngineInteractionView,
  actionId: string,
  inputId: string,
): OptionSelectionInput | undefined {
  const action = enabledAction(view, actionId);
  return action?.inputs.find(
    (input): input is OptionSelectionInput =>
      input.kind === "option-selection" && input.id === inputId,
  );
}

function enabledAction(
  view: EngineInteractionView,
  actionId: string,
): InteractionAction | undefined {
  if (view.status !== "ready") {
    return undefined;
  }
  return view.actions.find((action) => action.id === actionId && action.enabled);
}
