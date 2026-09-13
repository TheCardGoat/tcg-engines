import { proveTemporaryMemoryBanish } from "../../../testing/temporary-memory-banish.ts";
import { describe } from "vitest";
import { chillingTouch } from "./chilling-touch.ts";

/** @covers 4K2pT3RmTJ-a1 */
describe("Chilling Touch \u2014 resolution", () => {
  proveTemporaryMemoryBanish({ card: chillingTouch, cost: 1, amount: 1, level: 0 });
});
