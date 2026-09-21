import { describe } from "vitest";

import { proveClassBonusActivationDiscount } from "../../../testing/class-bonus-activation-discount.ts";
import { iceboundSlam } from "./icebound-slam.ts";

/** @covers 6fxxgmuesd-a1 */
describe("Icebound Slam — Class Bonus activation discount", () => {
  proveClassBonusActivationDiscount({ card: iceboundSlam, discount: 2 });
});
