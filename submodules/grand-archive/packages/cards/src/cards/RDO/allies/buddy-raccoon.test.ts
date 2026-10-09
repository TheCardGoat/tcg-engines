import { proveClassBonusFastActivation } from "../../../testing/class-bonus-fast-activation.ts";
import { describe } from "vitest";
import { buddyRaccoon } from "./buddy-raccoon.ts";

/** @covers VMQsdBX2rx-a1 */
describe("Buddy Raccoon Fast Activation", () => {
  proveClassBonusFastActivation(buddyRaccoon, "none");
});
