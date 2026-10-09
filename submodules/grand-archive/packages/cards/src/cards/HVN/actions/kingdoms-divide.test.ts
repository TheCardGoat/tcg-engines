import { describe } from "vitest";
import { kingdomsDivide } from "./kingdoms-divide.ts";

import { proveLevelFloatingMemory } from "../../../testing/level-floating-memory.ts";
/** @covers qy34r8gffr-a2 */
describe("kingdomsDivide — level Floating Memory", () => {
  proveLevelFloatingMemory(kingdomsDivide, 2);
});
