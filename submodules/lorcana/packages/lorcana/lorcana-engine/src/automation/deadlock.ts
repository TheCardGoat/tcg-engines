import type { PlayerId } from "#core";

export const AUTOMATED_ACTION_REPEAT_DEADLOCK_THRESHOLD = 3;

export interface AutomatedActionRepeatedStateObservation {
  actorId?: PlayerId;
  stateFingerprint: string;
}

export interface AutomatedActionRepeatedStateObservationResult {
  count: number;
  key?: string;
  repeatedStateDeadlock: boolean;
}

export function createAutomatedActionRepeatedStateTracker(
  repeatThreshold = AUTOMATED_ACTION_REPEAT_DEADLOCK_THRESHOLD,
) {
  const seenStates = new Map<string, number>();

  return {
    clear(): void {
      seenStates.clear();
    },
    observe(
      observation: AutomatedActionRepeatedStateObservation,
    ): AutomatedActionRepeatedStateObservationResult {
      if (!observation.actorId) {
        return {
          count: 0,
          repeatedStateDeadlock: false,
        };
      }

      const key = `${observation.actorId}:${observation.stateFingerprint}`;
      const count = (seenStates.get(key) ?? 0) + 1;
      seenStates.set(key, count);

      return {
        count,
        key,
        repeatedStateDeadlock: count >= repeatThreshold,
      };
    },
  };
}
