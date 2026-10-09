import { proveDrawCardResolution } from "../../../testing/draw-card-resolution.ts";
import { describe } from "vitest";
import { sparkLink } from "./spark-link.ts";

/** @covers PUgqk3lxq6-a1 */
describe("sparkLink draw", () => {
  proveDrawCardResolution({ card: sparkLink, destination: "memory", eachPlayer: true });
});

import { proveLevelFloatingMemory } from "../../../testing/level-floating-memory.ts";
/** @covers PUgqk3lxq6-a2 */
describe("sparkLink — level Floating Memory", () => {
  proveLevelFloatingMemory(sparkLink, 1);
});
