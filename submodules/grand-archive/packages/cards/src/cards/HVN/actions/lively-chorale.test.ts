import { describe } from "vitest";

import { proveClassBonusFloatingMemory } from "../../../testing/class-bonus-floating-memory.ts";
import { livelyChorale } from "./lively-chorale.ts";

/** @covers x1c9ob6jva-a2 */
describe("Lively Chorale — Class Bonus Floating Memory", () => {
  proveClassBonusFloatingMemory({ card: livelyChorale });
});
