import { describe } from "vitest";
import { dredgingStreams } from "./dredging-streams.ts";

import { proveLevelFloatingMemory } from "../../../testing/level-floating-memory.ts";
/** @covers wmt0x5zado-a2 */
describe("dredgingStreams — level Floating Memory", () => {
  proveLevelFloatingMemory(dredgingStreams, 2);
});
