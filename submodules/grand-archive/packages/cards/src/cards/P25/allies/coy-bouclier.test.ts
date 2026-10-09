import { describe } from "vitest";
import { coyBouclier } from "./coy-bouclier.ts";

import { proveLevelActivationDiscount } from "../../../testing/class-bonus-activation-discount.ts";
/** @covers vo1qr9bkme-a1 */
describe("coyBouclier — level discount", () => {
  proveLevelActivationDiscount({
    card: coyBouclier,
    discount: 2,
    threshold: 2,
    classBonus: false,
    preparation: "ordinary",
  });
});
