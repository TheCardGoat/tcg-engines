import { describe } from "vitest";

import { proveClassBonusFloatingMemory } from "../../../testing/class-bonus-floating-memory.ts";
import { imperialApprentice } from "./imperial-apprentice.ts";

/** @covers u6o6eanbrf-a2 */
describe("Imperial Apprentice — Class Bonus Floating Memory", () => {
  proveClassBonusFloatingMemory({ card: imperialApprentice });
});
