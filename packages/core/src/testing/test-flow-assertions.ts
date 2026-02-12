import type { RuleEngine } from "../engine/rule-engine";
import type { MoveContext, MoveContextInput } from "../moves/move-system";

/**
 * Test Flow Assertions
 *
 * Assertion helpers for testing game flow and phase transitions
 */

/**
 * Assert that a move causes a phase transition
 *
 * Verifies that executing a move transitions from one phase to another.
 * Supports custom phase paths for games that store phase in nested state.
 *
 * @param engine - Rule engine instance
 * @param moveId - Move to execute
 * @param context - Move context
 * @param fromPhase - Expected initial phase
 * @param toPhase - Expected final phase
 * @param phasePath - Optional path to phase in state (default: 'phase')
 * @throws Error if phase transition doesn't match expectations
 *
 * @example
 * ```typescript
 * // Test phase transition
 * expectPhaseTransition(
 *   engine,
 *   'endPhase',
 *   { playerId: 'p1' },
 *   'main',
 *   'end'
 * );
 *
 * // Test with custom phase path
 * expectPhaseTransition(
 *   engine,
 *   'advance',
 *   { playerId: 'p1' },
 *   'draw',
 *   'main',
 *   'gameState.currentPhase'
 * );
 * ```
 */
export function expectPhaseTransition<TState, TMoves extends Record<string, any>>(
  engine: RuleEngine<TState, TMoves>,
  moveId: string,
  context: MoveContextInput,
  fromPhase: string,
  toPhase: string,
  phasePath = "phase",
): void {
  // Get initial state
  const initialState = engine.getState();
  const initialPhase = getPropertyByPath(initialState, phasePath);

  // Verify initial phase
  if (initialPhase !== fromPhase) {
    throw new Error(`Expected initial phase to be '${fromPhase}', but found '${initialPhase}'`);
  }

  // Execute move
  const result = engine.executeMove(moveId, context);

  // Check if move succeeded
  if (!result.success) {
    throw new Error(
      `Move failed during phase transition test: ${result.error}` +
        (result.errorCode ? ` (code: ${result.errorCode})` : ""),
    );
  }

  // Get final state
  const finalState = engine.getState();
  const finalPhase = getPropertyByPath(finalState, phasePath);

  // Verify final phase
  if (finalPhase !== toPhase) {
    throw new Error(`Expected final phase to be '${toPhase}', but found '${finalPhase}'`);
  }
}

/**
 * Get property value by path with dot notation
 *
 * Supports paths like:
 * - 'phase'
 * - 'gameState.currentPhase'
 * - 'flow.phase'
 *
 * @param obj - Object to traverse
 * @param path - Property path
 * @returns Property value or undefined
 */
function getPropertyByPath(obj: any, path: string): any {
  const parts = path.split(".");
  let current = obj;

  for (const part of parts) {
    if (current === null || current === undefined) {
      return undefined;
    }
    current = current[part];
  }

  return current;
}
