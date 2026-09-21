import { describe } from "vitest";

import { proveClassBonusActivationDiscount } from "../../../testing/class-bonus-activation-discount.ts";
import { crosswindCuts } from "./crosswind-cuts.ts";

/** @covers S0YCKJcU5e-a1 */
describe("Crosswind Cuts — Class Bonus activation discount", () => {
  proveClassBonusActivationDiscount({ card: crosswindCuts, discount: 2 });
});
