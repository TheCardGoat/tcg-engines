import { describe } from "vitest";
import { steelHalberd } from "./steel-halberd.ts";
import { proveConditionalWeaponPower } from "../../../testing/conditional-weapon-power.ts";

/** @covers fvnvknj4dd-a1 */
describe("Steel Halberd Class Bonus", () => {
  for (const classBonus of [false, true])
    proveConditionalWeaponPower({
      card: steelHalberd,
      classBonus,
      withAlly: false,
      targetAlly: false,
      expectedDamage: 1 + Number(classBonus),
    });
});
