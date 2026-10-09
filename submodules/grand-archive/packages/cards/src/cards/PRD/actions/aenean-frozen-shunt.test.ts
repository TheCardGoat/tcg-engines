import { describe } from "vitest";
import { aeneanFrozenShunt } from "./aenean-frozen-shunt.ts";

import { proveClassLevelDrawBonus } from "../../../testing/class-level-draw-bonus.ts";
/** @covers Fkpr1hCUGF-a1
 * @covers Fkpr1hCUGF-a2
 */
describe("aeneanFrozenShunt class and level draw bonus", () => {
  proveClassLevelDrawBonus(aeneanFrozenShunt, 4, "shunt");
});
