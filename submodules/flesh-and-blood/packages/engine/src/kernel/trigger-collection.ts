import type { FabMatchState } from "../state.ts";
import type { FabPendingTrigger } from "../rules/process.ts";
import type { FabTriggerCollectionResult } from "../rules/trigger-matcher.ts";
import { matchesFabSnapshotFilter } from "../rules/state-rules-view.ts";
import { isGoFishDoubleTriggerReplacement } from "./replacements/admission.ts";
import { replacementExpired } from "./replacements/collect.ts";

/** Persist a collected trigger batch onto the match. Query code stays in trigger-matcher. */
export function applyTriggerCollection(
  state: FabMatchState,
  result: FabTriggerCollectionResult,
): void {
  state.triggerLimitUsage = { ...result.triggerLimitUsage };
  if (!state.rulesProcess) return;
  state.rulesProcess.pendingTriggers.push(
    ...result.pendingTriggers.flatMap((pending) => expandGoFishDoubleTriggers(state, pending)),
  );
}

/**
 * Catch of the Day registers a this-turn replacement on Go Fish trigger
 * events. Trigger layers are collected from the causing event (hit), not
 * from the later Trap-style observation `trigger` event, so the replacement
 * must expand the pending cohort here (CR 6.4 / 1.9.1).
 */
function expandGoFishDoubleTriggers(
  state: FabMatchState,
  pending: FabPendingTrigger,
): readonly FabPendingTrigger[] {
  if (!isGoFishPending(pending)) return [pending];
  const doubles = state.replacementEffects.some((replacement) => {
    if (replacementExpired(state, replacement.expiresAt)) return false;
    if (!isGoFishDoubleTriggerReplacement(replacement.effect)) return false;
    const filter = replacement.effect.replaces.filter;
    return !filter || matchesFabSnapshotFilter(state, pending.source, filter);
  });
  if (!doubles) return [pending];
  return [pending, { ...pending, pendingTriggerId: `${pending.pendingTriggerId}:go-fish-twice` }];
}

function isGoFishPending(pending: FabPendingTrigger): boolean {
  const ability = pending.source.current.abilities.find((entry) => entry.id === pending.abilityId);
  return ability?.label?.name === "go-fish";
}
