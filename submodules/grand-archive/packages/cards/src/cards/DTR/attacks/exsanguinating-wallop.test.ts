import { describe } from "vitest";

import { proveClassBonusFloatingMemory } from "../../../testing/class-bonus-floating-memory.ts";
import { exsanguinatingWallop } from "./exsanguinating-wallop.ts";

/** @covers cicanyx695-a2 */
describe("Exsanguinating Wallop — Class Bonus Floating Memory", () => {
  proveClassBonusFloatingMemory({ card: exsanguinatingWallop });
});
