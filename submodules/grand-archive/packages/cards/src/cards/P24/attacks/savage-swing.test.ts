import { describe } from "vitest";

import { proveClassBonusFloatingMemory } from "../../../testing/class-bonus-floating-memory.ts";
import { savageSwing } from "./savage-swing.ts";

/** @covers vk56lbihtc-a1 */
describe("Savage Swing — Class Bonus Floating Memory", () => {
  proveClassBonusFloatingMemory({ card: savageSwing });
});
