import { describe } from "vitest";
import { dissonantFractal } from "./dissonant-fractal.ts";
import { proveEntryGlimpse } from "../../../testing/entry-glimpse.ts";
/** @covers 2d7rgchttu-a1 */
describe("Dissonant Fractal entry Glimpse", () => proveEntryGlimpse(dissonantFractal, 1, 4));
