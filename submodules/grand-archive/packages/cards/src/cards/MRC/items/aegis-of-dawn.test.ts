import { describe } from "vitest";
import { aegisOfDawn } from "./aegis-of-dawn.ts";

import { proveClassBonusMaterializationDiscount } from "../../../testing/class-bonus-materialization-discount.ts";

/** @covers abipl6gt7l-a1 */
describe("aegisOfDawn — Class Bonus materialization discount", () => {
  proveClassBonusMaterializationDiscount(aegisOfDawn, false);
});
