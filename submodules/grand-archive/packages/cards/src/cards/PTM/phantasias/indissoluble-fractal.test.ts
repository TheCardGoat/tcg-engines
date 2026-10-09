import { describe } from "vitest";
import { indissolubleFractal } from "./indissoluble-fractal.ts";
import { proveClassEphemerate } from "../../../testing/class-ephemerate.ts";
/** @covers ULHGVVpQoH-a2 */
describe("indissolubleFractal — class Ephemerate", () => {
  proveClassEphemerate(indissolubleFractal, 5, "fractal");
});
