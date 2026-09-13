import { proveAnimalBeastLevel } from "../../../testing/animal-beast-level.ts";
import { describe } from "vitest";

import { proveClassBonusFloatingMemory } from "../../../testing/class-bonus-floating-memory.ts";
import { energeticBeastbonder } from "./energetic-beastbonder.ts";

/** @covers q2okpDFJw5-a2 */
describe("Energetic Beastbonder — Class Bonus Floating Memory", () => {
  proveClassBonusFloatingMemory({ card: energeticBeastbonder });
});

/** @covers q2okpDFJw5-a1 */
describe("Energetic Beastbonder \u2014 resolution", () => {
  proveAnimalBeastLevel(energeticBeastbonder);
});
