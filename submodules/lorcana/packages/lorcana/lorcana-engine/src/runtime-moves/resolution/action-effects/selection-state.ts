import type { CardInstanceId, PlayerId } from "#core";
import { resolveSelectedPlayerIds } from "../../../targeting/runtime";
import type { TargetSelectionInput } from "../../../targeting/runtime";
import type { PendingActionResolutionInput } from "../../../types";
import type { ActionResolutionInput } from "./types";

export type SelectionTarget = CardInstanceId | PlayerId;

type SelectionStateCarrier = Pick<
  ActionResolutionInput | PendingActionResolutionInput,
  "contextTargets" | "currentTargets" | "targets"
>;

export function effectTargetUsesSelectionContext(target: unknown): boolean {
  if (typeof target === "string") {
    return (
      target.startsWith("CHOSEN_") ||
      target === "chosen-for-effect" ||
      target === "previous-target" ||
      target === "selected-first" ||
      target === "selected-all" ||
      target === "CARD_OWNER"
    );
  }

  if (!target || typeof target !== "object") {
    return false;
  }

  if (Array.isArray(target)) {
    return target.some((entry) => effectTargetUsesSelectionContext(entry));
  }

  const record = target as Record<string, unknown>;
  if (record.compareWithParentsTarget === true && record.value === "target") {
    return true;
  }
  if (typeof record.ref === "string" || typeof record.reference === "string") {
    return true;
  }

  return Object.values(record).some((value) => effectTargetUsesSelectionContext(value));
}

export function effectTargetConsumesSelectionContext(target: unknown): boolean {
  if (typeof target === "string") {
    return (
      target.startsWith("CHOSEN_") ||
      target === "chosen-for-effect" ||
      target === "previous-target" ||
      target === "selected-first" ||
      target === "selected-all" ||
      target === "CARD_OWNER"
    );
  }

  if (!target || typeof target !== "object") {
    return false;
  }

  if (Array.isArray(target)) {
    return target.some((entry) => effectTargetConsumesSelectionContext(entry));
  }

  const record = target as Record<string, unknown>;
  if (typeof record.ref === "string" || typeof record.reference === "string") {
    return true;
  }

  // When a filter contains compareWithParentsTarget, the step needs
  // the prior step's target promoted into context so it can compare against it.
  if (record.compareWithParentsTarget === true) {
    return true;
  }

  return Object.values(record).some((value) => effectTargetConsumesSelectionContext(value));
}

export function normalizeSelectionTargets(targets: TargetSelectionInput): SelectionTarget[] {
  if (typeof targets === "string") {
    return targets.length > 0 ? [targets as SelectionTarget] : [];
  }

  if (Array.isArray(targets)) {
    return targets.filter(
      (target): target is SelectionTarget => typeof target === "string" && target.length > 0,
    );
  }

  return [];
}

export function toTargetSelectionInput(targets: readonly SelectionTarget[]): TargetSelectionInput {
  if (targets.length === 0) {
    return undefined;
  }

  return targets.length === 1 ? targets[0] : [...targets];
}

export function getCurrentSelectionTargets(
  resolutionInput: SelectionStateCarrier,
): SelectionTarget[] {
  return normalizeSelectionTargets(resolutionInput.currentTargets ?? resolutionInput.targets);
}

export function getContextSelectionTargets(
  resolutionInput: SelectionStateCarrier,
): SelectionTarget[] {
  return normalizeSelectionTargets(resolutionInput.contextTargets);
}

export function getCombinedSelectionTargets(
  resolutionInput: SelectionStateCarrier,
): SelectionTarget[] {
  return [
    ...getContextSelectionTargets(resolutionInput),
    ...getCurrentSelectionTargets(resolutionInput),
  ];
}

export function getCurrentSelectionInput(
  resolutionInput: SelectionStateCarrier,
): TargetSelectionInput {
  return toTargetSelectionInput(getCurrentSelectionTargets(resolutionInput));
}

