import { proveFixedDamageAction } from "../../../testing/fixed-damage-action.ts";
import { describe } from "vitest";
import { proveClassBonusActivationDiscount } from "../../../testing/class-bonus-activation-discount.ts";
import { fireball } from "./fireball.ts";

/** @covers RIVahUIQVD-a1 */
describe("Fireball \u2014 RIVahUIQVD-a1", () => {
  proveClassBonusActivationDiscount({ card: fireball, discount: 2 });
});

/** @covers RIVahUIQVD-a2 */
describe("Fireball \u2014 resolution", () => {
  proveFixedDamageAction({ card: fireball, cost: 4, damage: 1, targetKind: "unit", level: 0 });
});

/** @covers RIVahUIQVD-a2 */
describe("Class Bonus enabled", () => {
  proveFixedDamageAction({
    card: fireball,
    cost: 2,
    damage: 3,
    targetKind: "unit",
    level: 2,
    classBonus: true,
  });
});
