import { describe } from "vitest";

import { proveClassBonusActivationDiscount } from "../../../testing/class-bonus-activation-discount.ts";
import { echoicGuard } from "./echoic-guard.ts";

/** @covers gn1b2sbrq9-a1 */
describe("Echoic Guard — Class Bonus activation discount", () => {
  proveClassBonusActivationDiscount({ card: echoicGuard, discount: 1 });
});
