import { describe } from "vitest";
import { dualitysConvergence } from "./dualitys-convergence.ts";

import { proveChampionActivationDiscount } from "../../../testing/class-bonus-activation-discount.ts";
/** @covers qtjphZSiO6-a1 */
describe("dualitysConvergence — named champion discount", () => {
  proveChampionActivationDiscount({
    card: dualitysConvergence,
    discount: 2,
    lineageName: "Merlin",
  });
});
