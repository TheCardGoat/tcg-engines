import { describe } from "vitest";
import { chanceSevenOfSpades } from "./chance-seven-of-spades.ts";

import { proveLevelActivationDiscount } from "../../../testing/class-bonus-activation-discount.ts";
/** @covers DKoSnhjX18-a1 */
describe("chanceSevenOfSpades — level discount", () => {
  proveLevelActivationDiscount({
    card: chanceSevenOfSpades,
    discount: 3,
    threshold: 1,
    classBonus: false,
    preparation: "ordinary",
  });
});
