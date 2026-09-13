import { describe } from "vitest";

import { proveClassBonusFloatingMemory } from "../../../testing/class-bonus-floating-memory.ts";
import { kingdomInformant } from "./kingdom-informant.ts";

/** @covers zPC4Yqo9Fs-a2 */
describe("Kingdom Informant — Class Bonus Floating Memory", () => {
  proveClassBonusFloatingMemory({ card: kingdomInformant });
});
