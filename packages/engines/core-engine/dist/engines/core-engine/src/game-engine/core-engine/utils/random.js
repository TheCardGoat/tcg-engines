import { createId as cuid, init } from "@paralleldrive/cuid2";
/**
 * Fisher-Yates shuffle algorithm with seed support.
 * @param array The array to shuffle.
 * @param seed A string or numeric seed for deterministic shuffling.
 * @returns The shuffled array (shallow copy).
 */
export function fisherYatesWithSeed(array, seed) {
    const numericSeed = seedToNumber(seed);
    // Linear Congruential Generator for deterministic PRNG
    function mulberry32(a) {
        return () => {
            let t = (a += 0x6d2b79f5);
            t = Math.imul(t ^ (t >>> 15), t | 1);
            t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
            return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
        };
    }
    const random = mulberry32(numericSeed);
    const result = array.slice();
    for (let i = result.length - 1; i > 0; i--) {
        // Use seeded pseudo-random number for swap index
        const j = Math.floor(random() * (i + 1));
        [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
}
// Another implementation of Fisher-Yates shuffle
/**
 * Creates a seeded pseudo-random number generator (PRNG) using a linear congruential generator.
 * @param seed The seed for the random number generator.
 * @returns A function that returns a random number between 0 and 1.
 */
function createPrng(seed) {
    const numericSeed = seedToNumber(seed);
    // Parameters for the linear congruential generator (these are commonly used values)
    const a = 1664525;
    const c = 1013904223;
    const m = 2 ** 32;
    let s = numericSeed;
    return () => {
        s = (a * s + c) % m;
        return s / m;
    };
}
/**
 * Shuffles an array using the Fisher-Yates algorithm with a seeded PRNG.
 * @param array The array to shuffle.
 * @param seed The seed for the shuffle, making it deterministic.
 * @returns A new array with the elements shuffled.
 */
function fisherYates(array, seed) {
    const prng = createPrng(seed);
    const result = [...array]; // Create a shallow copy to avoid modifying the original array
    let currentIndex = result.length;
    let randomIndex;
    // While there remain elements to shuffle
    while (currentIndex !== 0) {
        // Pick a remaining element
        randomIndex = Math.floor(prng() * currentIndex);
        currentIndex--;
        // And swap it with the current element
        [result[currentIndex], result[randomIndex]] = [
            result[randomIndex],
            result[currentIndex],
        ];
    }
    return result;
}
// Another implementation of Fisher-Yates shuffle
/**
 * Simple Linear Congruential Generator (LCG) for seeded random number generation
 * Uses the same constants as used in Numerical Recipes and other implementations
 */
export class LinearCongruentialGenerator {
    seed;
    constructor(seed) {
        this.seed = seedToNumber(seed);
    }
    /**
     * Generate next random number between 0 and 1
     */
    next() {
        // LCG formula: (a * seed + c) % m
        // Using constants from Numerical Recipes
        this.seed = (this.seed * 1664525 + 1013904223) % 2 ** 32;
        return this.seed / 2 ** 32;
    }
    /**
     * Generate random integer between 0 (inclusive) and max (exclusive)
     */
    nextInt(max) {
        return Math.floor(this.next() * max);
    }
}
/**
 * Fisher-Yates shuffle algorithm with seed support
 * @param array - Array to shuffle (will be modified in place)
 * @param seed - Seed for random number generation (string or number)
 * @returns The shuffled array
 */
function fisherYatesShuffle(array, seed) {
    const rng = new LinearCongruentialGenerator(seed);
    // Start from the last element and work backwards
    for (let i = array.length - 1; i > 0; i--) {
        // Pick a random index from 0 to i (inclusive)
        const j = rng.nextInt(i + 1);
        // Swap elements at positions i and j
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}
/**
 * Fisher-Yates shuffle that doesn't modify the original array
 * @param array - Array to shuffle (original array remains unchanged)
 * @param seed - Seed for random number generation (string or number)
 * @returns A new shuffled array
 */
export function shuffleCardZone(array, seed) {
    const shuffled = [...array];
    return fisherYatesShuffle(shuffled, seed);
}
/**
 * Converts a string seed to a 32-bit integer using a simple hash function.
 * If the seed is already a number, returns it unchanged.
 */
function seedToNumber(seed) {
    if (typeof seed === "number")
        return seed;
    // Simple string hash (djb2)
    let hash = 5381;
    for (let i = 0; i < seed.length; i++) {
        hash = (hash << 5) + hash + seed.charCodeAt(i);
        hash = hash & 0xffffffff; // Ensure 32-bit integer
    }
    return hash >>> 0; // Ensure unsigned
}
export const createShortAndUniqueIds = (size) => {
    const createId = init({
        // 1296 possibilities
        length: 2,
    });
    const ids = new Set();
    do {
        ids.add(createId());
    } while (ids.size < size);
    return Array.from(ids);
};
export const createId = cuid;
//# sourceMappingURL=random.js.map