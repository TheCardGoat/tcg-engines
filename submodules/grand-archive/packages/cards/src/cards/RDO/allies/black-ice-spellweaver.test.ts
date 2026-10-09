import { describe } from "vitest";
import { blackIceSpellweaver } from "./black-ice-spellweaver.ts";

import { proveTargetAttackReduction } from "../../../testing/target-attack-reduction.ts";
/** @covers M5LHimBiCn-a2 */
describe("blackIceSpellweaver attack reduction", () => {
  proveTargetAttackReduction(blackIceSpellweaver, "sacrifice", "M5LHimBiCn-a2");
});
