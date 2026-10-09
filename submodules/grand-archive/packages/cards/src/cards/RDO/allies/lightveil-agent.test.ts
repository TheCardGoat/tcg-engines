import { describe } from "vitest";
import { lightveilAgent } from "./lightveil-agent.ts";
import { proveClassBonusStealth } from "../../../testing/class-bonus-stealth.ts";
/** @covers jcaLgesx0e-a1 */
describe("lightveilAgent — Class Bonus Stealth", () => {
  proveClassBonusStealth(lightveilAgent);
});
