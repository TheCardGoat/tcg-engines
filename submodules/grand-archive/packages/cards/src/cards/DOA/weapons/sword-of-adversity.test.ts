import { proveConditionalWeaponPower } from "../../../testing/conditional-weapon-power.ts";
import { describe } from "vitest";
import { swordOfAdversity } from "./sword-of-adversity.ts";

/** @covers dpu9pHGX48-a1 */
describe("Sword of Adversity \u2014 resolution", () => {
  proveConditionalWeaponPower({
    card: swordOfAdversity,
    classBonus: true,
    withAlly: true,
    targetAlly: true,
    expectedDamage: 1,
  });
});

describe("restriction boundaries", () => {
  proveConditionalWeaponPower({
    card: swordOfAdversity,
    classBonus: true,
    withAlly: true,
    targetAlly: false,
    expectedDamage: 1,
  });
  proveConditionalWeaponPower({
    card: swordOfAdversity,
    classBonus: true,
    withAlly: false,
    targetAlly: true,
    expectedDamage: 2,
  });
  proveConditionalWeaponPower({
    card: swordOfAdversity,
    classBonus: true,
    withAlly: false,
    targetAlly: false,
    expectedDamage: 2,
  });
  proveConditionalWeaponPower({
    card: swordOfAdversity,
    classBonus: false,
    withAlly: true,
    targetAlly: true,
    expectedDamage: 1,
  });
  proveConditionalWeaponPower({
    card: swordOfAdversity,
    classBonus: false,
    withAlly: true,
    targetAlly: false,
    expectedDamage: 1,
  });
  proveConditionalWeaponPower({
    card: swordOfAdversity,
    classBonus: false,
    withAlly: false,
    targetAlly: true,
    expectedDamage: 1,
  });
  proveConditionalWeaponPower({
    card: swordOfAdversity,
    classBonus: false,
    withAlly: false,
    targetAlly: false,
    expectedDamage: 1,
  });
});
