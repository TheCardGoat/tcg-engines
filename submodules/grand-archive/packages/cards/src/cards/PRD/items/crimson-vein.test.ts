import { describe } from "vitest";
import { crimsonVein } from "./crimson-vein.ts";
import { proveRecoveryStatCounter } from "../../../testing/recovery-stat-counter.ts";

/** @covers QwF7kvdpFz-a1
 * @covers QwF7kvdpFz-a2
 * @covers QwF7kvdpFz-a3 */
describe("Recovery counter scaling", () => {
  proveRecoveryStatCounter({
    card: crimsonVein,
    counter: "blood",
    entryCounters: 3,
    classRestrictedRecovery: false,
    recipient: "champion",
    stat: "life",
    base: 15,
  });
});
