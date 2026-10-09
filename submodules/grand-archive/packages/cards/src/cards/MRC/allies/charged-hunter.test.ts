import { describe } from "vitest";
import { chargedHunter } from "./charged-hunter.ts";
import { proveRangedAlly } from "../../../testing/ranged-ally.ts";

/** @covers iffei7chsb-a1 */
describe("Charged Hunter Ranged", () => {
  proveRangedAlly({ card: chargedHunter, power: 2, ranged: 2, classBonus: false });
});

import { proveControlledEntryCondition } from "../../../testing/controlled-entry-condition.ts";
import { automatonDrone } from "../../ALC/tokens/automaton-drone.ts";
import { cellReactor } from "../../PRD/items/cell-reactor.ts";
import { powercell } from "../tokens/powercell.ts";
/** @covers iffei7chsb-a2 */
describe("chargedHunter controlled entry condition", () =>
  proveControlledEntryCondition(chargedHunter, automatonDrone, cellReactor, {
    alternative: powercell,
    ranged: 2,
  }));
