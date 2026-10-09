import { describe } from "vitest";
import { shatteredHope } from "./shattered-hope.ts";

import { proveChampionActivationDiscount } from "../../../testing/class-bonus-activation-discount.ts";
/** @covers XOevViFTB3-a1 */
describe("shatteredHope — named champion discount", () => {
  proveChampionActivationDiscount({ card: shatteredHope, discount: 1, lineageName: "Merlin" });
});
