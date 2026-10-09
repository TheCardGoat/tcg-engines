import { proveClassBonusFastActivation } from "../../../testing/class-bonus-fast-activation.ts";
import { describe } from "vitest";
import { convalescingMare } from "./convalescing-mare.ts";

/** @covers ysj63dw50a-a1 */
describe("Convalescing Mare Fast Activation", () => {
  proveClassBonusFastActivation(convalescingMare, "none");
});
