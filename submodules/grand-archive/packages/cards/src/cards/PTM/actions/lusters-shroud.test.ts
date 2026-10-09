import { describe } from "vitest";
import { lustersShroud } from "./lusters-shroud.ts";

import { proveTargetNextPrevention } from "../../../testing/target-next-prevention.ts";
/** @covers tizLamFGPS-a1 */
describe("lusters-shroud — next damage", () => {
  proveTargetNextPrevention({ card: lustersShroud, cost: 1, capacity: 3 });
});
