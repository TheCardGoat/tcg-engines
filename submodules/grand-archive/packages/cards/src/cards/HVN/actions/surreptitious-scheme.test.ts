import { describe } from "vitest";
import { surreptitiousScheme } from "./surreptitious-scheme.ts";
import { proveCounterRemovalDraw } from "../../../testing/counter-removal-draw.ts";
/** @covers 2bcammhx44-a1 */
describe("surreptitious-scheme — removal-dependent draw", () =>
  proveCounterRemovalDraw(surreptitiousScheme, "level"));
