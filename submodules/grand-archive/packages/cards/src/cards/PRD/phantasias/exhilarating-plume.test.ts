import { describe } from "vitest";

import { proveClassBonusActivationDiscount } from "../../../testing/class-bonus-activation-discount.ts";
import { exhilaratingPlume } from "./exhilarating-plume.ts";

/** @covers A9c8tb7LKD-a1 */
describe("Exhilarating Plume — Class Bonus activation discount", () => {
  proveClassBonusActivationDiscount({ card: exhilaratingPlume, discount: 2 });
});
