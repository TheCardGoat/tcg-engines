import type { MoveExecutionResult, RuleEngine } from "../engine/rule-engine";
import type { MoveContext } from "../moves/move-system";

/**
 * Test Assertions
 *
 * Assertion helpers for testing game moves and state
 */

/**
 * Assert that a move executes successfully
 *
 * Executes the move and throws an error if it fails.
 * Returns the success result for further assertions on patches.
 *
 * @param engine - Rule engine instance
 * @param moveId - Move to execute
 * @param context - Move context
 * @returns Move execution result (success)
 * @throws Error if move fails
 *
 * @example
 * ```typescript
 * const result = expectMoveSuccess(engine, 'playCard', {
 *   playerId: 'p1',
 *   data: { cardId: 'card-123' }
 * });
 * expect(result.patches.length).toBeGreaterThan(0);
 * ```
 */
export function expectMoveSuccess<TState, TMoves extends Record<string, any>>(
  engine: RuleEngine<TState, TMoves>,
  moveId: string,
  context: MoveContext,
): Extract<MoveExecutionResult, { success: true }> {
  const result = engine.executeMove(moveId, context);

  if (!result.success) {
    throw new Error(
      `Expected move '${moveId}' to succeed, but it failed with: ${result.error}` +
        (result.errorCode ? ` (code: ${result.errorCode})` : ""),
    );
  }

  return result;
}

/**
 * Assert that a move fails
 *
 * Executes the move and throws an error if it succeeds.
 * Returns the failure result for assertions on error details.
 *
 * @param engine - Rule engine instance
 * @param moveId - Move to execute
 * @param context - Move context
 * @param expectedErrorCode - Optional expected error code
 * @returns Move execution result (failure)
 * @throws Error if move succeeds or error code doesn't match
 *
 * @example
 * ```typescript
 * const result = expectMoveFailure(engine, 'invalidMove', {
 *   playerId: 'p1'
 * }, 'CONDITION_FAILED');
 * expect(result.error).toContain('not met');
 * ```
 */
export function expectMoveFailure<TState, TMoves extends Record<string, any>>(
  engine: RuleEngine<TState, TMoves>,
  moveId: string,
  context: MoveContext,
  expectedErrorCode?: string,
): Extract<MoveExecutionResult, { success: false }> {
  const result = engine.executeMove(moveId, context);

  if (result.success) {
    throw new Error(
      `Expected move '${moveId}' to fail, but it succeeded with ${result.patches.length} patches`,
    );
  }

  if (expectedErrorCode && result.errorCode !== expectedErrorCode) {
    throw new Error(
      `Expected error code '${expectedErrorCode}', but got '${result.errorCode}': ${result.error}`,
    );
  }

  return result;
}

/**
 * Assert that a state property has a specific value
 *
 * Supports dot notation and array indexing for nested properties.
 * Throws an error if the property doesn't match the expected value.
 *
 * @param engine - Rule engine instance
 * @param path - Property path (e.g., 'players[0].score' or 'nested.deep.value')
 * @param expectedValue - Expected value
 * @throws Error if property doesn't match or path is invalid
 *
 * @example
 * ```typescript
 * expectStateProperty(engine, 'turnNumber', 1);
 * expectStateProperty(engine, 'players[0].score', 10);
 * expectStateProperty(engine, 'nested.deep.value', 42);
 * ```
 */
export function expectStateProperty<TState, TMoves extends Record<string, any>>(
  engine: RuleEngine<TState, TMoves>,
  path: string,
  expectedValue: any,
): void {
  const state = engine.getState();
  const actualValue = getPropertyByPath(state, path);

  if (actualValue === undefined && !hasProperty(state, path)) {
    throw new Error(
      `Property path '${path}' not found in state. Available paths: ${getAvailablePaths(state).join(", ")}`,
    );
  }

  if (actualValue !== expectedValue) {
    throw new Error(
      `Expected state.${path} to be ${JSON.stringify(expectedValue)}, but got ${JSON.stringify(actualValue)}`,
    );
  }
}

/**
 * Get property value by path with dot notation and array indexing
 *
 * Supports paths like:
 * - 'players[0].name'
 * - 'nested.deep.value'
 * - 'array.length'
 *
 * @param obj - Object to traverse
 * @param path - Property path
 * @returns Property value or undefined
 */
function getPropertyByPath(obj: any, path: string): any {
  // Split by dots but preserve array brackets
  const parts = path.split(/\.(?![^[]*\])/);

  let current = obj;

  for (const part of parts) {
    if (current === null || current === undefined) {
      return undefined;
    }

    // Handle array indexing: players[0]
    const arrayMatch = part.match(/^(.+?)\[(\d+)\]$/);
    if (arrayMatch) {
      const [, arrayName, index] = arrayMatch;
      current = current[arrayName as string];
      if (current === null || current === undefined) {
        return undefined;
      }
      current = current[Number.parseInt(index as string, 10)];
    } else {
      current = current[part];
    }
  }

  return current;
}

/**
 * Check if a property path exists in an object
 *
 * @param obj - Object to check
 * @param path - Property path
 * @returns True if path exists
 */
function hasProperty(obj: any, path: string): boolean {
  const parts = path.split(/\.(?![^[]*\])/);
  let current = obj;

  for (const part of parts) {
    if (current === null || current === undefined) {
      return false;
    }

    // Handle array indexing
    const arrayMatch = part.match(/^(.+?)\[(\d+)\]$/);
    if (arrayMatch) {
      const [, arrayName, index] = arrayMatch;
      if (!(arrayName in current)) {
        return false;
      }
      current = current[arrayName as string];
      if (current === null || current === undefined) {
        return false;
      }
      const idx = Number.parseInt(index as string, 10);
      if (!Array.isArray(current) || idx >= current.length) {
        return false;
      }
      current = current[idx];
    } else {
      if (!(part in current)) {
        return false;
      }
      current = current[part];
    }
  }

  return true;
}

/**
 * Get available property paths in an object (for error messages)
 *
 * @param obj - Object to inspect
 * @param prefix - Path prefix for recursion
 * @param maxDepth - Maximum depth to traverse
 * @returns Array of property paths
 */
function getAvailablePaths(obj: any, prefix = "", maxDepth = 2): string[] {
  if (maxDepth <= 0 || obj === null || typeof obj !== "object") {
    return [];
  }

  const paths: string[] = [];

  for (const key of Object.keys(obj)) {
    const path = prefix ? `${prefix}.${key}` : key;
    paths.push(path);

    // Recursively get nested paths
    if (typeof obj[key] === "object" && obj[key] !== null) {
      if (Array.isArray(obj[key])) {
        // Show array length
        paths.push(`${path}.length`);
        // Show first few elements
        for (let i = 0; i < Math.min(3, obj[key].length); i++) {
          paths.push(`${path}[${i}]`);
          const nestedPaths = getAvailablePaths(
            obj[key][i],
            `${path}[${i}]`,
            maxDepth - 1,
          );
          paths.push(...nestedPaths);
        }
      } else {
        const nestedPaths = getAvailablePaths(obj[key], path, maxDepth - 1);
        paths.push(...nestedPaths);
      }
    }
  }

  return paths.slice(0, 50); // Limit for readability
}
