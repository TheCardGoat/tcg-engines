import { proveConditionalWeaponPower } from "../../../testing/conditional-weapon-power.ts";
import { describe } from "vitest";
import { curvedDagger } from "./curved-dagger.ts";

/** @covers Q2ugqVm04E-a1 */
describe("Curved Dagger \u2014 resolution", () => {
  proveConditionalWeaponPower({
    card: curvedDagger,
    classBonus: true,
    withAlly: true,
    targetAlly: true,
    expectedDamage: 2,
  });
});

describe("restriction boundaries", () => {
  proveConditionalWeaponPower({
    card: curvedDagger,
    classBonus: true,
    withAlly: true,
    targetAlly: false,
    expectedDamage: 1,
  });
  proveConditionalWeaponPower({
    card: curvedDagger,
    classBonus: true,
    withAlly: false,
    targetAlly: true,
    expectedDamage: 2,
  });
  proveConditionalWeaponPower({
    card: curvedDagger,
    classBonus: true,
    withAlly: false,
    targetAlly: false,
    expectedDamage: 1,
  });
  proveConditionalWeaponPower({
    card: curvedDagger,
    classBonus: false,
    withAlly: true,
    targetAlly: true,
    expectedDamage: 1,
  });
  proveConditionalWeaponPower({
    card: curvedDagger,
    classBonus: false,
    withAlly: true,
    targetAlly: false,
    expectedDamage: 1,
  });
  proveConditionalWeaponPower({
    card: curvedDagger,
    classBonus: false,
    withAlly: false,
    targetAlly: true,
    expectedDamage: 1,
  });
  proveConditionalWeaponPower({
    card: curvedDagger,
    classBonus: false,
    withAlly: false,
    targetAlly: false,
    expectedDamage: 1,
  });
});
