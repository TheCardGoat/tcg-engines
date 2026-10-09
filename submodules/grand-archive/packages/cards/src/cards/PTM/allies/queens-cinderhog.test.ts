import { describe } from "vitest";
import { queensCinderhog } from "./queens-cinderhog.ts";
import { proveClassBonusStealth } from "../../../testing/class-bonus-stealth.ts";
/** @covers 9fZMLbyRWd-a2 */
describe("queensCinderhog — Class Bonus Stealth", () => {
  proveClassBonusStealth(queensCinderhog);
});
