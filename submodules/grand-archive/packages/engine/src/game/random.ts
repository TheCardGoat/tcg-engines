import type { GrandArchiveRandomState } from "./model.ts";

export interface GrandArchiveRandomResult<Value> {
  readonly value: Value;
  readonly random: GrandArchiveRandomState;
}

export function nextGrandArchiveRandom(
  random: GrandArchiveRandomState,
): GrandArchiveRandomResult<number> {
  let value = (random.seed + random.cursor + 0x6d2b79f5) | 0;
  value = Math.imul(value ^ (value >>> 15), value | 1);
  value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
  const normalized = ((value ^ (value >>> 14)) >>> 0) / 4_294_967_296;
  return { value: normalized, random: { ...random, cursor: random.cursor + 1 } };
}

export interface GrandArchiveDiceResult {
  readonly results: readonly number[];
  readonly total: number;
}

export function rollGrandArchiveDice(
  random: GrandArchiveRandomState,
  sides: number,
  count = 1,
): GrandArchiveRandomResult<GrandArchiveDiceResult> {
  if (!Number.isSafeInteger(sides) || sides < 2) {
    throw new Error("A fair die must have at least two sides");
  }
  if (!Number.isSafeInteger(count) || count < 1) {
    throw new Error("A die calculation must roll at least one die");
  }
  const results: number[] = [];
  let nextRandom = random;
  for (let index = 0; index < count; index += 1) {
    const rolled = nextGrandArchiveRandom(nextRandom);
    nextRandom = rolled.random;
    results.push(Math.floor(rolled.value * sides) + 1);
  }
  return {
    value: { results, total: results.reduce((sum, result) => sum + result, 0) },
    random: nextRandom,
  };
}

export function shuffleGrandArchiveObjects<Value>(
  values: readonly Value[],
  random: GrandArchiveRandomState,
): GrandArchiveRandomResult<readonly Value[]> {
  const shuffled = [...values];
  let nextRandom = random;
  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const result = nextGrandArchiveRandom(nextRandom);
    nextRandom = result.random;
    const swapIndex = Math.floor(result.value * (index + 1));
    const current = shuffled[index];
    const swap = shuffled[swapIndex];
    if (current === undefined || swap === undefined) throw new Error("Invalid shuffle index");
    shuffled[index] = swap;
    shuffled[swapIndex] = current;
  }
  return { value: shuffled, random: nextRandom };
}
