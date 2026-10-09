import { describe } from "vitest";
import { lurchingRogue } from "./lurching-rogue.ts";
import { proveClassBonusStealth } from "../../../testing/class-bonus-stealth.ts";
/** @covers 8tYVFYnK0T-a2 */
describe("lurchingRogue — Class Bonus Stealth", () => {
  proveClassBonusStealth(lurchingRogue);
});
