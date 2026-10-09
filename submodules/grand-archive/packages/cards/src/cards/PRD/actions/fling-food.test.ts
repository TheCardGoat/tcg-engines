import { describe } from "vitest";

import { proveFixedDamageAction } from "../../../testing/fixed-damage-action.ts";
import { flingFood } from "./fling-food.ts";

/** @covers pVHGi99Svy-a2 */
describe("Fling Food — fixed damage", () => {
  proveFixedDamageAction({
    card: flingFood,
    cost: 1,
    damage: 4,
    targetKind: "unit",
    sacrifice: "food",
  });
});

import { keySlimePudding } from "../../P24/items/key-slime-pudding.ts";
import { proveAdditionalSacrifice } from "../../../testing/additional-sacrifice.ts";
/** @covers pVHGi99Svy-a1 */
describe("Fling Food additional sacrifice", () => {
  proveAdditionalSacrifice(flingFood, 1, [keySlimePudding]);
});
