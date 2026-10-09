import { describe } from "vitest";
import { lunarConduit } from "./lunar-conduit.ts";

import { proveClassBonusMaterializationDiscount } from "../../../testing/class-bonus-materialization-discount.ts";

/** @covers 0yetaebjlw-a1 */
describe("lunarConduit — Class Bonus materialization discount", () => {
  proveClassBonusMaterializationDiscount(lunarConduit, false);
});
