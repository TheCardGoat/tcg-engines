import { describe } from "vitest";
import { maidenOfGlimmersDusk } from "./maiden-of-glimmers-dusk.ts";
import { proveCountedActivationDiscount } from "../../../testing/counted-activation-discount.ts";
/** @covers qa4ke7txh0-a1 */
describe("Maiden of Glimmer's Dusk — capped phantasia discount", () => {
  proveCountedActivationDiscount({
    card: maidenOfGlimmersDusk,
    cost: 3,
    qualifying: maidenOfGlimmersDusk,
    zone: "field",
    cap: 2,
  });
});
