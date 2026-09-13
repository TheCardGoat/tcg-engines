import { proveAnimalBeastLevel } from "../../../testing/animal-beast-level.ts";
import { describe } from "vitest";

import { proveClassBonusFloatingMemory } from "../../../testing/class-bonus-floating-memory.ts";
import { deepSeaBeastbonder } from "./deep-sea-beastbonder.ts";

/** @covers qxbdXU7H4Z-a2 */
describe("Deep Sea Beastbonder — Class Bonus Floating Memory", () => {
  proveClassBonusFloatingMemory({ card: deepSeaBeastbonder });
});

/** @covers qxbdXU7H4Z-a1 */
describe("Deep Sea Beastbonder \u2014 resolution", () => {
  proveAnimalBeastLevel(deepSeaBeastbonder);
});
