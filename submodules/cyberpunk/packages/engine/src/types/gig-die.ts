import type { GigDieId, PlayerId } from "./branded.ts";

export type DieType = "d4" | "d6" | "d8" | "d10" | "d12" | "d20";

export interface GigDie {
  id: GigDieId;
  dieType: DieType;
  faceValue: number;
  location: GigDieLocation;
  ownerId: PlayerId;
}

export type GigDieLocation = "fixerArea" | "gigArea";

export const DIE_MAX_VALUES: Record<DieType, number> = {
  d4: 4,
  d6: 6,
  d8: 8,
  d10: 10,
  d12: 12,
  d20: 20,
};

export const STANDARD_GIG_DICE: DieType[] = ["d20", "d12", "d10", "d8", "d6", "d4"];

export function rollDie(dieType: DieType, rng: () => number): number {
  const max = DIE_MAX_VALUES[dieType];
  return Math.floor(rng() * max) + 1;
}

export function getGigsStolenForPower(power: number): number {
  return 1 + Math.floor(power / 10);
}

export function getStreetCred(dice: GigDie[]): number {
  return dice.reduce((sum, die) => sum + die.faceValue, 0);
}
