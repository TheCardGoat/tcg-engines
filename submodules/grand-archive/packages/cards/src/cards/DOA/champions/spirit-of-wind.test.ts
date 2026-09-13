import { proveStartingHand } from "../../../testing/starting-hand.ts";
import { describe } from "vitest";
import { spiritOfWind } from "./spirit-of-wind.ts";

/** @covers pNiyaGlIe7-a1 */
describe("Spirit of Wind \u2014 resolution", () => {
  proveStartingHand(spiritOfWind);
});
