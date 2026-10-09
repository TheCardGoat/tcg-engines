import { describe } from "vitest";
import { poweredArmsmaster } from "./powered-armsmaster.ts";
import { proveRangedAlly } from "../../../testing/ranged-ally.ts";

/** @covers fpvw2ifz1n-a1 */
describe("Powered Armsmaster Ranged", () => {
  proveRangedAlly({ card: poweredArmsmaster, power: 1, ranged: 3, classBonus: false });
});

import { proveDeathPowercell } from "../../../testing/death-powercell.ts";
/** @covers fpvw2ifz1n-a3 */
describe("powered-armsmaster death Powercell", () =>
  proveDeathPowercell(poweredArmsmaster, "fpvw2ifz1n-a3"));
