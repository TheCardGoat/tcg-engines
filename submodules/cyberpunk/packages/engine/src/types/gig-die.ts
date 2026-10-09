import type { GigDieId, PlayerId } from "./branded.ts";
import { DIE_MAX_VALUES, type DieType } from "@tcg/cyberpunk-types";

export interface GigDie {
  id: GigDieId;
  dieType: DieType;
  faceValue: number;
  location: GigDieLocation;
  ownerId: PlayerId;
}

export type GigDieLocation = "fixerArea" | "gigArea";

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
