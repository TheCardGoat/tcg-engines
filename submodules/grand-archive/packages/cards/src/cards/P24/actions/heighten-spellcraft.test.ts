import { describe } from "vitest";

import { proveClassBonusFloatingMemory } from "../../../testing/class-bonus-floating-memory.ts";
import { heightenSpellcraft } from "./heighten-spellcraft.ts";

/** @covers zejeq7rp5q-a2 */
describe("Heighten Spellcraft — Class Bonus Floating Memory", () => {
  proveClassBonusFloatingMemory({ card: heightenSpellcraft });
});
