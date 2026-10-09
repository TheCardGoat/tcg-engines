import { proveClassBonusFastActivation } from "../../../testing/class-bonus-fast-activation.ts";
import { describe } from "vitest";
import { flamebreakChorus } from "./flamebreak-chorus.ts";

/** @covers yky280mtts-a1 */
describe("Flamebreak Chorus Fast Activation", () => {
  proveClassBonusFastActivation(flamebreakChorus, "ally");
});
