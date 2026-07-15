import type { DynamicAmountEventSnapshot } from "../../../types/domain-events";

export function didLastEffectPerform(
  eventSnapshot: DynamicAmountEventSnapshot | undefined,
): boolean {
  return eventSnapshot?.lastEffectPerformed === true;
}

export function markLastEffectPerformed(
  eventSnapshot: DynamicAmountEventSnapshot | undefined,
  performed: boolean,
): void {
  if (eventSnapshot) {
    eventSnapshot.lastEffectPerformed = performed;
  }
}

export function resetLastEffectPerformed(
  eventSnapshot: DynamicAmountEventSnapshot | undefined,
): void {
  markLastEffectPerformed(eventSnapshot, false);
}
