import { describe } from "vitest";
import { proveLookRevealAndReturn } from "../../../testing/look-reveal-and-return.ts";
import { eventideLure } from "./eventide-lure.ts";
import { deepSeaFractal } from "../../FTC/phantasias/deep-sea-fractal.ts";
/** @covers eg771cn2q1-a1 */
describe("eventideLure — On Enter reveals a qualifying card into memory", () => {
  proveLookRevealAndReturn(eventideLure, 5, 2, [deepSeaFractal], "memory", "field");
});
