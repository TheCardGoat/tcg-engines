import { describe } from "vitest";
import { smolderingCook } from "./smoldering-cook.ts";
import { proveClassBonusStealth } from "../../../testing/class-bonus-stealth.ts";
/** @covers HtxzN0sQCJ-a1 */
describe("smolderingCook — Class Bonus Stealth", () => {
  proveClassBonusStealth(smolderingCook);
});
