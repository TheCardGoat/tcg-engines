import { describe } from "vitest";
import { proveDrawCardResolution } from "../../../testing/draw-card-resolution.ts";
import { teraSight } from "./tera-sight.ts";

/** @covers 2Ojrn7buPe-a2 */
describe("Tera Sight \u2014 2Ojrn7buPe-a2", () => {
  proveDrawCardResolution({ card: teraSight });
});
