import { proveClassBonusFastActivation } from "../../../testing/class-bonus-fast-activation.ts";
import { describe } from "vitest";
import { breathsColoratura } from "./breaths-coloratura.ts";

/** @covers 1ybdJi1VN5-a1 */
describe("Breath's Coloratura Fast Activation", () => {
  proveClassBonusFastActivation(breathsColoratura, "none");
});
