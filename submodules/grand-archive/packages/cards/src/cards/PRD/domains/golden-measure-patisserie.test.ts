import { describe } from "vitest";
import { goldenMeasurePatisserie } from "./golden-measure-patisserie.ts";
import { proveEntryCounter } from "../../../testing/entry-counter.ts";
/** @covers Bq2kynKJvx-a1 */
describe("golden-measure-patisserie — entry counter", () =>
  proveEntryCounter(goldenMeasurePatisserie, "buff", 1));
