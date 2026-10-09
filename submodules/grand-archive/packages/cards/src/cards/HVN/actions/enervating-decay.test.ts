import { describe } from "vitest";
import { enervatingDecay } from "./enervating-decay.ts";

import { proveLevelActivationDiscount } from "../../../testing/class-bonus-activation-discount.ts";
/** @covers jh9s424gjr-a1 */
describe("enervatingDecay — level discount", () => {
  proveLevelActivationDiscount({
    card: enervatingDecay,
    discount: 2,
    threshold: 5,
    classBonus: true,
    preparation: "attacking-enemy-ally",
  });
});
