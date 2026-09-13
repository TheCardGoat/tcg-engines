import { describe } from "vitest";

import { proveClassBonusFloatingMemory } from "../../../testing/class-bonus-floating-memory.ts";
import { intoTheFray } from "./into-the-fray.ts";

/** @covers tu9agwj4f1-a2 */
describe("Into the Fray — Class Bonus Floating Memory", () => {
  proveClassBonusFloatingMemory({ card: intoTheFray });
});
