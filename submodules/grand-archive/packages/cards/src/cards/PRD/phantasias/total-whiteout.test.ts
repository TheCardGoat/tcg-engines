import { describe } from "vitest";

import { proveClassBonusActivationDiscount } from "../../../testing/class-bonus-activation-discount.ts";
import { totalWhiteout } from "./total-whiteout.ts";

/** @covers O4mD40xpbY-a1 */
describe("Total Whiteout — Class Bonus activation discount", () => {
  proveClassBonusActivationDiscount({ card: totalWhiteout, discount: 3 });
});
