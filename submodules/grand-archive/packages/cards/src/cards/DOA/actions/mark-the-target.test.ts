import { proveFixedDamageAction } from "../../../testing/fixed-damage-action.ts";
import { describe } from "vitest";
import { markTheTarget } from "./mark-the-target.ts";

/** @covers LRsgl92Iqa-a1 */
describe("Mark the Target \u2014 resolution", () => {
  proveFixedDamageAction({
    card: markTheTarget,
    cost: 1,
    damage: 1,
    targetKind: "unit",
    classBonus: false,
    preparation: 0,
  });
});

/** @covers LRsgl92Iqa-a2 */
describe("Class Bonus enabled", () => {
  proveFixedDamageAction({
    card: markTheTarget,
    cost: 1,
    damage: 1,
    targetKind: "unit",
    classBonus: true,
    preparation: 1,
  });
});
