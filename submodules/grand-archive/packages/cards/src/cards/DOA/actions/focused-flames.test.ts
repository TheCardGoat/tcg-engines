import { proveFixedDamageAction } from "../../../testing/fixed-damage-action.ts";
import { describe } from "vitest";

import { proveClassBonusActivationDiscount } from "../../../testing/class-bonus-activation-discount.ts";
import { focusedFlames } from "./focused-flames.ts";

/** @covers 145y6KBhxe-a1 */
describe("Focused Flames — Class Bonus activation discount", () => {
  proveClassBonusActivationDiscount({ card: focusedFlames, discount: 1 });
});

/** @covers 145y6KBhxe-a2 */
describe("Focused Flames \u2014 resolution", () => {
  proveFixedDamageAction({ card: focusedFlames, cost: 2, damage: 4, targetKind: "ally" });
});
