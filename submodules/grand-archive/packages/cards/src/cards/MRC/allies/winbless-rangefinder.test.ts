import { describe } from "vitest";

import { proveClassBonusFloatingMemory } from "../../../testing/class-bonus-floating-memory.ts";
import { winblessRangefinder } from "./winbless-rangefinder.ts";

/** @covers uyv3fpvw2i-a2 */
describe("Winbless Rangefinder — Class Bonus Floating Memory", () => {
  proveClassBonusFloatingMemory({ card: winblessRangefinder });
});
