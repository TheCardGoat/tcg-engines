import { describe } from "vitest";
import { harmoniousMantra } from "./harmonious-mantra.ts";
import { proveShiftingCurrentConditional } from "../../../testing/shifting-current-conditionals.ts";
/** @covers gnth142db4-a1 */
describe("Harmonious Mantra — North recovery", () =>
  proveShiftingCurrentConditional(harmoniousMantra, "recover"));
