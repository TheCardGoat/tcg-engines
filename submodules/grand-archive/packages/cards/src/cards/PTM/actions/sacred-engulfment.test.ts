import { describe } from "vitest";

import { proveClassBonusActivationDiscount } from "../../../testing/class-bonus-activation-discount.ts";
import { sacredEngulfment } from "./sacred-engulfment.ts";

/** @covers QvQhg1EOBR-a1 */
describe("Sacred Engulfment — Class Bonus activation discount", () => {
  proveClassBonusActivationDiscount({ card: sacredEngulfment, discount: 2 });
});
