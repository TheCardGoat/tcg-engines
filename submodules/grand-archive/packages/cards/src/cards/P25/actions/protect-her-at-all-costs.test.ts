import { describe } from "vitest";
import { protectHerAtAllCosts } from "./protect-her-at-all-costs.ts";

import { proveChampionActivationDiscount } from "../../../testing/class-bonus-activation-discount.ts";
/** @covers OzNHncAfFJ-a1 */
describe("protectHerAtAllCosts — named champion discount", () => {
  proveChampionActivationDiscount({
    card: protectHerAtAllCosts,
    discount: 2,
    lineageName: "Merlin",
  });
});
