import { describe } from "vitest";

import { proveClassBonusFloatingMemory } from "../../../testing/class-bonus-floating-memory.ts";
import { ordinaryBear } from "./ordinary-bear.ts";

/** @covers p3nq0ymvdd-a2 */
describe("Ordinary Bear — Class Bonus Floating Memory", () => {
  proveClassBonusFloatingMemory({ card: ordinaryBear });
});
