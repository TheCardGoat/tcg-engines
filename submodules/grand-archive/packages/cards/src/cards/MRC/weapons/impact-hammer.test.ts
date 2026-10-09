import { describe } from "vitest";
import { impactHammer } from "./impact-hammer.ts";
import { proveConditionalWeaponPower } from "../../../testing/conditional-weapon-power.ts";

/** @covers chsbalegbs-a1 */
describe("Impact Hammer Class Bonus", () => {
  for (const classBonus of [false, true])
    proveConditionalWeaponPower({
      card: impactHammer,
      classBonus,
      withAlly: false,
      targetAlly: false,
      expectedDamage: 2 + Number(classBonus),
    });
});
