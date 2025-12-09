import { createId as cuid } from "@paralleldrive/cuid2";
/**
 * Fisher-Yates shuffle algorithm with seed support.
 * @param array The array to shuffle.
 * @param seed A string or numeric seed for deterministic shuffling.
 * @returns The shuffled array (shallow copy).
 */
export declare function fisherYatesWithSeed<T>(array: T[], seed: string | number): T[];
/**
 * Simple Linear Congruential Generator (LCG) for seeded random number generation
 * Uses the same constants as used in Numerical Recipes and other implementations
 */
export declare class LinearCongruentialGenerator {
    seed: number;
    constructor(seed: string | number);
    /**
     * Generate next random number between 0 and 1
     */
    next(): number;
    /**
     * Generate random integer between 0 (inclusive) and max (exclusive)
     */
    nextInt(max: number): number;
}
/**
 * Fisher-Yates shuffle that doesn't modify the original array
 * @param array - Array to shuffle (original array remains unchanged)
 * @param seed - Seed for random number generation (string or number)
 * @returns A new shuffled array
 */
export declare function shuffleCardZone<T>(array: T[], seed: string | number): T[];
export declare const createShortAndUniqueIds: (size: number) => string[];
export declare const createId: typeof cuid;
//# sourceMappingURL=random.d.ts.map