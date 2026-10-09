import { describe } from "vitest";
import { martialGuard } from "./martial-guard.ts";

import { proveTargetNextPrevention } from "../../../testing/target-next-prevention.ts";
/** @covers nsdwmxz1vd-a1 */
describe("martial-guard — next damage", () => {
  proveTargetNextPrevention({ card: martialGuard, cost: 2, capacity: 2 });
});
