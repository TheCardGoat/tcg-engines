import { describe } from "vitest";
import { aeneanGutteringFlames } from "./aenean-guttering-flames.ts";

import { proveLevelActivationDiscount } from "../../../testing/class-bonus-activation-discount.ts";
/** @covers JGQ9LO5DFv-a1 */
describe("aeneanGutteringFlames — level discount", () => {
  proveLevelActivationDiscount({
    card: aeneanGutteringFlames,
    discount: 2,
    threshold: 3,
    classBonus: true,
    preparation: "ordinary",
  });
});
