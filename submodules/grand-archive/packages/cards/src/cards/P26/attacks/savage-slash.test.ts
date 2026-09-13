import { describe } from "vitest";

import { proveClassBonusFloatingMemory } from "../../../testing/class-bonus-floating-memory.ts";
import { savageSlash } from "./savage-slash.ts";

/** @covers 4a7QLLouGk-a1 */
describe("Savage Slash — Class Bonus Floating Memory", () => {
  proveClassBonusFloatingMemory({ card: savageSlash });
});
