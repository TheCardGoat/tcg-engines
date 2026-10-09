import { describe } from "vitest";
import { immaterialDissolution } from "./immaterial-dissolution.ts";

import { proveLevelActivationDiscount } from "../../../testing/class-bonus-activation-discount.ts";
/** @covers 55d9w9uuvq-a1 */
describe("immaterialDissolution — level discount", () => {
  proveLevelActivationDiscount({
    card: immaterialDissolution,
    discount: 1,
    threshold: 2,
    classBonus: false,
    preparation: "ordinary",
  });
});
