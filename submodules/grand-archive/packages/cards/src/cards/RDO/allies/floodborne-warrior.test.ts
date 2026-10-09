import { describe } from "vitest";
import { proveDelugeStats } from "../../../testing/deluge-stats.ts";
import { floodborneWarrior } from "./floodborne-warrior.ts";
/** @covers KFfmJZMdZN-a1 */
describe("floodborneWarrior — Deluge", () => {
  proveDelugeStats(floodborneWarrior, 2, 1, 1);
});
