import { describe } from "vitest";

import { proveFixedDamageAction } from "../../../testing/fixed-damage-action.ts";
import { aeneanPointedFlare } from "./aenean-pointed-flare.ts";

/** @covers BTapvu1Zvd-a2 */
describe("Aenean Pointed Flare — fixed damage", () => {
  proveFixedDamageAction({
    card: aeneanPointedFlare,
    cost: 4,
    damage: 4,
    targetKind: "champion",
  });
});

import { proveLevelActivationDiscount } from "../../../testing/class-bonus-activation-discount.ts";
/** @covers BTapvu1Zvd-a1 */
describe("aeneanPointedFlare — level discount", () => {
  proveLevelActivationDiscount({
    card: aeneanPointedFlare,
    discount: 2,
    threshold: 3,
    classBonus: false,
    preparation: "ordinary",
  });
});
