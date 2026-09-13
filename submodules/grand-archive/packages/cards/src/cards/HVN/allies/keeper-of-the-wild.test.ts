import { describe } from "vitest";

import { proveClassBonusFloatingMemory } from "../../../testing/class-bonus-floating-memory.ts";
import { keeperOfTheWild } from "./keeper-of-the-wild.ts";

/** @covers 9krp8brw64-a2 */
describe("Keeper of the Wild — Class Bonus Floating Memory", () => {
  proveClassBonusFloatingMemory({ card: keeperOfTheWild });
});
