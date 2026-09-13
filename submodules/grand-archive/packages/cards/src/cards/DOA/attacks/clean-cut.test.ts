import { proveAttackKillTrigger } from "../../../testing/attack-kill-trigger.ts";
import { describe } from "vitest";
import { cleanCut } from "./clean-cut.ts";

/** @covers 71i7d3JB9A-a1 */
describe("Clean Cut \u2014 resolution", () => {
  proveAttackKillTrigger({ card: cleanCut, power: 2, classRestricted: false, wake: false });
});