export function getContextSelectionInput(
  resolutionInput: SelectionStateCarrier,
): TargetSelectionInput {
  return toTargetSelectionInput(getContextSelectionTargets(resolutionInput));
}

export function getCombinedSelectionInput(
  resolutionInput: SelectionStateCarrier,
): TargetSelectionInput {
  return toTargetSelectionInput(getCombinedSelectionTargets(resolutionInput));
}

export function getEffectTargetSelectionInput(
  target: unknown,
  resolutionInput: SelectionStateCarrier,
): TargetSelectionInput {
  if (effectTargetUsesSelectionContext(target)) {
    // Pure reference descriptors (e.g. { ref: "previous-target" }) should
    // prefer context targets (prior step selections) when inside a sequence.
    // The combined selection includes current targets for future steps, and
    // "previous-target" (which takes the last element) would resolve to a
    // wrong card.  Fall back to combined when no context is available.
    if (
      target &&
      typeof target === "object" &&
      !Array.isArray(target) &&
      typeof (target as Record<string, unknown>).ref === "string"
    ) {
      const contextInput = getContextSelectionInput(resolutionInput);
      if (contextInput != null) {
        return contextInput;
      }
    }
    return getCombinedSelectionInput(resolutionInput);
  }

  // For chosen selectors, prefer the current selection over combined context.
  // This allows Ambush-style cards to pass multiple targets in a single sequence
  // without the chosen selector consuming context targets from prior steps.
  if (
    target &&
    typeof target === "object" &&
    !Array.isArray(target) &&
    (target as Record<string, unknown>).selector === "chosen"
  ) {
    const current = getCurrentSelectionInput(resolutionInput);
    return current ?? getCombinedSelectionInput(resolutionInput);
  }

  return getCurrentSelectionInput(resolutionInput);
}

export function withCurrentSelectionTargets<
  T extends ActionResolutionInput | PendingActionResolutionInput,
>(resolutionInput: T, targets: readonly SelectionTarget[]): T {
  const currentTargets = toTargetSelectionInput(targets);
  return {
    ...resolutionInput,
    ...(currentTargets
      ? { currentTargets, targets: currentTargets }
      : { currentTargets: undefined, targets: undefined }),
  };
}

export function withContextSelectionTargets<
  T extends ActionResolutionInput | PendingActionResolutionInput,
>(resolutionInput: T, targets: readonly SelectionTarget[]): T {
  const contextTargets = toTargetSelectionInput(targets);
  return {
    ...resolutionInput,
    contextTargets,
  };
}

export function clearCurrentSelectionTargets<
  T extends ActionResolutionInput | PendingActionResolutionInput,
>(resolutionInput: T): T {
  return {
    ...resolutionInput,
    currentTargets: undefined,
    targets: undefined,
  };
}

export function promoteCurrentSelectionTargetsToContext<
  T extends ActionResolutionInput | PendingActionResolutionInput,
>(resolutionInput: T): T {
  const contextTargets = getContextSelectionTargets(resolutionInput);
  const currentTargets = getCurrentSelectionTargets(resolutionInput);

  return clearCurrentSelectionTargets(
    withContextSelectionTargets(resolutionInput, [...contextTargets, ...currentTargets]),
  );
}

export function promoteCurrentSelectedPlayersToContext<
  T extends ActionResolutionInput | PendingActionResolutionInput,
>(playerIds: readonly PlayerId[], resolutionInput: T): T {
  const selectedPlayerIds = resolveSelectedPlayerIds(
    playerIds,
    getCurrentSelectionInput(resolutionInput),
  );
  if (!selectedPlayerIds?.length) {
    return resolutionInput;
  }

  const contextTargets = getContextSelectionTargets(resolutionInput);
  return clearCurrentSelectionTargets(
    withContextSelectionTargets(resolutionInput, [...contextTargets, ...selectedPlayerIds]),
  );
}

export function cloneSelectionInput(targets: TargetSelectionInput): TargetSelectionInput {
  const normalized = normalizeSelectionTargets(targets);
  return toTargetSelectionInput(normalized);
}
