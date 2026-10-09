import { describe } from "vitest";
import { lumenBorealis } from "./lumen-borealis.ts";
import { proveClassBonusGroupStats } from "../../../testing/class-bonus-group-stats.ts";
/** @covers 3ejd9yj9rl-a2 */
describe("lumenBorealis — continuous group bonus", () => {
  proveClassBonusGroupStats(lumenBorealis, "animal");
});
