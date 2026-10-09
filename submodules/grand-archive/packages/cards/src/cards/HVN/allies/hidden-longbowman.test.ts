import { describe } from "vitest";
import { hiddenLongbowman } from "./hidden-longbowman.ts";
import { proveRangedAlly } from "../../../testing/ranged-ally.ts";

/** @covers bx4k3akqx7-a1 */
describe("Hidden Longbowman Ranged", () => {
  proveRangedAlly({ card: hiddenLongbowman, power: 1, ranged: 2, classBonus: false });
});

import { proveStateStealth } from "../../../testing/state-stealth.ts";
/** @covers bx4k3akqx7-a2 */
describe("hidden-longbowman — conditional Stealth", () => {
  proveStateStealth(hiddenLongbowman, "distant");
});
