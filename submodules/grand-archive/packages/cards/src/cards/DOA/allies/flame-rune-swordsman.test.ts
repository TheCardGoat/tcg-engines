import { describe } from "vitest";

import { proveClassBonusFloatingMemory } from "../../../testing/class-bonus-floating-memory.ts";
import { flameRuneSwordsman } from "./flame-rune-swordsman.ts";

/** @covers VV6ADdMrr5-a1 */
describe("Flame-Rune Swordsman — Class Bonus Floating Memory", () => {
  proveClassBonusFloatingMemory({ card: flameRuneSwordsman });
});
