import { describe } from "vitest";

import { proveClassBonusFloatingMemory } from "../../../testing/class-bonus-floating-memory.ts";
import { weavingManastream } from "./weaving-manastream.ts";

/** @covers wi4f59furp-a2 */
describe("Weaving Manastream — Class Bonus Floating Memory", () => {
  proveClassBonusFloatingMemory({ card: weavingManastream });
});
