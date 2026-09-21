import { describe } from "vitest";

import { proveClassBonusActivationDiscount } from "../../../testing/class-bonus-activation-discount.ts";
import { demolition } from "./demolition.ts";

/** @covers 7iak6hyh6b-a1 */
describe("Demolition — Class Bonus activation discount", () => {
  proveClassBonusActivationDiscount({ card: demolition, discount: 1 });
});
