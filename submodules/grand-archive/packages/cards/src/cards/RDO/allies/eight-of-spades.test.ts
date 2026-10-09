import { describe } from "vitest";
import { eightOfSpades } from "./eight-of-spades.ts";

import { proveLevelActivationDiscount } from "../../../testing/class-bonus-activation-discount.ts";
/** @covers d43C0Hk6qH-a1 */
describe("eightOfSpades — level discount", () => {
  proveLevelActivationDiscount({
    card: eightOfSpades,
    discount: 4,
    threshold: 1,
    classBonus: false,
    preparation: "ordinary",
  });
});
