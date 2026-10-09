import { describe } from "vitest";
import { accursedStrength } from "./accursed-strength.ts";

import { proveChampionActivationDiscount } from "../../../testing/class-bonus-activation-discount.ts";
/** @covers j3fkza233s-a1 */
describe("accursedStrength — named champion discount", () => {
  proveChampionActivationDiscount({ card: accursedStrength, discount: 1, lineageName: "Diana" });
});
