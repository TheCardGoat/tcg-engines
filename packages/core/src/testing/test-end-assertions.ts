import type { RuleEngine } from "../engine/rule-engine";
import type { GameEndResult } from "../game-definition/game-definition";

/**
 * Test End Assertions
 *
 * Assertion helpers for testing game end conditions
 */

/**
 * Assert that the game has ended
 *
 * Verifies that checkGameEnd returns a truthy value.
 * Optionally checks the winner and/or reason.
 *
 * @param engine - Rule engine instance
 * @param expectedWinner - Optional expected winner
 * @param expectedReason - Optional expected reason
 * @returns Game end result
 * @throws Error if game hasn't ended or end result doesn't match expectations
 *
 * @example
 * ```typescript
 * // Check that game ended
 * expectGameEnd(engine);
 *
 * // Check specific winner
 * expectGameEnd(engine, 'player1');
 *
 * // Check winner and reason
 * expectGameEnd(engine, 'player1', 'Opponent eliminated');
 * ```
 */
export function expectGameEnd<TState, TMoves extends Record<string, any>>(
  engine: RuleEngine<TState, TMoves>,
  expectedWinner?: string,
  expectedReason?: string,
): GameEndResult {
  const endResult = engine.checkGameEnd();

  if (!endResult) {
    throw new Error(
      "Expected game to have ended, but checkGameEnd() returned undefined",
    );
  }

  // Check winner if specified
  if (expectedWinner !== undefined && endResult.winner !== expectedWinner) {
    throw new Error(
      `Expected winner to be '${expectedWinner}', but got '${endResult.winner}'`,
    );
  }

  // Check reason if specified
  if (expectedReason !== undefined && endResult.reason !== expectedReason) {
    throw new Error(
      `Expected reason to be '${expectedReason}', but got '${endResult.reason}'`,
    );
  }

  return endResult;
}

/**
 * Assert that the game has not ended
 *
 * Verifies that checkGameEnd returns undefined/falsy.
 * Useful for testing that intermediate game states don't trigger end conditions.
 *
 * @param engine - Rule engine instance
 * @throws Error if game has ended
 *
 * @example
 * ```typescript
 * // Verify game is still ongoing
 * expectGameNotEnded(engine);
 *
 * // Do some moves
 * engine.executeMove('attack', { ... });
 *
 * // Verify game still hasn't ended
 * expectGameNotEnded(engine);
 * ```
 */
export function expectGameNotEnded<TState, TMoves extends Record<string, any>>(
  engine: RuleEngine<TState, TMoves>,
): void {
  const endResult = engine.checkGameEnd();

  if (endResult) {
    throw new Error(
      `Expected game to still be ongoing, but it ended with: ${JSON.stringify(endResult)}`,
    );
  }
}
