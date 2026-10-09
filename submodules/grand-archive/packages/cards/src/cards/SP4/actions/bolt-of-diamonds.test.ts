import { describe } from "vitest";

import { proveFixedDamageAction } from "../../../testing/fixed-damage-action.ts";
import { boltOfDiamonds } from "./bolt-of-diamonds.ts";

/** @covers ek5r5YlFQv-a2 */
describe("Bolt of Diamonds — fixed damage", () => {
  proveFixedDamageAction({
    card: boltOfDiamonds,
    cost: 2,
    damage: 1,
    targetKind: "unit",
  });
});

import { proveLevelActivationDiscount } from "../../../testing/class-bonus-activation-discount.ts";
/** @covers ek5r5YlFQv-a1 */
describe("boltOfDiamonds — level discount", () => {
  proveLevelActivationDiscount({
    card: boltOfDiamonds,
    discount: 2,
    threshold: 2,
    classBonus: false,
    preparation: "ordinary",
  });
});
