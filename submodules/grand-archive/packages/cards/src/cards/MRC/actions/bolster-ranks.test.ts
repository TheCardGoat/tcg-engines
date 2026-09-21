import { describe } from "vitest";

import { proveClassBonusActivationDiscount } from "../../../testing/class-bonus-activation-discount.ts";
import { bolsterRanks } from "./bolster-ranks.ts";

/** @covers n0esog2898-a1 */
describe("Bolster Ranks — Class Bonus activation discount", () => {
  proveClassBonusActivationDiscount({ card: bolsterRanks, discount: 1 });
});
