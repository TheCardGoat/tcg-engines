import { describe } from "vitest";
import { forgelightBlade } from "./forgelight-blade.ts";
import { proveConditionalWeaponPower } from "../../../testing/conditional-weapon-power.ts";

/** @covers ly4wiffei7-a1 */
describe("Forgelight Blade Class Bonus", () => {
  for (const classBonus of [false, true])
    proveConditionalWeaponPower({
      card: forgelightBlade,
      classBonus,
      withAlly: false,
      targetAlly: false,
      expectedDamage: 1 + Number(classBonus),
    });
});
