import { describe } from "vitest";

import { proveClassBonusActivationDiscount } from "../../../testing/class-bonus-activation-discount.ts";
import { reinforcingAir } from "./reinforcing-air.ts";

/** @covers TrWfgn2PV0-a1 */
describe("Reinforcing Air — Class Bonus activation discount", () => {
  proveClassBonusActivationDiscount({ card: reinforcingAir, discount: 1 });
});
