import { describe } from "vitest";

import { proveClassBonusActivationDiscount } from "../../../testing/class-bonus-activation-discount.ts";
import { acquiescingRejection } from "./acquiescing-rejection.ts";

/** @covers qwtprd5b5r-a1 */
describe("Acquiescing Rejection — Class Bonus activation discount", () => {
  proveClassBonusActivationDiscount({
    card: acquiescingRejection,
    discount: 1,
    preparation: "stack-target",
  });
});
