import { describe } from "vitest";
import { proveDelugeStats } from "../../../testing/deluge-stats.ts";
import { currentGroover } from "./current-groover.ts";
/** @covers 3lMV08BClz-a1 */
describe("currentGroover — Deluge", () => {
  proveDelugeStats(currentGroover, 3, 1, 0);
});
