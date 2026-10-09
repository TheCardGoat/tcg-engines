import { proveClassBonusFastActivation } from "../../../testing/class-bonus-fast-activation.ts";
import { describe } from "vitest";
import { drownInAether } from "./drown-in-aether.ts";

/** @covers gnfbp3g8iw-a1 */
describe("Drown in Aether Fast Activation", () => {
  proveClassBonusFastActivation(drownInAether, "rested-ally");
});
