import { describe } from "vitest";

import { proveClassBonusActivationDiscount } from "../../../testing/class-bonus-activation-discount.ts";
import { suffocatingAsh } from "./suffocating-ash.ts";

/** @covers d6xkecLJ5S-a1 */
describe("Suffocating Ash — Class Bonus activation discount", () => {
  proveClassBonusActivationDiscount({
    card: suffocatingAsh,
    discount: 2,
    preparation: "stack-target",
  });
});
