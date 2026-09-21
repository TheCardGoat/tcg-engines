import { describe } from "vitest";

import { proveClassBonusActivationDiscount } from "../../../testing/class-bonus-activation-discount.ts";
import { righteousRetribution } from "./righteous-retribution.ts";

/** @covers TO9qqKHakv-a1 */
describe("Righteous Retribution — Class Bonus activation discount", () => {
  proveClassBonusActivationDiscount({ card: righteousRetribution, discount: 2 });
});
