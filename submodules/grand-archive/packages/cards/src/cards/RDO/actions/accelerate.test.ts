import { proveDrawCardResolution } from "../../../testing/draw-card-resolution.ts";
import { describe } from "vitest";
import { accelerate } from "./accelerate.ts";

/** @covers 6yW2zOwWmU-a2 */
describe("accelerate draw", () => {
  proveDrawCardResolution({ card: accelerate, destination: "memory" });
});
