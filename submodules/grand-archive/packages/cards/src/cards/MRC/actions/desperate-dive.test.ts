import { describe } from "vitest";

import { proveClassBonusActivationDiscount } from "../../../testing/class-bonus-activation-discount.ts";
import { desperateDive } from "./desperate-dive.ts";

/** @covers oz13xfpk9x-a1 */
describe("Desperate Dive — Class Bonus activation discount", () => {
  proveClassBonusActivationDiscount({ card: desperateDive, discount: 1 });
});
