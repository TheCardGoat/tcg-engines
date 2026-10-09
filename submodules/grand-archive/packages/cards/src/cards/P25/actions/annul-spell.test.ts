import { describe } from "vitest";
import { annulSpell } from "./annul-spell.ts";

import { proveLevelActivationDiscount } from "../../../testing/class-bonus-activation-discount.ts";
/** @covers u817uqlk1j-a1 */
describe("annulSpell — level discount", () => {
  proveLevelActivationDiscount({
    card: annulSpell,
    discount: 1,
    threshold: 2,
    classBonus: false,
    preparation: "stack-spell",
  });
});
