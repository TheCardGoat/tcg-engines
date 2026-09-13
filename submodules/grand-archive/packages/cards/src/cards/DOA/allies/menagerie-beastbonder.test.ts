import { proveAnimalBeastLevel } from "../../../testing/animal-beast-level.ts";
import { describe } from "vitest";

import { proveClassBonusFloatingMemory } from "../../../testing/class-bonus-floating-memory.ts";
import { menagerieBeastbonder } from "./menagerie-beastbonder.ts";

/** @covers izGEjxBPo9-a2 */
describe("Menagerie Beastbonder — Class Bonus Floating Memory", () => {
  proveClassBonusFloatingMemory({ card: menagerieBeastbonder });
});

/** @covers izGEjxBPo9-a1 */
describe("Menagerie Beastbonder \u2014 resolution", () => {
  proveAnimalBeastLevel(menagerieBeastbonder);
});
