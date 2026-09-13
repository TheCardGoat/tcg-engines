import { describe } from "vitest";

import { proveClassBonusFloatingMemory } from "../../../testing/class-bonus-floating-memory.ts";
import { surgingSearch } from "./surging-search.ts";

/** @covers h0vBIZjzrI-a2 */
describe("Surging Search — Class Bonus Floating Memory", () => {
  proveClassBonusFloatingMemory({ card: surgingSearch });
});
