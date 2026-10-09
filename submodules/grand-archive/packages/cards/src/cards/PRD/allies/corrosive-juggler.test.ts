import { proveClassBonusFastActivation } from "../../../testing/class-bonus-fast-activation.ts";
import { describe } from "vitest";
import { corrosiveJuggler } from "./corrosive-juggler.ts";

/** @covers Ow9tNHwpUB-a1 */
describe("Corrosive Juggler Fast Activation", () => {
  proveClassBonusFastActivation(corrosiveJuggler, "none");
});
