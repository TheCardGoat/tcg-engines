import { proveGlimpsePlay } from "../../../testing/glimpse-play.ts";
import { describe } from "vitest";
import { strategicPlanning } from "./strategic-planning.ts";

/** @covers EtIGAJ8sxw-a1 */
describe("Strategic Planning \u2014 resolution", () => {
  proveGlimpsePlay({
    card: strategicPlanning,
    cost: { kind: "reserve", amount: 2 },
    count: 2,
    preparation: 1,
  });
});
