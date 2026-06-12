import type { PlayerId } from "@tcg/lorcana-engine";

export const REPEATED_STATE_DEADLOCK_THRESHOLD = 3;

export interface RepeatedStateObservation {
  actorId?: PlayerId;
  stateFingerprint: string;
}

export interface RepeatedStateObservationResult {
  count: number;
  key?: string;
  repeatedStateDeadlock: boolean;
}

export interface AutomationDeadlockConcedeCommandResult {
  error?: string;
  success: boolean;
}

export interface AutomationDeadlockConcedeResult {
  attempted: boolean;
  conceded: boolean;
  error?: string;
}

export function createRepeatedStateDeadlockTracker(
  repeatThreshold = REPEATED_STATE_DEADLOCK_THRESHOLD,
) {
  const seenStates = new Map<string, number>();

  return {
    observe(observation: RepeatedStateObservation): RepeatedStateObservationResult {
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

export function resolveRepeatedStateDeadlockByConceding(args: {
  actorId?: PlayerId;
  concede(actorId: PlayerId): AutomationDeadlockConcedeCommandResult;
  observation: RepeatedStateObservationResult;
}): AutomationDeadlockConcedeResult {
  const { actorId, concede, observation } = args;

  if (!observation.repeatedStateDeadlock) {
    return {
      attempted: false,
      conceded: false,
    };
  }

  if (!actorId) {
    return {
      attempted: true,
      conceded: false,
      error: "Repeated state deadlock detected without a resolvable automated actor.",
    };
  }

  const result = concede(actorId);

  if (!result.success) {
    return {
      attempted: true,
      conceded: false,
      error: result.error ?? "Failed to concede after repeated state deadlock.",
    };
  }

  return {
    attempted: true,
    conceded: true,
  };
}
