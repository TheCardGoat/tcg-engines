import { describe } from "vitest";

import { proveClassBonusActivationDiscount } from "../../../testing/class-bonus-activation-discount.ts";
import { coneOfFrost } from "./cone-of-frost.ts";

/** @covers i7sbjy86ep-a1 */
describe("Cone of Frost — Class Bonus activation discount", () => {
  proveClassBonusActivationDiscount({ card: coneOfFrost, discount: 1, championLevel: 1 });
});

import { proveConeOfFrostLevels } from "../../../testing/cone-of-frost-levels.ts";
/** @covers i7sbjy86ep-a2
 * @covers i7sbjy86ep-a3
 * @covers i7sbjy86ep-a4
 */
describe("Cone of Frost level clauses", () => {
  proveConeOfFrostLevels();
});
