import { describe } from "vitest";

import { proveClassBonusFloatingMemory } from "../../../testing/class-bonus-floating-memory.ts";
import { foragingServant } from "./foraging-servant.ts";

/** @covers 0pw0y6isxy-a2 */
describe("Foraging Servant — Class Bonus Floating Memory", () => {
  proveClassBonusFloatingMemory({ card: foragingServant });
});
