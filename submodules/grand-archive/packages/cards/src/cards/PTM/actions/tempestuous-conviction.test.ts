import { describe } from "vitest";

import { proveClassBonusActivationDiscount } from "../../../testing/class-bonus-activation-discount.ts";
import { tempestuousConviction } from "./tempestuous-conviction.ts";

/** @covers 6Rb25k7OjY-a2 */
describe("Tempestuous Conviction — Class Bonus activation discount", () => {
  proveClassBonusActivationDiscount({ card: tempestuousConviction, discount: 2 });
});
