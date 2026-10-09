import { describe } from "vitest";
import { slimeshield } from "./slimeshield.ts";

import { proveLevelActivationDiscount } from "../../../testing/class-bonus-activation-discount.ts";
/** @covers hcpetipurz-a1 */
describe("slimeshield — level discount", () => {
  proveLevelActivationDiscount({
    card: slimeshield,
    discount: 1,
    threshold: 2,
    classBonus: true,
    preparation: "ordinary",
  });
});
