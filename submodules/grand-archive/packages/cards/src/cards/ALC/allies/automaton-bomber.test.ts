import { describe } from "vitest";
import { proveRangedAlly } from "../../../testing/ranged-ally.ts";

import { proveClassBonusFloatingMemory } from "../../../testing/class-bonus-floating-memory.ts";
import { automatonBomber } from "./automaton-bomber.ts";

/** @covers ygojwk0pw0-a2 */
describe("Automaton Bomber — Class Bonus Floating Memory", () => {
  proveClassBonusFloatingMemory({ card: automatonBomber });
});

/** @covers ygojwk0pw0-a1 */
describe("automaton-bomber — Ranged", () => {
  proveRangedAlly({ card: automatonBomber, power: 1, ranged: 4, classBonus: false });
});
