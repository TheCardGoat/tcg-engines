import { describe } from "vitest";
import { proveDelugeStats } from "../../../testing/deluge-stats.ts";
import { fountainBladehand } from "./fountain-bladehand.ts";
/** @covers 3pG1rks3rv-a1 */
describe("fountainBladehand — Deluge", () => {
  proveDelugeStats(fountainBladehand, 3, 1, 1);
});
