import { describe } from "vitest";
import { tideholderClaymore } from "./tideholder-claymore.ts";

import { proveClassBonusMaterializationDiscount } from "../../../testing/class-bonus-materialization-discount.ts";

/** @covers 5iqigcom2r-a1 */
describe("tideholderClaymore — Class Bonus materialization discount", () => {
  proveClassBonusMaterializationDiscount(tideholderClaymore, false);
});
