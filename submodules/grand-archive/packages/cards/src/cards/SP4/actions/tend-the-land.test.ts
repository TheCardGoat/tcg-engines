import { proveClassBonusFastActivation } from "../../../testing/class-bonus-fast-activation.ts";
import { describe } from "vitest";
import { tendTheLand } from "./tend-the-land.ts";

/** @covers Rgg4dJYxnl-a1 */
describe("Tend the Land Fast Activation", () => {
  proveClassBonusFastActivation(tendTheLand, "none");
});
