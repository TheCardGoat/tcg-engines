import { proveAttackPower } from "../../../testing/attack-power.ts";
import { describe } from "vitest";
import { flameSweep } from "./flame-sweep.ts";

/** @covers FGvq4eQPbP-a2 */
describe("Flame Sweep \u2014 resolution", () => {
  proveAttackPower({
    card: flameSweep,
    cost: 4,
    power: 1,
    classBonus: false,
    level: 1,
    cleave: true,
  });
});

describe("other conditional boundaries", () => {
  proveAttackPower({
    card: flameSweep,
    cost: 4,
    power: 1,
    classBonus: false,
    level: 2,
    cleave: true,
  });
  proveAttackPower({
    card: flameSweep,
    cost: 4,
    power: 1,
    classBonus: true,
    level: 1,
    cleave: true,
  });
  proveAttackPower({
    card: flameSweep,
    cost: 4,
    power: 2,
    classBonus: true,
    level: 2,
    cleave: true,
  });
});
