import { describe } from "vitest";

import { proveClassBonusActivationDiscount } from "../../../testing/class-bonus-activation-discount.ts";
import { shiftingMirage } from "./shifting-mirage.ts";

/** @covers hmjr33ijq6-a1 */
describe("Shifting Mirage — Class Bonus activation discount", () => {
  proveClassBonusActivationDiscount({ card: shiftingMirage, discount: 1 });
});
