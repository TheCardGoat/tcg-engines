import { proveTemporaryMemoryBanish } from "../../../testing/temporary-memory-banish.ts";
import { describe } from "vitest";

import { proveClassBonusFloatingMemory } from "../../../testing/class-bonus-floating-memory.ts";
import { mindFreeze } from "./mind-freeze.ts";

/** @covers L9o11y7yfa-a2 */
describe("Mind Freeze — Class Bonus Floating Memory", () => {
  proveClassBonusFloatingMemory({ card: mindFreeze });
});

/** @covers L9o11y7yfa-a1 */
describe("Mind Freeze \u2014 resolution", () => {
  proveTemporaryMemoryBanish({ card: mindFreeze, cost: 5, amount: 2, level: 2 });
});

describe("level zero", () => {
  proveTemporaryMemoryBanish({ card: mindFreeze, cost: 5, amount: 0, level: 0 });
});
