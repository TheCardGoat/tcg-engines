import { describe } from "vitest";

import { proveClassBonusActivationDiscount } from "../../../testing/class-bonus-activation-discount.ts";
import { redirectFlow } from "./redirect-flow.ts";

/** @covers a6h0rcs8sw-a1 */
describe("Redirect Flow — Class Bonus activation discount", () => {
  proveClassBonusActivationDiscount({
    card: redirectFlow,
    discount: 2,
    preparation: "stack-ability",
  });
});
