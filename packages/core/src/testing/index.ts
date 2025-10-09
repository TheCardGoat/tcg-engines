/**
 * @tcg/core/testing
 *
 * Testing utilities for game engine development
 *
 * Provides assertions, factories, and helpers for:
 * - Move execution testing
 * - State verification
 * - Flow and phase transitions
 * - Game end conditions
 * - Card and zone creation
 * - Deterministic RNG testing
 * - Replay verification
 *
 * @example
 * ```typescript
 * import {
 *   expectMoveSuccess,
 *   expectStateProperty,
 *   createTestCard,
 *   createTestDeck,
 *   withSeed,
 *   expectDeterministicReplay
 * } from '@tcg/core/testing';
 *
 * // Test move execution
 * expectMoveSuccess(engine, 'playCard', {
 *   playerId: 'p1',
 *   data: { cardId: 'card-123' }
 * });
 *
 * // Verify state
 * expectStateProperty(engine, 'players[0].score', 10);
 *
 * // Create test data
 * const card = createTestCard({ type: 'creature', basePower: 3 });
 * const deck = createTestDeck(['card1', 'card2', 'card3'], 'player1');
 *
 * // Test with deterministic RNG
 * const result = withSeed('test-seed', (rng) => {
 *   return rng.shuffle([1, 2, 3, 4, 5]);
 * });
 *
 * // Verify deterministic replay
 * expectDeterministicReplay(engine);
 * ```
 *
 * @module @tcg/core/testing
 */

// Move assertions
export {
  expectMoveFailure,
  expectMoveSuccess,
  expectStateProperty,
} from "./test-assertions";
// Card factory
export {
  createTestCard,
  createTestCards,
  resetCardCounter,
} from "./test-card-factory";

// End assertions
export { expectGameEnd, expectGameNotEnded } from "./test-end-assertions";
// Flow assertions
export { expectPhaseTransition } from "./test-flow-assertions";
// Replay assertions
export { expectDeterministicReplay } from "./test-replay-assertions";

// RNG helpers
export {
  createDeterministicRNG,
  createMultipleRNGs,
  createPredictableSequence,
  expectDeterministicBehavior,
  testWithMultipleSeeds,
  withSeed,
} from "./test-rng-helpers";
// Zone factory
export {
  createTestDeck,
  createTestGraveyard,
  createTestHand,
  createTestPlayArea,
  createTestZone,
  resetZoneCounter,
} from "./test-zone-factory";
