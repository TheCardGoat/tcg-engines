import { describe } from "vitest";
import { calamityCannon } from "./calamity-cannon.ts";

import { proveChampionActivationDiscount } from "../../../testing/class-bonus-activation-discount.ts";
/** @covers lwabipl6gt-a1 */
describe("calamityCannon — named champion discount", () => {
  proveChampionActivationDiscount({ card: calamityCannon, discount: 3, lineageName: "Polkhawk" });
});
