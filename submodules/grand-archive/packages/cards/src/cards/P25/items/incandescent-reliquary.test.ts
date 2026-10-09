import { describe } from "vitest";
import { incandescentReliquary } from "./incandescent-reliquary.ts";

import { proveClassBonusMaterializationDiscount } from "../../../testing/class-bonus-materialization-discount.ts";

/** @covers wsycqp2l90-a1 */
describe("incandescentReliquary — Class Bonus materialization discount", () => {
  proveClassBonusMaterializationDiscount(incandescentReliquary, false);
});
