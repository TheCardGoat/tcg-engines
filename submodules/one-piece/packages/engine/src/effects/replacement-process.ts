import type { MatchState } from "../types.ts";

/** 8-1-3-4-3: identities already applied to this process, not a turn-wide limit. */
export interface ReplacementProcess {
  applied: string[];
  /** Pre-movement characteristics of the original simultaneous K.O. group. */
  koBasePowers?: Array<{ instanceId: string; zoneChangeCounter: number; value: number }>;
  /** Replacement payments unavailable when this simultaneous removal began. */
  unavailableRemovalPayments?: string[];
  removalTrash?: Array<{ instanceId: string; zoneChangeCounter: number }>;
  paymentTrash?: Array<{ instanceId: string; zoneChangeCounter: number }>;
  declined?: Record<string, string[]>;
}

// Only the synchronous executor is ambient. The evidence itself is carried on
// queued actions and prompts, so a saved match retains its replacement chain.
const executing = new WeakMap<MatchState, ReplacementProcess>();

export function currentReplacementProcess(state: MatchState) {
  return executing.get(state);
}

export function withReplacementProcess<T>(
  state: MatchState,
  process: ReplacementProcess | undefined,
  run: () => T,
): T {
  const previous = executing.get(state);
  if (process) executing.set(state, process);
  else executing.delete(state);
  try {
    return run();
  } finally {
    if (previous) executing.set(state, previous);
    else executing.delete(state);
  }
}

export function replacementProcessKey(state: MatchState, sourceId: string, effectKey: string) {
  return `${sourceId}:${state.cards[sourceId].zoneChangeCounter}:${effectKey}`;
}

export function extendReplacementProcess(
  state: MatchState,
  sourceId: string,
  effectKey: string,
): ReplacementProcess {
  return {
    paymentTrash: executing.get(state)?.removalTrash,
    applied: [
      ...(executing.get(state)?.applied ?? []),
      replacementProcessKey(state, sourceId, effectKey),
    ],
  };
}

export function replacementTargetKey(state: MatchState, targetId: string) {
  return `${targetId}:${state.cards[targetId].zoneChangeCounter}`;
}

export function declineReplacementProcess(
  state: MatchState,
  targetIds: string[],
  offeredKeys: string[],
): ReplacementProcess {
  const process = executing.get(state);
  const declined = { ...process?.declined };
  for (const targetId of targetIds) {
    const key = replacementTargetKey(state, targetId);
    declined[key] = [...(declined[key] ?? []), ...offeredKeys];
  }
  return { ...process, applied: [...(process?.applied ?? [])], declined };
}
