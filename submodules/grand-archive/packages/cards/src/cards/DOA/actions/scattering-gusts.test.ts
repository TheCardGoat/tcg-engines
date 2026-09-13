import { proveSuppressAction } from "../../../testing/suppress-action.ts";
import { describe } from "vitest";
import { scatteringGusts } from "./scattering-gusts.ts";

/** @covers jOqyx96kse-a1 @covers jOqyx96kse-a2 */
describe("Scattering Gusts \u2014 resolution", () => {
  proveSuppressAction({
    card: scatteringGusts,
    cost: 4,
    targetId: "target-allies",
    maximum: 2,
    optional: true,
    counter: "enlighten",
  });
});
