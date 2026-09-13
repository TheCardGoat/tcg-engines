import { describe } from "vitest";

import { proveClassBonusFloatingMemory } from "../../../testing/class-bonus-floating-memory.ts";
import { martialFlowstate } from "./martial-flowstate.ts";

/** @covers fekR8D4FpB-a2 */
describe("Martial Flowstate — Class Bonus Floating Memory", () => {
  proveClassBonusFloatingMemory({ card: martialFlowstate });
});
