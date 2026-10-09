import { proveClassBonusFastActivation } from "../../../testing/class-bonus-fast-activation.ts";
import { describe } from "vitest";
import { sinisterMindreaver } from "./sinister-mindreaver.ts";

/** @covers jozihslnhz-a1 */
describe("Sinister Mindreaver Fast Activation", () => {
  proveClassBonusFastActivation(sinisterMindreaver, "none");
});
