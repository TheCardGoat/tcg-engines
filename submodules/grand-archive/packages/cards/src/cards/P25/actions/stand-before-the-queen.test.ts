import { describe } from "vitest";

import { proveClassBonusFloatingMemory } from "../../../testing/class-bonus-floating-memory.ts";
import { standBeforeTheQueen } from "./stand-before-the-queen.ts";

/** @covers v9SJgS6z40-a3 */
describe("Stand Before the Queen — Class Bonus Floating Memory", () => {
  proveClassBonusFloatingMemory({ card: standBeforeTheQueen });
});
