import { proveAttackKillTrigger } from "../../../testing/attack-kill-trigger.ts";
import { describe } from "vitest";
import { comboStrike } from "./combo-strike.ts";

/** @covers zcVjsVRBV8-a1 */
describe("Combo Strike \u2014 resolution", () => {
  proveAttackKillTrigger({ card: comboStrike, power: 3, classRestricted: true, wake: true });
});
