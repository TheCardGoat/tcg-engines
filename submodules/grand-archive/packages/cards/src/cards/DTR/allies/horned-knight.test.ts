import { describe } from "vitest";
import { hornedKnight } from "./horned-knight.ts";

import { proveAttackingAllyPower } from "../../../testing/attacking-ally-power.ts";
/** @covers vjdbqgku4z-a1 */
describe("horned-knight — conditional attack power", () => {
  proveAttackingAllyPower({ card: hornedKnight, basePower: 2, bonus: 1, requiresRested: false });
});
