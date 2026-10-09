import { describe } from "vitest";
import { courtsideBeastkeeper } from "./courtside-beastkeeper.ts";
import { proveClassBonusGroupStats } from "../../../testing/class-bonus-group-stats.ts";
/** @covers o6gy3kq2lc-a1 */
describe("courtsideBeastkeeper — continuous group bonus", () => {
  proveClassBonusGroupStats(courtsideBeastkeeper, "beast");
});
