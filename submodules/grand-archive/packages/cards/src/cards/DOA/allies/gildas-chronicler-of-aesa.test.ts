import { proveAllyCombatStats } from "../../../testing/ally-combat-stats.ts";
import { describe } from "vitest";
import { gildasChroniclerOfAesa } from "./gildas-chronicler-of-aesa.ts";

/** @covers JAs9SmLqUS-a2 */
describe("Gildas, Chronicler of Aesa \u2014 resolution", () => {
  proveAllyCombatStats({ card: gildasChroniclerOfAesa, power: 4, life: 3, hand: 0, memory: 0 });
});

describe("other condition boundaries", () => {
  proveAllyCombatStats({ card: gildasChroniclerOfAesa, power: 4, life: 3, hand: 2, memory: 2 });
  proveAllyCombatStats({ card: gildasChroniclerOfAesa, power: 1, life: 3, hand: 1, memory: 0 });
  proveAllyCombatStats({ card: gildasChroniclerOfAesa, power: 1, life: 3, hand: 0, memory: 1 });
});
