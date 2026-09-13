import { describe } from "vitest";

import { proveClassBonusFloatingMemory } from "../../../testing/class-bonus-floating-memory.ts";
import { savageSunder } from "./savage-sunder.ts";

/** @covers 5mnvohcd0o-a2 */
describe("Savage Sunder — Class Bonus Floating Memory", () => {
  proveClassBonusFloatingMemory({ card: savageSunder });
});
