import { describe } from "vitest";

import { proveClassBonusFloatingMemory } from "../../../testing/class-bonus-floating-memory.ts";
import { corsairCaptain } from "./corsair-captain.ts";

/** @covers 4e1gqwah01-a2 */
describe("Corsair Captain — Class Bonus Floating Memory", () => {
  proveClassBonusFloatingMemory({ card: corsairCaptain });
});
