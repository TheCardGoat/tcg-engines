import { proveTemporaryLevelAction } from "../../../testing/temporary-level-action.ts";
import { describe } from "vitest";

import { proveClassBonusFloatingMemory } from "../../../testing/class-bonus-floating-memory.ts";
import { cramSession } from "./cram-session.ts";

/** @covers 9GWxrTMfBz-a2 */
describe("Cram Session — Class Bonus Floating Memory", () => {
  proveClassBonusFloatingMemory({ card: cramSession });
});

/** @covers 9GWxrTMfBz-a1 */
describe("Cram Session \u2014 resolution", () => {
  proveTemporaryLevelAction({ card: cramSession, cost: 1, amount: 1, draw: 0 });
});
