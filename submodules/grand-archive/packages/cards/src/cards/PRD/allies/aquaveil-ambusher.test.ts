import { describe } from "vitest";

import { proveClassBonusActivationDiscount } from "../../../testing/class-bonus-activation-discount.ts";
import { aquaveilAmbusher } from "./aquaveil-ambusher.ts";

/** @covers TScoOwz80U-a1 */
describe("Aquaveil Ambusher — Class Bonus activation discount", () => {
  proveClassBonusActivationDiscount({ card: aquaveilAmbusher, discount: 2 });
});

import { proveKeywordGroup } from "../../../testing/keyword-group.ts";

/** @covers TScoOwz80U-a2 */
describe("Aquaveil Ambusher — printed keywords", () => {
  proveKeywordGroup({
    card: aquaveilAmbusher,
    keywords: [
      {
        name: "ambush",
      },
      {
        name: "retort",
        value: 2,
      },
      {
        name: "stealth",
      },
    ],
  });
});
