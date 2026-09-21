import { describe } from "vitest";

import { proveClassBonusActivationDiscount } from "../../../testing/class-bonus-activation-discount.ts";
import { incapacitate } from "./incapacitate.ts";

/** @covers szene5o32m-a1 */
describe("Incapacitate — Class Bonus activation discount", () => {
  proveClassBonusActivationDiscount({
    card: incapacitate,
    discount: 2,
    preparation: "stack-action",
  });
});
