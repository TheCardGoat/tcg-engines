import { describe } from "vitest";
import { sighingCrownwing } from "./sighing-crownwing.ts";
import { proveClassBonusStealth } from "../../../testing/class-bonus-stealth.ts";
/** @covers CfU2EmuKwY-a2 */
describe("sighingCrownwing — Class Bonus Stealth", () => {
  proveClassBonusStealth(sighingCrownwing);
});
