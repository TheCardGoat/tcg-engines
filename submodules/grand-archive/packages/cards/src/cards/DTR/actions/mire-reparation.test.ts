import { describe } from "vitest";

import { proveClassBonusFloatingMemory } from "../../../testing/class-bonus-floating-memory.ts";
import { mireReparation } from "./mire-reparation.ts";

/** @covers 7imoz7vrlr-a2 */
describe("Mire Reparation — Class Bonus Floating Memory", () => {
  proveClassBonusFloatingMemory({ card: mireReparation });
});
