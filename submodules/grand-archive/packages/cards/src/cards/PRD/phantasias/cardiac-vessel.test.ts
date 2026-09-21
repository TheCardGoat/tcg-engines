import { describe } from "vitest";

import { proveClassBonusActivationDiscount } from "../../../testing/class-bonus-activation-discount.ts";
import { cardiacVessel } from "./cardiac-vessel.ts";

/** @covers 5xjzPh6l2M-a1 */
describe("Cardiac Vessel — Class Bonus activation discount", () => {
  proveClassBonusActivationDiscount({ card: cardiacVessel, discount: 3 });
});
