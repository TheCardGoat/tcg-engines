import { describe } from "vitest";
import { aeneanReclaim } from "./aenean-reclaim.ts";

import { proveClassLevelDrawBonus } from "../../../testing/class-level-draw-bonus.ts";
/** @covers DCzUre54F9-a2 */
describe("aeneanReclaim class and level draw bonus", () => {
  proveClassLevelDrawBonus(aeneanReclaim, 3, "reclaim");
});
