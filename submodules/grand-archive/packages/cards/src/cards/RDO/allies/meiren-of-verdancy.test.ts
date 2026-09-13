import { describe } from "vitest";

import { proveClassBonusFloatingMemory } from "../../../testing/class-bonus-floating-memory.ts";
import { meirenOfVerdancy } from "./meiren-of-verdancy.ts";

/** @covers y46R5C190v-a2 */
describe("Meiren of Verdancy — Class Bonus Floating Memory", () => {
  proveClassBonusFloatingMemory({ card: meirenOfVerdancy });
});
