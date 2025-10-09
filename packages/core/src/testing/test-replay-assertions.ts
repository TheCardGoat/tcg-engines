import type { RuleEngine } from "../engine/rule-engine";

/**
 * Test Replay Assertions
 *
 * Assertion helpers for testing deterministic replay behavior
 */

/**
 * Assert that replaying the game produces the same final state
 *
 * This verifies that the game is deterministic by:
 * 1. Capturing the current game state
 * 2. Replaying all moves from the beginning
 * 3. Comparing the final states
 *
 * This is crucial for:
 * - Network synchronization
 * - Game recordings/replays
 * - Bug reproduction
 * - Ensuring RNG is properly seeded
 *
 * @param engine - Rule engine instance with move history
 * @throws Error if replay produces different state
 *
 * @example
 * ```typescript
 * const engine = new RuleEngine(gameDefinition, players, {
 *   seed: 'test-seed'
 * });
 *
 * // Execute some moves
 * engine.executeMove('shuffle', { playerId: 'p1' });
 * engine.executeMove('draw', { playerId: 'p1' });
 * engine.executeMove('play', { playerId: 'p1', data: { cardId: 'card1' } });
 *
 * // Verify replay is deterministic
 * expectDeterministicReplay(engine);
 * ```
 */
export function expectDeterministicReplay<
  TState,
  TMoves extends Record<string, any>,
>(engine: RuleEngine<TState, TMoves>): void {
  // Get current state
  const originalState = engine.getState();

  // Replay from the beginning
  const replayedState = engine.replay();

  // Compare states
  const originalJson = JSON.stringify(originalState);
  const replayedJson = JSON.stringify(replayedState);

  if (originalJson !== replayedJson) {
    // Find differences for better error message
    const diff = findStateDifferences(originalState, replayedState);

    throw new Error(
      "Replay produced different state than original execution.\n" +
        "This indicates non-deterministic behavior in your game logic.\n\n" +
        "Common causes:\n" +
        "- Using Math.random() instead of context.rng\n" +
        "- Using Date.now() or other time-based values\n" +
        "- External state mutations\n" +
        "- Non-deterministic array sorting\n\n" +
        `Differences found:\n${diff}\n\n` +
        `Original state: ${truncateString(originalJson, 500)}\n\n` +
        `Replayed state: ${truncateString(replayedJson, 500)}`,
    );
  }
}

/**
 * Find differences between two states for error reporting
 *
 * @param original - Original state
 * @param replayed - Replayed state
 * @returns String describing differences
 */
function findStateDifferences(original: any, replayed: any): string {
  const differences: string[] = [];

  const findDiffs = (obj1: any, obj2: any, path = "") => {
    if (typeof obj1 !== typeof obj2) {
      differences.push(
        `${path || "root"}: type mismatch (${typeof obj1} vs ${typeof obj2})`,
      );
      return;
    }

    if (typeof obj1 !== "object" || obj1 === null || obj2 === null) {
      if (obj1 !== obj2) {
        differences.push(
          `${path || "root"}: value mismatch (${JSON.stringify(obj1)} vs ${JSON.stringify(obj2)})`,
        );
      }
      return;
    }

    // Check arrays
    if (Array.isArray(obj1) && Array.isArray(obj2)) {
      if (obj1.length !== obj2.length) {
        differences.push(
          `${path || "root"}: array length mismatch (${obj1.length} vs ${obj2.length})`,
        );
        return;
      }

      for (let i = 0; i < obj1.length; i++) {
        findDiffs(obj1[i], obj2[i], `${path}[${i}]`);
      }
      return;
    }

    // Check objects
    const keys1 = Object.keys(obj1).sort();
    const keys2 = Object.keys(obj2).sort();

    const allKeys = new Set([...keys1, ...keys2]);

    for (const key of allKeys) {
      if (!(key in obj1)) {
        differences.push(`${path}.${key}: missing in original`);
      } else if (key in obj2) {
        findDiffs(obj1[key], obj2[key], path ? `${path}.${key}` : key);
      } else {
        differences.push(`${path}.${key}: missing in replay`);
      }
    }
  };

  findDiffs(original, replayed);

  if (differences.length === 0) {
    return "States are identical (this shouldn't happen)";
  }

  // Limit differences shown
  const maxDiffs = 10;
  const shown = differences.slice(0, maxDiffs);
  const remaining = differences.length - maxDiffs;

  let result = shown.join("\n");
  if (remaining > 0) {
    result += `\n... and ${remaining} more differences`;
  }

  return result;
}

/**
 * Truncate a string for display
 *
 * @param str - String to truncate
 * @param maxLength - Maximum length
 * @returns Truncated string
 */
function truncateString(str: string, maxLength: number): string {
  if (str.length <= maxLength) {
    return str;
  }
  return `${str.substring(0, maxLength)}... (${str.length - maxLength} more chars)`;
}
