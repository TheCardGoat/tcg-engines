import { proveStartingHand } from "../../../testing/starting-hand.ts";
import { describe } from "vitest";
import { spiritOfFire } from "./spirit-of-fire.ts";

/** @covers LMyKyVC2O9-a1 */
describe("Spirit of Fire \u2014 resolution", () => {
  proveStartingHand(spiritOfFire);
});
