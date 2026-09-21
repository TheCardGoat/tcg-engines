import { describe } from "vitest";

import { proveClassBonusActivationDiscount } from "../../../testing/class-bonus-activation-discount.ts";
import { samaritansReach } from "./samaritans-reach.ts";

/** @covers MskPCrbv0L-a1 */
describe("Samaritan's Reach — Class Bonus activation discount", () => {
  proveClassBonusActivationDiscount({
    card: samaritansReach,
    discount: 1,
    preparation: "attacking-enemy-ally",
  });
});
