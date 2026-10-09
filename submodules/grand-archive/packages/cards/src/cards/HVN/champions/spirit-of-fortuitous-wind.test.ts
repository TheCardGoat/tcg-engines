import { describe } from "vitest";
import { spiritOfFortuitousWind } from "./spirit-of-fortuitous-wind.ts";
import { proveStartingGlimpse } from "../../../testing/starting-glimpse.ts";
/** @covers gqxdu1fn5b-a1 */
describe("spiritOfFortuitousWind — starting glimpse and draw", () => {
  proveStartingGlimpse({ card: spiritOfFortuitousWind, count: 7, draw: 7, memory: true });
});
