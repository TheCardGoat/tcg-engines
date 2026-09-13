import { proveStartingHand } from "../../../testing/starting-hand.ts";
import { describe } from "vitest";
import { spiritOfWater } from "./spirit-of-water.ts";

/** @covers tafqldAGRF-a1 */
describe("Spirit of Water \u2014 resolution", () => {
  proveStartingHand(spiritOfWater);
});
