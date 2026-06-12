import type { DieType } from "../types/gig-die.ts";
import type { RngState } from "../types/match-state.ts";

// Re-export engine-core RNG primitives for cross-engine consumers.
// SeededRNG below is kept as-is because its internal algorithm and state
// format (single 32-bit integer) do not map cleanly to engine-core’s
// xorshift-based PRNG — changing it would alter deterministic replay output.
export { seedFromString, nextRandom, createRandomAPI } from "@tcg/engine-core";
export type { PRNGState, RandomAPIState } from "@tcg/engine-core";

export class SeededRNG {
  private state: number;

  constructor(seed: string | number) {
    if (typeof seed === "number") {
      this.state = seed >>> 0;
    } else {
      this.state = this.hashString(seed);
    }
  }

  private hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash;
    }
    return (Math.abs(hash) || 1) >>> 0;
  }

  next(): number {
    return this.nextUint32() / 0x100000000;
  }

  nextInt(min: number, max: number): number {
    if (!Number.isInteger(min) || !Number.isInteger(max)) {
      throw new Error("SeededRNG.nextInt requires integer bounds");
    }
    if (max < min) {
      throw new Error(`SeededRNG.nextInt invalid range: ${min}..${max}`);
    }

    const range = max - min + 1;
    if (range <= 0 || range > 0x100000000) {
      throw new Error(`SeededRNG.nextInt range is out of bounds: ${range}`);
    }

    const limit = Math.floor(0x100000000 / range) * range;
    let value: number;
    do {
      value = this.nextUint32();
    } while (value >= limit);
    return min + (value % range);
  }

  shuffle<T>(array: T[]): T[] {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
      const j = this.nextInt(0, i);
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }

  rollDie(dieType: DieType): number {
    const max = { d4: 4, d6: 6, d8: 8, d10: 10, d12: 12, d20: 20 }[dieType];
    return this.nextInt(1, max!);
  }

  getState(): RngState {
    return { state: this.state };
  }

  setState(rngState: RngState): void {
    this.state = rngState.state >>> 0;
  }

  private nextUint32(): number {
    this.state = (this.state + 0x6d2b79f5) >>> 0;
    let value = this.state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return (value ^ (value >>> 14)) >>> 0;
  }
}
