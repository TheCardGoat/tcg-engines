import { proveClassBonusFastActivation } from "../../../testing/class-bonus-fast-activation.ts";
import { describe } from "vitest";
import { cloakedExecutioner } from "./cloaked-executioner.ts";

/** @covers itwys9kf4r-a1 */
describe("Cloaked Executioner Fast Activation", () => {
  proveClassBonusFastActivation(cloakedExecutioner, "none");
});
