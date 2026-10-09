import { describe } from "vitest";
import { luXunPyreStrategist } from "./lu-xun-pyre-strategist.ts";

import { proveOnEnterCounter } from "../../../testing/on-enter-counter.ts";
/** @covers xllhbjr20n-a2 */
describe("luXunPyreStrategist — entry counters", () => {
  proveOnEnterCounter({
    card: luXunPyreStrategist,
    abilityId: "xllhbjr20n-a2",
    counter: "enlighten",
    amount: 1,
    self: false,
  });
});

import { proveKindle } from "../../../testing/kindle.ts";
/** @covers xllhbjr20n-a1 */
describe("Lu Xun, Pyre Strategist — Kindle", () => {
  proveKindle(luXunPyreStrategist, 3);
});
