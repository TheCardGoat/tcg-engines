import { describe } from "vitest";
import { beguilingBandit } from "./beguiling-bandit.ts";
import { proveClassLevelAllyStats } from "../../../testing/class-level-ally-stats.ts";
/** @covers jyrqgyj9vn-a1 @covers jyrqgyj9vn-a2 */
describe("beguilingBandit — Class Bonus level stats", () => {
  proveClassLevelAllyStats(beguilingBandit, 1, 0);
});
