import { describe } from "vitest";
import { geldusTerrorOfDorumegia } from "./geldus-terror-of-dorumegia.ts";
import { provePrideAlly } from "../../../testing/pride-ally.ts";

/** @covers n9yvn1uoy5-a1 */
describe("Geldus, Terror of Dorumegia Pride", () => {
  provePrideAlly({ card: geldusTerrorOfDorumegia, power: 5, pride: 4 });
});

import { proveLevelActivationDiscount } from "../../../testing/class-bonus-activation-discount.ts";
/** @covers n9yvn1uoy5-a2 */
describe("geldusTerrorOfDorumegia — level discount", () => {
  proveLevelActivationDiscount({
    card: geldusTerrorOfDorumegia,
    discount: 2,
    threshold: 3,
    classBonus: false,
    preparation: "ordinary",
  });
});
