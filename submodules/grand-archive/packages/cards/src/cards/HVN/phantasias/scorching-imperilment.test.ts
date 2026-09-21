import { describe } from "vitest";

import { proveClassBonusActivationDiscount } from "../../../testing/class-bonus-activation-discount.ts";
import { scorchingImperilment } from "./scorching-imperilment.ts";

/** @covers aj7pz79wsp-a1 */
describe("Scorching Imperilment — Class Bonus activation discount", () => {
  proveClassBonusActivationDiscount({ card: scorchingImperilment, discount: 2 });
});
