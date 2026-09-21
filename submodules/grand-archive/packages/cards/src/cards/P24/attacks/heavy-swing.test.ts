import { describe } from "vitest";

import { proveClassBonusActivationDiscount } from "../../../testing/class-bonus-activation-discount.ts";
import { heavySwing } from "./heavy-swing.ts";

/** @covers kvoqk1l75t-a1 */
describe("Heavy Swing — Class Bonus activation discount", () => {
  proveClassBonusActivationDiscount({ card: heavySwing, discount: 2 });
});
