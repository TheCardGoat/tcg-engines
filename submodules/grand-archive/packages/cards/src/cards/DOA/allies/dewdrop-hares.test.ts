import { describe } from "vitest";

import { proveClassBonusFloatingMemory } from "../../../testing/class-bonus-floating-memory.ts";
import { dewdropHares } from "./dewdrop-hares.ts";

/** @covers fxwy3haEXU-a1 */
describe("Dewdrop Hares — Class Bonus Floating Memory", () => {
  proveClassBonusFloatingMemory({ card: dewdropHares });
});
