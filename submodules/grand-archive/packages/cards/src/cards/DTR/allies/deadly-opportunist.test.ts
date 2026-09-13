import { describe } from "vitest";

import { proveClassBonusFloatingMemory } from "../../../testing/class-bonus-floating-memory.ts";
import { deadlyOpportunist } from "./deadly-opportunist.ts";

/** @covers eyvxonorcs-a2 */
describe("Deadly Opportunist — Class Bonus Floating Memory", () => {
  proveClassBonusFloatingMemory({ card: deadlyOpportunist });
});
