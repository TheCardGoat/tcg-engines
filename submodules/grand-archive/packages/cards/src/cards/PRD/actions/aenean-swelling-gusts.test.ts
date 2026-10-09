import { describe } from "vitest";
import { aeneanSwellingGusts } from "./aenean-swelling-gusts.ts";

import { proveLevelActivationDiscount } from "../../../testing/class-bonus-activation-discount.ts";
/** @covers nbznVwdylT-a1 */
describe("aeneanSwellingGusts — level discount", () => {
  proveLevelActivationDiscount({
    card: aeneanSwellingGusts,
    discount: 2,
    threshold: 3,
    classBonus: true,
    preparation: "ordinary",
  });
});

import { proveClassLevelDrawBonus } from "../../../testing/class-level-draw-bonus.ts";
/** @covers nbznVwdylT-a3 */
describe("aeneanSwellingGusts class and level draw bonus", () => {
  proveClassLevelDrawBonus(aeneanSwellingGusts, 5, "gusts");
});
