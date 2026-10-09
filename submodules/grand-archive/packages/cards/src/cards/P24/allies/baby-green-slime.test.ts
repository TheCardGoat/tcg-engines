import { proveClassBonusFastActivation } from "../../../testing/class-bonus-fast-activation.ts";
import { describe } from "vitest";
import { babyGreenSlime } from "./baby-green-slime.ts";

/** @covers cqadnk9iz0-a1 */
describe("Baby Green Slime Fast Activation", () => {
  proveClassBonusFastActivation(babyGreenSlime, "none");
});
