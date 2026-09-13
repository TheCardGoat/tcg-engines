import { describe } from "vitest";

import { proveClassBonusActivationDiscount } from "../../../testing/class-bonus-activation-discount.ts";
import { adornedStag } from "./adorned-stag.ts";

/** @covers 4gdubtwij9-a1 */
describe("Adorned Stag — Class Bonus activation discount", () => {
  proveClassBonusActivationDiscount({ card: adornedStag, discount: 1 });
});
