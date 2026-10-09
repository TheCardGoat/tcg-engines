import { describe } from "vitest";
import { spiritOfFortuitousWater } from "./spirit-of-fortuitous-water.ts";
import { proveStartingGlimpse } from "../../../testing/starting-glimpse.ts";
/** @covers q6prapdczd-a1 */
describe("spiritOfFortuitousWater — starting glimpse and draw", () => {
  proveStartingGlimpse({ card: spiritOfFortuitousWater, count: 7, draw: 7, memory: true });
});
