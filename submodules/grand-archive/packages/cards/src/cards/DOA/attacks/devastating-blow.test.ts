import { proveAttackPower } from "../../../testing/attack-power.ts";
import { describe } from "vitest";
import { devastatingBlow } from "./devastating-blow.ts";

/** @covers At1UNRG7F0-a1 */
describe("Devastating Blow \u2014 resolution", () => {
  proveAttackPower({
    card: devastatingBlow,
    cost: 3,
    power: 3,
    classBonus: false,
    level: 2,
    retaliationAllowed: true,
  });
});

describe("other conditional boundaries", () => {
  proveAttackPower({
    card: devastatingBlow,
    cost: 3,
    power: 3,
    classBonus: false,
    level: 3,
    retaliationAllowed: true,
  });
  proveAttackPower({
    card: devastatingBlow,
    cost: 3,
    power: 3,
    classBonus: true,
    level: 2,
    retaliationAllowed: true,
  });
  proveAttackPower({
    card: devastatingBlow,
    cost: 3,
    power: 7,
    classBonus: true,
    level: 3,
    retaliationAllowed: false,
  });
});
