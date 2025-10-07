import { nanoid } from "nanoid";
import seedrandom from "seedrandom";

/**
 * Seeded random number generator for deterministic randomness
 * Wraps seedrandom library to provide game-specific RNG operations
 */
export class SeededRNG {
  private seed: string;
  private prng: seedrandom.PRNG;

  constructor(seed?: string) {
    this.seed = seed ?? nanoid();
    this.prng = seedrandom(this.seed);
  }

  /**
   * Get the current seed
   */
  getSeed(): string {
    return this.seed;
  }

  /**
   * Set a new seed and reset the generator
   */
  setSeed(newSeed: string): void {
    this.seed = newSeed;
    this.prng = seedrandom(this.seed);
  }

  /**
   * Generate a random float in range [0, 1)
   */
  random(): number {
    return this.prng();
  }

  /**
   * Generate a random integer in range [min, max] (inclusive)
   * If only one argument is provided, range is [0, max]
   */
  randomInt(min: number, max?: number): number {
    const actualMin = max === undefined ? 0 : min;
    const actualMax = max === undefined ? min : max;

    if (actualMin === actualMax) {
      return actualMin;
    }

    return Math.floor(this.random() * (actualMax - actualMin + 1)) + actualMin;
  }

  /**
   * Pick a random element from an array
   * Returns undefined if array is empty
   */
  pick<T>(array: readonly T[]): T | undefined {
    if (array.length === 0) {
      return undefined;
    }

    if (array.length === 1) {
      return array[0];
    }

    const index = this.randomInt(0, array.length - 1);
    return array[index];
  }

  /**
   * Shuffle an array using Fisher-Yates algorithm
   * Returns a new array, does not mutate the original
   */
  shuffle<T>(array: readonly T[]): T[] {
    if (array.length <= 1) {
      return [...array];
    }

    const result = [...array];

    for (let i = result.length - 1; i > 0; i--) {
      const j = this.randomInt(0, i);
      [result[i], result[j]] = [result[j], result[i]];
    }

    return result;
  }

  /**
   * Roll dice with specified number of sides
   * Returns a single number for one die, or an array for multiple dice
   */
  rollDice(sides: number, count?: number): number | number[] {
    if (count === undefined || count === 1) {
      return this.randomInt(1, sides);
    }

    return Array.from({ length: count }, () => this.randomInt(1, sides));
  }

  /**
   * Flip a coin
   * @param bias - Probability of returning true (default: 0.5)
   */
  flipCoin(bias = 0.5): boolean {
    return this.random() < bias;
  }

  /**
   * Create a child RNG with a derived seed
   * Useful for creating independent RNG instances for sub-operations
   */
  createChild(namespace: string): SeededRNG {
    const childSeed = `${this.seed}:${namespace}`;
    return new SeededRNG(childSeed);
  }
}
