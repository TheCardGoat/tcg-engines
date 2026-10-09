import { proveClassBonusFastActivation } from "../../../testing/class-bonus-fast-activation.ts";
import { describe } from "vitest";
import { gatherSlimes } from "./gather-slimes.ts";

/** @covers 1dfhbt3yna-a1 */
describe("Gather Slimes Fast Activation", () => {
  proveClassBonusFastActivation(gatherSlimes, "none");
});
