import { proveClassBonusFastActivation } from "../../../testing/class-bonus-fast-activation.ts";
import { describe } from "vitest";
import { illusoryArmsmaster } from "./illusory-armsmaster.ts";

/** @covers LnVEY7nVXn-a1 */
describe("Illusory Armsmaster Fast Activation", () => {
  proveClassBonusFastActivation(illusoryArmsmaster, "none");
});
