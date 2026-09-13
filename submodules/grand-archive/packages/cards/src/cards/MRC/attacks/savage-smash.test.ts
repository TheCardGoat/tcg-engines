import { describe } from "vitest";

import { proveClassBonusFloatingMemory } from "../../../testing/class-bonus-floating-memory.ts";
import { savageSmash } from "./savage-smash.ts";

/** @covers i7chsbaleg-a1 */
describe("Savage Smash — Class Bonus Floating Memory", () => {
  proveClassBonusFloatingMemory({ card: savageSmash });
});
