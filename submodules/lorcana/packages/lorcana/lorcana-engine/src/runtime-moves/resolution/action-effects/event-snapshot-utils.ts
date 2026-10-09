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
    eventSnapshot.anyEffectPerformed = eventSnapshot.anyEffectPerformed === true || performed;
    eventSnapshot.effectOutcomeReported = true;
  }
}

export function resetLastEffectPerformed(
  eventSnapshot: DynamicAmountEventSnapshot | undefined,
): void {
  // Reset the local if-you-do prerequisite, not the whole ability outcome.
  if (eventSnapshot) {
    eventSnapshot.lastEffectPerformed = false;
    eventSnapshot.effectOutcomeReported = false;
  }
}
