import { describe } from "vitest";
import { proveDelugeStats } from "../../../testing/deluge-stats.ts";
import { soakedSlash } from "./soaked-slash.ts";
/** @covers 6XDoCxQuoH-a1 */
describe("soakedSlash — Deluge", () => {
  proveDelugeStats(soakedSlash, 2, 2, 0);
});
