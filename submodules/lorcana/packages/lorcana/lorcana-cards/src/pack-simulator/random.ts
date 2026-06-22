import seedrandom from "seedrandom";

export type RandomFn = () => number;

export function createSeededRandom(seed?: string): RandomFn {
  return seed ? seedrandom(seed) : Math.random;
}
