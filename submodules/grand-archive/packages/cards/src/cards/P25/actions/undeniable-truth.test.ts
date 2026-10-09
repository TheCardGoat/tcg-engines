import { describe } from "vitest";
import { undeniableTruth } from "./undeniable-truth.ts";

import { proveDrawAndPrepare } from "../../../testing/draw-and-prepare.ts";
/** @covers UaUfw7yFTW-a1
 * @covers UaUfw7yFTW-a2
 */
describe("undeniableTruth draw and preparation", () => {
  proveDrawAndPrepare(undeniableTruth, 1, 1, "ally");
});
