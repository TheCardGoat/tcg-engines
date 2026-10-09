import { describe } from "vitest";
import { tidalFractal } from "./tidal-fractal.ts";
import { proveEntryMill } from "../../../testing/entry-mill.ts";
/** @covers zRG5hmBcsP-a1 */
describe("tidal-fractal — entry mill", () => proveEntryMill(tidalFractal, 2, "target"));
