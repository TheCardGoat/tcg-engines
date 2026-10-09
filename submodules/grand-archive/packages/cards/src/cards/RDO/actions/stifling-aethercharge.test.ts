import { describe } from "vitest";
import { stiflingAethercharge } from "./stifling-aethercharge.ts";
import { proveOptionalAetherwingLoad } from "../../../testing/optional-aetherwing-load.ts";

/** @covers bYrLVjKSCL-a2 */
describe("stifling-aethercharge — optional Aetherwing loading", () => {
  proveOptionalAetherwingLoad(stiflingAethercharge, true);
});
