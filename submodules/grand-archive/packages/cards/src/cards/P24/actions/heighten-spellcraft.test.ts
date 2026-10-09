import { describe } from "vitest";

import { proveClassBonusFloatingMemory } from "../../../testing/class-bonus-floating-memory.ts";
import { heightenSpellcraft } from "./heighten-spellcraft.ts";

/** @covers zejeq7rp5q-a2 */
describe("Heighten Spellcraft — Class Bonus Floating Memory", () => {
  proveClassBonusFloatingMemory({ card: heightenSpellcraft });
});

import { proveEmpowerAction } from "../../../testing/empower-action.ts";
/** @covers zejeq7rp5q-a1 */
describe("Heighten Spellcraft — Empower 3", () => proveEmpowerAction(heightenSpellcraft));
