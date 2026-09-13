import { proveAttackPower } from "../../../testing/attack-power.ts";
import { describe } from "vitest";
import { backstab } from "./backstab.ts";

/** @covers sxg6WefxIe-a1 */
describe("Backstab \u2014 resolution", () => {
  proveAttackPower({
    card: backstab,
    cost: 2,
    power: 2,
    classBonus: false,
    allyTarget: true,
    restedTarget: false,
  });
});

describe("other conditional boundaries", () => {
  proveAttackPower({
    card: backstab,
    cost: 2,
    power: 2,
    classBonus: false,
    allyTarget: true,
    restedTarget: true,
  });
  proveAttackPower({
    card: backstab,
    cost: 2,
    power: 2,
    classBonus: true,
    allyTarget: true,
    restedTarget: false,
  });
  proveAttackPower({
    card: backstab,
    cost: 2,
    power: 4,
    classBonus: true,
    allyTarget: true,
    restedTarget: true,
  });
});
