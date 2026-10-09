import { proveClassBonusFastActivation } from "../../../testing/class-bonus-fast-activation.ts";
import { describe } from "vitest";
import { surveilTheWinds } from "./surveil-the-winds.ts";

/** @covers xt6uaz6a7g-a1 */
describe("Surveil the Winds Fast Activation", () => {
  proveClassBonusFastActivation(surveilTheWinds, "none");
});

import { proveDrawAndPrepare } from "../../../testing/draw-and-prepare.ts";
/** @covers xt6uaz6a7g-a2 */
describe("surveilTheWinds draw and preparation", () => {
  proveDrawAndPrepare(surveilTheWinds, 2, 1, "none");
});
