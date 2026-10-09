import { describe } from "vitest";
import { expelTheDeparted } from "./expel-the-departed.ts";

import { proveLevelActivationDiscount } from "../../../testing/class-bonus-activation-discount.ts";
/** @covers 9wxcgpy069-a1 */
describe("expelTheDeparted — level discount", () => {
  proveLevelActivationDiscount({
    card: expelTheDeparted,
    discount: 1,
    threshold: 2,
    classBonus: false,
    preparation: "ordinary",
  });
});
