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
