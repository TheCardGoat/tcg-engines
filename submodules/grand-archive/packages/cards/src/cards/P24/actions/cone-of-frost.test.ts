import { describe } from "vitest";

import { proveClassBonusActivationDiscount } from "../../../testing/class-bonus-activation-discount.ts";
import { coneOfFrost } from "./cone-of-frost.ts";

/** @covers i7sbjy86ep-a1 */
describe("Cone of Frost — Class Bonus activation discount", () => {
  proveClassBonusActivationDiscount({ card: coneOfFrost, discount: 1, championLevel: 1 });
});
