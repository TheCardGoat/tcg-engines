import { describe } from "vitest";
import { warriorsLongsword } from "./warriors-longsword.ts";
import { proveConditionalWeaponPower } from "../../../testing/conditional-weapon-power.ts";

/** @covers jF1VuIR7a6-a1 */
describe("Warrior's Longsword Class Bonus", () => {
  for (const classBonus of [false, true])
    proveConditionalWeaponPower({
      card: warriorsLongsword,
      classBonus,
      withAlly: false,
      targetAlly: false,
      expectedDamage: 1 + Number(classBonus),
    });
});
