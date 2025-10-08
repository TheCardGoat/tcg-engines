/**
 * Seeded RNG interface for deterministic random number generation
 * This is a stub - full implementation will be added in Task 11 (Rule Engine Core)
 */

export type SeededRNG = {
  random(): number;
  randomInt(min: number, max: number): number;
  pick<T>(array: T[]): T;
  shuffle<T>(array: T[]): T[];
  rollDice(sides: number): number;
  flipCoin(): boolean;
  getSeed(): string;
  setSeed(seed: string): void;
  createChild(label?: string): SeededRNG;
};
