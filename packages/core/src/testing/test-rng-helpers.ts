import { SeededRNG } from "../rng/seeded-rng";

/**
 * Test RNG Helpers
 *
 * Utilities for testing with deterministic randomness
 */

/**
 * Execute a function with a seeded RNG
 *
 * Creates a temporary RNG instance with the specified seed,
 * executes the function, and returns its result.
 *
 * @param seed - Seed for deterministic behavior
 * @param fn - Function to execute with RNG
 * @returns Result of the function
 *
 * @example
 * ```typescript
 * const result = withSeed('test-seed', (rng) => {
 *   return rng.shuffle([1, 2, 3, 4, 5]);
 * });
 *
 * // Same seed produces same result
 * const result2 = withSeed('test-seed', (rng) => {
 *   return rng.shuffle([1, 2, 3, 4, 5]);
 * });
 * expect(result).toEqual(result2);
 * ```
 */
export function withSeed<T>(seed: string, fn: (rng: SeededRNG) => T): T {
  const rng = new SeededRNG(seed);
  return fn(rng);
}

/**
 * Create a deterministic RNG for testing
 *
 * Creates an RNG instance with a known seed for predictable testing.
 *
 * @param seed - Optional seed (default: 'test-seed')
 * @returns Seeded RNG instance
 *
 * @example
 * ```typescript
 * const rng = createDeterministicRNG('my-test');
 * const value1 = rng.randomInt(1, 100);
 *
 * // Recreate with same seed for same results
 * const rng2 = createDeterministicRNG('my-test');
 * const value2 = rng2.randomInt(1, 100);
 *
 * expect(value1).toBe(value2);
 * ```
 */
export function createDeterministicRNG(seed = "test-seed"): SeededRNG {
  return new SeededRNG(seed);
}

/**
 * Assert that a function produces deterministic results with same seed
 *
 * Executes the function twice with the same seed and verifies
 * that the results are identical.
 *
 * @param fn - Function to test for determinism
 * @param seed - Optional seed (default: 'determinism-test')
 * @throws Error if function produces different results
 *
 * @example
 * ```typescript
 * // Test that shuffle is deterministic
 * expectDeterministicBehavior((rng) => {
 *   return rng.shuffle([1, 2, 3, 4, 5]);
 * });
 *
 * // Test game mechanic
 * expectDeterministicBehavior((rng) => {
 *   const deck = createDeck();
 *   return drawCards(deck, 5, rng);
 * }, 'draw-test-seed');
 * ```
 */
export function expectDeterministicBehavior<T>(
  fn: (rng: SeededRNG) => T,
  seed = "determinism-test",
): void {
  const result1 = withSeed(seed, fn);
  const result2 = withSeed(seed, fn);

  // Deep equality check
  if (JSON.stringify(result1) !== JSON.stringify(result2)) {
    throw new Error(
      `Expected function to be deterministic with seed '${seed}', but got different results:\n` +
        `Run 1: ${JSON.stringify(result1)}\n` +
        `Run 2: ${JSON.stringify(result2)}`,
    );
  }
}

/**
 * Create multiple RNG instances with related seeds
 *
 * Useful for testing scenarios with multiple independent RNG streams
 * (e.g., one per player) that need to be reproducible.
 *
 * @param count - Number of RNG instances to create
 * @param baseSeed - Base seed for determinism
 * @returns Array of seeded RNG instances
 *
 * @example
 * ```typescript
 * // Create RNG for each player
 * const [p1Rng, p2Rng] = createMultipleRNGs(2, 'game-seed');
 *
 * // Each player gets deterministic but independent randomness
 * const p1Roll = p1Rng.rollDice(20);
 * const p2Roll = p2Rng.rollDice(20);
 * ```
 */
export function createMultipleRNGs(
  count: number,
  baseSeed = "test",
): SeededRNG[] {
  return Array.from({ length: count }, (_, i) => {
    return new SeededRNG(`${baseSeed}-${i}`);
  });
}

/**
 * Test a random operation multiple times with different seeds
 *
 * Useful for ensuring that random operations cover a good range
 * of possible outcomes.
 *
 * @param fn - Function to test
 * @param iterations - Number of iterations to run
 * @returns Array of results
 *
 * @example
 * ```typescript
 * // Test that shuffle produces variety
 * const results = testWithMultipleSeeds(
 *   (rng) => rng.shuffle([1, 2, 3, 4, 5]),
 *   100
 * );
 *
 * // Verify we got different shuffles
 * const uniqueResults = new Set(results.map(r => JSON.stringify(r)));
 * expect(uniqueResults.size).toBeGreaterThan(10);
 * ```
 */
export function testWithMultipleSeeds<T>(
  fn: (rng: SeededRNG) => T,
  iterations = 10,
): T[] {
  return Array.from({ length: iterations }, (_, i) => {
    return withSeed(`test-iteration-${i}`, fn);
  });
}

/**
 * Create a predictable sequence of random values
 *
 * Useful for testing specific scenarios with known random values.
 *
 * @param seed - Seed for the sequence
 * @param count - Number of values to generate
 * @param min - Minimum value (inclusive)
 * @param max - Maximum value (inclusive)
 * @returns Array of random integers
 *
 * @example
 * ```typescript
 * // Generate predictable dice rolls for testing
 * const rolls = createPredictableSequence('combat', 10, 1, 20);
 * // Always gets same sequence of rolls with this seed
 * ```
 */
export function createPredictableSequence(
  seed: string,
  count: number,
  min: number,
  max: number,
): number[] {
  return withSeed(seed, (rng) => {
    return Array.from({ length: count }, () => rng.randomInt(min, max));
  });
}
