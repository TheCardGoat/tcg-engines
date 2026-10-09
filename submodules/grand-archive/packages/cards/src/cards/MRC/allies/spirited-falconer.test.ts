import { proveClassBonusFastActivation } from "../../../testing/class-bonus-fast-activation.ts";
import { describe } from "vitest";
import { spiritedFalconer } from "./spirited-falconer.ts";

/** @covers a5igwbsmks-a1 */
describe("Spirited Falconer Fast Activation", () => {
  proveClassBonusFastActivation(spiritedFalconer, "none");
});
