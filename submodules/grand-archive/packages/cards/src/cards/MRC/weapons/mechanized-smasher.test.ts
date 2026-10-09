import { describe } from "vitest";
import { mechanizedSmasher } from "./mechanized-smasher.ts";

import { proveClassBonusMaterializationDiscount } from "../../../testing/class-bonus-materialization-discount.ts";

/** @covers qsm3n9yvn1-a1 */
describe("mechanizedSmasher — Class Bonus materialization discount", () => {
  proveClassBonusMaterializationDiscount(mechanizedSmasher, false);
});
