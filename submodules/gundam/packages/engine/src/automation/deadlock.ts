import type { MatchState } from "../types/match-state.ts";

/**
 * Interface for detecting when bots get stuck in repeating state loops.
 */
export interface DeadlockDetector {
  /** Record a state fingerprint for the current game state. */
  recordState(fingerprint: string): void;
  /** Check if the recent history indicates a deadlock (repeated states). */
  isDeadlocked(): boolean;
  /** Reset the detector, clearing all recorded history. */
  reset(): void;
}

/**
 * Create a deadlock detector that uses a sliding window of state fingerprints.
 *
 * If the same fingerprint appears more than `threshold` times in the last
 * `windowSize` states, the detector reports a deadlock.
 *
 * @param windowSize - Number of recent states to consider (default: 20)
 * @param threshold - Number of repeated fingerprints to trigger deadlock (default: 3)
 */
export function createDeadlockDetector(
  windowSize: number = 20,
  threshold: number = 3,
): DeadlockDetector {
  let history: string[] = [];

  return {
    recordState(fp: string): void {
      history.push(fp);
      // Keep only the last windowSize entries
      if (history.length > windowSize) {
        history = history.slice(history.length - windowSize);
      }
    },

    isDeadlocked(): boolean {
      if (history.length < threshold) {
        return false;
      }

      // Count occurrences of each fingerprint in the window
      const counts = new Map<string, number>();
      for (const fp of history) {
        const count = (counts.get(fp) ?? 0) + 1;
        counts.set(fp, count);
        if (count >= threshold) {
          return true;
        }
      }

      return false;
    },

    reset(): void {
      history = [];
    },
  };
}

/**
 * Generate a fingerprint string from a MatchState for deadlock detection.
 *
 * The fingerprint captures the key elements of game state that would indicate
 * repetition: phase, turn, priority, zone card counts, and game-specific state.
 */
export function fingerprint(state: MatchState): string {
  const parts: string[] = [];

  // Core context
  parts.push(`sid:${state.ctx._stateID}`);
  parts.push(`p:${state.ctx.status.phase ?? ""}`);
  parts.push(`s:${state.ctx.status.step ?? ""}`);
  parts.push(`t:${state.ctx.status.turn}`);
  parts.push(`ap:${state.ctx.status.activePlayer}`);

  // Zone card counts (sorted for determinism)
  const zoneSummaries = state.ctx.zones.public.zoneSummaries;
  const zoneKeys = Object.keys(zoneSummaries).sort();
  for (const key of zoneKeys) {
    const summary = zoneSummaries[key];
    if (summary) {
      parts.push(`z:${key}:${summary.count}`);
    }
  }

  // Game-specific state hash (simple JSON-based)
  try {
    parts.push(`G:${JSON.stringify(state.G)}`);
  } catch {
    parts.push("G:?");
  }

  return parts.join("|");
}
