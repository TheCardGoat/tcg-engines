import { describe } from "vitest";
import { bulwarkSword } from "./bulwark-sword.ts";
import { proveConditionalWeaponPower } from "../../../testing/conditional-weapon-power.ts";

/** @covers 8kmoi0a5uh-a1 */
describe("Bulwark Sword Class Bonus", () => {
  for (const classBonus of [false, true])
    proveConditionalWeaponPower({
      card: bulwarkSword,
      classBonus,
      withAlly: false,
      targetAlly: false,
      expectedDamage: 2 + Number(classBonus),
      attackReserveCost: 2,
    });
});
