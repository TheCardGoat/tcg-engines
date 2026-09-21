import { describe } from "vitest";

import { proveClassBonusActivationDiscount } from "../../../testing/class-bonus-activation-discount.ts";
import { underFire } from "./under-fire.ts";

/** @covers 5sw9f8uqrp-a1 */
describe("Under Fire — Class Bonus activation discount", () => {
  proveClassBonusActivationDiscount({ card: underFire, discount: 1 });
});
