import { describe } from "vitest";

import { proveClassBonusActivationDiscount } from "../../../testing/class-bonus-activation-discount.ts";
import { hailstormGuard } from "./hailstorm-guard.ts";

/** @covers 05qzzadf9q-a1 */
describe("Hailstorm Guard — Class Bonus activation discount", () => {
  proveClassBonusActivationDiscount({ card: hailstormGuard, discount: 2 });
});
