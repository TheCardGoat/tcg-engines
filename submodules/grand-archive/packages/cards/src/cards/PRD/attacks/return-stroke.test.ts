import { describe } from "vitest";
import { returnStroke } from "./return-stroke.ts";
import { proveAttackPower } from "../../../testing/attack-power.ts";

/** @covers TZym0IOInK-a1 */
describe("Return Stroke Class Bonus", () => {
  for (const classBonus of [false, true])
    for (const level of [0, 1, 3])
      proveAttackPower({
        card: returnStroke,
        classBonus,
        level,
        cost: 3,
        power: 2 + (classBonus ? level : 0),
      });
});
