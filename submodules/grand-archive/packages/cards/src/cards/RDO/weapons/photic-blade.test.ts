import { describe } from "vitest";
import { photicBlade } from "./photic-blade.ts";
import { proveRecoveryStatCounter } from "../../../testing/recovery-stat-counter.ts";

/** @covers NRBO0nVMdl-a1
 * @covers NRBO0nVMdl-a2 */
describe("Recovery counter scaling", () => {
  proveRecoveryStatCounter({
    card: photicBlade,
    counter: "refinement",
    entryCounters: 0,
    classRestrictedRecovery: true,
    recipient: "source",
    stat: "power",
    base: 3,
  });
});
