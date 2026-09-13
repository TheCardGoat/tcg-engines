import { describe } from "vitest";

import { proveClassBonusFloatingMemory } from "../../../testing/class-bonus-floating-memory.ts";
import { slimeEruption } from "./slime-eruption.ts";

/** @covers m3zkl7lpvn-a2 */
describe("Slime Eruption — Class Bonus Floating Memory", () => {
  proveClassBonusFloatingMemory({ card: slimeEruption });
});
