import { describe } from "vitest";
import { stolenChance } from "./stolen-chance.ts";
import { proveCounterRemovalDraw } from "../../../testing/counter-removal-draw.ts";
/** @covers Ww12XlYHFA-a1 */
describe("stolen-chance — removal-dependent draw", () =>
  proveCounterRemovalDraw(stolenChance, "preparation"));
