import { describe } from "vitest";
import { spiritOfFortuitousFire } from "./spirit-of-fortuitous-fire.ts";
import { proveStartingGlimpse } from "../../../testing/starting-glimpse.ts";
/** @covers 8mrjtrzx5t-a1 */
describe("spiritOfFortuitousFire — starting glimpse and draw", () => {
  proveStartingGlimpse({ card: spiritOfFortuitousFire, count: 7, draw: 7, memory: true });
});
